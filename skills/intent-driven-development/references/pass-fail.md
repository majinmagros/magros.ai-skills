# Intent-Driven Development — Pass/fail examples e quality check

Use these to judge whether the skill actually produced a verifiable brief, not planning prose.

**A failing acceptance criterion**

```
AC-001: The export works correctly and is secure.
```

Fails — "works correctly" and "secure" are not observable, there is no scenario, trigger,
expected result, or verification method, and nothing states what must not happen. A reader
cannot tell whether the implementation satisfied it.

**A passing acceptance criterion**

```
AC-001: Export generates file with correct headers
- Scenario: authenticated user, at least one data row visible
- Action: click "Export CSV"
- Expected: browser downloads file with columns [id, name, created_at]
- Must not: expose internal fields or rows belonging to other users
- Verification: automated integration test + manual schema spot-check
- Priority: Required
```

Passes — a concrete observable outcome, a prohibited side effect, and a named verification
method. Two people would agree on whether it was met.

**A failing context entry**

```
Discovered facts: Users on the free tier are limited to 100 exports per month.
```

Fails — a per-tier limit is a business rule. It must not appear under discovered facts inferred
from code; it belongs under Product/business constraints, supplied by the user, or be listed as
an assumption to confirm.

## Pass/Fail Rubric

A brief passes only if every answer is "yes". Any "no" means revise before returning it.

- [ ] Does every required criterion have a scenario, an observable expected result, and a named verification method?
- [ ] Are all vague terms ("correctly", "secure", "fast", "robust") either replaced with observable evidence or marked as human judgment?
- [ ] Are product/business constraints listed as supplied/assumed, with none silently inferred from code?
- [ ] Is scope explicit, with out-of-scope items named?
- [ ] Are blocking decisions limited to choices that actually affect safety or correctness, not preferences?

## Quality Check

Before returning the brief, check:

- The goal describes an outcome rather than an implementation choice.
- Scope boundaries and assumptions are explicit.
- Every required criterion is observable or clearly marked for human judgment.
- Security, privacy, data, compatibility, external-effect, and UX risks were considered only
  where relevant and not silently ignored.
- Verification methods identify safe environments for risky operations.
- No secret or production-sensitive information was copied into the output.
- No repository mutation or implementation block is imposed without justification or request.
