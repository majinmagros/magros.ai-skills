#!/usr/bin/env python3
"""
fh-debate.py — Multi-round debate with hidden model names
Part of Fusion Harness V2

Usage:
    python3 fh-debate.py "Thesis to debate"
    python3 fh-debate.py --rounds 5 "Thesis"
    python3 fh-debate.py --builders Flux,Drift "Thesis"
"""

import asyncio
import argparse
import sys
import os
import yaml
import time
import json
from dataclasses import dataclass, asdict, field
from typing import List, Optional, Dict
from pathlib import Path

# Reuse provider logic from fh-opinion
sys.path.insert(0, str(Path(__file__).parent))
from fh_opinion import (
    ModelConfig, ModelResult, Settings, load_model_stack, filter_models,
    get_provider, query_model, PROVIDER_MODULES
)

# ============ DEBATE MODELS ============
@dataclass
class DebatePosition:
    alias: str
    position: str
    confidence: float  # 0-1

@dataclass
class DebateRound:
    round_num: int
    positions: Dict[str, DebatePosition]
    refutations: Dict[str, str] = field(default_factory=dict)
    agreements: Dict[str, str] = field(default_factory=dict)
    changed_minds: List[str] = field(default_factory=list)

@dataclass
class DebateResult:
    thesis: str
    rounds: List[DebateRound]
    consensus: bool
    final_positions: Dict[str, str]
    total_cost_usd: float
    timestamp: float

def build_debate_prompt(thesis: str, previous_rounds: List[DebateRound], 
                        is_first_round: bool, hidden_names: bool = True) -> str:
    """Build prompt for a debate round."""
    if is_first_round:
        return f"""DEBATE ROUND 1

Thesis: "{thesis}"

You are a participant in a structured debate. Your model name is HIDDEN from other participants (they see only aliases like "Flux", "Drift", "Local").

State your position on the thesis. Be specific and concrete. Include:
1. Your stance (Agree / Disagree / Nuanced)
2. Key arguments (2-3 bullet points)
3. Confidence level (0-100%)
4. What evidence would change your mind

Format:
STANCE: [Agree/Disagree/Nuanced]
ARGUMENTS:
- ...
- ...
CONFIDENCE: XX%
EVIDENCE_TO_CHANGE: ..."""
    
    # Subsequent rounds
    prompt = f"DEBATE ROUND {len(previous_rounds) + 1}\n\nThesis: \"{thesis}\"\n\n"
    prompt += "Previous positions:\n"
    for r in previous_rounds:
        for alias, pos in r.positions.items():
            prompt += f"  {alias}: {pos.position[:200]}...\n"
    
    if previous_rounds:
        last = previous_rounds[-1]
        if last.refutations:
            prompt += "\nRefutations from last round:\n"
            for alias, ref in last.refutations.items():
                prompt += f"  {alias}: {ref}\n"
        if last.agreements:
            prompt += "\nAgreements from last round:\n"
            for alias, agr in last.agreements.items():
                prompt += f"  {alias}: {agr}\n"
        if last.changed_minds:
            prompt += f"\nChanged minds: {', '.join(last.changed_minds)}\n"
    
    prompt += """
Now, respond to the other positions. For each point you disagree with, provide a refutation.
For points you agree with, state agreement.
Finally, state if your position has changed.

Format:
REFUTATIONS:
- [alias]: [your counter-argument]
AGREEMENTS:
- [alias]: [what you agree with]
CHANGED_MIND: [Yes/No] — if yes, new stance
UPDATED_POSITION: [your updated position if changed, or "Unchanged"]"""
    
    return prompt

def check_consensus(positions: Dict[str, DebatePosition], threshold: float) -> bool:
    """Check if consensus reached (all same stance above threshold)."""
    if not positions:
        return False
    stances = [p.position.split()[0].lower() for p in positions.values()]
    # Simple check: all have same first word (Agree/Disagree/Nuanced)
    return len(set(stances)) == 1

async def run_debate(thesis: str, models: List[ModelConfig], settings: Settings,
                     max_rounds: int = 3, builder_aliases: Optional[List[str]] = None) -> DebateResult:
    builders = filter_models(models, role_filter="builder")
    if builder_aliases:
        builders = [m for m in builders if m.alias in builder_aliases]
    builders = builders[:settings.max_parallel_builders]
    
    print(f"⚔️  Starting debate: \"{thesis}\"")
    print(f"👥 Participants: {', '.join(m.alias for m in builders)}")
    print(f"🔄 Max rounds: {max_rounds}\n")
    
    rounds = []
    total_cost = 0.0
    
    for round_num in range(1, max_rounds + 1):
        print(f"\n{'='*60}")
        print(f"ROUND {round_num}")
        print(f"{'='*60}")
        
        is_first = (round_num == 1)
        prompt = build_debate_prompt(thesis, rounds, is_first)
        
        # Query all builders in parallel
        tasks = [query_model(m, prompt) for m in builders]
        results = await asyncio.gather(*tasks)
        
        # Parse positions
        positions = {}
        for r in results:
            if r.error:
                print(f"❌ {r.alias} error: {r.error}")
                continue
            # Simple parsing
            stance = "Nuanced"
            if "STANCE:" in r.response:
                stance_line = r.response.split("STANCE:")[1].split("\n")[0].strip().lower()
                if "agree" in stance_line and "disagree" not in stance_line:
                    stance = "Agree"
                elif "disagree" in stance_line:
                    stance = "Disagree"
            
            conf = 50
            if "CONFIDENCE:" in r.response:
                try:
                    conf = int(r.response.split("CONFIDENCE:")[1].split("%")[0].strip())
                except:
                    pass
            
            positions[r.alias] = DebatePosition(
                alias=r.alias,
                position=r.response[:500],
                confidence=conf/100
            )
            print(f"  {r.alias}: {stance} ({conf}%)")
            total_cost += r.cost_usd
        
        round_obj = DebateRound(round_num=round_num, positions=positions)
        rounds.append(round_obj)
        
        # Check consensus
        if check_consensus(positions, settings.consensus_threshold):
            print(f"\n✅ CONSENSUS REACHED in round {round_num}!")
            break
        
        # Build refutations/agreements for next round (simplified)
        # In real implementation, would parse REFUTATIONS/AGREEMENTS from responses
        # For now, just continue
    
    # Final statements
    print(f"\n{'='*60}")
    print("FINAL STATEMENTS")
    print(f"{'='*60}")
    
    final_positions = {}
    for m in builders:
        final_prompt = f"""Debate on: "{thesis}"

Final round. State your final position in 2-3 sentences.
Previous rounds summary: {[r.round_num for r in rounds]} rounds completed.

Your final stance:"""
        result = await query_model(m, final_prompt)
        final_positions[m.alias] = result.response[:300]
        print(f"  {m.alias}: {result.response[:200]}...")
        total_cost += result.cost_usd
    
    consensus = check_consensus(
        {k: DebatePosition(alias=k, position=v, confidence=1.0) for k,v in final_positions.items()},
        settings.consensus_threshold
    )
    
    return DebateResult(
        thesis=thesis,
        rounds=rounds,
        consensus=consensus,
        final_positions=final_positions,
        total_cost_usd=total_cost,
        timestamp=time.time()
    )

def main():
    parser = argparse.ArgumentParser(description="Fusion Harness: Multi-model debate")
    parser.add_argument("thesis", nargs="+", help="Thesis to debate")
    parser.add_argument("--model-stack", "-s", help="Path to model-stack.yaml")
    parser.add_argument("--rounds", "-r", type=int, default=3, help="Max debate rounds")
    parser.add_argument("--builders", "-b", help="Comma-separated builder aliases")
    parser.add_argument("--output", "-o", help="Output JSON file")
    
    args = parser.parse_args()
    thesis = " ".join(args.thesis)
    
    stack_path = Path(args.model_stack) if args.model_stack else Path(".fusion-harness/config/model-stack.yaml")
    if not stack_path.exists():
        print(f"❌ Model stack not found: {stack_path}")
        sys.exit(1)
    
    models, settings = load_model_stack(stack_path)
    if args.builders:
        settings.default_builders = [a.strip() for a in args.builders.split(",")]
    
    result = asyncio.run(run_debate(thesis, models, settings, args.rounds))
    
    print(f"\n💰 Total debate cost: ${result.total_cost_usd:.6f}")
    print(f"🤝 Consensus: {'YES' if result.consensus else 'NO'}")
    
    if args.output:
        with open(args.output, "w") as f:
            json.dump(asdict(result), f, indent=2, default=str)
        print(f"📝 Results saved to {args.output}")

if __name__ == "__main__":
    main()