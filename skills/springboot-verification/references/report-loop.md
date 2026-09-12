# Phase 6: Diff Review, Report, Continuous Mode

```bash
git diff --stat
git diff
```

Checklist: no debugging logs (`System.out`, unguarded `log.debug`), meaningful errors and HTTP statuses, transactions and validation present, config changes documented.

## Output Template

```
VERIFICATION REPORT
===================
Build:     [PASS/FAIL]
Static:    [PASS/FAIL] (spotbugs/pmd/checkstyle)
Tests:     [PASS/FAIL] (X/Y passed, Z% coverage)
Security:  [PASS/FAIL] (CVE findings: N)
Diff:      [X files changed]

Overall:   [READY / NOT READY]

Issues to Fix:
1. ...
2. ...
```

## Continuous Mode

- Re-run phases on significant changes or every 30–60 minutes in long sessions.
- Keep a short loop: `mvn -T 4 test` + spotbugs for quick feedback.
- Fast feedback beats late surprises; treat warnings as defects in production systems.
