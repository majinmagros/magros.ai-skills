#!/usr/bin/env python3
"""
Reflection Tuning Trainer — Stage 2 of Reflection-Tuning Pipeline.

Trains models with combined loss: L = L_ce + λ * L_reflection
Supports LoRA and full fine-tuning.
"""

import argparse
import json
import os
from pathlib import Path
from typing import Any
from dataclasses import dataclass, asdict
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    Trainer,
    TrainingArguments,
    DataCollatorForLanguageModeling,
)
from peft import LoraConfig, get_peft_model, TaskType, prepare_model_for_kbit_training
import bitsandbytes as bnb


@dataclass
class TrainingConfig:
    base_model: str
    dataset_path: str
    output_dir: str
    lora_r: int = 32
    lora_alpha: int = 64
    lora_dropout: float = 0.05
    reflection_weight: float = 0.3
    learning_rate: float = 2e-5
    num_epochs: int = 3
    batch_size: int = 4
    gradient_accumulation_steps: int = 4
    max_seq_length: int = 2048
    warmup_ratio: float = 0.03
    logging_steps: int = 10
    save_steps: int = 500
    eval_steps: int = 500
    fp16: bool = True
    bf16: bool = False
    gradient_checkpointing: bool = True
    optim: str = "paged_adamw_32bit"
    lr_scheduler_type: str = "cosine"
    weight_decay: float = 0.01
    max_grad_norm: float = 1.0
    seed: int = 42
    merge_and_save: bool = True
    load_in_4bit: bool = True
    load_in_8bit: bool = False


class ReflectionDataset(Dataset):
    """Dataset for reflection-tuning: combines prompt, CoT, critique, corrected CoT."""

    def __init__(self, tokenizer, data_path: str, max_length: int = 2048):
        self.tokenizer = tokenizer
        self.max_length = max_length
        self.samples = []

        with open(data_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    self.samples.append(json.loads(line))

        print(f"Loaded {len(self.samples)} samples from {data_path}")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        sample = self.samples[idx]

        # Format: prompt -> CoT -> critique -> corrected_CoT
        # We train on the corrected CoT as target, with critique as auxiliary signal
        prompt_text = f"### Problem:\n{sample['prompt']}\n\n### Reasoning:\n{sample['corrected_cot']}"

        # Also create critique-aware version for reflection loss
        critique_text = f"### Critique:\n{sample['critique']}\n\n### Corrected Reasoning:\n{sample['corrected_cot']}"

        # Tokenize main target
        encoding = self.tokenizer(
            prompt_text,
            truncation=True,
            max_length=self.max_length,
            padding="max_length",
            return_tensors="pt"
        )

        # Tokenize critique (for reflection loss)
        critique_encoding = self.tokenizer(
            critique_text,
            truncation=True,
            max_length=self.max_length,
            padding="max_length",
            return_tensors="pt"
        )

        return {
            "input_ids": encoding["input_ids"].squeeze(0),
            "attention_mask": encoding["attention_mask"].squeeze(0),
            "critique_input_ids": critique_encoding["input_ids"].squeeze(0),
            "critique_attention_mask": critique_encoding["attention_mask"].squeeze(0),
            "labels": encoding["input_ids"].squeeze(0).clone(),
            "reward_learnability": sample["reward_learnability"],
            "reward_accuracy": sample["reward_accuracy"],
        }


class ReflectionTrainer(Trainer):
    """Custom trainer with reflection loss component."""

    def __init__(self, reflection_weight: float = 0.3, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.reflection_weight = reflection_weight

    def compute_loss(self, model, inputs, return_outputs=False, **kwargs):
        # Standard causal LM loss
        input_ids = inputs["input_ids"]
        attention_mask = inputs["attention_mask"]
        labels = inputs["labels"]

        outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
        ce_loss = outputs.loss

        # Reflection loss: encourage model to produce critique-aware outputs
        critique_input_ids = inputs["critique_input_ids"]
        critique_attention_mask = inputs["critique_attention_mask"]

        # Forward pass with critique context
        critique_outputs = model(
            input_ids=critique_input_ids,
            attention_mask=critique_attention_mask,
            labels=critique_input_ids  # Self-supervised on critique+correction
        )
        reflection_loss = critique_outputs.loss

        # Weighted combination
        total_loss = ce_loss + self.reflection_weight * reflection_loss

        # Log component losses
        if self.state.global_step % self.args.logging_steps == 0:
            logs = {
                "ce_loss": ce_loss.item(),
                "reflection_loss": reflection_loss.item(),
                "total_loss": total_loss.item(),
                "reflection_weight": self.reflection_weight
            }
            self.log(logs)

        return (total_loss, outputs) if return_outputs else total_loss


def setup_model_and_tokenizer(config: TrainingConfig):
    """Load model and tokenizer with quantization and LoRA."""
    # Tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        config.base_model,
        trust_remote_code=True,
        padding_side="right"
    )
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    # Quantization config
    if config.load_in_4bit:
        from transformers import BitsAndBytesConfig
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16 if config.bf16 else torch.float16,
            bnb_4bit_use_double_quant=True,
        )
    elif config.load_in_8bit:
        from transformers import BitsAndBytesConfig
        bnb_config = BitsAndBytesConfig(load_in_8bit=True)
    else:
        bnb_config = None

    # Model
    model = AutoModelForCausalLM.from_pretrained(
        config.base_model,
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=True,
        torch_dtype=torch.bfloat16 if config.bf16 else torch.float16,
    )

    # Prepare for k-bit training
    if config.load_in_4bit or config.load_in_8bit:
        model = prepare_model_for_kbit_training(model, use_gradient_checkpointing=config.gradient_checkpointing)

    # LoRA config
    lora_config = LoraConfig(
        r=config.lora_r,
        lora_alpha=config.lora_alpha,
        lora_dropout=config.lora_dropout,
        bias="none",
        task_type=TaskType.CAUSAL_LM,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    )

    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    return model, tokenizer


def main():
    parser = argparse.ArgumentParser(description="Reflection-Tuning Trainer")
    parser.add_argument("--base-model", required=True, help="Base model HF ID or path")
    parser.add_argument("--dataset", required=True, help="Path to reflection dataset JSONL")
    parser.add_argument("--output-dir", required=True, help="Output directory for checkpoints")
    parser.add_argument("--lora-r", type=int, default=32, help="LoRA rank")
    parser.add_argument("--lora-alpha", type=int, default=64, help="LoRA alpha")
    parser.add_argument("--lora-dropout", type=float, default=0.05, help="LoRA dropout")
    parser.add_argument("--reflection-weight", type=float, default=0.3, help="Weight for reflection loss (λ)")
    parser.add_argument("--learning-rate", type=float, default=2e-5, help="Learning rate")
    parser.add_argument("--num-epochs", type=int, default=3, help="Number of epochs")
    parser.add_argument("--batch-size", type=int, default=4, help="Batch size per device")
    parser.add_argument("--grad-accum", type=int, default=4, help="Gradient accumulation steps")
    parser.add_argument("--max-seq-len", type=int, default=2048, help="Max sequence length")
    parser.add_argument("--fp16", action="store_true", help="Use FP16")
    parser.add_argument("--bf16", action="store_true", help="Use BF16")
    parser.add_argument("--load-in-4bit", action="store_true", default=True, help="Load in 4-bit")
    parser.add_argument("--load-in-8bit", action="store_true", help="Load in 8-bit")
    parser.add_argument("--merge-and-save", action="store_true", default=True, help="Merge and save final model")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    args = parser.parse_args()

    # Set seeds
    torch.manual_seed(args.seed)
    torch.cuda.manual_seed_all(args.seed)

    config = TrainingConfig(
        base_model=args.base_model,
        dataset_path=args.dataset,
        output_dir=args.output_dir,
        lora_r=args.lora_r,
        lora_alpha=args.lora_alpha,
        lora_dropout=args.lora_dropout,
        reflection_weight=args.reflection_weight,
        learning_rate=args.learning_rate,
        num_epochs=args.num_epochs,
        batch_size=args.batch_size,
        gradient_accumulation_steps=args.grad_accum,
        max_seq_length=args.max_seq_len,
        fp16=args.fp16,
        bf16=args.bf16,
        load_in_4bit=args.load_in_4bit,
        load_in_8bit=args.load_in_8bit,
        merge_and_save=args.merge_and_save,
        seed=args.seed,
    )

    output_dir = Path(config.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Save config
    with open(output_dir / "training_config.json", "w") as f:
        json.dump(asdict(config), f, indent=2)

    print("Setting up model and tokenizer...")
    model, tokenizer = setup_model_and_tokenizer(config)

    print("Loading dataset...")
    dataset = ReflectionDataset(tokenizer, config.dataset_path, config.max_seq_length)

    # Split train/eval (90/10)
    train_size = int(0.9 * len(dataset))
    eval_size = len(dataset) - train_size
    train_dataset, eval_dataset = torch.utils.data.random_split(dataset, [train_size, eval_size])
    print(f"Train: {len(train_dataset)}, Eval: {len(eval_dataset)}")

    # Training arguments
    training_args = TrainingArguments(
        output_dir=str(output_dir / "checkpoints"),
        num_train_epochs=config.num_epochs,
        per_device_train_batch_size=config.batch_size,
        per_device_eval_batch_size=config.batch_size,
        gradient_accumulation_steps=config.gradient_accumulation_steps,
        learning_rate=config.learning_rate,
        warmup_ratio=config.warmup_ratio,
        logging_steps=config.logging_steps,
        save_steps=config.save_steps,
        eval_steps=config.eval_steps,
        evaluation_strategy="steps",
        save_strategy="steps",
        load_best_model_at_end=True,
        metric_for_best_model="eval_loss",
        greater_is_better=False,
        fp16=config.fp16,
        bf16=config.bf16,
        gradient_checkpointing=config.gradient_checkpointing,
        optim=config.optim,
        lr_scheduler_type=config.lr_scheduler_type,
        weight_decay=config.weight_decay,
        max_grad_norm=config.max_grad_norm,
        seed=config.seed,
        dataloader_pin_memory=False,
        remove_unused_columns=False,
        report_to="none",
    )

    # Data collator
    data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

    # Trainer
    trainer = ReflectionTrainer(
        reflection_weight=config.reflection_weight,
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        data_collator=data_collator,
        tokenizer=tokenizer,
    )

    print("Starting training...")
    trainer.train()

    print("Saving final model...")
    trainer.save_model(str(output_dir / "final_checkpoint"))
    tokenizer.save_pretrained(str(output_dir / "final_checkpoint"))

    # Merge and save if requested
    if config.merge_and_save:
        print("Merging LoRA weights...")
        merged_model = model.merge_and_unload()
        merged_path = output_dir / "merged_model"
        merged_model.save_pretrained(str(merged_path))
        tokenizer.save_pretrained(str(merged_path))
        print(f"Merged model saved to {merged_path}")

    print("Training complete!")


if __name__ == "__main__":
    main()