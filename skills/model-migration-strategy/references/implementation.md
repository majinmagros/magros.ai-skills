# Implementation — Model Migration Strategy

`KNOWN_FAILURE_MODES`, `ModelMigrationManager` (canary→full com auto-rollback), `MIGRATION_EVAL_SUITE`, `CostAttributionTracker`. Princípios no `SKILL.md`.

## Failure Modes por Família

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
    GPT_5 = "gpt-5"
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
        FailureMode(ModelFamily.GPT_5,
            symptom="Excessive em dashes (—) in output",
            detection="Count em dashes per 1k tokens > threshold",
            mitigation="Post-process filter or prompt 'avoid em dashes'",
            severity="medium"),
        FailureMode(ModelFamily.GPT_5,
            symptom="AI telltale sentence structures",
            detection="Pattern match: 'In today's world...', 'Not only... but also...', 'Delve into'",
            mitigation="Style transfer prompt or fine-tune",
            severity="medium"),
        FailureMode(ModelFamily.GPT_5,
            symptom="Overly formal/academic tone",
            detection="Flesch-Kincaid grade level > target",
            mitigation="Prompt 'write simply, avoid academic language'",
            severity="low"),
    ],
    ModelFamily.CLAUDE_OPUS: [
        FailureMode(ModelFamily.CLAUDE_OPUS,
            symptom="Over-thinking simple tasks",
            detection="Token count > 3x expected for task type",
            mitigation="Add 'be concise' or use Sonnet for simple tasks",
            severity="low"),
    ],
    ModelFamily.DEEPSEEK: [
        FailureMode(ModelFamily.DEEPSEEK,
            symptom="Chinese characters in English output",
            detection="Detect non-Latin scripts in expected English",
            mitigation="Prompt 'respond only in English'",
            severity="medium"),
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

## ModelMigrationManager (canary → full, auto-rollback)

```python
from dataclasses import dataclass
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
    traffic_pct: float
    duration_hours: int
    success_criteria: Dict
    rollback_trigger: Dict

class ModelMigrationManager:
    """Gerencia migração segura entre modelos."""

    def __init__(self, eval_harness: "EvalHarness"):
        self.eval_harness = eval_harness

    def create_migration_plan(self, source: str, target: str,
                              eval_suite: "EvalSuite") -> MigrationPlan:
        return MigrationPlan(
            source_model=source, target_model=target, eval_suite=eval_suite,
            rollback_criteria={"error_rate_increase_pct": 10,
                               "latency_increase_pct": 20,
                               "cost_increase_pct": 50,
                               "eval_score_drop_pct": 5},
            phases=[
                MigrationPhase("canary", 5, 24,
                    {"eval_pass_rate": 0.95}, {"eval_pass_rate": 0.90}),
                MigrationPhase("partial", 25, 48,
                    {"eval_pass_rate": 0.97}, {"eval_pass_rate": 0.93}),
                MigrationPhase("majority", 75, 72,
                    {"eval_pass_rate": 0.98}, {"eval_pass_rate": 0.95}),
                MigrationPhase("full", 100, 0,
                    {"eval_pass_rate": 0.99}, {"eval_pass_rate": 0.97}),
            ]
        )

    def execute_migration(self, plan: MigrationPlan) -> bool:
        """Execute phases with auto-rollback."""
        for phase in plan.phases:
            print(f"Starting phase: {phase.name} ({phase.traffic_pct}% traffic)")
            self._set_traffic_split(plan.source_model, plan.target_model, phase.traffic_pct)

            start_time = datetime.now()
            while (datetime.now() - start_time).total_seconds() < phase.duration_hours * 3600:
                eval_results = self.eval_harness.run(plan.eval_suite, model=plan.target_model)

                if self._check_criteria(eval_results, phase.success_criteria):
                    print(f"Phase {phase.name} success criteria met")
                    break

                if self._check_criteria(eval_results, phase.rollback_trigger):
                    print(f"Phase {phase.name} rollback triggered!")
                    self._rollback(plan.source_model)
                    return False

                time.sleep(300)  # Check every 5 min

        print("Migration completed successfully")
        return True

    def _check_criteria(self, results: dict, criteria: dict) -> bool:
        for metric, threshold in criteria.items():
            if results.get(metric, 0) < threshold:
                return False
        return True
```

## MIGRATION_EVAL_SUITE

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

MIGRATION_EVAL_SUITE = EvalSuite(
    name="model_migration_regression",
    test_cases=[
        EvalCase("code_generation_simple",
                 "Write a Python function to parse JSON",
                 "Clean, working function with error handling", "regression"),
        EvalCase("code_generation_complex",
                 "Build a REST API with auth, rate limiting, tests",
                 "Complete working API with all components", "hard_scenario"),
        EvalCase("debugging",
                 "Fix this bug: [code with off-by-one error]",
                 "Identifies and fixes off-by-one", "task_type"),
        EvalCase("reasoning",
                 "Analyze this architecture for scalability issues",
                 "Identifies bottlenecks, suggests improvements", "hard_scenario"),
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

## CostAttributionTracker

```python
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
    """Fine-grained telemetry: what calls cost what."""

    def __init__(self):
        self.attributions = []

    def record(self, attr: CostAttribution):
        self.attributions.append(attr)

    def get_breakdown(self, by: str = "feature") -> Dict:
        breakdown = defaultdict(float)
        for attr in self.attributions:
            breakdown[getattr(attr, by)] += attr.cost_usd
        return dict(breakdown)

    def get_model_comparison(self) -> Dict:
        by_model = defaultdict(lambda: {"cost": 0, "tokens": 0, "calls": 0})
        for attr in self.attributions:
            m = by_model[attr.model]
            m["cost"] += attr.cost_usd
            m["tokens"] += attr.tokens_in + attr.tokens_out
            m["calls"] += 1
        return dict(by_model)

    def detect_anomalies(self) -> List[dict]:
        """Flag features consuming >50% of budget."""
        anomalies = []
        by_feature = self.get_breakdown("feature")
        total = sum(by_feature.values())
        for feature, cost in by_feature.items():
            pct = cost / total * 100
            if pct > 50:
                anomalies.append({"type": "feature_cost_concentration",
                                  "feature": feature, "percentage": pct,
                                  "recommendation": f"Optimize {feature} or use cheaper model"})
        return anomalies
```
