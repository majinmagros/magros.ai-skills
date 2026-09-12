---
name: django-tdd
description: "Use when django testing strategies with pytest-django, TDD methodology, factory_boy, mocking, coverage, and testing Django REST Framework APIs. Only for Django — not for other frameworks. Triggers on \"django-tdd\", \"django tdd\"."
metadata:
  origin: ECC
---

# Django Testing with TDD

Test-driven development for Django applications using pytest, factory_boy, and Django REST Framework.

## When to Activate

- Writing new Django applications
- Implementing Django REST Framework APIs
- Testing Django models, views, and serializers
- Setting up testing infrastructure for Django projects

## When NOT to Use

- Other frameworks (use `laravel-tdd`, `quarkus-tdd`, `springboot-tdd`, etc.)
- Django architecture in general (use `django-patterns`)
- Django verification loop (use `django-verification`)

## Contents

| Topic | Reference |
|---|---|
| TDD cycle, pytest config, conftest | `references/tdd-setup.md` |
| Factories, model tests | `references/factories-models.md` |
| View tests, DRF serializer/API tests | `references/views-drf.md` |
| Mocking, integration tests | `references/mocking-integration.md` |

## Testing Best Practices

### DO

- **Use factories**: Instead of manual object creation
- **One assertion per test**: Keep tests focused
- **Descriptive test names**: `test_user_cannot_delete_others_post`
- **Test edge cases**: Empty inputs, None values, boundary conditions
- **Mock external services**: Don't depend on external APIs
- **Use fixtures**: Eliminate duplication
- **Test permissions**: Ensure authorization works
- **Keep tests fast**: Use `--reuse-db` and `--nomigrations`

### DON'T

- **Don't test Django internals**: Trust Django to work
- **Don't test third-party code**: Trust libraries to work
- **Don't ignore failing tests**: All tests must pass
- **Don't make tests dependent**: Tests should run in any order
- **Don't over-mock**: Mock only external dependencies
- **Don't test private methods**: Test public interface
- **Don't use production database**: Always use test database

## Coverage

### Coverage Configuration

```bash
# Run tests with coverage
pytest --cov=apps --cov-report=html --cov-report=term-missing

# Generate HTML report