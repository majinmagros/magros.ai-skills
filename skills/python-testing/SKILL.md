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

```bash
# Run all tests
pytest

# Run specific file
pytest tests/test_utils.py

# Run specific test
pytest tests/test_utils.py::test_function

# Run with verbose output
pytest -v

# Run with coverage
pytest --cov=mypackage --cov-report=html

# Run only fast tests
pytest -m "not slow"

# Run until first failure
pytest -x

# Run and stop on N failures
pytest --maxfail=3

# Run last failed tests
pytest --lf

# Run tests with pattern
pytest -k "test_user"

# Run with debugger on failure
pytest --pdb
```

## Quick Reference

| Pattern | Usage |
|---------|-------|
| `pytest.raises()` | Test expected exceptions |
| `@pytest.fixture()` | Create reusable test fixtures |
| `@pytest.mark.parametrize()` | Run tests with multiple inputs |
| `@pytest.mark.slow` | Mark slow tests |
| `pytest -m "not slow"` | Skip slow tests |
| `@patch()` | Mock functions and classes |
| `tmp_path` fixture | Automatic temp directory |
| `pytest --cov` | Generate coverage report |
| `assert` | Simple and readable assertions |

## Referências

- `references/philosophy.md` — TDD, metas de cobertura
- `references/pytest-basics.md` — estrutura, assertions
- `references/fixtures.md` — scopes, params, conftest
- `references/parametrization.md` — ids, fixtures parametrizadas
- `references/markers.md` — marks, selecao, pytest.ini
- `references/mocking.md` — patch, autospec, properties
- `references/async.md` — pytest-asyncio, fixtures async
- `references/exceptions-sidefx.md` — raises, tmp_path
- `references/organization.md` — diretorios, classes
- `references/patterns-config.md` — APIs, DB, config

**Remember**: Tests are code too. Keep them clean, readable, and maintainable. Good tests catch bugs; great tests prevent them.
