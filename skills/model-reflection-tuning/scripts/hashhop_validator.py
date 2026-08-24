#!/usr/bin/env python3
"""
HashHop Validator — Stage 3 of Reflection-Tuning Pipeline.

Reproducible validation via HashHop benchmark (HuggingFace blog).
Tests model's ability to reproduce exact hash outputs from fixed prompts.
"""

import argparse
import hashlib
import json
import random
import time
from pathlib import Path
from typing import Any
from dataclasses import dataclass, asdict
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig


@dataclass
class HashHopChallenge:
    challenge_id: str
    prompt: str
    target_hash: str
    difficulty: str  # "easy", "medium", "hard"


@dataclass
class HashHopResult:
    challenge_id: str
    prompt: str
    target_hash: str
    model_output: str
    extracted_hash: str
    passed: bool
    latency_ms: float
    tokens_generated: int


CHALLENGE_TEMPLATES = {
    "easy": [
        "Output the SHA256 hash of the string 'hello world': ",
        "Compute SHA256 of 'test123': ",
        "What is the SHA256 of 'abc'? ",
        "Hash 'simple' with SHA256: ",
    ],
    "medium": [
        "Calculate SHA256('{s1}{s2}') where s1='alpha' and s2='beta': ",
        "SHA256(concat('key', 'value')): ",
        "Hash the string 'reflection-tuning-2024' with SHA256: ",
        "SHA256('model' + 'weights'): ",
    ],
    "hard": [
        "Compute SHA256(SHA256('nested')): ",
        "SHA256('a' * 100): ",
        "Hash the JSON {{'key': 'value', 'num': 42}} with SHA256: ",
        "SHA256('unicode: café 🚀'): ",
    ],
}


def generate_challenges(num_challenges: int, seed: int = 42) -> list[HashHopChallenge]:
    """Generate deterministic HashHop challenges."""
    random.seed(seed)
    challenges = []

    for i in range(num_challenges):
        difficulty = random.choices(
            ["easy", "medium", "hard"],
            weights=[0.5, 0.3, 0.2]
        )[0]

        template = random.choice(CHALLENGE_TEMPLATES[difficulty])

        # Generate the actual string to hash based on template
        if difficulty == "easy":
            test_strings = ["hello world", "test123", "abc", "simple", "hashme", "test"]
            s = random.choice(test_strings)
            prompt = template
        elif difficulty == "medium":
            s1 = random.choice(["alpha", "beta", "gamma", "delta", "epsilon"])
            s2 = random.choice(["key", "value", "data", "input", "output"])
            if "s1" in template and "s2" in template:
                prompt = template.format(s1=s1, s2=s2)
                s = s1 + s2
            elif "concat" in template:
                prompt = template
                s = "keyvalue"
            elif "reflection" in template:
                prompt = template
                s = "reflection-tuning-2024"
            else:
                prompt = template
                s = "modelweights"
        else:  # hard
            if "nested" in template:
                inner = hashlib.sha256("nested".encode()).hexdigest()
                s = inner
                prompt = template
            elif "a * 100" in template:
                s = "a" * 100
                prompt = template
            elif "JSON" in template:
                s = '{"key": "value", "num": 42}'
                prompt = template
            else:
                s = "unicode: café 🚀"
                prompt = template

        target_hash = hashlib.sha256(s.encode()).hexdigest()

        challenges.append(HashHopChallenge(
            challenge_id=f"hashhop_{i:04d}_{difficulty}",
            prompt=prompt,
            target_hash=target_hash,
            difficulty=difficulty
        ))

    return challenges


def extract_hash_from_output(output: str) -> str | None:
    """Extract SHA256 hash from model output."""
    import re
    # Look for 64-character hex string
    matches = re.findall(r'\b[a-fA-F0-9]{64}\b', output)
    if matches:
        return matches[0].lower()
    return None


def run_hashhop_validation(
    model_path: str,
    challenges: list[HashHopChallenge],
    max_new_tokens: int = 128,
    temperature: float = 0.1,
    top_p: float = 0.9,
    device: str = "auto"
) -> list[HashHopResult]:
    """Run HashHop validation on a model."""
    print(f"Loading model from {model_path}...")

    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        device_map=device,
        torch_dtype=torch.float16,
        trust_remote_code=True,
    )
    model.eval()

    generation_config = GenerationConfig(
        max_new_tokens=max_new_tokens,
        temperature=temperature,
        top_p=top_p,
        do_sample=temperature > 0,
        pad_token_id=tokenizer.pad_token_id,
        eos_token_id=tokenizer.eos_token_id,
    )

    results = []

    for challenge in challenges:
        # Format prompt
        messages = [{"role": "user", "content": challenge.prompt}]
        prompt_text = tokenizer.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )

        inputs = tokenizer(prompt_text, return_tensors="pt").to(model.device)

        # Generate
        start_time = time.time()
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                generation_config=generation_config,
            )
        latency_ms = (time.time() - start_time) * 1000

        # Decode only new tokens
        new_tokens = outputs[0][inputs["input_ids"].shape[1]:]
        model_output = tokenizer.decode(new_tokens, skip_special_tokens=True)
        tokens_generated = len(new_tokens)

        # Extract hash
        extracted_hash = extract_hash_from_output(model_output)
        passed = extracted_hash == challenge.target_hash.lower()

        results.append(HashHopResult(
            challenge_id=challenge.challenge_id,
            prompt=challenge.prompt,
            target_hash=challenge.target_hash,
            model_output=model_output.strip(),
            extracted_hash=extracted_hash or "NOT_FOUND",
            passed=passed,
            latency_ms=latency_ms,
            tokens_generated=tokens_generated
        ))

        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"  {challenge.challenge_id} [{challenge.difficulty}]: {status} "
              f"({latency_ms:.0f}ms, {tokens_generated} tokens)")

    return results


def compute_metrics(results: list[HashHopResult]) -> dict:
    """Compute aggregate metrics."""
    total = len(results)
    passed = sum(1 for r in results if r.passed)
    pass_rate = passed / total if total > 0 else 0

    by_difficulty = {}
    for diff in ["easy", "medium", "hard"]:
        diff_results = [r for r in results if r.challenge_id.endswith(f"_{diff}")]
        if diff_results:
            diff_passed = sum(1 for r in diff_results if r.passed)
            by_difficulty[diff] = {
                "total": len(diff_results),
                "passed": diff_passed,
                "pass_rate": diff_passed / len(diff_results)
            }

    avg_latency = sum(r.latency_ms for r in results) / total if total > 0 else 0
    avg_tokens = sum(r.tokens_generated for r in results) / total if total > 0 else 0

    return {
        "total_challenges": total,
        "passed": passed,
        "pass_rate": pass_rate,
        "by_difficulty": by_difficulty,
        "avg_latency_ms": round(avg_latency, 1),
        "avg_tokens_generated": round(avg_tokens, 1),
    }


def main():
    parser = argparse.ArgumentParser(description="HashHop Validation for Reflection-Tuning")
    parser.add_argument("--model-path", required=True, help="Path to model (local or HF)")
    parser.add_argument("--num-challenges", type=int, default=100, help="Number of challenges")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for challenge generation")
    parser.add_argument("--max-new-tokens", type=int, default=128, help="Max new tokens to generate")
    parser.add_argument("--temperature", type=float, default=0.1, help="Generation temperature")
    parser.add_argument("--top-p", type=float, default=0.9, help="Top-p sampling")
    parser.add_argument("--device", default="auto", help="Device map (auto, cuda, cpu)")
    parser.add_argument("--output", required=True, help="Output JSON report path")
    args = parser.parse_args()

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Generate challenges
    print(f"Generating {args.num_challenges} HashHop challenges...")
    challenges = generate_challenges(args.num_challenges, args.seed)

    # Run validation
    print(f"Running HashHop validation on {args.model_path}...")
    results = run_hashhop_validation(
        args.model_path,
        challenges,
        max_new_tokens=args.max_new_tokens,
        temperature=args.temperature,
        top_p=args.top_p,
        device=args.device
    )

    # Compute metrics
    metrics = compute_metrics(results)

    # Prepare report
    report = {
        "model_path": args.model_path,
        "num_challenges": args.num_challenges,
        "seed": args.seed,
        "generation_config": {
            "max_new_tokens": args.max_new_tokens,
            "temperature": args.temperature,
            "top_p": args.top_p,
        },
        "metrics": metrics,
        "results": [asdict(r) for r in results],
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    }

    # Save report
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    # Print summary
    print("\n" + "=" * 50)
    print("HASHHOP VALIDATION REPORT")
    print("=" * 50)
    print(f"Model: {args.model_path}")
    print(f"Total Challenges: {metrics['total_challenges']}")
    print(f"Passed: {metrics['passed']}")
    print(f"Pass Rate: {metrics['pass_rate']:.1%}")
    print(f"Avg Latency: {metrics['avg_latency_ms']:.1f}ms")
    print(f"Avg Tokens: {metrics['avg_tokens_generated']:.1f}")
    print("\nBy Difficulty:")
    for diff, stats in metrics["by_difficulty"].items():
        print(f"  {diff}: {stats['passed']}/{stats['total']} ({stats['pass_rate']:.1%})")
    print(f"\nReport saved to: {output_path}")

    # Exit code based on pass rate
    if metrics["pass_rate"] < 0.85:
        print("\n⚠️  PASS RATE BELOW 85% THRESHOLD")
        exit(1)
    else:
        print("\n✅ PASS RATE ≥ 85% - VALIDATION PASSED")
        exit(0)


if __name__ == "__main__":
    main()