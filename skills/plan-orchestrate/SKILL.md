---
name: plan-orchestrate
description: "Use when the user has a multi-step plan and wants to drive it through orchestrate without composing chains by hand. Generative only — never invokes /orchestrate itself. Triggers on \"plan-orchestrate\", \"orchestrate this plan\", \"orchestrate prompts\"."
metadata:
  origin: ECC
---

# Plan Orchestrate

Bridge a plan document to `/orchestrate custom`: one ready-to-paste invocation per step. Detalhes em `references/`.

## When to Activate

- User has a multi-step plan (PRD, RFC, implementation plan) for `/orchestrate`
- User says "orchestrate this plan" or "give me orchestrate prompts"
- A step-by-step plan exists but agent-per-step picking is wanted
- Scoping emission with `--scope` or previewing with `--dry-run`
- Detecting language/install form before composing chains

## Core Flow

1. **Detect** ECC mode (plugin vs legacy) + language once, freeze it
2. **Decompose** plan into step units (numbering → table → blocks → H2)
3. **Tag + chain** each step from the catalogue (dedup, ≤4 agents, reviewer closes impl)
4. **Compress** task to 200–600 chars with `[Plan: path#step-N]` + Acceptance
5. **Self-check** before emitting (catalogue, single form, no invented flags)

## Example

```bash
/orchestrate custom "tdd-guide,python-reviewer" "[Plan: docs/plan/feat.md#step-2] Implement X; Acceptance: tests pass; migration clean"
```

## References

- `references/mode-catalogue.md` — install forms, `{ORCH_CMD}`, agent catalogue
- `references/decompose-tag.md` — inputs, Phase 0–1, tag table
- `references/composition-rules.md` — chain rules, zero-tag, length limits
- `references/output-format.md` — Phase 3–5, edge cases, examples

## Checklist

- [ ] Every agent from the catalogue, `{ORCH_CMD}` + names in one form
- [ ] Task single-line, starts `[Plan: path#step-N]`, 1–3 Acceptance items
- [ ] Chain ≤ 4, deduped; impl/refactor/migration ends with reviewer
- [ ] No invented flags; `Out of scope` only when inherited from plan
- [ ] Overview lists all steps; detail count matches `--scope`
