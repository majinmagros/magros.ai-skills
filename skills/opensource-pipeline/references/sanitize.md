# /opensource verify PROJECT

Run sanitizer independently. Resolve path: if PROJECT contains `/`, treat as a path. Otherwise check `$HOME/opensource-staging/PROJECT`, then `$HOME/PROJECT`, then current directory.

```
Agent(
  subagent_type="opensource-sanitizer",
  prompt="Verify sanitization of: {resolved_path}. Run all 6 scan categories and generate SANITIZATION_REPORT.md."
)
```

# The 6 Scan Categories

1. Secrets scan (CRITICAL)
2. PII scan (CRITICAL)
3. Internal references scan (CRITICAL)
4. Dangerous files check (CRITICAL)
5. Configuration completeness (WARNING)
6. Git history audit

# FAIL Policy

- **If FAIL:** Show findings to user. Ask: "Fix these and re-scan, or abort?"
  - If fix: Apply fixes, re-run sanitizer (maximum 3 retry attempts — after 3 FAILs, present all findings and ask user to fix manually)
  - If abort: Clean up staging directory
- **If PASS or PASS WITH WARNINGS:** Continue to packaging.
- **Never** proceed after a sanitizer FAIL without fixing all critical findings.
- Re-run the sanitizer after any manual fixes before publishing.
