# Implementation — Batch Mode + Multi-Model Allocation

`ALLOCATION_STRATEGY`, `calculate_batch_cost`, `ManagedAgentsBatchClient`, exemplos Watchtower/funnel, `SandboxPool`, `BatchCostMonitor`. Resumo no `SKILL.md`.

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

# Strategy from video: FRONTIER coordena, CHEAP executa volume, MID verifica
ALLOCATION_STRATEGY = {
    "coordinator": ModelAllocation(
        tier=ModelTier.FRONTIER, model="claude-opus-4", cost_per_1k_tokens=0.015,
        use_cases=["planning_and_orchestration", "complex_reasoning",
                   "decision_making", "code_generation_for_complex_tasks"]
    ),
    "fan_out_workers": ModelAllocation(
        tier=ModelTier.CHEAP, model="deepseek-v4-flash", cost_per_1k_tokens=0.0002,
        use_cases=["account_evaluation", "data_extraction",
                   "simple_queries", "parallel_processing"]
    ),
    "verification": ModelAllocation(
        tier=ModelTier.MID, model="claude-sonnet-4", cost_per_1k_tokens=0.003,
        use_cases=["output_verification", "quality_checks", "rubric_evaluation"]
    ),
}

def calculate_batch_cost(num_accounts: int, coordinator_tokens: int,
                         worker_tokens_per_account: int,
                         verifier_tokens_per_account: int) -> dict:
    """Cost with multi-model allocation vs all-frontier."""
    coordinator_cost = (coordinator_tokens / 1000) * ALLOCATION_STRATEGY["coordinator"].cost_per_1k_tokens
    worker_cost = num_accounts * (worker_tokens_per_account / 1000) * ALLOCATION_STRATEGY["fan_out_workers"].cost_per_1k_tokens
    verifier_cost = num_accounts * (verifier_tokens_per_account / 1000) * ALLOCATION_STRATEGY["verification"].cost_per_1k_tokens

    total = coordinator_cost + worker_cost + verifier_cost
    all_frontier = (coordinator_tokens + num_accounts * (worker_tokens_per_account + verifier_tokens_per_account)) / 1000 * ALLOCATION_STRATEGY["coordinator"].cost_per_1k_tokens

    return {"total_cost": total, "all_frontier_cost": all_frontier,
            "savings_pct": (all_frontier - total) / all_frontier * 100,
            "breakdown": {"coordinator": coordinator_cost, "workers": worker_cost,
                          "verification": verifier_cost}}

# Example: 500 accounts, 50k coord, 10k/worker, 5k/verifier → ~70-80% savings
result = calculate_batch_cost(500, 50000, 10000, 5000)
```

## BatchJob + ManagedAgentsBatchClient

```python
from dataclasses import dataclass
from typing import Callable
from datetime import datetime

@dataclass
class BatchJob:
    name: str
    schedule: str  # cron expression
    task_generator: Callable[[], List[dict]]
    model_allocation: Dict[str, str]  # role -> model
    max_parallelism: int = 100
    timeout_hours: int = 4

class ManagedAgentsBatchClient:
    """Client para Managed Agents Batch API."""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.anthropic.com/v1/managed-agents/batch"

    def create_batch_job(self, job: BatchJob) -> str:
        payload = {"name": job.name, "schedule": job.schedule,
                   "tasks": job.task_generator(),
                   "model_allocation": job.model_allocation,
                   "max_parallelism": job.max_parallelism,
                   "timeout_hours": job.timeout_hours}
        # POST to API
        return "batch_job_id"

    def get_batch_status(self, batch_id: str) -> dict:
        # GET from API
        pass

    def get_batch_results(self, batch_id: str) -> List[dict]:
        # GET from API
        pass
```

## Exemplos: Watchtower Nightly + Funnel Analysis

```python
def create_watchtower_batch() -> BatchJob:
    """Nightly: evaluate 500 accounts for next-day priorities (2 AM)."""

    def generate_tasks() -> List[dict]:
        return [{"account_id": f"acc_{i}",
                 "task": "evaluate_priority_for_tomorrow",
                 "context": {"user_preferences": "managed_memory",
                             "org_concepts": "cross_account_memory"}}
                for i in range(1, 501)]

    return BatchJob(
        name="watchtower-nightly-priorities",
        schedule="0 2 * * *",
        task_generator=generate_tasks,
        model_allocation={"coordinator": "claude-opus-4",
                          "fan_out_workers": "deepseek-v4-flash",
                          "verification": "claude-sonnet-4"},
        max_parallelism=200,
        timeout_hours=3
    )


def create_funnel_analysis_batch() -> BatchJob:
    """Nightly: funnel drops + fixes (3 AM)."""

    def generate_tasks() -> List[dict]:
        return [{"funnel": f, "period": "last_24h",
                 "task": "detect_conversion_drops", "lookback_weeks": 4}
                for f in ["checkout", "signup"]]

    return BatchJob(
        name="funnel-analysis-nightly",
        schedule="0 3 * * *",
        task_generator=generate_tasks,
        model_allocation={"coordinator": "claude-opus-4",
                          "fan_out_workers": "deepseek-v4-flash",
                          "verification": "claude-sonnet-4"},
        max_parallelism=50,
        timeout_hours=2
    )
```

## SandboxPool (Pre-warm)

```python
class SandboxPool:
    """Pool de sandboxes pre-warmed para latency-sensitive ops."""

    def __init__(self, client: ManagedAgentsBatchClient):
        self.client = client
        self.warmed_sandboxes = {}

    def prewarm(self, config: dict, count: int = 10) -> List[str]:
        sandbox_ids = []
        for i in range(count):
            sandbox_id = self.client.sandboxes.create(
                source="github", repo=config["repo"],
                branch=config.get("branch", "main"),
                warm=True  # Pre-load repo, install deps
            )
            sandbox_ids.append(sandbox_id)
        self.warmed_sandboxes[config["repo"]] = sandbox_ids
        return sandbox_ids

    def get_warmed_sandbox(self, repo: str) -> Optional[str]:
        if repo in self.warmed_sandboxes and self.warmed_sandboxes[repo]:
            return self.warmed_sandboxes[repo].pop()
        return None

    def return_sandbox(self, repo: str, sandbox_id: str):
        self.warmed_sandboxes.setdefault(repo, []).append(sandbox_id)


# Usage:
sandbox_pool = SandboxPool(batch_client)
sandbox_pool.prewarm({"repo": "org/main-app"}, count=10)
sandbox_id = sandbox_pool.get_warmed_sandbox("org/main-app")
if sandbox_id:
    result = sandbox_pool.client.sandboxes.run(sandbox_id, task)
    sandbox_pool.return_sandbox("org/main-app", sandbox_id)
else:
    result = sandbox_pool.client.sandboxes.create_and_run(task)  # cold start
```

## BatchCostMonitor

```python
class BatchCostMonitor:
    """Monitor costs + monthly projection + budget alerts."""

    def __init__(self):
        self.job_costs = {}

    def record_batch_cost(self, batch_id: str, cost_breakdown: dict):
        self.job_costs[batch_id] = {"timestamp": datetime.now(), **cost_breakdown}

    def get_monthly_projection(self) -> dict:
        recent = list(self.job_costs.values())[-30:]
        if not recent:
            return {"projected_monthly": 0}
        avg_daily = sum(j["total_cost"] for j in recent) / len(recent)
        return {"projected_monthly": avg_daily * 30, "avg_daily": avg_daily,
                "runs_analyzed": len(recent)}

    def alert_if_over_budget(self, budget_monthly: float):
        projection = self.get_monthly_projection()
        if projection["projected_monthly"] > budget_monthly:
            return {"alert": True, "projected": projection["projected_monthly"],
                    "budget": budget_monthly,
                    "overage_pct": (projection["projected_monthly"] - budget_monthly) / budget_monthly * 100}
        return {"alert": False}
```
