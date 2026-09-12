# Error Analysis, Ledger, Contract, Data, Pipeline

## Error Analysis Loop

After each baseline, training run, threshold change, or config change:

1. Split mistakes into false positives, false negatives, abstentions, low-confidence cases, and system failures.
2. Cluster errors by shared traits: language, entity type, source, time, geography, device, sparsity, recency, feature freshness, label source, or model version.
3. Separate model mistakes from data bugs, label ambiguity, product ambiguity, instrumentation gaps, and serving mismatches.
4. Trace each major cluster to one of four moves: better labels, better features, better threshold/config, or better product fallback.
5. Preserve every important mistake as a regression test, eval slice, dashboard panel, or runbook entry.
6. Write the next iteration as a falsifiable experiment, not a vague "improve model" task.

The strongest MLE loop is not train -> metric -> ship. It is mistake -> cluster -> hypothesis -> experiment -> evidence -> simpler system.

## Observation Ledger

Keep a compact decision and evidence trail beside the code, PR, experiment report, or runbook:

```text
Iteration:
Change:
Why this mattered:
Metric movement:
Slice movement:
False positives:
False negatives:
Unexpected errors:
Decision:
Tradeoff accepted:
Lesson captured:
Regression added:
Debt created:
Next iteration:
```

Use the ledger to make model work cumulative. The goal is for each iteration to make the next decision easier, not merely to produce another artifact.

## 1. Define the Prediction Contract

Capture the product-level contract before writing model code:

- Prediction target and decision owner
- Input entity, output schema, confidence/calibration fields, and allowed latency
- Batch, online, streaming, or hybrid serving mode
- Fallback behavior when the model, feature store, or dependency is unavailable
- Human review or override path for high-impact decisions
- Privacy, retention, and audit requirements for inputs, predictions, and labels

Do not accept "improve the model" as a requirement. Tie the model to an observable product behavior and a measurable acceptance gate.

## 2. Lock the Data Contract

Every ML task needs an explicit data contract:

- Entity grain and primary key
- Label definition, label timestamp, and label availability delay
- Feature timestamp, freshness SLA, and point-in-time join rules
- Train, validation, test, and backtest split policy
- Required columns, allowed nulls, ranges, categories, and units
- PII or sensitive fields that must not enter training artifacts or logs
- Dataset version or snapshot ID for reproducibility

Guard against leakage first. If a feature is not available at prediction time, or is joined using future information, remove it or move it to an analysis-only path.

## 3. Build a Reproducible Pipeline

Training code should be runnable by another engineer without hidden notebook state:

- Use typed config files or dataclasses for all hyperparameters and paths
- Pin package and model dependencies
- Set random seeds and document any nondeterministic GPU behavior
- Record dataset version, code SHA, config hash, metrics, and artifact URI
- Save preprocessing logic with the model artifact, not separately in a notebook
- Keep train, eval, and inference transformations shared or generated from one source
- Make every step idempotent so retries do not corrupt artifacts or metrics

Prefer immutable values and pure transformation functions. Avoid mutating shared data frames or global config during feature generation.

```python
import hashlib
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class TrainingConfig:
    dataset_uri: str
    model_dir: Path
    seed: int
    learning_rate: float
    batch_size: int


def artifact_name(config: TrainingConfig, code_sha: str) -> str:
    config_key = f"{config.dataset_uri}:{config.seed}:{config.learning_rate}:{config.batch_size}"
    config_hash = hashlib.sha256(config_key.encode("utf-8")).hexdigest()[:12]
    return f"{code_sha[:12]}-{config_hash}"
```
