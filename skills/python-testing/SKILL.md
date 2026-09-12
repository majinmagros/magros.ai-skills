---
name: python-testing
description: "Use when python testing strategies using pytest, TDD methodology, fixtures, mocking, parametrization, and coverage requirements. Only for Python — not for other languages. Triggers on \"python-testing\", \"python testing\", \"testing\"."
metadata:
  origin: ECC
---

# Python Testing Patterns

Comprehensive testing strategies for Python applications using pytest, TDD methodology, and best practices.

## When to Activate

- Writing new Python code (follow TDD: red, green, refactor)
- Designing test suites for Python projects
- Reviewing Python test coverage
- Setting up testing infrastructure

## When NOT to Use

- Other languages (use `golang-testing`, `kotlin-testing`, etc.)
- Python idioms in general (use `python-patterns`)
- Django/pytest-django specifics (use `django-tdd`)

## Contents

| Topic | Reference |
|---|---|
| TDD philosophy, coverage requirements | `references/philosophy.md` |
| pytest basics (structure, assertions) | `references/pytest-basics.md` |
| Fixtures (scopes, params, conftest) | `references/fixtures.md` |
| Parametrization | `references/parametrization.md` |
| Markers and test selection | `references/markers.md` |
| Mocking and patching | `references/mocking.md` |
| Async tests (pytest-asyncio) | `references/async.md` |
| Exceptions, side effects | `references/exceptions-sidefx.md` |
| Test organization | `references/organization.md` |
| API/DB patterns, pytest config | `references/patterns-config.md` |

## Best Practices

### DO

- **Follow TDD**: Write tests before code (red-green-refactor)
- **Test one thing**: Each test should verify a single behavior
- **Use descriptive names**: `test_user_login_with_invalid_credentials_fails`
- **Use fixtures**: Eliminate duplication with fixtures
- **Mock external dependencies**: Don't depend on external services
- **Test edge cases**: Empty inputs, None values, boundary conditions
- **Aim for 80%+ coverage**: Focus on critical paths
- **Keep tests fast**: Use marks to separate slow tests

### DON'T

- **Don't test implementation**: Test behavior, not internals
- **Don't use complex conditionals in tests**: Keep tests simple
- **Don't ignore test failures**: All tests must pass
- **Don't test third-party code**: Trust libraries to work
- **Don't share state between tests**: Tests should be independent
- **Don't catch exceptions in tests**: Use `pytest.raises`
- **Don't use print statements**: Use assertions and pytest output
- **Don't write tests that are too brittle**: Avoid over-specific mocks

## Running Tests
