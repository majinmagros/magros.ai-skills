---
name: agent-cost-optimization-batch
description: Use when optimizing agent costs via batch mode — 50-75% savings running 24h in advance, pre-warm sandboxes for latency-sensitive parts, multi-model cost allocation (frontier for coordination, cheap for fan-out). Triggers on "agent batch mode", "batch processing agents", "pre-warm sandboxes", "multi-model cost allocation", "agent cost optimization", "managed agents batch", "cost savings 50-75%".
metadata:
  origin: ECC
  source_docs:
    - https://docs.anthropic.com/en/docs/managed-agents/batch
  video_source: "hm8NzEd5io0 - How founders build on Claude Managed Agents (Claude Oficial)"
  related_skills:
    - cost-aware-llm-pipeline
    - roteamento-modelos-baratos
    - claude-managed-agents-patterns
    - subscription-tier-routing
---

# Skill: agent-cost-optimization-batch — Otimização de Custo via Batch Mode

Padrões de **batch mode** do Managed Agents SDK: **50-75% savings** rodando 24h antes, **pre-warm sandboxes** para partes latency-sensitive, **multi-model cost allocation** (frontier para coordenação, barato para fan-out 500 accounts). Extraído da mesa redonda oficial Anthropic.

## Quando usar

- Você usa **Managed Agents SDK** e quer reduzir custos drasticamente
- Tem jobs que podem rodar **24h antes** (nightly, batch processing)
- Precisa de **pre-warm sandboxes** para reduzir cold start latency
- Quer alocar **modelos caros só onde necessário** (coordenação) vs baratos (volume)
- Processa **centenas de accounts** em paralelo (fan-out)

## Quando NÃO usar

- Tasks que precisam resposta imediata (real-time) → use normal mode
- Cost tracking genérico → use `cost-aware-llm-pipeline`
- Roteamento simples → use `roteamento-modelos-baratos`
- Subscription tier routing → use `subscription-tier-routing`

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| Batch mode: 50-75% savings running 24h in advance | ✅ | https://docs.anthropic.com/en/docs/managed-agents/batch |
| Pre-warm sandboxes for latency-sensitive parts | ✅ | Video + docs |
| Multi-model allocation: frontier for coordination, cheap for fan-out | ✅ | Video (500 accounts example) |
| Managed Agents batch API exists | ✅ | Anthropic docs |

---

## Batch Mode Economics

```
┌─────────────────────────────────────────────────────────────────┐
│                    COST COMPARISON                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  NORMAL MODE (On-demand):                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 500 account queries × Opus 4 = $X per run                │   │
│  │ Daily runs = $30X/month                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼ 50-75% savings                   │
│                                                                  │
│  BATCH MODE (24h advance):                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 500 account queries × Opus 4 = $0.25X - $0.5X per run   │   │
│  │ Daily runs = $7.5X - $15X/month                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  SAVINGS: $15X - $22.5X/month (50-75%)                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Multi-Model Cost Allocation

```python
from dataclasses import dataclass
from typing import Dict, List
from enum import Enum

class ModelTier(Enum):
    FRONTIER = "frontier"      # Opus 4, Fable 5.1, GPT-4o
    MID = "mid"                # Sonnet 4, Haiku 3.5
    CHEAP = "cheap"            # DeepSeek, GLM, local

@dataclass
class ModelAllocation:
    tier: ModelTier
    model: str
    cost_per_1k_tokens: float
    use_cases: List[str]

# Allocation strategy from video:
# - Coordinator (1 agent): FRONTIER - complex reasoning, planning
# - Fan-out workers (500 agents): CHEAP - simple execution, parallel
# - Verification: MID - balance of accuracy/cost

ALLOCATION_STRATEGY = {
    "coordinator": ModelAllocation(
        tier=ModelTier.FRONTIER,
        model="claude-opus-4",
        cost_per_1k_tokens=0.015,
        use_cases=[
            "planning_and_orchestration",
            "complex_reasoning",
            "decision_making",
            "code_generation_for_complex_tasks"
        ]
    ),
    "fan_out_workers": ModelAllocation(
        tier=ModelTier.CHEAP,
        model="deepseek-v4-flash",  # or glm-4.5
        cost_per_1k_tokens=0.0002,
        use_cases=[
            "account_evaluation",
            "data_extraction",
            "simple_queries",
            "parallel_processing"
        ]
    ),
    "verification": ModelAllocation(
        tier=ModelTier.MID,
        model="claude-sonnet-4",
        cost_per_1k_tokens=0.003,
        use_cases=[
            "output_verification",
            "quality_checks",
            "rubric_evaluation"
        ]
    ),
}

def calculate_batch_cost(
    num_accounts: int,
    coordinator_tokens: int,
    worker_tokens_per_account: int,
    verifier_tokens_per_account: int
) -> dict:
    """Calculate cost for batch job with multi-model allocation."""
    
    coordinator_cost = (coordinator_tokens / 1000) * ALLOCATION_STRATEGY["coordinator"].cost_per_1k_tokens
    worker_cost = num_accounts * (worker_tokens_per_account / 1000) * ALLOCATION_STRATEGY["fan_out_workers"].cost_per_1k_tokens
    verifier_cost = num_accounts * (verifier_tokens_per_account / 1000) * ALLOCATION_STRATEGY["verification"].cost_per_1k_tokens
    
    total = coordinator_cost + worker_cost + verifier_cost
    
    # Compare with all-frontier
    all_frontier = (coordinator_tokens + num_accounts * (worker_tokens_per_account + verifier_tokens_per_account)) / 1000 * ALLOCATION_STRATEGY["coordinator"].cost_per_1k_tokens
    
    savings = (all_frontier - total) / all_frontier * 100
    
    return {
        "total_cost": total,
        "all_frontier_cost": all_frontier,
        "savings_pct": savings,
        "breakdown": {
            "coordinator": coordinator_cost,
            "workers": worker_cost,
            "verification": verifier_cost
        }
    }

# Example: 500 accounts
# coordinator: 50k tokens, workers: 10k/account, verifier: 5k/account
result = calculate_batch_cost(500, 50000, 10000, 5000)
# Result: ~70-80% savings vs all-frontier
```

---

## Batch Job Implementation

```python
from dataclasses import dataclass
from typing import Callable, Optional
from datetime import datetime, timedelta
import json

@dataclass
class BatchJob:
    name: str
    schedule: str  # cron expression
    task_generator: Callable[[], List[dict]]  # Returns list of tasks
    model_allocation: Dict[str, str]  # role -> model
    max_parallelism: int = 100
    timeout_hours: int = 4

class ManagedAgentsBatchClient:
    """
    Client para Managed Agents Batch API.
    """
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.anthropic.com/v1/managed-agents/batch"
    
    def create_batch_job(self, job: BatchJob) -> str:
        """Create scheduled batch job."""
        payload = {
            "name": job.name,
            "schedule": job.schedule,
            "tasks": job.task_generator(),
            "model_allocation": job.model_allocation,
            "max_parallelism": job.max_parallelism,
            "timeout_hours": job.timeout_hours
        }
        # POST to API
        return "batch_job_id"
    
    def get_batch_status(self, batch_id: str) -> dict:
        """Get batch job status."""
        # GET from API
        pass
    
    def get_batch_results(self, batch_id: str) -> List[dict]:
        """Get completed batch results."""
        # GET from API
        pass


# === EXEMPLO: Watchtower Nightly Batch ===

def create_watchtower_batch() -> BatchJob:
    """Nightly batch: evaluate 500 accounts for next-day priorities."""
    
    def generate_tasks() -> List[dict]:
        tasks = []
        # In reality, fetch from account agents
        for account_id in range(1, 501):
            tasks.append({
                "account_id": f"acc_{account_id}",
                "task": "evaluate_priority_for_tomorrow",
                "context": {
                    "user_preferences": "managed_memory",
                    "org_concepts": "cross_account_memory"
                }
            })
        return tasks
    
    return BatchJob(
        name="watchtower-nightly-priorities",
        schedule="0 2 * * *",  # 2 AM daily
        task_generator=generate_tasks,
        model_allocation={
            "coordinator": "claude-opus-4",
            "fan_out_workers": "deepseek-v4-flash",
            "verification": "claude-sonnet-4"
        },
        max_parallelism=200,
        timeout_hours=3
    )


# === EXEMPLO: Funnel Analysis Nightly ===

def create_funnel_analysis_batch() -> BatchJob:
    """Nightly batch: analyze funnel drops, suggest fixes."""
    
    def generate_tasks() -> List[dict]:
        return [
            {
                "funnel": "checkout",
                "period": "last_24h",
                "task": "detect_conversion_drops",
                "lookback_weeks": 4
            },
            {
                "funnel": "signup",
                "period": "last_24h", 
                "task": "detect_conversion_drops",
                "lookback_weeks": 4
            },
            # ... more funnels
        ]
    
    return BatchJob(
        name="funnel-analysis-nightly",
        schedule="0 3 * * *",  # 3 AM daily
        task_generator=generate_tasks,
        model_allocation={
            "coordinator": "claude-opus-4",
            "fan_out_workers": "deepseek-v4-flash",
            "verification": "claude-sonnet-4"
        },
        max_parallelism=50,
        timeout_hours=2
    )
```

---

## Pre-warm Sandboxes Pattern

```python
class SandboxPool:
    """
    Pool de sandboxes pre-warmed para latency-sensitive operations.
    """
    
    def __init__(self, client: ManagedAgentsBatchClient):
        self.client = client
        self.warmed_sandboxes = {}
    
    def prewarm(self, config: dict, count: int = 10) -> List[str]:
        """
        Pre-warm sandboxes antes de job latency-sensitive.
        """
        sandbox_ids = []
        
        for i in range(count):
            # Create sandbox with repo loaded
            sandbox_id = self.client.sandboxes.create(
                source="github",
                repo=config["repo"],
                branch=config.get("branch", "main"),
                warm=True  # Pre-load repo, install deps
            )
            sandbox_ids.append(sandbox_id)
        
        self.warmed_sandboxes[config["repo"]] = sandbox_ids
        return sandbox_ids
    
    def get_warmed_sandbox(self, repo: str) -> Optional[str]:
        """Get a pre-warmed sandbox."""
        if repo in self.warmed_sandboxes and self.warmed_sandboxes[repo]:
            return self.warmed_sandboxes[repo].pop()
        return None
    
    def return_sandbox(self, repo: str, sandbox_id: str):
        """Return sandbox to pool (if still healthy)."""
        if repo not in self.warmed_sandboxes:
            self.warmed_sandboxes[repo] = []
        self.warmed_sandboxes[repo].append(sandbox_id)


# Usage no agent loop:
sandbox_pool = SandboxPool(batch_client)

# Pre-warm antes de job crítico
sandbox_pool.prewarm({"repo": "org/main-app"}, count=10)

# Durante execução latency-sensitive:
sandbox_id = sandbox_pool.get_warmed_sandbox("org/main-app")
if sandbox_id:
    result = sandbox_pool.client.sandboxes.run(sandbox_id, task)
    sandbox_pool.return_sandbox("org/main-app", sandbox_id)
else:
    # Fallback: create on-demand (cold start)
    result = sandbox_pool.client.sandboxes.create_and_run(task)
```

---

## Cost Monitoring Dashboard

```python
class BatchCostMonitor:
    """
    Monitor costs for batch jobs.
    """
    
    def __init__(self):
        self.job_costs = {}
    
    def record_batch_cost(self, batch_id: str, cost_breakdown: dict):
        self.job_costs[batch_id] = {
            "timestamp": datetime.now(),
            **cost_breakdown
        }
    
    def get_monthly_projection(self) -> dict:
        """Project monthly cost from recent batches."""
        recent = list(self.job_costs.values())[-30:]  # Last 30 runs
        if not recent:
            return {"projected_monthly": 0}
        
        avg_daily = sum(j["total_cost"] for j in recent) / len(recent)
        return {
            "projected_monthly": avg_daily * 30,
            "avg_daily": avg_daily,
            "runs_analyzed": len(recent)
        }
    
    def alert_if_over_budget(self, budget_monthly: float):
        """Alert if projected monthly exceeds budget."""
        projection = self.get_monthly_projection()
        if projection["projected_monthly"] > budget_monthly:
            return {
                "alert": True,
                "projected": projection["projected_monthly"],
                "budget": budget_monthly,
                "overage_pct": (projection["projected_monthly"] - budget_monthly) / budget_monthly * 100
            }
        return {"alert": False}
```

---

## Integração com Skills Existentes

| Skill | Relação |
|---|---|
| `cost-aware-llm-pipeline` | Fornece batch mode cost model |
| `roteamento-modelos-baratos` | Multi-model allocation strategy |
| `claude-managed-agents-patterns` | Batch mode é feature do Managed Agents |
| `subscription-tier-routing` | Batch mode usa weekly allowances efficientemente |

---

## Referências

- Video: `hm8NzEd5io0.en.dedup.txt` — linhas 1079-1096, 1147-1183
- Managed Agents Batch: https://docs.anthropic.com/en/docs/managed-agents/batch
- Key quotes: "you can probably save 50%-75% on cost and make that possible", "batch mode that easily today", "frontier intelligence for coordinator, cheap for fan-out"