---
name: vibe-security-scanner
description: "Use when auditing vibe-coded SaaS apps for the 5 common flaws (RLS, frontend auth, IDOR, secrets, XSS). Triggers on \"vibe-security-scanner\", \"vibe security\", \"scan my code\"."
metadata:
  origin: ECC
---

# Vibe Security Scanner

Free automated scans (ZAP, GitLeaks, Bandit, Grype) plus the 5 AI-code flaws. Detalhes em `references/`.

## When to Activate

- User built a SaaS with Cursor, Claude Code, Bolt, Lovable, or similar AI tools
- Pre-deployment security audit
- "Is my app secure?" or "scan my code"
- Payment integration review
- User handles customer data (LGPD, GDPR, HIPAA context)

## Core Principles

1. **Secrets first** — GitLeaks over full history; rotate all hits
2. **Server-side auth** — RLS on tables, RPC role check, ownership on IDs
3. **Scan the stack** — Bandit (Python) + Grype (deps) + ZAP (runtime)
4. **Grep the 5 patterns** — localStorage role, innerHTML, sk_live, raw SQL IDs
5. **Manual complements auto** — `security-review` for auth/payments/crypto depth

## Example

```bash
gitleaks detect --source . --verbose
bandit -r . -ll
docker run --rm -v $(pwd):/src anchore/grype dir:/src
```

## References

- `references/vulnerabilities.md` — the 5 flaws with FAIL/PASS code (RLS, admin, IDOR, secrets, XSS)
- `references/scanners.md` — ZAP, GitLeaks, Bandit, Grype commands and findings
- `references/workflow-review.md` — scan order, AI review prompt, JS/TS profile, links

## Checklist

- [ ] GitLeaks clean incl. history; secrets rotated, never in frontend bundle
- [ ] RLS enabled, admin verified server-side, IDOR ownership checked
- [ ] Bandit HIGH/MEDIUM fixed; Grype CVEs updated; ZAP baseline reviewed
- [ ] Grep for localStorage role, innerHTML, sk_live/sk_test hits resolved
