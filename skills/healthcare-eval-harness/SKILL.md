---
name: healthcare-eval-harness
description: "Use when verifying healthcare app deployments for patient safety: CDSS, PHI, data integrity gates. Triggers on \"healthcare-eval-harness\", \"healthcare eval harness\", \"harness\"."
metadata:
  origin: ECC
---

# Healthcare Eval Harness — Patient Safety Verification

One CRITICAL failure blocks deployment: CDSS/PHI/integrity at 100%, workflows at 95%+. Detalhes em `references/`.

## When to Activate

- Before any deployment of EMR/EHR applications
- After modifying CDSS logic (drug interactions, dose validation, scoring)
- After changing database schemas that touch patient data
- After modifying authentication or access control
- During CI/CD pipeline configuration for healthcare apps
- After resolving merge conflicts in clinical modules

## Core Principles

1. **CRITICAL = 100% with --bail** — CDSS, PHI exposure, data integrity
2. **HIGH = 95%+ with review** — clinical workflow, integration compliance
3. **Real logic only** — never mock the CDSS engine in tests
4. **Coverage on CDSS** — enforce thresholds, never skip green-last-time
5. **Red gate = no deploy** — warnings allowed only on HIGH with review

## Example

```bash
npx jest --testPathPattern='tests/cdss' --bail --ci --coverage && \
npx jest --testPathPattern='tests/security/phi' --bail --ci && \
npx jest --testPathPattern='tests/data-integrity' --bail --ci
```

## References

- `references/critical-gates.md` — CDSS, PHI, data-integrity gates with commands
- `references/high-gates.md` — clinical and integration gates, pass/fail matrix
- `references/ci-integration.md` — GitHub Actions safety gate, anti-patterns
- `references/examples-reports.md` — local runs, pass-rate check, eval report

## Checklist

- [ ] All 3 CRITICAL gates green at 100% with --bail before deploy
- [ ] HIGH gates at 95%+ or explicitly reviewed and accepted
- [ ] CDSS tested with real engine + coverage; no --no-bail, no skips
- [ ] Eval report recorded with per-category counts and verdict
