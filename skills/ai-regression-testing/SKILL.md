---
name: ai-regression-testing
description: "Use when regression testing strategies for AI-assisted development. Sandbox-mode API testing without database dependencies, automated bug-check workflows, and patterns to catch AI blind spots where the same model writes and reviews code. Triggers on \"ai-regression-testing\", \"ai regression testing\", \"testing\"."
metadata:
  origin: ECC
---

# AI Regression Testing

Patterns for AI-assisted development where the same model writes and reviews code — systematic blind spots only automated tests catch. Detalhes em `references/`.

## When to Activate

- AI agent (Claude Code, Cursor, Codex) has modified API routes or backend logic
- A bug was found and fixed — need to prevent re-introduction
- Project has a sandbox/mock mode that can be leveraged for DB-free testing
- Running `/bug-check` or similar review commands after code changes
- Multiple code paths exist (sandbox vs production, feature flags, etc.)

## The Core Problem

AI reviewing its own fix carries the same assumptions into both steps:

```
AI writes fix → AI reviews fix → AI says "looks correct" → Bug still exists
```

Observed pattern: **sandbox/production path inconsistency** is the #1 AI-introduced regression (same bug re-introduced 4x, caught instantly once tested).

## Quick Reference

| AI Regression Pattern | Test Strategy | Priority |
|---|---|---|
| Sandbox/production mismatch | Assert same response shape in sandbox mode | High |
| SELECT clause omission | Assert all required fields in response | High |
| Error state leakage | Assert state cleanup on error | Medium |
| Missing rollback | Assert state restored on API failure | Medium |
| Type cast masking null | Assert field is not undefined | Medium |

## References

- `references/sandbox-testing.md` — Vitest setup, request helpers, regression + parity tests
- `references/bug-check-workflow.md` — `/bug-check` command (tests → build → review → new test)
- `references/regression-patterns.md` — 4 FAIL/PASS patterns + test-where-bugs-were strategy

## DO / DON'T

**DO:**
- Write tests immediately after finding a bug (before fixing it if possible)
- Test the API response shape, not the implementation
- Run tests as the first step of every bug-check
- Keep tests fast (< 1 second total with sandbox mode)
- Name tests after the bug they prevent (e.g., "BUG-R1 regression")

**DON'T:**
- Write tests for code that has never had a bug
- Trust AI self-review as a substitute for automated tests
- Skip sandbox path testing because "it's just mock data"
- Write integration tests when unit tests suffice
- Aim for coverage percentage — aim for regression prevention
