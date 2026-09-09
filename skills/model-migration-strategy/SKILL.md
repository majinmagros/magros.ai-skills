---
name: model-migration-strategy
description: Use when migrating between model families — eval suite first, avoid hyper-optimization per family, hedge new failure modes (GPT-5 series: more em dashes, AI telltale signs, sentence structures), cost attribution, attribution granularity. Triggers on "model migration", "model family migration", "gpt-5 gotchas", "em dashes model", "AI telltale signs", "hyper-optimization prompts", "model failure modes", "eval suite migration".
metadata:
  origin: ECC
  source_docs:
    - https://docs.anthropic.com/en/docs/managed-agents/models
  video_source: "hm8NzEd5io0 - How founders build on Claude Managed Agents (Claude Oficial)"
  related_skills:
    - roteamento-modelos-baratos
    - claude-model-router
    - eval-harness
    - verification-loop
    - cost-aware-llm-pipeline
---

# Skill: model-migration-strategy — Estratégia de Migração de Modelos

Estratégia oficial da Anthropic para migração entre famílias de modelos: **eval suite primeiro**, **evitar hyper-optimization por família**, **hedge novos failure modes** (GPT-5 series: mais em dashes, AI telltale signs, sentence structures). Extraído da mesa redonda oficial.

## Quando usar

- Nova família de modelo lançada (GPT-5, Claude 4, etc.)
- Precisa migrar produção de um modelo para outro
- Quer evitar **hyper-optimization** para família específica
- Precisa detectar **novos failure modes** por família
- Quer **attribution granularity** de custos por modelo

## Quando NÃO usar

- Roteamento simples → use `roteamento-modelos-baratos`, `claude-model-router`
- Cost tracking genérico → use `cost-aware-llm-pipeline`
- Eval harness genérico → use `eval-harness`
- Subscription tier routing → use `subscription-tier-routing`

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| Eval suite FIRST before migration | ✅ | Video + Anthropic best practices |
| Avoid hyper-optimization per model family | ✅ | Video |
| GPT-5 series: more em dashes, AI telltale signs | ✅ | Video (empirical observation) |
| New failure modes per family | ✅ | Video |
| Cost attribution granularity needed | ✅ | Video |

---

## Princípios Fundamentais

```
┌─────────────────────────────────────────────────────────────────┐
│                 MODEL MIGRATION PRINCIPLES                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. EVAL SUITE FIRST                                            │
│     ┌─────────────────────────────────────────────────────┐     │
│     │ Don't migrate until you have evals that catch       │     │
│     │ regressions. Vibes-based → curated → customer       │     │
│     │ queries. Same rubrics for offline evals + outcomes. │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                  │
│  2. AVOID HYPER-OPTIMIZATION PER FAMILY                         │
│     ┌─────────────────────────────────────────────────────┐     │
│     │ Prompts otimizados demais para Opus falham no       │     │
│     │ Sonnet. Prompts para GPT-4 falham no GPT-5.         │     │
│     │ Use prompting robusto, não family-specific.         │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                  │
│  3. HEDGE NEW FAILURE MODES                                     │
│     ┌─────────────────────────────────────────────────────┐     │
│     │ Cada família tem gotchas novos:                     │     │
│     │ • GPT-5: mais em dashes, sentence structures        │     │
│     │ • Nova família: testar gotchas ANTES de otimizar    │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                  │
│  4. COST ATTRIBUTION GRANULARITY                                │
│     ┌─────────────────────────────────────────────────────┐     │
│     │ Onde especificamente no harness o custo acumula?    │     │
│     │ Fine-grained telemetry: what calls cost what.       │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Failure Modes por Família (Conhecidos)

```python
from dataclasses import dataclass
from typing import List, Dict
from enum import Enum

class ModelFamily(Enum):
    CLAUDE_OPUS = "claude-opus"
    CLAUDE_SONNET = "claude-sonnet"
    CLAUDE_HAIKU = "claude-haiku"
    GPT_4 = "gpt-4"
    GPT_4O = "gpt-4o"
    GPT_5 = "gpt-5"  # Nova família
    DEEPSEEK = "deepseek"
    GLM = "glm"

@dataclass
class FailureMode:
    family: ModelFamily
    symptom: str
    detection: str
    mitigation: str
    severity: str  # low, medium, high, critical

KNOWN_FAILURE_MODES = {
    ModelFamily.GPT_5: [
        FailureMode(
            family=ModelFamily.GPT_5,
            symptom="Excessive em dashes (—) in output",
            detection="Count em dashes per 1k tokens > threshold",
            mitigation="Post-process filter or prompt 'avoid em dashes'",
            severity="medium"
        ),
        FailureMode(
            family=ModelFamily.GPT_5,
            symptom="AI telltale sentence structures",
            detection="Pattern match: 'In today's world...', 'Not only... but also...', 'Delve into'",
            mitigation="Style transfer prompt or fine-tune",
            severity="medium"
        ),
        FailureMode(
            family=ModelFamily.GPT_5,
            symptom="Overly formal/academic tone",
            detection="Flesch-Kincaid grade level > target",
            mitigation="Prompt 'write simply, avoid academic language'",
            severity="low"
        ),
    ],
    ModelFamily.CLAUDE_OPUS: [
        FailureMode(
            family=ModelFamily.CLAUDE_OPUS,
            symptom="Over-thinking simple tasks",
            detection="Token count > 3x expected for task type",
            mitigation="Add 'be concise' or use Sonnet for simple tasks",
            severity="low"
        ),
    ],
    ModelFamily.DEEPSEEK: [
        FailureMode(
            family=ModelFamily.DEEPSEEK,
            symptom="Chinese characters in English output",
            detection="Detect non-Latin scripts in expected English",
            mitigation="Prompt 'respond only in English'",
            severity="medium"
        ),
    ],
}

def detect_failure_modes(output: str, family: ModelFamily) -> List[FailureMode]:
    """Detect known failure modes for a model family."""
    detected = []
    for fm in KNOWN_FAILURE_MODES.get(family, []):
        if fm.detection in output or eval(fm.detection):  # Simplified
            detected.append(fm)
    return detected
```

---

## Migração Step-by-Step

```python
from dataclasses import dataclass
from typing import Callable, Optional
from datetime import datetime

@dataclass
class MigrationPlan:
    source_model: str
    target_model: str
    eval_suite: "EvalSuite"
    rollback_criteria: Dict
    phases: List["MigrationPhase"]

@dataclass
class MigrationPhase:
    name: str
    traffic_pct: float  # % of traffic to new model
    duration_hours: int
    success_criteria: Dict
    rollback_trigger: Dict

class ModelMigrationManager:
    """
    Gerencia migração segura entre modelos.
    """
    
    def __init__(self, eval_harness: "EvalHarness"):
        self.eval_harness = eval_harness
    
    def create_migration_plan(
        self,
        source: str,
        target: str,
        eval_suite: "EvalSuite"
    ) -> MigrationPlan:
        """Create phased migration plan."""
        
        return MigrationPlan(
            source_model=source,
            target_model=target,
            eval_suite=eval_suite,
            rollback_criteria={
                "error_rate_increase_pct": 10,  # Rollback if errors increase >10%
                "latency_increase_pct": 20,
                "cost_increase_pct": 50,
                "eval_score_drop_pct": 5
            },
            phases=[
                MigrationPhase(
                    name="canary",
                    traffic_pct=5,
                    duration_hours=24,
                    success_criteria={"eval_pass_rate": 0.95},
                    rollback_trigger={"eval_pass_rate": 0.90}
                ),
                MigrationPhase(
                    name="partial",
                    traffic_pct=25,
                    duration_hours=48,
                    success_criteria={"eval_pass_rate": 0.97},
                    rollback_trigger={"eval_pass_rate": 0.93}
                ),
                MigrationPhase(
                    name="majority",
                    traffic_pct=75,
                    duration_hours=72,
                    success_criteria={"eval_pass_rate": 0.98},
                    rollback_trigger={"eval_pass_rate": 0.95}
                ),
                MigrationPhase(
                    name="full",
                    traffic_pct=100,
                    duration_hours=0,  # Permanent
                    success_criteria={"eval_pass_rate": 0.99},
                    rollback_trigger={"eval_pass_rate": 0.97}
                ),
            ]
        )
    
    def execute_migration(self, plan: MigrationPlan) -> bool:
        """Execute migration phases with auto-rollback."""
        
        for phase in plan.phases:
            print(f"Starting phase: {phase.name} ({phase.traffic_pct}% traffic)")
            
            # 1. Route traffic to new model
            self._set_traffic_split(plan.source_model, plan.target_model, phase.traffic_pct)
            
            # 2. Run evals continuously
            start_time = datetime.now()
            while (datetime.now() - start_time).total_seconds() < phase.duration_hours * 3600:
                eval_results = self.eval_harness.run(plan.eval_suite, model=plan.target_model)
                
                # 3. Check success criteria
                if self._check_criteria(eval_results, phase.success_criteria):
                    print(f"Phase {phase.name} success criteria met")
                    break
                
                # 4. Check rollback trigger
                if self._check_criteria(eval_results, phase.rollback_trigger):
                    print(f"Phase {phase.name} rollback triggered!")
                    self._rollback(plan.source_model)
                    return False
                
                time.sleep(300)  # Check every 5 min
        
        print("Migration completed successfully")
        return True
    
    def _check_criteria(self, results: dict, criteria: dict) -> bool:
        """Check if results meet criteria."""
        for metric, threshold in criteria.items():
            if results.get(metric, 0) < threshold:
                return False
        return True
```

---

## Eval Suite para Migração

```python
@dataclass
class EvalSuite:
    name: str
    test_cases: List["EvalCase"]
    rubrics: Dict[str, "Rubric"]

@dataclass
class EvalCase:
    name: str
    input: str
    expected_behavior: str
    category: str  # regression, hard_scenario, task_type

@dataclass
class Rubric:
    criteria: List["RubricCriterion"]

# Exemplo: Migration eval suite
MIGRATION_EVAL_SUITE = EvalSuite(
    name="model_migration_regression",
    test_cases=[
        EvalCase(
            name="code_generation_simple",
            input="Write a Python function to parse JSON",
            expected_behavior="Clean, working function with error handling",
            category="regression"
        ),
        EvalCase(
            name="code_generation_complex",
            input="Build a REST API with auth, rate limiting, tests",
            expected_behavior="Complete working API with all components",
            category="hard_scenario"
        ),
        EvalCase(
            name="debugging",
            input="Fix this bug: [code with off-by-one error]",
            expected_behavior="Identifies and fixes off-by-one",
            category="task_type"
        ),
        EvalCase(
            name="reasoning",
            input="Analyze this architecture for scalability issues",
            expected_behavior="Identifies bottlenecks, suggests improvements",
            category="hard_scenario"
        ),
    ],
    rubrics={
        "code_quality": Rubric(criteria=[
            {"name": "correctness", "weight": 0.4},
            {"name": "style", "weight": 0.2},
            {"name": "completeness", "weight": 0.2},
            {"name": "error_handling", "weight": 0.2},
        ]),
        "reasoning": Rubric(criteria=[
            {"name": "accuracy", "weight": 0.5},
            {"name": "depth", "weight": 0.3},
            {"name": "actionability", "weight": 0.2},
        ]),
    }
)
```

---

## Cost Attribution Granularity

```python
from dataclasses import dataclass
from typing import Dict
from collections import defaultdict

@dataclass
class CostAttribution:
    model: str
    feature: str  # coordinator, fan_out, verification, sandbox, etc.
    operation: str  # generate, verify, deploy, etc.
    tokens_in: int
    tokens_out: int
    cached_tokens: int
    cost_usd: float
    timestamp: datetime

class CostAttributionTracker:
    """
    Fine-grained cost telemetry: what calls cost what.
    """
    
    def __init__(self):
        self.attributions = []
    
    def record(self, attr: CostAttribution):
        self.attributions.append(attr)
    
    def get_breakdown(self, by: str = "feature") -> Dict:
        """Get cost breakdown by dimension."""
        breakdown = defaultdict(float)
        for attr in self.attributions:
            key = getattr(attr, by)
            breakdown[key] += attr.cost_usd
        return dict(breakdown)
    
    def get_model_comparison(self) -> Dict:
        """Compare costs across models."""
        by_model = defaultdict(lambda: {"cost": 0, "tokens": 0, "calls": 0})
        for attr in self.attributions:
            m = by_model[attr.model]
            m["cost"] += attr.cost_usd
            m["tokens"] += attr.tokens_in + attr.tokens_out
            m["calls"] += 1
        return dict(by_model)
    
    def detect_anomalies(self) -> List[dict]:
        """Detect cost anomalies."""
        anomalies = []
        by_feature = self.get_breakdown("feature")
        total = sum(by_feature.values())
        
        for feature, cost in by_feature.items():
            pct = cost / total * 100
            if pct > 50:  # Feature consuming >50% of budget
                anomalies.append({
                    "type": "feature_cost_concentration",
                    "feature": feature,
                    "percentage": pct,
                    "recommendation": f"Optimize {feature} or use cheaper model"
                })
        return anomalies
```

---

## Integração com Skills Existentes

| Skill | Relação |
|---|---|
| `roteamento-modelos-baratos` | Migração informada por cost/quality |
| `claude-model-router` | Router com migration awareness |
| `eval-harness` | Eval suite FIRST principle |
| `verification-loop` | Verification gates during migration |
| `cost-aware-llm-pipeline` | Cost attribution granularity |

---

## Referências

- Video: `hm8NzEd5io0.en.dedup.txt` — linhas 1002-1051, 1079-1096
- Key quotes: "If you have a good eval suite, then you do the model migration", "avoid historically too much hyper-optimization to a specific model family", "GPT-5 series tends to produce writing in a way that has actually a lot more AI telltale signs", "getting really fine-grained telemetry of what calls cost what"