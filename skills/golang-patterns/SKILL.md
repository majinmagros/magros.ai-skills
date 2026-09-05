---
name: golang-patterns
description: "Use when idiomatic Go patterns, best practices, and conventions for building robust, efficient, and maintainable Go applications. Only for Go — not for other languages. Triggers on \"golang-patterns\", \"golang patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Go Development Patterns

Idiomatic Go patterns and best practices for building robust, efficient, and maintainable applications.

## When to Activate

- Writing new Go code
- Reviewing Go code
- Refactoring existing Go code
- Designing Go packages/modules

## When NOT to Use

- Other languages (use `python-patterns`, `rust-patterns`, `kotlin-patterns`, etc.)
- Go test strategy specifically (use `golang-testing`)

## Contents

| Topic | Reference |
|---|---|
| Core principles (simplicity, zero value, interfaces) | `references/core-principles.md` |
| Error handling (wrapping, custom types, Is/As) | `references/error-handling.md` |
| Concurrency (worker pool, context, errgroup) | `references/concurrency.md` |
| Interface design | `references/interfaces.md` |
| Package organization | `references/packages.md` |
| Struct design (options, embedding) | `references/structs.md` |
| Memory and performance | `references/performance.md` |
| Tooling (commands, golangci) | `references/tooling.md` |

## Quick Reference: Go Idioms

| Idiom | Description |
|-------|-------------|
| Accept interfaces, return structs | Functions accept interface params, return concrete types |
| Errors are values | Treat errors as first-class values, not exceptions |
| Don't communicate by sharing memory | Use channels for coordination between goroutines |
| Make the zero value useful | Types should work without explicit initialization |
| A little copying is better than a little dependency | Avoid unnecessary external dependencies |
| Clear is better than clever | Prioritize readability over cleverness |
| gofmt is no one's favorite but everyone's friend | Always format with gofmt/goimports |
| Return early | Handle errors first, keep happy path unindented |

## Anti-Patterns to Avoid

```go
// Bad: Naked returns in long functions
func process() (result int, err error) {
    // ... 50 lines ...
    return // What is being returned?
}

// Bad: Using panic for control flow
func GetUser(id string) *User {
    user, err := db.Find(id)
    if err != nil {
        panic(err) // Don't do this
    }
    return user
}

// Bad: Passing context in struct
type Request struct {
    ctx context.Context // Context should be first param
    ID  string
}

// Good: Context as first parameter
func ProcessRequest(ctx context.Context, id string) error {
    // ...
}

// Bad: Mixing value and pointer receivers
type Counter struct{ n int }
func (c Counter) Value() int { return c.n }    // Value receiver
func (c *Counter) Increment() { c.n++ }        // Pointer receiver
// Pick one style and be consistent
```

## Referências

- `references/core-principles.md` — simplicidade, zero value, interfaces
- `references/error-handling.md` — wrapping, tipos custom, Is/As
- `references/concurrency.md` — worker pool, context, errgroup, leaks
- `references/interfaces.md` — interfaces pequenas e focadas
- `references/packages.md` — layout, naming, estado
- `references/structs.md` — functional options, embedding
- `references/performance.md` — preallocate, sync.Pool, strings
- `references/tooling.md` — comandos go, golangci

**Remember**: Go code should be boring in the best way - predictable, consistent, and easy to understand. When in doubt, keep it simple.
