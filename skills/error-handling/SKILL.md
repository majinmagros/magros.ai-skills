---
name: error-handling
description: "Use when patterns for robust error handling across TypeScript, Python, and Go. Covers typed errors, error boundaries, retries, circuit breakers, and user-facing error messages. Triggers on \"error-handling\", \"error handling\", \"handling\"."
metadata:
  origin: ECC
---

# Error Handling Patterns

Consistent, robust error handling: typed errors, fail fast, user messages ≠ dev messages, never swallow silently. Detalhes em `references/`.

## When to Activate

- Designing error types or exception hierarchies for a new module or service
- Adding retry logic or circuit breakers for unreliable external dependencies
- Reviewing API endpoints for missing error handling
- Implementing user-facing error messages and feedback
- Debugging cascading failures or silent error swallowing

## Core Principles

1. **Fail fast and loudly** — surface errors where they occur; don't bury them
2. **Typed errors over strings** — errors are first-class values with structure
3. **User messages ≠ developer messages** — friendly text to users, full context in logs
4. **Never swallow silently** — every `catch` handles, re-throws, or logs
5. **Errors are API contract** — document every error code clients may receive

## Example

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

// API envelope: { error: { code, message } } — never leak internals (500 → generic)
```

## References

- `references/typescript.md` — typed errors, Result pattern, API handler, ErrorBoundary
- `references/python-go.md` — exception hierarchy, FastAPI handlers, sentinel errors + wrapping
- `references/resilience.md` — exponential backoff with jitter, user-message map

## Checklist

- [ ] Every `catch` handles, re-throws, or logs
- [ ] API envelope `{ error: { code, message } }`, no stack traces to users
- [ ] Custom errors extend base `AppError` with `code`
- [ ] Retries only on retriable errors (never 4xx)
- [ ] React rendering wrapped in `ErrorBoundary`
