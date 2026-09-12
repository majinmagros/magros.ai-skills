---
name: production-audit
description: "Use when judging production readiness from local evidence: ship/block call with scored risks. Triggers on \"production-audit\", \"production audit\", \"audit\"."
metadata:
  origin: ECC
---

# Production Audit

Local-evidence readiness audit: ship/block with scored risks, no external data sharing. Detalhes em `references/`.

## When to Activate

- The user asks "is this production-ready", "what would break in prod", "ready to ship?"
- A feature was merged and needs a pre-deploy or post-merge risk pass
- A public launch, demo, customer rollout, or investor walkthrough is close
- CI is green but the user wants production risk, not only test status
- A deployed URL, release branch, PR, or current checkout is available for evidence

## Core Principles

1. **Local evidence only** — no unpinned remote code or third-party uploads
2. **Surface to rollback** — release surface, changes, runtime bounds, CI, rollback
3. **Five lenses** — auth/security, data, payments/webhooks, operations, UX
4. **Score forces priority** — caps at 69 (auth/idempotency/secrets/rollback) and 84 (CI/E2E)
5. **Risk + next action** — blockers, evidence checked/missing, one concrete fix

## Example

```text
Production audit: 68/100, risky, because Stripe webhooks are verified but not
idempotent and there is no rollback note for the pending migration.
Next action: Want me to patch webhook idempotency first?
```

## References

- `references/evidence-risk.md` — method, git/CI/runtime evidence, five risk lenses
- `references/scoring-output.md` — score bands, caps, output shape, worked example
- `references/scope-antipatterns.md` — when not to use, anti-patterns, related skills

## Checklist

- [ ] Release surface, recent diff, and rollback path established first
- [ ] All five lenses checked against files that actually exist in the repo
- [ ] Score capped correctly; blockers named with evidence checked/missing
- [ ] No external uploads; ends with one concrete next action
