# Implementation — Subscription Tier Router

Código completo: `SubscriptionTierRouter`, `BankedResetManager`, GLM budget config, fast mode decision, exemplo de uso. Matriz de tiers no `SKILL.md`.

```python
from dataclasses import dataclass
from typing import Dict, Optional
from enum import Enum

class Provider(Enum):
    CODEX = "codex"
    CLAUDE = "claude"
    GLM = "glm"

class Tier(Enum):
    CODEX_PLUS = "codex_plus"
    CODEX_PRO_5X = "codex_pro_5x"
    CODEX_PRO_20X = "codex_pro_20x"
    CLAUDE_PRO = "claude_pro"
    CLAUDE_MAX_5X = "claude_max_5x"
    CLAUDE_MAX_20X = "claude_max_20x"
    GLM_18 = "glm_18"
    GLM_80 = "glm_80"
    GLM_168 = "glm_168"

@dataclass
class SubscriptionState:
    provider: Provider
    tier: Tier
    weekly_allowance_used_pct: float  # 0-100 from meter
    cache_hit_rate: float  # 0-1 (0.94 for Astra, 0.79 for Sonnet)
    banked_resets_available: int = 0
    fast_mode_enabled: bool = False

@dataclass
class RoutingDecision:
    provider: Provider
    tier: Tier
    model: str
    reasoning: str
    estimated_cost_pct: float  # % of weekly allowance

@dataclass
class TaskSpec:
    type: str  # code_generation, code_review, research, debugging, refactoring
    prefer_fast: bool = False
    require_frontier: bool = False  # Needs Opus/Fable
    max_cost_pct: float = 5.0  # Max % of weekly allowance

class SubscriptionTierRouter:
    """Roteia requests considerando tier allowance, cache, banked resets."""

    # Cache multipliers: effective allowance increase from cache reuse
    CACHE_MULTIPLIERS = {
        Provider.CODEX: 1.25,   # 94% cache → ~25% more tokens
        Provider.CLAUDE: 1.093, # 79% cache → ~9.3% more tokens
        Provider.GLM: 1.0,
    }

    # API equiv projections per full weekly allowance (from video)
    WEEKLY_API_EQUIV = {
        Tier.CODEX_PLUS: 240,
        Tier.CODEX_PRO_5X: 1200,
        Tier.CODEX_PRO_20X: 4900,
        Tier.CLAUDE_PRO: 101,
        Tier.CLAUDE_MAX_5X: 503,
        Tier.CLAUDE_MAX_20X: 2013,
        Tier.GLM_18: "unlimited_practical",
        Tier.GLM_80: "unlimited_practical",
        Tier.GLM_168: "unlimited_practical",
    }

    def __init__(self, subscriptions: Dict[Tier, SubscriptionState]):
        self.subscriptions = subscriptions

    def route(self, task: TaskSpec) -> RoutingDecision:
        """Decide best provider/tier for a task."""
        candidates = []

        for tier, state in self.subscriptions.items():
            # Skip if allowance exhausted (no banked resets)
            if state.weekly_allowance_used_pct >= 95 and state.banked_resets_available == 0:
                continue

            effective_remaining = self._effective_allowance_remaining(state)
            task_cost = self._estimate_task_cost(task, state.provider)

            if task_cost > effective_remaining:
                continue

            score = self._score_candidate(task, state, task_cost, effective_remaining)
            candidates.append((score, state, task_cost))

        if not candidates:
            return self._fallback_route(task)

        candidates.sort(key=lambda x: x[0], reverse=True)
        best = candidates[0]

        return RoutingDecision(
            provider=best[1].provider,
            tier=best[1].tier,
            model=self._tier_to_model(best[1].tier, task),
            reasoning=best[1].provider.value + " " + best[1].tier.value,
            estimated_cost_pct=best[2] / self._effective_allowance_remaining(best[1]) * 100
        )

    def _effective_allowance_remaining(self, state: SubscriptionState) -> float:
        """Effective allowance remaining considering cache."""
        base_remaining_pct = 100 - state.weekly_allowance_used_pct
        return base_remaining_pct * self.CACHE_MULTIPLIERS[state.provider]

    def _estimate_task_cost(self, task: TaskSpec, provider: Provider) -> float:
        """Estimate task cost as % of weekly allowance."""
        base_costs = {
            "code_generation": 2.0,
            "code_review": 1.0,
            "research": 3.0,
            "debugging": 1.5,
            "refactoring": 2.5,
        }
        base = base_costs.get(task.type, 1.0)
        if task.prefer_fast:
            base *= 2.0  # Fast mode ~2x credit consumption
        return base

    def _score_candidate(self, task, state, task_cost, effective_remaining):
        """Prefer cheaper provider, more remaining allowance, cache efficiency."""
        cost_score = 1.0 - (task_cost / effective_remaining)
        cache_score = state.cache_hit_rate
        tier_score = 1.0 if state.tier in [Tier.CODEX_PRO_20X, Tier.CLAUDE_MAX_20X] else 0.5
        return cost_score * 0.5 + cache_score * 0.3 + tier_score * 0.2

    def _tier_to_model(self, tier: Tier, task: TaskSpec) -> str:
        """Map tier to specific model."""
        mapping = {
            Tier.CODEX_PLUS: "gpt-4o",
            Tier.CODEX_PRO_5X: "gpt-4o",
            Tier.CODEX_PRO_20X: "gpt-4o",
            Tier.CLAUDE_PRO: "claude-sonnet-4",
            Tier.CLAUDE_MAX_5X: "claude-sonnet-4",
            Tier.CLAUDE_MAX_20X: "claude-opus-4",  # Fable 5.1 requires paid credits
            Tier.GLM_18: "glm-4.5",
            Tier.GLM_80: "glm-4.5",
            Tier.GLM_168: "glm-4.5",
        }
        return mapping.get(tier, "default")

    def _fallback_route(self, task) -> RoutingDecision:
        """When all allowances exhausted: banked reset, else GLM $18."""
        for tier, state in self.subscriptions.items():
            if state.banked_resets_available > 0:
                return RoutingDecision(
                    provider=state.provider,
                    tier=state.tier,
                    model=self._tier_to_model(state.tier, task),
                    reasoning=f"Using banked reset ({state.banked_resets_available} left)",
                    estimated_cost_pct=0
                )

        return RoutingDecision(
            provider=Provider.GLM,
            tier=Tier.GLM_18,
            model="glm-4.5",
            reasoning="All allowances exhausted, using GLM budget tier",
            estimated_cost_pct=0
        )
```

## BankedResetManager

```python
class BankedResetManager:
    """Gerencia banked resets promocionais OpenAI."""

    def check_and_use_reset(self, state: SubscriptionState) -> bool:
        """Usa reset se allowance crítico (>80%) e há reset disponível."""
        if state.banked_resets_available > 0 and state.weekly_allowance_used_pct > 80:
            # Refreshes 5h + weekly limits, changes reset date
            state.banked_resets_available -= 1
            state.weekly_allowance_used_pct = 0
            return True
        return False

    def sync_from_openai(self, state: SubscriptionState):
        """Sync banked resets from OpenAI usage settings (periodically)."""
        pass
```

## GLM como Budget Tier

```python
GLM_BUDGET_CONFIG = {
    "tier": "glm_18",
    "monthly_cost": 18,  # USD
    "strengths": ["browser_automation", "c_coding", "long_task_persistence", "trial_quota"],
    "weaknesses": ["not_frontier_reasoning", "limited_languages", "no_image_generation"],
    "use_when": ["budget_constrained", "volume_coding_tasks", "browser_automation_needed",
                 "c_cpp_projects", "allowance_exhausted_on_others"],
}

def should_use_glm_budget(task: TaskSpec, router: SubscriptionTierRouter) -> bool:
    if router._fallback_route(task).provider == Provider.GLM:
        return True
    if task.type in ["code_generation", "debugging"] and getattr(task, "require_c_cpp", False):
        return True
    if getattr(task, "require_browser_automation", False):
        return True
    return False
```

## Fast Mode Decision

```python
def should_use_fast_mode(task: TaskSpec, state: SubscriptionState,
                          urgency: str = "normal") -> bool:
    """Fast mode ~2x credit consumption. Worth it?"""
    if not state.fast_mode_enabled:
        return False
    if urgency == "critical" and task.require_frontier:
        return True
    if urgency == "high" and state.weekly_allowance_used_pct < 50:
        return True
    if state.weekly_allowance_used_pct > 70:
        return False  # Cost-sensitive: never on low allowance
    return False
```

## Exemplo de Uso Completo

```python
subscriptions = {
    Tier.CODEX_PRO_20X: SubscriptionState(
        provider=Provider.CODEX, tier=Tier.CODEX_PRO_20X,
        weekly_allowance_used_pct=15, cache_hit_rate=0.94,
        banked_resets_available=1, fast_mode_enabled=True
    ),
    Tier.CLAUDE_MAX_5X: SubscriptionState(
        provider=Provider.CLAUDE, tier=Tier.CLAUDE_MAX_5X,
        weekly_allowance_used_pct=60, cache_hit_rate=0.79,
        banked_resets_available=0, fast_mode_enabled=True
    ),
    Tier.GLM_18: SubscriptionState(
        provider=Provider.GLM, tier=Tier.GLM_18,
        weekly_allowance_used_pct=0, cache_hit_rate=0.0,
        banked_resets_available=0, fast_mode_enabled=False
    ),
}

router = SubscriptionTierRouter(subscriptions)
task = TaskSpec(type="code_generation", prefer_fast=False)
decision = router.route(task)
print(f"Route to: {decision.provider.value} {decision.tier.value} ({decision.model})")
print(f"Estimated cost: {decision.estimated_cost_pct:.1f}% of weekly allowance")
```
