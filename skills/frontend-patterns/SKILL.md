---
name: frontend-patterns
description: "Use when frontend development patterns for React, Next.js, state management, performance optimization, and UI best practices. Only for React/Next.js frontend — not for backend or other frameworks. Triggers on \"frontend-patterns\", \"frontend patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Frontend Development Patterns

Modern frontend patterns for React, Next.js, and performant user interfaces.

## When to Activate

- Building React components (composition, props, rendering)
- Managing state (useState, useReducer, Zustand, Context)
- Implementing data fetching (SWR, React Query, server components)
- Optimizing performance (memoization, virtualization, code splitting)
- Working with forms (validation, controlled inputs, Zod schemas)
- Handling client-side routing and navigation
- Building accessible, responsive UI patterns

## When NOT to Use

- Backend work (use `backend-patterns`, `fastapi-patterns`, etc.)
- Vue/Angular specifics (use `vue-patterns`, `nuxt4-patterns`)
- Mobile React Native (use `react-native-patterns`)

## Contents

| Topic | Reference |
|---|---|
| Components, custom hooks | `references/components-hooks.md` |
| State, memoization, splitting | `references/state-perf.md` |
| Forms, error boundaries | `references/forms-errors.md` |
| Animation, a11y | `references/animation-a11y.md` |

## Example

```tsx
// Composition over inheritance
function Dialog({ children }: { children: React.ReactNode }) {
  return <div role="dialog">{children}</div>
}
```

## Referências

- `references/components-hooks.md` — composicao, compound, hooks
- `references/state-perf.md` — context/reducer, memo, virtualizacao
- `references/forms-errors.md` — controlled forms, error boundary
- `references/animation-a11y.md` — framer motion, teclado, foco

**Remember**: Modern frontend patterns enable maintainable, performant user interfaces. Choose patterns that fit your project complexity.
