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