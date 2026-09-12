# Promotion Gates, Serving, Operations, Review

## 4. Evaluate Before Promotion

Promotion criteria should be declared before training finishes:

- Baseline model and current production model comparison
- Primary metric aligned to product behavior
- Guardrail metrics for latency, calibration, fairness slices, cost, and error concentration
- Slice metrics for important cohorts, geographies, devices, languages, or data sources
- Confidence intervals or repeated-run variance when metrics are noisy
- Failure examples reviewed by a human for high-impact models
- Explicit "do not ship" thresholds

```python
PROMOTION_GATES = {
    "auc": ("min", 0.82),
    "calibration_error": ("max", 0.04),
    "p95_latency_ms": ("max", 80),
}


def assert_promotion_ready(metrics: dict[str, float]) -> None:
    missing = sorted(name for name in PROMOTION_GATES if name not in metrics)
    if missing:
        raise ValueError(f"Model promotion metrics missing required gates: {missing}")

    failures = {
        name: value
        for name, (direction, threshold) in PROMOTION_GATES.items()
        for value in [metrics[name]]
        if (direction == "min" and value < threshold)
        or (direction == "max" and value > threshold)
    }
    if failures:
        raise ValueError(f"Model failed promotion gates: {failures}")
```

Use offline metrics as gates, not guarantees. When the model changes product behavior, plan shadow evaluation, canary rollout, or A/B testing before full rollout.

## 5. Package for Serving

An ML artifact is production-ready only when the serving contract is testable:

- Model artifact includes version, training data reference, config, and preprocessing
- Input schema rejects invalid, stale, or out-of-range features
- Output schema includes model version and confidence or explanation fields when useful
- Serving path has timeout, batching, resource limits, and fallback behavior
- CPU/GPU requirements are explicit and tested
- Prediction logs avoid PII and include enough identifiers for debugging and label joins
- Integration tests cover missing features, stale features, bad types, empty batches, and fallback path

Never let training-only feature code diverge from serving feature code without a test that proves equivalence.

## 6. Operate the Model

Model monitoring needs both system and quality signals:

- Availability, error rate, timeout rate, queue depth, and p50/p95/p99 latency
- Feature null rate, range drift, categorical drift, and freshness drift
- Prediction distribution drift and confidence distribution drift
- Label arrival health and delayed quality metrics
- Business KPI guardrails and rollback triggers
- Per-version dashboards for canaries and rollbacks

Every deployment should have a rollback plan that names the previous artifact, config, data dependency, and traffic-switch mechanism.

## Review Checklist

- [ ] Prediction contract is explicit and testable
- [ ] Data contract defines entity grain, label timing, feature timing, and snapshot/version
- [ ] Leakage risks were checked against prediction-time availability
- [ ] Training is reproducible from code, config, data version, and seed
- [ ] Metrics compare against baseline and current production model
- [ ] Slice metrics and guardrails are included for high-risk cohorts
- [ ] Promotion gates are automated and fail closed
- [ ] Training and serving transformations are shared or equivalence-tested
- [ ] Model artifact carries version, config, dataset reference, and preprocessing
- [ ] Serving path validates inputs and has timeout, fallback, and rollback behavior
- [ ] Monitoring covers system health, feature drift, prediction drift, and delayed labels
- [ ] Sensitive data is excluded from artifacts, logs, prompts, and examples

## Anti-Patterns

- Notebook state is required to reproduce the model
- Random split leaks future data into validation or test sets
- Feature joins ignore event time and label availability
- Offline metric improves while important slices regress
- Thresholds are tuned on the test set repeatedly
- Training preprocessing is copied manually into serving code
- Model version is missing from prediction logs
- Monitoring only checks service uptime, not data or prediction quality
- Rollback requires retraining instead of switching to a known-good artifact

## Output Expectations

When using this skill, return concrete artifacts: data contract, promotion gates, pipeline steps, test plan, deployment plan, or review findings. Call out unknowns that block production readiness instead of filling them with assumptions.
