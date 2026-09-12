---
name: code-tour
description: "Use when create CodeTour `.tour` files — persona-targeted, step-by-step walkthroughs with real file and line anchors. Use for onboarding tours, architecture walkthroughs, PR tours, RCA tours, and structured \"explain how this works\" requests. Triggers on \"code-tour\", \"code tour\", \"tour\"."
metadata:
  origin: ECC
---

# Code Tour

CodeTour `.tour` walkthroughs anchored to real files and lines, living in `.tours/`. Detalhes em `references/`.

## When to Activate

- User asks for a code, onboarding, architecture, PR, or RCA tour
- User says "explain how X works" and wants a reusable artifact
- Ramp-up path for a new engineer or reviewer
- Guided sequence beats a flat summary
- Skip: one-off chat answer, prose docs, implementation, broad onboarding

## Core Principles

1. **Real anchors only** — verify every file, line, selection; never guess
2. **One persona, one story** — orientation → path → gotcha → next move
3. **`ref` must contain the files** — PR tours point at the PR branch, else omit
4. **SMIG descriptions** — Situation, Mechanism, Implication, Gotcha
5. **Only `.tour` JSON** — never modify source code

## Example

```json
{ "file": "src/auth/middleware.ts", "line": 42, "title": "Auth Gate",
  "description": "Every protected request passes here first." }
```

## References

- `references/workflow.md` — discover, personas, anchors, write, validate, `ref`
- `references/step-types.md` — content, directory, file+line, selection, pattern, URI
- `references/writing.md` — SMIG, narrative arc, full example, anti-patterns, practices

## Checklist

- [ ] Persona + depth picked from request shape
- [ ] Every path exists, every line/selection valid at chosen `ref`
- [ ] First step anchored (never content-only)
- [ ] Story arc holds, descriptions name concrete code
- [ ] Written to `.tours/<persona>-<focus>.tour`
