---
name: gan-style-harness
description: "Use when building high-quality applications autonomously with a GAN-inspired Generator-Evaluator agent harness. Based on Anthropic's March 2026 harness design paper. Triggers on \"gan-style-harness\", \"gan style harness\", \"harness\"."
metadata:
  origin: ECC
---

# GAN-Style Harness

Separate generation from evaluation: a ruthless Evaluator drives a Generator past "AI slop" to production quality. Detalhes em `references/`.

## When to Use

- Building complete applications from a one-line prompt
- Frontend design tasks requiring high visual quality
- Full-stack projects that need working features, not just code
- Any task where "AI slop" aesthetics are unacceptable
- Projects where you can invest $50-200 for production-quality output

## Core Flow

1. **Planner** expands the brief into an ambitious multi-sprint spec
2. **Generator** implements one sprint against a sprint contract
3. **Evaluator** tests the live app (Playwright) and scores design/originality/craft/functionality
4. **Loop** feedback into the next iteration until score ≥ 7.0 or 15 iterations
5. **Simplify** the harness as models improve — strip scaffolding that no longer pays

## Example

```bash
# Full three-agent harness with custom quality bar
/project:gan-build "Build a recipe sharing platform" --max-iterations 10 --pass-threshold 7.5
```

## References

- `references/agents.md` — planner/generator/evaluator roles, behaviors, models, architecture
- `references/rubric.md` — four criteria 1-10, weights, pass threshold
- `references/usage.md` — command, shell script, and manual Claude Code usage
- `references/evolution-config.md` — model stages, env vars, eval modes, anti-patterns, results, sources

## Checklist

- [ ] Ambitious spec with evaluation criteria before any code
- [ ] Evaluator tests the live app, never just screenshots or code
- [ ] Feedback passed as `feedback-NNN.md` files, read each iteration
- [ ] `GAN_MAX_ITERATIONS` set; plateau after 3 iterations → human review
- [ ] Evaluator critiques only; generator fixes — never the reverse
