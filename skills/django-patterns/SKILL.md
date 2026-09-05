---
name: django-patterns
description: "Use when django architecture patterns, REST API design with DRF, ORM best practices, caching, signals, middleware, and production-grade Django apps. Only for Django — not for other frameworks. Triggers on \"django-patterns\", \"django patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Django Development Patterns

Production-grade Django architecture patterns for scalable, maintainable applications.

## When to Activate

- Building Django web applications
- Designing Django REST Framework APIs
- Working with Django ORM and models
- Setting up Django project structure
- Implementing caching, signals, middleware

## When NOT to Use

- Other frameworks (use `laravel-patterns`, `fastapi-patterns`, etc.)
- Django testing specifically (use `django-tdd`, `django-verification`)
- Django security review (use `django-security`)

## Contents

| Topic | Reference |
|---|---|
| Project structure, split settings | `references/project-structure.md` |
| Models, QuerySets, managers | `references/models.md` |
| DRF serializers, ViewSets, actions | `references/drf.md` |
| Service layer, caching | `references/services-caching.md` |
| Signals, middleware | `references/signals-middleware.md` |
| Performance (N+1, indexing, bulk) | `references/performance.md` |

## Quick Reference

| Pattern | Description |
|---------|-------------|
| Split settings | Separate dev/prod/test settings |
| Custom QuerySet | Reusable query methods |
| Service Layer | Business logic separation |
| ViewSet | REST API endpoints |
| Serializer validation | Request/response transformation |
| select_related | Foreign key optimization |
| prefetch_related | Many-to-many optimization |
| Cache first | Cache expensive operations |
| Signals | Event-driven actions |
| Middleware | Request/response processing |

## Example

```python
# Good: service layer + select_related (1 query, testable)
class OrderService:
    @staticmethod
    def list_recent():
        return Order.objects.select_related("customer").all()[:20]
```

## Referências

- `references/project-structure.md` — layout, split settings
- `references/models.md` — models, QuerySets, managers
- `references/drf.md` — serializers, ViewSets, actions
- `references/services-caching.md` — service layer, caching
- `references/signals-middleware.md` — signals, middleware
- `references/performance.md` — N+1, indices, bulk ops

Remember: Django provides many shortcuts, but for production applications, structure and organization matter more than concise code. Build for maintainability.
