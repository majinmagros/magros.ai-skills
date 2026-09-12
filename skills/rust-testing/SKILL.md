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