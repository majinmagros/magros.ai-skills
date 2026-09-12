# Scoping, Related Surfaces, Task Simulations

## Scope Calibration

Use only the lanes that fit the system in front of you. This skill is useful for ranking, search, recommendations, classifiers, forecasting, embeddings, LLM workflows, anomaly detection, and batch analytics, but it should not force one architecture onto all of them.

- Do not assume every model has supervised labels, online serving, a feature store, PyTorch, GPUs, human review, A/B tests, or real-time feedback.
- Do not add heavyweight MLOps machinery when a data contract, baseline, eval script, and rollback note would make the change reviewable.
- Do make assumptions explicit when the project lacks labels, delayed outcomes, slice definitions, production traffic, or monitoring ownership.
- Treat examples as interchangeable scaffolds. Replace metrics, serving mode, data stores, and rollout mechanics with the project-native equivalents.

## Related Skills

- `python-patterns` and `python-testing` for Python implementation and pytest coverage
- `pytorch-patterns` for deep learning models, data loaders, device handling, and training loops
- `eval-harness` and `ai-regression-testing` for promotion gates and agent-assisted regression checks
- `database-migrations`, `postgres-patterns`, and `clickhouse-io` for data storage and analytics surfaces
- `deployment-patterns`, `docker-patterns`, and `security-review` for serving, secrets, containers, and production hardening

## Reuse the SWE Surface

Do not treat MLE as separate from software engineering. Most ECC SWE workflows apply directly to ML systems, often with stricter failure modes:

The recommended `minimal --with capability:machine-learning` install keeps the core agent surface available alongside this skill. For skill-only or agent-limited harnesses, pair `skill:mle-workflow` with `agent:mle-reviewer` where the target supports agents.

| SWE surface | MLE use |
|-------------|---------|
| `product-capability` / `architecture-decision-records` | Turn model work into explicit product contracts and record irreversible data, model, and rollout choices |
| `repo-scan` / `codebase-onboarding` / `code-tour` | Find existing training, feature, serving, eval, and monitoring paths before introducing a parallel ML stack |
| `plan` / `feature-dev` | Scope model changes as product capabilities with data, eval, serving, and rollback phases |
| `tdd-workflow` / `python-testing` | Test feature transforms, split logic, metric calculations, artifact loading, and inference schemas before implementation |
| `code-reviewer` / `mle-reviewer` | Review code quality plus ML-specific leakage, reproducibility, promotion, and monitoring risks |
| `build-fix` / `pr-test-analyzer` | Diagnose broken CI, flaky evals, missing fixtures, and environment-specific model or dependency failures |
| `quality-gate` / `test-coverage` | Require automated evidence for transforms, metrics, inference contracts, promotion gates, and rollback behavior |
| `eval-harness` / `verification-loop` | Turn offline metrics, slice checks, latency budgets, and rollback drills into repeatable gates |
| `ai-regression-testing` | Preserve every production bug as a regression: missing feature, stale label, bad artifact, schema drift, or serving mismatch |
| `api-design` / `backend-patterns` | Design prediction APIs, batch jobs, idempotent retraining endpoints, and response envelopes |
| `database-migrations` / `postgres-patterns` / `clickhouse-io` | Version labels, feature snapshots, prediction logs, experiment metrics, and drift analytics |
| `deployment-patterns` / `docker-patterns` | Package reproducible training and serving images with health checks, resource limits, and rollback |
| `canary-watch` / `dashboard-builder` | Make rollout health visible with model-version, slice, drift, latency, cost, and delayed-label dashboards |
| `security-review` / `security-scan` | Check model artifacts, notebooks, prompts, datasets, and logs for secrets, PII, unsafe deserialization, and supply-chain risk |
| `e2e-testing` / `browser-qa` / `accessibility` | Test critical product flows that consume predictions, including explainability and fallback UI states |
| `benchmark` / `performance-optimizer` | Measure throughput, p95 latency, memory, GPU utilization, and cost per prediction or retrain |
| `cost-aware-llm-pipeline` / `token-budget-advisor` | Route LLM/embedding workloads by quality, latency, and budget instead of defaulting to the largest model |
| `documentation-lookup` / `search-first` | Verify current library behavior for model serving, feature stores, vector DBs, and eval tooling before coding |
| `git-workflow` / `github-ops` / `opensource-pipeline` | Package MLE changes for review with crisp scope, generated artifacts excluded, and reproducible test evidence |
| `strategic-compact` / `dmux-workflows` | Split long ML work into parallel tracks: data contract, eval harness, serving path, monitoring, and docs |

## Ten MLE Task Simulations

Use these simulations as coverage checks when planning or reviewing MLE work. A strong MLE workflow should reduce each task to explicit contracts, reusable SWE surfaces, automated evidence, and a reviewable artifact.

| ID | Common MLE task | Streamlined ECC path | Required output | Pipeline lanes covered |
|----|-----------------|----------------------|-----------------|------------------------|
| MLE-01 | Frame an ambiguous prediction, ranking, recommender, classifier, embedding, or forecast capability | `product-capability`, `plan`, `architecture-decision-records`, `mle-workflow` | Iteration Compact naming who cares, decision owner, success metric, unacceptable mistakes, assumptions, constraints, and first experiment | product contract, stakeholder loss, risk, rollout |
| MLE-02 | Define metric goals, labels, data sources, and the mistake budget | `repo-scan`, `database-reviewer`, `database-migrations`, `postgres-patterns`, `clickhouse-io` | Data and metric contract with entity grain, label timing, label confidence, feature timing, point-in-time joins, split policy, and dataset snapshot | data contract, metric design, leakage, reproducibility |
| MLE-03 | Build a baseline model and scoring path before adding complexity | `tdd-workflow`, `python-testing`, `python-patterns`, `code-reviewer` | Baseline scorer with confusion matrix, calibration notes, latency/cost estimate, known weaknesses, and tests for score shape and determinism | baseline, scoring, testing, serving parity |
| MLE-04 | Generate features from hypotheses about what separates outcomes | `python-patterns`, `pytorch-patterns`, `docker-patterns`, `deployment-patterns` | Feature plan and transform module covering signal source, missing values, outliers, correlations, leakage checks, and train/serve equivalence | feature pipeline, leakage, training, artifacts |
| MLE-05 | Tune thresholds, configs, and model complexity under tradeoffs | `eval-harness`, `ai-regression-testing`, `quality-gate`, `test-coverage` | Threshold/config report comparing precision, recall, F1, AUC, calibration, group slices, latency, cost, complexity, and acceptable error classes | evaluation, threshold, promotion, regression |
| MLE-06 | Run error analysis and turn mistakes into the next experiment | `eval-harness`, `ai-regression-testing`, `mle-reviewer`, `silent-failure-hunter` | Error cluster report for false positives, false negatives, ambiguous labels, stale features, missing signals, and bug traces with lessons captured | error analysis, bug trace, iteration, regression |
| MLE-07 | Package a model artifact for batch or online inference | `api-design`, `backend-patterns`, `security-review`, `security-scan` | Versioned artifact bundle with preprocessing, config, dependency constraints, schema validation, safe loading, and PII-safe logs | artifact, security, inference contract |
| MLE-08 | Ship online serving or batch scoring with feedback capture | `api-design`, `backend-patterns`, `e2e-testing`, `browser-qa`, `accessibility` | Prediction endpoint or batch job with response envelope, timeout, batching, fallback, model version, confidence, feedback logging, and product-flow tests | serving, batch inference, fallback, user workflow |
| MLE-09 | Roll out a model with shadow traffic, canary, A/B test, or rollback | `canary-watch`, `dashboard-builder`, `verification-loop`, `performance-optimizer` | Rollout plan naming traffic split, dashboards, p95 latency, cost, quality guardrails, rollback artifact, and rollback trigger | deployment, canary, rollback |
| MLE-10 | Operate, debug, and refresh a production model after launch | `silent-failure-hunter`, `dashboard-builder`, `mle-reviewer`, `doc-updater`, `github-ops` | Observation ledger and refresh plan with drift checks, delayed-label health, alert owners, runbook updates, retrain criteria, and PR evidence | monitoring, incident response, retraining |
