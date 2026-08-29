#!/usr/bin/env python3
"""
fh-opinion.py — Query all builder models + architect synthesis on a question
Part of Fusion Harness V2

Usage:
    python3 fh-opinion.py "Your question here"
    python3 fh-opinion.py --model-stack custom-stack.yaml "Question"
    python3 fh-opinion.py --only-builders "Quick opinion without architect"
"""

import asyncio
import argparse
import sys
import os
import yaml
import time
import json
from dataclasses import dataclass, asdict
from typing import List, Optional
from pathlib import Path
from abc import ABC, abstractmethod

# ============ CONFIG ============
DEFAULT_STACK_PATH = Path(".fusion-harness/config/model-stack.yaml")
PROVIDER_MODULES = {
    "anthropic": "providers.anthropic_provider",
    "openai": "providers.openai_provider",
    "google": "providers.google_provider",
    "openrouter": "providers.openrouter_provider",
    "local": "providers.local_provider",
}

# ============ DATA MODELS ============
@dataclass
class ModelConfig:
    id: str
    alias: str
    provider: str
    tier: str
    cost_per_1k_in: float
    cost_per_1k_out: float
    max_tokens: int
    role: List[str]
    hidden_name: bool
    api_env: Optional[str] = None
    base_url: Optional[str] = None
    endpoint: Optional[str] = None
    model: Optional[str] = None

@dataclass
class ModelResult:
    alias: str
    provider: str
    response: str
    tokens_in: int
    tokens_out: int
    latency_ms: int
    cost_usd: float
    error: Optional[str] = None

    def to_dict(self):
        return asdict(self)

@dataclass
class Settings:
    default_architect: str
    default_builders: List[str]
    max_parallel_builders: int
    debate_rounds: int
    consensus_threshold: float
    cost_budget_per_session_usd: float
    cost_budget_per_workflow_usd: float
    auto_track_costs: bool
    hide_model_names: bool
    log_level: str

# ============ PROVIDER ABSTRACTION ============
class BaseProvider(ABC):
    @abstractmethod
    async def query(self, model: ModelConfig, prompt: str, system: str = "") -> ModelResult:
        pass

    def calculate_cost(self, model: ModelConfig, tokens_in: int, tokens_out: int) -> float:
        return (tokens_in / 1000 * model.cost_per_1k_in) + (tokens_out / 1000 * model.cost_per_1k_out)

# Lazy import providers
def get_provider(provider_name: str) -> BaseProvider:
    module_path = PROVIDER_MODULES.get(provider_name)
    if not module_path:
        raise ValueError(f"Unknown provider: {provider_name}")
    module = __import__(module_path, fromlist=['Provider'])
    return module.Provider()

# ============ CORE LOGIC ============
def load_model_stack(path: Path) -> tuple[List[ModelConfig], Settings]:
    with open(path) as f:
        data = yaml.safe_load(f)
    
    models = [ModelConfig(**m) for m in data.get("models", [])]
    settings_data = data.get("settings", {})
    settings = Settings(
        default_architect=settings_data.get("default_architect", "Rune"),
        default_builders=settings_data.get("default_builders", ["Flux", "Drift", "Local"]),
        max_parallel_builders=settings_data.get("max_parallel_builders", 3),
        debate_rounds=settings_data.get("debate_rounds", 3),
        consensus_threshold=settings_data.get("consensus_threshold", 1.0),
        cost_budget_per_session_usd=settings_data.get("cost_budget_per_session_usd", 10.0),
        cost_budget_per_workflow_usd=settings_data.get("cost_budget_per_workflow_usd", 50.0),
        auto_track_costs=settings_data.get("auto_track_costs", True),
        hide_model_names=settings_data.get("hide_model_names", True),
        log_level=settings_data.get("log_level", "INFO"),
    )
    return models, settings

def filter_models(models: List[ModelConfig], role_filter: Optional[str] = None, 
                  aliases: Optional[List[str]] = None) -> List[ModelConfig]:
    filtered = models
    if role_filter:
        filtered = [m for m in filtered if role_filter in m.role]
    if aliases:
        filtered = [m for m in filtered if m.alias in aliases]
    return filtered

async def query_model(model: ModelConfig, prompt: str, system: str = "") -> ModelResult:
    start = time.time()
    provider = get_provider(model.provider)
    try:
        result = await provider.query(model, prompt, system)
        result.latency_ms = int((time.time() - start) * 1000)
        result.cost_usd = provider.calculate_cost(model, result.tokens_in, result.tokens_out)
        return result
    except Exception as e:
        return ModelResult(
            alias=model.alias,
            provider=model.provider,
            response="",
            tokens_in=0,
            tokens_out=0,
            latency_ms=int((time.time() - start) * 1000),
            cost_usd=0.0,
            error=str(e)
        )

async def run_opinion(question: str, models: List[ModelConfig], settings: Settings, 
                      only_builders: bool = False) -> dict:
    # Filter builders
    builders = filter_models(models, role_filter="builder")
    if settings.default_builders:
        builders = [m for m in builders if m.alias in settings.default_builders]
    
    # Limit parallel
    builders = builders[:settings.max_parallel_builders]
    
    print(f"🔍 Querying {len(builders)} builder models...")
    print(f"❓ Question: {question}\n")
    
    # Query builders in parallel
    tasks = [query_model(m, question) for m in builders]
    results = await asyncio.gather(*tasks)
    
    # Display results table
    print(f"{'Alias':<12} {'Provider':<12} {'Latency':>8} {'In':>8} {'Out':>8} {'Cost':>10} {'Status'}")
    print("-" * 80)
    
    total_cost = 0.0
    successful = []
    for r in results:
        status = "✅" if not r.error else f"❌ {r.error[:30]}"
        cost_str = f"${r.cost_usd:.6f}" if r.cost_usd > 0 else "$0.000000"
        print(f"{r.alias:<12} {r.provider:<12} {r.latency_ms:>6}ms {r.tokens_in:>8} {r.tokens_out:>8} {cost_str:>10} {status}")
        total_cost += r.cost_usd
        if not r.error:
            successful.append(r)
    
    print(f"\n💰 Total builder cost: ${total_cost:.6f}")
    
    # Architect synthesis (unless --only-builders)
    architect_result = None
    if not only_builders:
        architect_models = filter_models(models, role_filter="architect")
        architect = next((m for m in architect_models if m.alias == settings.default_architect), None)
        if not architect and architect_models:
            architect = architect_models[0]
        
        if architect:
            print(f"\n🏗️  Architect ({architect.alias}) synthesizing...")
            synthesis_prompt = f"""Question: {question}

Builder opinions:
{chr(10).join(f"{r.alias}: {r.response[:500]}" for r in successful)}

Provide a concise synthesis: key agreements, disagreements, and your recommendation.
Focus on actionable insights for an engineer."""
            
            architect_result = await query_model(architect, synthesis_prompt)
            print(f"\n🏗️  ARCHITECT ({architect.alias}):")
            print(f"   {architect_result.response}")
            print(f"   💰 Cost: ${architect_result.cost_usd:.6f} | ⏱️ {architect_result.latency_ms}ms")
            total_cost += architect_result.cost_usd
    
    print(f"\n💰 TOTAL SESSION COST: ${total_cost:.6f}")
    
    return {
        "question": question,
        "builders": [r.to_dict() for r in results],
        "architect": architect_result.to_dict() if architect_result else None,
        "total_cost_usd": total_cost,
        "timestamp": time.time()
    }

# ============ CLI ============
def main():
    parser = argparse.ArgumentParser(description="Fusion Harness: Multi-model opinion")
    parser.add_argument("question", nargs="+", help="Question to ask models")
    parser.add_argument("--model-stack", "-s", help="Path to model-stack.yaml")
    parser.add_argument("--only-builders", "-b", action="store_true", help="Skip architect synthesis")
    parser.add_argument("--builders", help="Comma-separated builder aliases to use")
    parser.add_argument("--output", "-o", help="Output JSON file")
    parser.add_argument("--json", action="store_true", help="Output JSON to stdout")
    
    args = parser.parse_args()
    question = " ".join(args.question)
    
    stack_path = Path(args.model_stack) if args.model_stack else DEFAULT_STACK_PATH
    if not stack_path.exists():
        print(f"❌ Model stack not found: {stack_path}")
        print(f"   Copy references/config/model-stack-template.yaml to {stack_path}")
        sys.exit(1)
    
    models, settings = load_model_stack(stack_path)
    
    if args.builders:
        aliases = [a.strip() for a in args.builders.split(",")]
        settings.default_builders = aliases
    
    result = asyncio.run(run_opinion(question, models, settings, args.only_builders))
    
    if args.output:
        with open(args.output, "w") as f:
            json.dump(result, f, indent=2)
        print(f"\n📝 Results saved to {args.output}")
    elif args.json:
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()