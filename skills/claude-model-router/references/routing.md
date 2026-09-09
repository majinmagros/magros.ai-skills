# Routing — model-routing.yaml, ModelRouter, ModelCostTracker, CLI

## 1. Model Assignment Rules

```yaml
# model-routing.yaml
routing_rules:
  daily_tasks:
    model: "sonet-3.7"
    max_cost_per_task: 0.50
    use_for:
      - writing
      - analysis
      - research
      - refactoring
      - simple_coding

  complex_tasks:
    model: "opus-5"
    max_cost_per_task: 5.00
    use_for:
      - architectural_decisions
      - complex_debugging
      - security_audit
      - multi_step_reasoning

  reasoning_tasks:
    model: "fable-5"
    max_cost_per_task: 10.00
    use_for:
      - complex_math
      - algorithm_design
      - security_research

  swap_rules:
    - if: "task_complexity > 7/10"
      then: "upgrade_to_opus"
    - if: "task_cost > 3x_expected"
      then: "downgrade_to_sonet"
    - if: "context_tokens > 100k"
      then: "consider_fable"
```

## 2. Mid-Task Swap Logic

```python
# model_router.py
class ModelRouter:
    def __init__(self):
        self.current_model = "sonet-3.7"
        self.task_tokens = 0
        self.session_cost = 0.0

    def should_swap_model(self, task_complexity: int, estimated_tokens: int) -> dict:
        """Decide se deve trocar de modelo mid-task."""

        current_cost = self.session_cost
        estimated_cost = self.estimate_cost(estimated_tokens)

        # Swap para modelo mais caro se tarefa complexa
        if task_complexity >= 8 and self.current_model != "opus-5":
            return {"action": "upgrade", "model": "opus-5", "reason": "High complexity task"}

        # Swap para modelo mais barato se tarefa simples
        if task_complexity <= 3 and self.current_model != "sonet-3.7":
            return {"action": "downgrade", "model": "sonet-3.7", "reason": "Simple task"}

        # Swap se custo estimado > 3x expected
        if self.task_tokens > 0 and estimated_tokens > self.task_tokens * 3:
            return {"action": "downgrade", "model": "sonet-3.7", "reason": "Cost overrun prevention"}

        return {"action": "none"}

    def estimate_cost(self, tokens: int, model: str = None) -> float:
        model = model or self.current_model
        # Rough estimate: 70% input, 30% output (rates per 1k tokens)
        rates = {
            "sonet-3.7": (0.003, 0.015),
            "opus-5": (0.015, 0.075),
            "fable-5": (0.03, 0.15)
        }
        in_rate, out_rate = rates.get(model, (0.003, 0.015))
        return ((tokens * 0.7) * in_rate + (tokens * 0.3) * out_rate) / 1000
```

## 3. Cost Tracking Per Task

```python
# cost_tracker.py
class ModelCostTracker:
    def __init__(self, session_budget: float = 100.0):
        self.session_budget = session_budget
        self.task_costs = []
        self.model_usage = {}

    def record_task(self, task_name: str, model: str, tokens_in: int, tokens_out: int, duration: float):
        cost = self._calculate_cost(tokens_in, tokens_out)

        record = {
            "task": task_name,
            "model": model,
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "cost_usd": cost,
            "timestamp": time.time()
        }

        self.task_costs.append(record)
        self.model_usage[model] = self.model_usage.get(model, 0) + cost

        return self._check_budget()

    def get_session_report(self) -> dict:
        total = sum(t["cost_usd"] for t in self.task_costs)
        return {
            "total_cost": total,
            "budget_remaining": self.session_budget - total,
            "by_model": self.model_usage,
            "task_count": len(self.task_costs)
        }
```

## Mid-Task Swap CLI

```bash
# CLI usage
claude-model-router swap --to opus-5 --reason "complex debugging"
claude-model-router swap --to sonet-3.7 --reason "cost optimization"
claude-model-router status  # Shows current model, session cost, budget
```
