---
name: fsharp-testing
description: "Use when f# testing patterns with xUnit, FsUnit, Unquote, FsCheck property-based testing, integration tests, and test organization best practices. Only for F# — not for other languages. Triggers on \"fsharp-testing\", \"fsharp testing\", \"testing\"."
metadata:
  origin: ECC
---

# F# Testing Patterns

Testing patterns for F# apps using xUnit, FsUnit, Unquote, FsCheck, and modern .NET practices. Detalhes em `references/`.

## When to Activate

- Writing new tests for F# code
- Reviewing test quality and coverage
- Setting up test infrastructure for F# projects
- Debugging flaky or slow tests

## Core Principles

1. **Unquote for assertions** — quotations show the full failed expression
2. **FsCheck for invariants** — totals, roundtrips, validation rules
3. **Function stubs first** — NSubstitute only for .NET interfaces
4. **Fresh state per test** — never mutable shared fixtures
5. **Test behavior, not internals** — typed values and pattern matches

## Example

```fsharp
[<Fact>]
let ``order total sums item prices`` () =
    let items = [ { Sku = "A"; Quantity = 2; Price = 10m }
                  { Sku = "B"; Quantity = 1; Price = 5m } ]
    let total = Order.calculateTotal items
    test <@ total = 25m @>
```

## References

- `references/unit-tests.md` — stack table, xUnit+FsUnit, Unquote, async, Theory
- `references/property-tests.md` — FsCheck.xUnit, custom generators
- `references/mocking-integration.md` — stubs, NSubstitute, WebApplicationFactory, layout, anti-patterns, `dotnet test`, related skills

## Checklist

- [ ] Unquote `test <@ ... @>` instead of bare asserts
- [ ] FsCheck properties for functions with clear invariants
- [ ] Async tests use `task { }`, no `Thread.Sleep`
- [ ] `CancellationToken` passed and verified
- [ ] Unit/Integration/Properties split under `tests/`
