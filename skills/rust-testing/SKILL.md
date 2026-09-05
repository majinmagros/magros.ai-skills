---
name: rust-testing
description: "Use when rust testing patterns including unit tests, integration tests, async testing, property-based testing, mocking, and coverage. Follows TDD methodology. Only for Rust — not for other languages. Triggers on \"rust-testing\", \"rust testing\", \"testing\"."
metadata:
  origin: ECC
---

# Rust Testing Patterns

Comprehensive Rust testing patterns for writing reliable, maintainable tests following TDD methodology.

## When to Use

- Writing new Rust functions, methods, or traits
- Adding test coverage to existing code
- Creating benchmarks for performance-critical code
- Implementing property-based tests for input validation
- Following TDD workflow in Rust projects

## When NOT to Use

- Other languages (use `golang-testing`, `python-testing`, `kotlin-testing`, etc.)
- Rust idioms and patterns in general (use `rust-patterns`)

## How It Works

1. **Identify target code** — Find the function, trait, or module to test
2. **Write a test** — Use `#[test]` in a `#[cfg(test)]` module, rstest for parameterized tests, or proptest for property-based tests
3. **Mock dependencies** — Use mockall to isolate the unit under test
4. **Run tests (RED)** — Verify the test fails with the expected error
5. **Implement (GREEN)** — Write minimal code to pass
6. **Refactor** — Improve while keeping tests green
7. **Check coverage** — Use cargo-llvm-cov, target 80%+

## Contents

| Topic | Reference |
|---|---|
| TDD RED-GREEN-REFACTOR cycle | `references/tdd-workflow.md` |
| Unit tests and assertion macros | `references/unit-tests.md` |
| `Result` and panic testing | `references/error-panic-testing.md` |
| Integration tests | `references/integration-tests.md` |
| Async tests (Tokio) | `references/async-tests.md` |
| Parameterized tests, helpers | `references/test-organization.md` |
| Property-based testing (proptest) | `references/property-testing.md` |
| Mocking (mockall) | `references/mocking.md` |
| Doc tests | `references/doc-tests.md` |
| Benchmarking (Criterion) | `references/benchmarking.md` |
| Coverage (cargo-llvm-cov) | `references/coverage.md` |
| CI integration | `references/ci-integration.md` |

## Example

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_valid_input() {
        assert_eq!(parse("42").unwrap(), 42);
    }

    #[test]
    fn rejects_invalid_input() {
        assert!(parse("abc").is_err());
    }
}
```

## Testing Commands

```bash
cargo test                        # Run all tests
cargo test -- --nocapture         # Show println output
cargo test test_name              # Run tests matching pattern
cargo test --lib                  # Unit tests only
cargo test --test api_test        # Integration tests only
cargo test --doc                  # Doc tests only
cargo test --no-fail-fast         # Don't stop on first failure
cargo test -- --ignored           # Run ignored tests
```

## Best Practices

**DO:**
- Write tests FIRST (TDD)
- Use `#[cfg(test)]` modules for unit tests
- Test behavior, not implementation
- Use descriptive test names that explain the scenario
- Prefer `assert_eq!` over `assert!` for better error messages
- Use `?` in tests that return `Result` for cleaner error output
- Keep tests independent — no shared mutable state

**DON'T:**
- Use `#[should_panic]` when you can test `Result::is_err()` instead
- Mock everything — prefer integration tests when feasible
- Ignore flaky tests — fix or quarantine them
- Use `sleep()` in tests — use channels, barriers, or `tokio::time::pause()`
- Skip error path testing

## Referências

- `references/tdd-workflow.md` — ciclo RED-GREEN-REFACTOR
- `references/unit-tests.md` — organizacao e assertions
- `references/error-panic-testing.md` — `Result`, `should_panic`
- `references/integration-tests.md` — estrutura e escrita
- `references/async-tests.md` — Tokio
- `references/test-organization.md` — rstest, helpers
- `references/property-testing.md` — proptest
- `references/mocking.md` — mockall
- `references/doc-tests.md` — documentacao executavel
- `references/benchmarking.md` — Criterion
- `references/coverage.md` — metas de cobertura
- `references/ci-integration.md` — GitHub Actions

**Remember**: Tests are documentation. They show how your code is meant to be used. Write them clearly and keep them up to date.
