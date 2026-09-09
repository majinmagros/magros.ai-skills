---
name: subscription-tier-routing
description: Use when routing LLM calls based on subscription tier allowances — Codex (5X/20X weekly), Claude (5X/20X weekly), cache-aware routing (94% Astra cached, 79% Sonnet cached), fast mode tradeoffs, banked resets (OpenAI promotional), GLM $18 budget tier. Triggers on "subscription tier routing", "weekly allowance routing", "cache aware routing", "banked resets", "codex pro routing", "claude max routing", "glm budget tier".
metadata:
  origin: ECC
  source_docs:
    - https://platform.openai.com/docs/api-reference
    - https://docs.anthropic.com/en/api
    - https://z.ai/pricing
  video_source: "EIiXhCaZ4rw - I Mathematically CALCULATED the worth of Codex & Claude Code PLANS (AI Code King)"
  related_skills:
    - roteamento-modelos-baratos
    - claude-model-router
    - cost-aware-llm-pipeline
    - glm-integration-patterns
---

# Skill: subscription-tier-routing — Roteamento Ciente de Tier de Assinatura

Roteamento de modelos que considera **weekly allowances por tier**, **cache hit rates**, **fast mode tradeoffs**, **banked resets promocionais** e **GLM como budget tier**. Extraído da análise matemática de valor das assinaturas Codex vs Claude Code.

## Quando usar

- Você paga assinaturas (Codex Pro 5X/20X, Claude Max 5X/20X) e quer maximizar valor
- Precisa rotear baseado em **allowance restante** não só custo por token
- Quer aproveitar **cache hit rates** (94% Astra, 79% Sonnet) para estender allowance
- Precisa lidar com **banked resets** (OpenAI promotional one-time refills)
- Quer usar **GLM $18/mo** como tier orçamentário para tarefas de volume
- Decide quando usar **fast mode** (higher credit consumption) vs normal

## Quando NÃO usar

- Roteamento simples por custo/token → use `roteamento-modelos-baratos`
- Model routing genérico → use `claude-model-router`
- Cost tracking sem tier awareness → use `cost-aware-llm-pipeline`
- GLM patterns específicos → use `glm-integration-patterns`

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| Codex Pro 20X: ~$4900 API equiv/mês (projetado, small sample) | ⚠️ Projetado | Video + OpenAI pricing |
| Claude Max 20X: ~$2013 API equiv/mês (projetado) | ⚠️ Projetado | Video + Anthropic pricing |
| Cache rates: 94% Astra input cached, 79% Sonnet input cached | ✅ | Video measurement |
| GLM $18 plano: browser automation, C coding, trial quota | ✅ | Z.ai pricing page |
| Banked resets: OpenAI promotional, refreshes 5h+weekly | ✅ | OpenAI usage settings |
| Fast mode: higher credit consumption, faster responses | ✅ | OpenAI/Anthropic docs |

> **Nota:** Valores projetados ($4900, $2013) baseados em small samples (43min, 13¢) extrapolados. Não são measured monthly limits.

---

## Subscription Tier Matrix

| Provider | Plan | Monthly | Weekly Allowance | API Equiv Projection | Cache Rate | Best For |
|---|---|---|---|---|---|---|
| **Codex** | Plus | $20 | 1X | ~$240 | 94% Astra | Light coding |
| **Codex** | Pro 5X | $100 | 5X | ~$1,200 | 94% Astra | Daily coding |
| **Codex** | Pro 20X | $200 | 20X | ~$4,900 | 94% Astra | Heavy volume |
| **Claude** | Pro | $20 | 1X (5h/day) | ~$101 | 79% Sonnet | Light coding |
| **Claude** | Max 5X | $100 | 5X (5h/day) | ~$503 | 79% Sonnet | Daily coding |
| **Claude** | Max 20X | $200 | 20X (5h/day) | ~$2,013 | 79% Sonnet | Heavy volume |
| **GLM/Z.ai** | Coding Plan | $18 | Generous | N/A (local/API) | N/A | Budget volume |
| **GLM/Z.ai** | Higher tiers | $80/$168 | More | N/A | N/A | Scale |

---

## Cache-Aware Routing Logic

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

class SubscriptionTierRouter:
    """
    Roteia requests considerando tier allowance, cache, banked resets.
    """
    
    # Cache multipliers: effective allowance increase from cache reuse
    CACHE_MULTIPLIERS = {
        Provider.CODEX: 1.25,   # 94% cache → ~25% more tokens
        Provider.CLAUDE: 1.093, # 79% cache → ~9.3% more tokens
        Provider.GLM: 1.0,      # Unknown
    }
    
    # API equiv projections per full weekly allowance (from video)
    WEEKLY_API_EQUIV = {
        Tier.CODEX_PLUS: 240,
        Tier.CODEX_PRO_5X: 1200,
        Tier.CODEX_PRO_20X: 4900,
        Tier.CLAUDE_PRO: 101,
        Tier.CLAUDE_MAX_5X: 503,
        Tier.CLAUDE_MAX_20X: 2013,
        Tier.GLM_18: "unlimited_practical",  # Generous enough
        Tier.GLM_80: "unlimited_practical",
        Tier.GLM_168: "unlimited_practical",
    }
    
    def __init__(self, subscriptions: Dict[Tier, SubscriptionState]):
        self.subscriptions = subscriptions
    
    def route(self, task: "TaskSpec") -> RoutingDecision:
        """
        Decide best provider/tier for a task.
        """
        candidates = []
        
        for tier, state in self.subscriptions.items():
            # Skip if allowance exhausted (no banked resets)
            if state.weekly_allowance_used_pct >= 95 and state.banked_resets_available == 0:
                continue
            
            # Calculate effective allowance remaining
            effective_remaining = self._effective_allowance_remaining(state)
            
            # Estimate task cost
            task_cost = self._estimate_task_cost(task, state.provider)
            
            # Can we afford it?
            if task_cost > effective_remaining:
                continue
            
            # Score candidate
            score = self._score_candidate(task, state, task_cost, effective_remaining)
            candidates.append((score, state, task_cost))
        
        if not candidates:
            # Fallback: use banked reset or cheapest available
            return self._fallback_route(task)
        
        # Pick highest score
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
        """Calculate effective allowance remaining considering cache."""
        base_remaining_pct = 100 - state.weekly_allowance_used_pct
        multiplier = self.CACHE_MULTIPLIERS[state.provider]
        return base_remaining_pct * multiplier
    
    def _estimate_task_cost(self, task: "TaskSpec", provider: Provider) -> float:
        """Estimate task cost as % of weekly allowance."""
        # Simplified: base cost by task type
        base_costs = {
            "code_generation": 2.0,
            "code_review": 1.0,
            "research": 3.0,
            "debugging": 1.5,
            "refactoring": 2.5,
        }
        base = base_costs.get(task.type, 1.0)
        
        # Fast mode multiplier
        if task.prefer_fast:
            base *= 2.0  # Fast mode ~2x credit consumption
        
        return base
    
    def _score_candidate(self, task, state, task_cost, effective_remaining):
        """Score routing candidate."""
        # Prefer: cheaper provider, more remaining allowance, cache efficiency
        cost_score = 1.0 - (task_cost / effective_remaining)
        cache_score = state.cache_hit_rate
        tier_score = 1.0 if state.tier in [Tier.CODEX_PRO_20X, Tier.CLAUDE_MAX_20X] else 0.5
        
        return cost_score * 0.5 + cache_score * 0.3 + tier_score * 0.2
    
    def _tier_to_model(self, tier: Tier, task: "TaskSpec") -> str:
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
        """When all allowances exhausted."""
        # Check banked resets
        for tier, state in self.subscriptions.items():
            if state.banked_resets_available > 0:
                return RoutingDecision(
                    provider=state.provider,
                    tier=state.tier,
                    model=self._tier_to_model(state.tier, task),
                    reasoning=f"Using banked reset ({state.banked_resets_available} left)",
                    estimated_cost_pct=0
                )
        
        # Ultimate fallback: GLM $18
        return RoutingDecision(
            provider=Provider.GLM,
            tier=Tier.GLM_18,
            model="glm-4.5",
            reasoning="All allowances exhausted, using GLM budget tier",
            estimated_cost_pct=0
        )


@dataclass
class TaskSpec:
    type: str  # code_generation, code_review, research, debugging, refactoring
    prefer_fast: bool = False
    require_frontier: bool = False  # Needs Opus/Fable
    max_cost_pct: float = 5.0  # Max % of weekly allowance
```

---

## Banked Resets Handling

```python
class BankedResetManager:
    """
    Gerencia banked resets promocionais OpenAI.
    """
    
    def check_and_use_reset(self, state: SubscriptionState) -> bool:
        """
        Verifica se há banked reset disponível e usa se allowance crítico.
        """
        if state.banked_resets_available > 0 and state.weekly_allowance_used_pct > 80:
            # Use reset: refreshes 5h + weekly limits, changes reset date
            state.banked_resets_available -= 1
            state.weekly_allowance_used_pct = 0  # Reset
            return True
        return False
    
    def sync_from_openai(self, state: SubscriptionState):
        """
        Sync banked resets from OpenAI usage settings.
        Call periodically (not every request).
        """
        # Would call OpenAI API to check usage settings
        pass
```

---

## GLM como Budget Tier

```python
GLM_BUDGET_CONFIG = {
    "tier": "glm_18",
    "monthly_cost": 18,  # USD
    "strengths": [
        "browser_automation",  # Interface interaction
        "c_coding",            # Strong at C/C++
        "long_task_persistence", # Keeps working on longer tasks
        "trial_quota",         # New users get trial
    ],
    "weaknesses": [
        "not_frontier_reasoning",
        "limited_languages",  # ~10 vs 50+
        "no_image_generation",
    ],
    "use_when": [
        "budget_constrained",
        "volume_coding_tasks",
        "browser_automation_needed",
        "c_cpp_projects",
        "allowance_exhausted_on_others",
    ]
}

def should_use_glm_budget(task: TaskSpec, router: SubscriptionTierRouter) -> bool:
    """Decide if GLM budget tier is appropriate."""
    # If all other allowances exhausted
    if router._fallback_route(task).provider == Provider.GLM:
        return True
    
    # If task matches GLM strengths
    if task.type in ["code_generation", "debugging"] and task.require_c_cpp:
        return True
    
    # If browser automation needed
    if task.require_browser_automation:
        return True
    
    return False
```

---

## Fast Mode Decision

```python
def should_use_fast_mode(
    task: TaskSpec, 
    state: SubscriptionState,
    urgency: str = "normal"  # low, normal, high, critical
) -> bool:
    """
    Decide if fast mode worth the credit cost.
    Fast mode ~2x credit consumption for faster responses.
    """
    if not state.fast_mode_enabled:
        return False
    
    # Critical urgency + frontier model needed
    if urgency == "critical" and task.require_frontier:
        return True
    
    # High urgency + plenty of allowance
    if urgency == "high" and state.weekly_allowance_used_pct < 50:
        return True
    
    # Cost-sensitive: never use fast mode if allowance low
    if state.weekly_allowance_used_pct > 70:
        return False
    
    return False
```

---

## Integration com Skills Existentes

| Skill | Como Complementa |
|---|---|
| `roteamento-modelos-baratos` | Adiciona tier awareness (weekly allowances, cache, banked resets) |
| `claude-model-router` | Estende com subscription state tracking |
| `cost-aware-llm-pipeline` | Fornece subscription-tier cost model |
| `glm-integration-patterns` | GLM como fallback budget tier |

---

## Exemplo de Uso Completo

```python
# Setup subscriptions
subscriptions = {
    Tier.CODEX_PRO_20X: SubscriptionState(
        provider=Provider.CODEX,
        tier=Tier.CODEX_PRO_20X,
        weekly_allowance_used_pct=15,  # 15% used
        cache_hit_rate=0.94,
        banked_resets_available=1,
        fast_mode_enabled=True
    ),
    Tier.CLAUDE_MAX_5X: SubscriptionState(
        provider=Provider.CLAUDE,
        tier=Tier.CLAUDE_MAX_5X,
        weekly_allowance_used_pct=60,
        cache_hit_rate=0.79,
        banked_resets_available=0,
        fast_mode_enabled=True
    ),
    Tier.GLM_18: SubscriptionState(
        provider=Provider.GLM,
        tier=Tier.GLM_18,
        weekly_allowance_used_pct=0,
        cache_hit_rate=0.0,
        banked_resets_available=0,
        fast_mode_enabled=False
    ),
}

router = SubscriptionTierRouter(subscriptions)

# Route a code generation task
task = TaskSpec(type="code_generation", prefer_fast=False)
decision = router.route(task)
print(f"Route to: {decision.provider.value} {decision.tier.value} ({decision.model})")
print(f"Reasoning: {decision.reasoning}")
print(f"Estimated cost: {decision.estimated_cost_pct:.1f}% of weekly allowance")
```

---

## Referências

- Video: `EIiXhCaZ4rw.en.dedup.txt` — linhas 94-169, 172-198, 278-307, 320-335
- OpenAI API Pricing: https://platform.openai.com/docs/pricing
- Anthropic API Pricing: https://docs.anthropic.com/en/docs/pricing
- Z.ai/GLM Pricing: https://z.ai/pricing
- Key quotes: "weekly meter moved from 0 to 3%", "94% of Astra's input and 79% of Sonnet's input came from cache", "banked resets... promotional, so availability varies"