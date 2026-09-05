---
name: golang-testing
description: "Use when go testing patterns including table-driven tests, subtests, benchmarks, fuzzing, and test coverage. Follows TDD methodology with idiomatic Go practices. Only for Go — not for other languages. Triggers on \"golang-testing\", \"golang testing\", \"testing\"."
metadata:
  origin: ECC
---

# Go Testing Patterns

Comprehensive Go testing patterns for writing reliable, maintainable tests following TDD methodology.

## When to Activate

- Writing new Go functions or methods
- Adding test coverage to existing code
- Creating benchmarks for performance-critical code
- Implementing fuzz tests for input validation
- Following TDD workflow in Go projects

## When NOT to Use

- Other languages (use `python-testing`, `kotlin-testing`, etc.)
- Go idioms in general (use `golang-patterns`)

## Contents

| Topic | Reference |
|---|---|
| TDD cycle, table-driven tests | `references/tdd-table.md` |
| Subtests, helpers, temp files | `references/subtests-helpers.md` |
| Golden files, interface mocking | `references/golden-mocking.md` |
| Benchmarks, fuzzing | `references/benchmarks-fuzz.md` |
| Coverage, HTTP handler testing | `references/coverage-http.md` |

## Testing Commands

```bash
# Run all tests
go test ./...

# Run tests with verbose output
go test -v ./...

# Run specific test
go test -run TestAdd ./...

# Run tests matching pattern
go test -run "TestUser/Create" ./...

# Run tests with race detector
go test -race ./...

# Run tests with coverage
go test -cover -coverprofile=coverage.out ./...

# Run short tests only
go test -short ./...

# Run tests with timeout
go test -timeout 30s ./...

# Run benchmarks
go test -bench=. -benchmem ./...

# Run fuzzing
go test -fuzz=FuzzParse -fuzztime=30s ./...

# Count test runs (for flaky test detection)
go test -count=10 ./...
```

## Best Practices

**DO:**
- Write tests FIRST (TDD)
- Use table-driven tests for comprehensive coverage
- Test behavior, not implementation
- Use `t.Helper()` in helper functions
- Use `t.Parallel()` for independent tests
- Clean up resources with `t.Cleanup()`
- Use meaningful test names that describe the scenario

**DON'T:**
- Test private functions directly (test through public API)
- Use `time.Sleep()` in tests (use channels or conditions)
- Ignore flaky tests (fix or remove them)
- Mock everything (prefer integration tests when possible)
- Skip error path testing

## Integration with CI/CD

```yaml
# GitHub Actions example
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-go@v5
      with:
        go-version: '1.22'

    - name: Run tests
      run: go test -race -coverprofile=coverage.out ./...

    - name: Check coverage
      run: |
        go tool cover -func=coverage.out | grep total | awk '{print $3}' | \
        awk -F'%' '{if ($1 < 80) exit 1}'
```

## Referências

- `references/tdd-table.md` — ciclo RED-GREEN-REFACTOR, table-driven
- `references/subtests-helpers.md` — subtests, helpers, tmp files
- `references/golden-mocking.md` — golden files, mocks por interface
- `references/benchmarks-fuzz.md` — benchmarks, fuzzing
- `references/coverage-http.md` — coverage, handlers HTTP

**Remember**: Tests are documentation. They show how your code is meant to be used. Write them clearly and keep them up to date.
