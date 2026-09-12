---
name: laravel-tdd
description: "Use when laravel testing strategies with PHPUnit, Pest, model factories, HTTP tests, Sanctum authentication testing, mocking, and coverage. Only for Laravel — not for other frameworks. Triggers on \"laravel-tdd\", \"laravel tdd\"."
metadata:
  origin: ECC
---

# Laravel Testing with TDD

Test-driven development for Laravel applications using PHPUnit, Pest, Laravel factories, and testing helpers.

## When to Activate

- Writing new Laravel applications or features
- Implementing API endpoints with Sanctum or Passport authentication
- Testing Eloquent models, relationships, scopes, and accessors
- Setting up testing infrastructure for Laravel projects
- Writing feature tests for HTTP controllers and form requests
- Mocking external services (queues, mail, notifications, HTTP)

## When NOT to Use

- Other frameworks (use `django-tdd`, `quarkus-tdd`, `springboot-tdd`, etc.)
- Laravel architecture in general (use `laravel-patterns`)
- Laravel verification loop (use `laravel-verification`)

## Contents

| Topic | Reference |
|---|---|
| TDD cycle, PHPUnit config, TestCase | `references/tdd-setup.md` |
| Factories, model tests | `references/factories-models.md` |
| Feature/HTTP, JSON API, Sanctum | `references/http-api.md` |
| Mocking and fakes | `references/mocking.md` |
| Authorization, Pest tests | `references/auth-pest.md` |

## Coverage

```bash
# PHPUnit (use clover output for CI threshold checks)
vendor/bin/phpunit --coverage-html coverage --coverage-clover clover.xml

# Pest (built-in threshold support)
vendor/bin/pest --coverage --min=80
```

### Coverage Goals

| Component | Target |
|-----------|--------|
| Models | 95%+ |
| Actions/Services | 90%+ |
| Form Requests | 90%+ |
| Controllers | 85%+ |
| Policies | 95%+ |
| Overall | 80%+ |

## Testing Best Practices

### DO

- Use factories over manual `create()` calls
- One logical assertion per test
- Descriptive names: `test_guests_cannot_create_products`
- Test edge cases and authorization boundaries