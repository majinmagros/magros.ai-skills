---
name: codebase-onboarding
description: "Use when joining a new repo, understanding an unfamiliar codebase, or generating CLAUDE.md. Triggers on \"codebase-onboarding\", \"onboard me\", \"understand this codebase\"."
metadata:
  origin: ECC
---

# Codebase Onboarding

Recon → map → conventions → guide + CLAUDE.md for unfamiliar repos. Detalhes em `references/`.

## When to Use

- First time opening a project with Claude Code
- Joining a new team or repository
- User asks "help me understand this codebase"
- User asks to generate a CLAUDE.md for a project
- User says "onboard me" or "walk me through this repo"

## Core Principles

1. **Recon with Glob/Grep** — manifests, configs, entry points, tests
2. **Map architecture** — stack, pattern, key dirs, one request trace
3. **Detect conventions** — naming, error handling, git workflow
4. **Verify, don't guess** — code beats config; flag unknowns
5. **Two artifacts** — scannable guide + ≤100-line CLAUDE.md

## Example

```bash
# Phase 1 recon (parallel, no full reads)
ls package.json go.mod Cargo.toml pyproject.toml 2>/dev/null
ls next.config.* vite.config.* angular.json 2>/dev/null
```

## References

- `references/reconnaissance.md` — 6 parallel checks: manifests, framework, entry, tree, tooling, tests
- `references/architecture-mapping.md` — stack, pattern, key dirs, data-flow trace
- `references/conventions.md` — naming, code patterns, git conventions, shallow-history rule
- `references/artifacts.md` — guide + CLAUDE.md templates, practices, anti-patterns, scenarios

## Checklist

- [ ] Recon via Glob/Grep; selective reads only
- [ ] One request traced entry → validation → logic → DB
- [ ] Existing CLAUDE.md enhanced, not replaced
- [ ] Guide scannable in 2 minutes; CLAUDE.md ≤100 lines
- [ ] Unknowns flagged instead of guessed
