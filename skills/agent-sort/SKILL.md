---
name: agent-sort
description: "Use when trimming ECC to a project-specific DAILY vs LIBRARY install plan backed by repo evidence. Triggers on \"agent-sort\", \"sort skills\", \"daily vs library\", \"trim install\"."
metadata:
  origin: ECC
---

# Agent Sort

Build an evidence-backed ECC install plan: DAILY (load always) vs LIBRARY (searchable). Detalhes em `references/`.

## When to Activate

- A project only needs a subset of ECC and full installs are too noisy
- The repo stack is clear, but nobody wants to hand-curate skills one by one
- A team wants a repeatable install decision backed by grep evidence
- You need to separate always-loaded surfaces from searchable library surfaces
- A repo drifted into the wrong language, rule, or hook set and needs cleanup

## Core Principles

1. **Repo is truth** — classify from files, manifests, CI, never opinion
2. **Evidence per DAILY** — every always-loaded item cites concrete proof
3. **Two buckets only** — DAILY loads, LIBRARY stays reachable via search/router
4. **No incompatible installs** — hooks/rules/scripts the repo cannot use stay out
5. **Plan then verify** — inventory, install plan, verification report in order

## Example

```text
skills/frontend-patterns | skill | DAILY | 84 .tsx files, next.config.ts present | core stack
skills/django-patterns   | skill | LIBRARY | no .py files, no pyproject.toml      | not active
```

## References

- `references/evidence-model.md` — non-negotiable rules, DAILY/LIBRARY model, evidence sources
- `references/review-passes.md` — 6 parallel passes (agents, skills, commands, rules, hooks, extras)
- `references/workflow.md` — read repo, evidence table, DAILY vs LIBRARY decision
- `references/install-verify.md` — install plan, library router, verification, handoffs, output

## Checklist

- [ ] Stack established from repo files before classifying anything
- [ ] Every DAILY item has cited evidence in the table
- [ ] Only compatible hooks/rules installed; rest routed to LIBRARY
- [ ] Verification run: DAILY exists, stale surfaces removed, gaps listed
