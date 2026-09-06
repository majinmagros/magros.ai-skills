---
name: claude-model-router
description: >-
  Estratégia de roteamento de modelos: Sonet (diário), Opus/Fable (complexo), swap mid-task, cost tracking per task. Baseado no vídeo da Luciana Papini "Me de 34 minutos e eu te darei 10 000 horas de conhecimento do Claude".
  Use quando: "claude model router", "roteamento modelos claude", "sonet vs opus", "swap model mid task", "cost tracking per task", "model routing strategy".
  Não use para: roteamento geral de LLMs (use roteamento-modelos-baratos), cost tracking geral (use cost-aware-llm-pipeline).
  Outcome: Estratégia de roteamento: Sonet (diário), Opus/Fable (complexo), swap mid-task, cost tracking per task.
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
    - https://docs.anthropic.com/en/docs/claude-code/settings
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Claude Model Router — Estratégia de Roteamento de Modelos

Estratégia de roteamento de modelos: **Sonet (diário), Opus/Fable (complexo), swap mid-task, cost tracking per task**.

## Quando usar (gatilhos concretos)

- "Roteamento de modelos no Claude Code"
- "Quando usar Sonet vs Opus vs Fable"
- "Swap de modelo mid-task"
- "Cost tracking por task"
- "Model routing strategy Claude"

## Quando NÃO usar

- Roteamento geral de LLMs → use `roteamento-modelos-baratos`
- Cost tracking geral → use `cost-aware-llm-pipeline`
- Model routing para outros provedores → use `roteamento-modelos-baratos`

## Pipeline (Baseado no vídeo Luciana Papini)

### 1. Model Assignment Rules

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

### 2. Mid-Task Swap Logic

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
        rates = {
            "sonet-3.7": {"in": 0.003, "out": 0.015},
            "opus-5": {"in": 0.015, "out": 0.075},
            "fable-5": {"in": 0.03, "out": 0.15}
        }
        # Rough estimate: 70% input, 30% output
        in_tokens = tokens * 0.7
        out_tokens = tokens * 0.3
        rates = {
            "sonet-3.7": (0.003, 0.015),
            "opus-5": (0.015, 0.075),
            "fable-5": (0.03, 0.15)
        }
        in_rate, out_rate = rates.get(model, (0.003, 0.015))
        return (in_tokens * in_rate + out_tokens * out_rate) / 1000
```

### 3. Cost Tracking Per Task

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

---

## Mid-Task Swap CLI

```bash
# CLI usage
claude-model-router swap --to opus-5 --reason "complex debugging"
claude-model-router swap --to sonet-3.7 --reason "cost optimization"
claude-model-router status  # Shows current model, session cost, budget
```

---

## Validação Contra Fonte (Luciana Papini Video + Anthropic Docs)

| Claim | Fonte | Status |
|-------|-------|--------|
| Sonet para tarefas diárias | Luciana Papini video | ✅ Confirmado |
| Opus/Fable para complexo | Luciana Papini video | ✅ Confirmado |
| Swap mid-task economiza | Luciana Papini video | ✅ Confirmado |
| Cost tracking per task | Anthropic Docs | ✅ Confirmado |

## Enriquecimento 2026-09-06 — Opus 5 + rate limits (AI Code King `6m1vJqdsanQ`, conferido nas docs oficiais)

- **Opus 5**: model ID `claude-opus-5`, contexto **1M default e máximo**, 128K output, thinking on — https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5. Preço API **$5/$25** por MTok.
- **Correção**: os **$10/$50** citados no vídeo são do **Fast mode / era Opus 4.8** (Week 30 digest), não do Opus 5 base. Não orçar Opus 5 a $10/$50.
- **Rate limits (14/set)**: boost temporário de 50% expira 13/set; aumento permanente de 25% sobre o baseline = **-17% vs o que você tem hoje** (admitido pela Anthropic). Limites 5h dobrados (maio) permanecem. Auto-mode classifier calls não contam mais no uso; auto-continue no reset reduz babysitting.
- Regra de roteamento: Opus 5 1M não dispensa curadoria — 1M cheio de ruído perde para 200K limpo (retrieval MRCR v2 cai com volume).

---

## Referências Oficiais

- [Luciana Papini Video](https://www.youtube.com/watch?v=Bezlzmti6_U)
- [Anthropic Model Docs](https://docs.anthropic.com/en/docs/claude-code/settings)
- [What's new in Claude Opus 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5)
- [Claude Code Week 30 — fast mode Opus 4.8 $10/$50](https://code.claude.com/docs/en/whats-new)

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```