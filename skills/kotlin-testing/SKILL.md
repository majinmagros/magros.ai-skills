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
./gradlew detekt

# Run ktlint (formatting check)
./gradlew ktlintCheck

# Continuous testing
./gradlew test --continuous
```

## Best Practices

**DO:**
- Write tests FIRST (TDD)
- Use Kotest's spec styles consistently across the project
- Use MockK's `coEvery`/`coVerify` for suspend functions
- Use `runTest` for coroutine testing
- Test behavior, not implementation
- Use property-based testing for pure functions
- Use `data class` test fixtures for clarity

**DON'T:**
- Mix testing frameworks (pick Kotest and stick with it)
- Mock data classes (use real instances)
- Use `Thread.sleep()` in coroutine tests (use `advanceTimeBy`)
- Skip the RED phase in TDD
- Test private functions directly
- Ignore flaky tests

## Integration with CI/CD

```yaml
# GitHub Actions example
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '21'

    - name: Run tests with coverage
      run: ./gradlew test koverXmlReport

    - name: Verify coverage
      run: ./gradlew koverVerify

    - name: Upload coverage
      uses: codecov/codecov-action@v5
      with:
        files: build/reports/kover/report.xml
        token: ${{ secrets.CODECOV_TOKEN }}
```

## Referências

- `references/tdd-kotest-specs.md` — ciclo RED-GREEN-REFACTOR, estilos Kotest
- `references/matchers-mockk.md` — matchers, MockK, coroutines mock
- `references/coroutines.md` — runTest, Flow, TestDispatcher
- `references/property-datadriven.md` — property testing, withData
- `references/lifecycle-kover.md` — fixtures, extensions, Kover
- `references/ktor.md` — testApplication

**Remember**: Tests are documentation. They show how your Kotlin code is meant to be used. Use Kotest's expressive matchers to make tests readable and MockK for clean mocking of dependencies.
