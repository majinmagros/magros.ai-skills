#!/usr/bin/env python3
"""
Reflection Dataset Generator — Stage 1 of Reflection-Tuning Pipeline.

Generates CoT → auto-critique → correction datasets for reflection-tuning.
Implements reward shaping: learnability + accuracy.
"""

import argparse
import json
import random
from pathlib import Path
from typing import Any
from dataclasses import dataclass, asdict
import hashlib


@dataclass
class ReflectionSample:
    task_id: str
    prompt: str
    cot: str
    critique: str
    corrected_cot: str
    reward_learnability: float
    reward_accuracy: float
    metadata: dict


TASK_TEMPLATES = {
    "math": [
        "Solve for x: {eq}",
        "Calculate: {expr}",
        "Find the derivative of: {func}",
        "Evaluate the integral: {integral}",
    ],
    "reasoning": [
        "If {premise}, what follows?",
        "Complete the pattern: {pattern}",
        "Which conclusion is valid: {options}",
    ],
    "coding": [
        "Write a function that {task}",
        "Fix the bug in: {code}",
        "Optimize this algorithm: {algo}",
    ],
}


def generate_task_prompts(task_type: str, count: int) -> list[dict]:
    """Generate diverse task prompts for dataset generation."""
    prompts = []
    templates = TASK_TEMPLATES.get(task_type, TASK_TEMPLATES["math"])

    for i in range(count):
        template = random.choice(templates)
        task_id = f"{task_type}_{i:04d}"

        if task_type == "math":
            a, b, c = random.randint(1, 20), random.randint(1, 20), random.randint(1, 20)
            prompt = template.format(
                eq=f"{a}x + {b} = {c}",
                expr=f"{a} * {b} + {c}",
                func=f"{a}x^{b}",
                integral=f"{a}x^{b} dx"
            )
        elif task_type == "reasoning":
            prompt = template.format(
                premise="all A are B and all B are C",
                pattern="2, 4, 8, 16, ?",
                options="A) All A are C  B) Some A are C  C) No A are C"
            )
        else:
            prompt = template.format(
                task="reverses a string in-place",
                code="def reverse(s): return s[::-1]",
                algo="bubble sort"
            )

        prompts.append({"task_id": task_id, "prompt": prompt, "type": task_type})

    return prompts


def simulate_cot_generation(prompt: str, task_type: str) -> str:
    """Simulate CoT generation (in practice, call your base model)."""
    if "Solve for x" in prompt:
        # Extract equation: ax + b = c
        import re
        m = re.search(r'(\d+)x\s*\+\s*(\d+)\s*=\s*(\d+)', prompt)
        if m:
            a, b, c = map(int, m.groups())
            x = (c - b) / a
            return f"Step 1: Subtract {b} from both sides: {a}x = {c - b}\nStep 2: Divide by {a}: x = {x}\nAnswer: x = {x}"
    elif "Calculate" in prompt:
        return f"Step 1: Compute multiplication first\nStep 2: Add remaining term\nAnswer: [computed]"
    elif "derivative" in prompt:
        return f"Step 1: Apply power rule\nStep 2: Multiply coefficient by exponent\nStep 3: Reduce exponent by 1\nAnswer: [derivative]"
    elif "pattern" in prompt:
        return f"Step 1: Identify pattern (powers of 2)\nStep 2: Next is 2^5 = 32\nAnswer: 32"

    return "Step 1: Analyze problem\nStep 2: Apply relevant method\nStep 3: Verify answer\nAnswer: [result]"


def simulate_critique(cot: str, prompt: str) -> tuple[str, float]:
    """Simulate auto-critique generation with learnability score."""
    critique_points = []
    learnability = 0.7 + random.random() * 0.25  # 0.7-0.95

    if "Subtract" in cot and "Divide" in cot:
        critique_points.append("Correct algebraic steps")
        learnability = min(0.95, learnability + 0.1)
    else:
        critique_points.append("Missing explicit algebraic manipulation")
        learnability = max(0.5, learnability - 0.2)

    if "Answer:" in cot:
        critique_points.append("Final answer clearly marked")
    else:
        critique_points.append("Answer not clearly separated from reasoning")
        learnability = max(0.5, learnability - 0.15)

    critique = "Critique: " + "; ".join(critique_points)
    return critique, round(learnability, 2)


def simulate_correction(cot: str, critique: str) -> tuple[str, float]:
    """Generate corrected CoT with accuracy score."""
    corrected = cot
    accuracy = 0.8 + random.random() * 0.2  # 0.8-1.0

    if "Missing explicit" in critique:
        corrected = cot.replace("Step 1:", "Step 1: Explicitly ")
        corrected = corrected.replace("Step 2:", "Step 2: Explicitly ")
        accuracy = min(1.0, accuracy + 0.1)

    if "Answer not clearly" in critique:
        if not corrected.strip().endswith("Answer:"):
            corrected += "\nAnswer: [explicit final answer]"
        accuracy = min(1.0, accuracy + 0.05)

    return corrected, round(accuracy, 2)


def compute_rewards(learnability: float, accuracy: float) -> dict:
    """Compute combined reward with weighting."""
    combined = 0.6 * accuracy + 0.4 * learnability
    return {
        "learnability": learnability,
        "accuracy": accuracy,
        "combined": round(combined, 3)
    }


def main():
    parser = argparse.ArgumentParser(description="Generate reflection-tuning dataset")
    parser.add_argument("--base-model", default="meta-llama/Llama-3.1-8B-Instruct",
                        help="Base model identifier (for metadata)")
    parser.add_argument("--task-specs", help="YAML file with task specifications")
    parser.add_argument("--num-samples", type=int, default=100,
                        help="Number of samples per task type")
    parser.add_argument("--task-types", nargs="+", default=["math", "reasoning", "coding"],
                        help="Task types to generate")
    parser.add_argument("--output", required=True, help="Output JSONL file path")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    args = parser.parse_args()

    random.seed(args.seed)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    all_samples = []

    for task_type in args.task_types:
        prompts = generate_task_prompts(task_type, args.num_samples)

        for p in prompts:
            cot = simulate_cot_generation(p["prompt"], task_type)
            critique, learnability = simulate_critique(cot, p["prompt"])
            corrected_cot, accuracy = simulate_correction(cot, critique)
            rewards = compute_rewards(learnability, accuracy)

            sample = ReflectionSample(
                task_id=p["task_id"],
                prompt=p["prompt"],
                cot=cot,
                critique=critique,
                corrected_cot=corrected_cot,
                reward_learnability=rewards["learnability"],
                reward_accuracy=rewards["accuracy"],
                metadata={
                    "base_model": args.base_model,
                    "task_type": task_type,
                    "reward_combined": rewards["combined"],
                    "generation_seed": args.seed
                }
            )
            all_samples.append(sample)

    # Write JSONL
    with open(output_path, "w", encoding="utf-8") as f:
        for sample in all_samples:
            f.write(json.dumps(asdict(sample), ensure_ascii=False) + "\n")

    # Summary stats
    avg_learnability = sum(s.reward_learnability for s in all_samples) / len(all_samples)
    avg_accuracy = sum(s.reward_accuracy for s in all_samples) / len(all_samples)
    avg_combined = sum(s.metadata["reward_combined"] for s in all_samples) / len(all_samples)

    print(f"Generated {len(all_samples)} samples -> {output_path}")
    print(f"Avg learnability: {avg_learnability:.3f}")
    print(f"Avg accuracy: {avg_accuracy:.3f}")
    print(f"Avg combined reward: {avg_combined:.3f}")


if __name__ == "__main__":
    main()