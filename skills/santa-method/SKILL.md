---
name: santa-method
description: "Use when output ships to users, production, or compliance review and needs adversarial verification. Triggers on \"santa-method\", \"santa method\", \"method\"."
metadata:
  origin: ECC
---

# Santa Method

Multi-agent adversarial verification: two isolated reviewers must both pass. Detalhes em `references/`.

## When to Activate

- Output will be published, deployed, or consumed by end users
- Compliance, regulatory, or brand constraints must be enforced
- Code ships to production without human review
- Content accuracy matters (docs, educational, customer-facing copy)
- Batch generation at scale where spot-checking misses systemic patterns
- Hallucination risk is elevated (claims, statistics, APIs, legal language)

## Core Flow

1. **Generate** — produce the deliverable normally (Phase 1)
2. **Check twice** — two reviewers, same rubric, no shared context (Phase 2)
3. **Gate** — B AND C pass → NICE/ship, else NAUGHTY (Phase 3)
4. **Fix until nice** — fix flagged issues only, fresh reviewers, max 3 rounds (Phase 4)
5. **Escalate** — still failing after MAX → human, never silent-ship

## Example

```python
verdict, issues, _ = santa_verdict(review_b, review_c)
output = fix(output, issues) if verdict == "NAUGHTY" else ship(output)
```

## References

- `references/architecture.md` — diagram, generate, verdict gate, fix-until-nice loop
- `references/reviewer-protocol.md` — isolation invariants, reviewer prompt, rubric design
- `references/patterns.md` — subagents (recommended), inline fallback, batch sampling
- `references/failures-metrics.md` — failure modes, skill integrations, metrics, cost

## Checklist

- [ ] Rubric has objective pass/fail per criterion, no vague reviews
- [ ] Reviewers isolated: same inputs, same rubric, structured JSON verdicts
- [ ] Both must pass; fix ONLY flagged issues, fresh agents each round
- [ ] Max 3 iterations, then escalate to human
- [ ] Deterministic checks (build/lint/test) run BEFORE Santa
