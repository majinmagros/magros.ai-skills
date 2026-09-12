---
name: kotlin-testing
description: "Use when kotlin testing patterns with Kotest, MockK, coroutine testing, property-based testing, and Kover coverage. Follows TDD methodology with idiomatic Kotlin practices. Only for Kotlin — not for other languages. Triggers on \"kotlin-testing\", \"kotlin testing\", \"testing\"."
metadata:
  origin: ECC
---

# Kotlin Testing Patterns

Comprehensive Kotlin testing patterns for writing reliable, maintainable tests following TDD methodology with Kotest and MockK.

## When to Use

- Writing new Kotlin functions or classes
- Adding test coverage to existing Kotlin code
- Implementing property-based tests
- Following TDD workflow in Kotlin projects
- Configuring Kover for code coverage

## When NOT to Use

- Other languages (use `golang-testing`, `python-testing`, etc.)
- Kotlin idioms in general (use `kotlin-patterns`)
- Ktor/Exposed specifics (use `kotlin-ktor-patterns`, `kotlin-exposed-patterns`)

## How It Works

1. **Identify target code** — Find the function, class, or module to test
2. **Write a Kotest spec** — Choose a spec style (StringSpec, FunSpec, BehaviorSpec) matching the test scope
3. **Mock dependencies** — Use MockK to isolate the unit under test
4. **Run tests (RED)** — Verify the test fails with the expected error
5. **Implement code (GREEN)** — Write minimal code to pass the test
6. **Refactor** — Improve the implementation while keeping tests green
7. **Check coverage** — Run `./gradlew koverHtmlReport` and verify 80%+ coverage

## Contents

| Topic | Reference |
|---|---|
| TDD cycle, Kotest spec styles | `references/tdd-kotest-specs.md` |
| Matchers, MockK | `references/matchers-mockk.md` |
| Coroutine testing (runTest, Flow) | `references/coroutines.md` |
| Property-based, data-driven | `references/property-datadriven.md` |
| Lifecycle, fixtures, Kover | `references/lifecycle-kover.md` |
| Ktor testApplication | `references/ktor.md` |

## Testing Commands

```bash
# Run all tests
./gradlew test

# Run specific test class
./gradlew test --tests "com.example.UserServiceTest"

# Run specific test
./gradlew test --tests "com.example.UserServiceTest.getUser returns user when found"

# Run with verbose output
./gradlew test --info

# Run with coverage
./gradlew koverHtmlReport

# Run detekt (static analysis)