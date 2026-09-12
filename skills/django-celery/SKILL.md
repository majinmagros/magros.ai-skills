---
name: django-celery
description: Django + Celery async task patterns — configuration, task design, beat scheduling, retries, canvas workflows, monitoring, and testing. Use when adding background jobs, scheduled tasks, or async processing to a Django app.
metadata:
  origin: ECC
---

# Django + Celery Async Task Patterns

Background tasks with Celery + Redis/RabbitMQ: idempotent tasks, retries with backoff, beat scheduling, canvas workflows, dead-letter queue. Detalhes em `references/`.

## When to Activate

- Adding background jobs or async processing to a Django app
- Implementing periodic/scheduled tasks
- Offloading slow operations (email, PDF generation, API calls) from request cycle
- Setting up Celery Beat for cron-like scheduling
- Debugging task failures, retries, or queue backlogs
- Writing tests for Celery tasks

## Core Rules

Pass PKs, never ORM objects. Tasks idempotent with status guards. `ACKS_LATE` + prefetch 1. Beat on a single node only.

```python
@shared_task(name='notifications.send_welcome_email')
def send_welcome_email(user_id: int) -> None:
    from apps.users.models import User
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return  # idempotent: nothing to do
    EmailService.send_welcome(user)
```

## References

- `references/setup.md` — install, `celery.py`, settings, worker commands
- `references/task-design.md` — basic/retryable/idempotent tasks, soft limits, calling
- `references/beat-canvas.md` — beat schedules, chain/group/chord, dead-letter queue
- `references/testing-monitoring.md` — eager tests, retry tests, Flower, anti-patterns

## Production Checklist

- [ ] `ACKS_LATE`, prefetch 1, soft + hard time limits set
- [ ] Separate queues per priority (`-Q default,high_priority`)
- [ ] Beat on single node; worker supervised (systemd/supervisord)
- [ ] `task_failure` → Sentry; Flower for queue visibility
- [ ] Tests: eager mode + missing-object + retry cases

## Related Skills

- `django-patterns` — ORM, service layer, and project structure
- `django-tdd` — Testing Django models, views, and services
- `python-testing` — pytest configuration and fixtures
