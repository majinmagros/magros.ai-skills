# Iteration Compact, Decision Brain, Metrics, Features

## Iteration Compact

Before touching model code, compress the work into one reviewable artifact. This should be short enough to fit in a PR description and precise enough that another engineer can challenge the tradeoffs.

```text
Goal:
Who cares:
Decision owner:
User or system action changed by the model:
Success metric:
Guardrail metrics:
Mistake budget:
Unacceptable mistakes:
Acceptable mistakes:
Assumptions:
Constraints:
Labels and data snapshot:
Baseline:
Candidate signals:
Threshold or config plan:
Eval slices:
Known risks:
Next experiment:
Rollback or fallback:
```

This compact is the MLE equivalent of a strong SWE design note. It keeps the team from optimizing a metric no one trusts, adding features that do not address the real error mode, or shipping complexity without a rollback.

## Decision Brain

Use this loop whenever the task is ambiguous, high-impact, or metric-heavy:

1. Start from the decision, not the model. Name the action that changes downstream behavior.
2. Name who cares and why. Different stakeholders pay different costs for false positives, false negatives, latency, compute spend, opacity, or missed opportunities.
3. Convert ambiguity into hypotheses. Ask what signal would separate outcomes, what evidence would disprove it, and what simple baseline should be hard to beat.
4. Research prior art or a nearby known problem before inventing a bespoke system.
5. Score choices with `(probability, confidence) x (cost, severity, importance, impact)`.
6. Consider adversarial behavior, incentives, selective disclosure, distribution shift, and feedback loops.
7. Prefer the simplest change that reduces the most important mistake. Simplicity is not laziness; it is a way to minimize blunders while preserving iteration speed.
8. Capture the decision, evidence, counterargument, and next reversible step.

## Metric and Mistake Economics

Choose metrics from failure costs, not habit:

- Use a confusion matrix early so the team can discuss concrete false positives and false negatives instead of abstract accuracy.
- Favor precision when the cost of an incorrect positive decision dominates.
- Favor recall when the cost of a missed positive dominates.
- Use F1 only when the precision/recall tradeoff is genuinely balanced and explainable.
- Use AUC or ranking metrics when ordering quality matters more than a single threshold.
- Track latency, throughput, memory, and cost as first-class metrics because they shape feasible model complexity.
- Compare against a baseline and the current production model before celebrating an offline gain.
- Treat real-world feedback signals as delayed labels with bias, lag, and coverage gaps; do not treat them as ground truth without analysis.

Every metric choice should state which mistake it makes cheaper, which mistake it makes more likely, and who absorbs that cost.

## Data and Feature Hypotheses

Features should come from a theory of separation:

- Text, categorical fields, numeric histories, graph relationships, recency, frequency, and aggregates are candidate signal families, not automatic features.
- For every feature family, state why it should separate outcomes and how it could leak future information.
- For noisy labels, consider adjudication, label confidence, soft targets, or confidence weighting.
- For class imbalance, compare weighted loss, resampling, threshold movement, and calibrated decision rules.
- For missing values, decide whether absence is informative, imputable, or a reason to abstain.
- For outliers, decide whether to clip, bucket, investigate, or preserve them as rare but important signal.
- For correlated features, check whether they are redundant, unstable, or proxies for unavailable future state.

Do not add model complexity until error analysis shows that the baseline is failing for a reason additional signal or capacity can plausibly fix.
