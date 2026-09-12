---
name: intent-driven-development
description: Turn ambiguous or high-impact product and engineering changes into scoped, verifiable acceptance criteria before or alongside implementation. Use when a user asks to clarify a feature, define acceptance criteria, de-risk a security/data/migration/integration change, prepare implementation requirements for another agent, or make a complex request testable. Do not trigger for trivial edits, straightforward fixes, active debugging, code review, or implementation requests whose acceptance conditions are already clear unless the user explicitly invokes this skill.
---

# Intent-Driven Development

Useful acceptance criteria without specification ceremony. Inspect context first, expose genuine ambiguity, choose verification that fits risk. Detalhes em `references/`.

## When to Activate

- User asks to clarify a feature, define acceptance criteria, or de-risk a change before implementation
- Request touches security, authentication, persistent data, migrations, external APIs, or compliance
- User wants to prepare a handoff artifact for another agent or team
- Request is ambiguous enough that the expected outcome is not yet observable or testable
- User explicitly invokes this skill with `/intent-driven-development`

Do not activate for trivial edits, straightforward one-line fixes, active debugging sessions,
code review requests, or implementation requests whose acceptance conditions are already clear.

## How It Works

1. **Inspect context first** — repo/docs/schemas/tests for technical facts; product constraints only from user or product artifacts
2. **Choose depth** — Quick Capture (3-7 criteria, low/moderate risk) or Full Acceptance Brief (security, data, migration, cross-system)
3. **Ask minimally** — only questions whose answers can't be inferred and change scope/behavior
4. **Write observable criteria** — AC-NNN with scenario, trigger, expected outcome, must-not, verification, priority; no vague words without evidence
5. **Proceed or hand off** — clear requests continue; risky changes wait for confirmation; pass brief/IDs to implementation workflow
6. **Handle revision** — failed AC gets `[revised]` + new revision number, re-present only changed criteria

## Example

**Quick Capture — "Add CSV export to the dashboard"**

```
Goal: Authenticated users can download dashboard data as a CSV file.
In scope: Export of currently filtered rows; filename includes date.
Out of scope: Scheduled exports, email delivery, Excel format.
Assumptions: Max row count is under 10k; no PII in exported fields.

AC-001: Export generates file with correct headers
- Scenario: authenticated user, at least one data row visible
- Action: click "Export CSV"
- Expected: browser downloads file with columns [id, name, created_at]
- Must not: expose internal fields or rows belonging to other users
- Verification: automated integration test + manual schema spot-check
- Priority: Required
```

## References

- `references/operating-rules.md` — 10 rules (inspect first, never infer business, ask minimally, revision protocol)
- `references/workflow.md` — goal/risk, context, scope, AC format, boundaries table, present/continue, handoff
- `references/template.md` — Full Acceptance Brief template (goal, scope, risk review, AC, verification plan)
- `references/pass-fail.md` — pass/fail examples, rubric, quality check
- `references/enrichment.md` — executable review contract (runtime, fixtures, gates, surfaces)
