# Santa Method — Failure Modes, Integrations, Metrics, Cost

## Failure Modes and Mitigations

| Failure Mode | Symptom | Mitigation |
|-------------|---------|------------|
| Infinite loop | Reviewers keep finding new issues after fixes | Max iteration cap (3). Escalate. |
| Rubber stamping | Both reviewers pass everything | Adversarial prompt: "Your job is to find problems, not approve." |
| Subjective drift | Reviewers flag style preferences, not errors | Tight rubric with objective pass/fail criteria only |
| Fix regression | Fixing issue A introduces issue B | Fresh reviewers each round catch regressions |
| Reviewer agreement bias | Both reviewers miss the same thing | Mitigated by independence, not eliminated. For critical output, add a third reviewer or human spot-check. |
| Cost explosion | Too many iterations on large outputs | Batch sampling pattern. Budget caps per verification cycle. |

## Integration with Other Skills

| Skill | Relationship |
|-------|-------------|
| Verification Loop | Use for deterministic checks (build, lint, test). Santa for semantic checks (accuracy, hallucinations). Run verification-loop first, Santa second. |
| Eval Harness | Santa Method results feed eval metrics. Track pass@k across Santa runs to measure generator quality over time. |
| Continuous Learning v2 | Santa findings become instincts. Repeated failures on the same criterion → learned behavior to avoid the pattern. |
| Strategic Compact | Run Santa BEFORE compacting. Don't lose review context mid-verification. |

## Metrics

Track these to measure Santa Method effectiveness:

- **First-pass rate**: % of outputs that pass Santa on round 1 (target: >70%)
- **Mean iterations to convergence**: average rounds to NICE (target: <1.5)
- **Issue taxonomy**: distribution of failure types (hallucination vs. completeness vs. compliance)
- **Reviewer agreement**: % of issues flagged by both reviewers vs. only one (low agreement = rubric needs tightening)
- **Escape rate**: issues found post-ship that Santa should have caught (target: 0)

## Cost Analysis

Santa Method costs approximately 2-3x the token cost of generation alone per verification cycle. For most high-stakes output, this is a bargain:

```
Cost of Santa = (generation tokens) + 2×(review tokens per round) × (avg rounds)
Cost of NOT Santa = (reputation damage) + (correction effort) + (trust erosion)
```

For batch operations, the sampling pattern reduces cost to ~15-20% of full verification while catching >90% of systematic issues.
