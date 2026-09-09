---
name: coding-standards
description: "Use when baseline cross-project coding conventions for naming, readability, immutability, and code-quality review. Use detailed frontend or backend skills for framework-specific patterns. Triggers on \"coding-standards\", \"coding standards\", \"standards\"."
metadata:
  origin: ECC
---

# Coding Standards & Best Practices

Baseline coding conventions applicable across projects. This skill is the shared floor, not the detailed framework playbook. Code in `references/`.

- Use `frontend-patterns` for React, state, forms, rendering, and UI architecture.
- Use `backend-patterns` or `api-design` for repository/service layers, endpoint design, validation, and server-specific concerns.
- Use `rules/common/coding-style.md` when you need the shortest reusable rule layer instead of a full skill walkthrough.

## When to Activate

- Starting a new project or module
- Reviewing code for quality and maintainability
- Refactoring existing code to follow conventions
- Enforcing naming, formatting, or structural consistency
- Setting up linting, formatting, or type-checking rules
- Onboarding new contributors to coding conventions

## Scope Boundaries

Activate for: descriptive naming · immutability defaults · readability, KISS, DRY, YAGNI · error-handling expectations · code-smell review.

Not primary source for: React composition/hooks/rendering · backend architecture/API/database layering · domain framework guidance covered by narrower ECC skills.

## Principles & Rules (resumo)

**Readability first** (read > written; self-documenting; consistent format) · **KISS** (simplest that works; no premature optimization) · **DRY** (extract, reuse, no copy-paste) · **YAGNI** (no speculative generality).

```typescript
// Regras de ouro:
const updated = { ...user, name: 'New' };   // spread, nunca mutação direta
const [users, mkts] = await Promise.all([fetchUsers(), fetchMarkets()]); // paralelo
if (!user) return;                           // early returns, sem nesting 5+
const MAX_RETRIES = 3;                       // sem magic numbers
```

- **TypeScript** (`references/typescript.md`): verb-noun functions, no `any`, typed interfaces, try/catch with typed rethrow
- **React** (`references/react.md`): typed props, `useDebounce`-style hooks, functional `setState`, flat conditionals
- **API** (`references/api.md`): REST verbs + query params, `{success, data, error, meta}` envelope, Zod schemas
- **Project** (`references/project.md`): `src/{app,components,hooks,lib,types,styles}` layout, PascalCase components / `use*` hooks, WHY-comments + JSDoc for public APIs
- **Perf + Tests** (`references/perf-testing.md`): `useMemo`/`useCallback` for expensive work, `lazy`+`Suspense`, select columns (never `*`), AAA tests with descriptive names
- **Smells** (`references/smells.md`): >50-line functions → split; 5+ nesting → early returns; magic numbers → named constants
