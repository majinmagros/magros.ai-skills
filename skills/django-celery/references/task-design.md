# Django + Celery — Task design e chamadas

## Basic Task

```python
# apps/notifications/tasks.py
from celery import shared_task
import logging

logger = logging.getLogger(__name__)

@shared_task(name='notifications.send_welcome_email')
def send_welcome_email(user_id: int) -> None:
    """Send welcome email to newly registered user."""
    from apps.users.models import User
    from apps.notifications.services import EmailService

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        logger.warning('send_welcome_email: user %s not found', user_id)
        return  # Idempotent — do not raise, task already impossible to complete

    EmailService.send_welcome(user)
    logger.info('Welcome email sent to user %s', user_id)
```

## Retryable Task

```python
@shared_task(
    bind=True,
    name='integrations.sync_to_crm',
    max_retries=5,
    default_retry_delay=60,       # seconds before first retry
    autoretry_for=(ConnectionError, TimeoutError),
    retry_backoff=True,           # exponential backoff
    retry_backoff_max=600,        # cap at 10 minutes
    retry_jitter=True,            # randomise to avoid thundering herd
)
def sync_contact_to_crm(self, contact_id: int) -> dict:
    """Sync contact to external CRM with retry on transient failures."""
    from apps.crm.services import CRMClient

    try:
        result = CRMClient().sync(contact_id)
        return result
    except CRMClient.RateLimitError as exc:
        # Specific retry delay from response header
        raise self.retry(exc=exc, countdown=int(exc.retry_after))
```

## Idempotent Task Pattern

Design tasks so they can safely run multiple times with the same inputs:

```python
@shared_task(name='orders.mark_shipped')
def mark_order_shipped(order_id: int, tracking_number: str) -> None:
    """Mark order as shipped — safe to run multiple times."""
    from apps.orders.models import Order

    updated = Order.objects.filter(
        pk=order_id,
        status=Order.Status.PROCESSING,    # Guard: only update if not already shipped
    ).update(
        status=Order.Status.SHIPPED,
        tracking_number=tracking_number,
    )

    if not updated:
        logger.info('mark_order_shipped: order %s already shipped or not found', order_id)
```

## Task with Soft Time Limit

```python
from celery.exceptions import SoftTimeLimitExceeded

@shared_task(
    bind=True,
    name='reports.generate_pdf',
    soft_time_limit=120,
    time_limit=150,
)
def generate_pdf_report(self, report_id: int) -> str:
    """Generate PDF report with graceful timeout handling."""
    from apps.reports.services import PDFGenerator

    try:
        path = PDFGenerator.build(report_id)
        return path
    except SoftTimeLimitExceeded:
        # Clean up partial files before hard kill
        PDFGenerator.cleanup(report_id)
        raise
```

## Calling Tasks

```python
from datetime import timedelta
from django.utils import timezone

# Fire and forget (async)
send_welcome_email.delay(user.pk)

# Schedule in the future
send_reminder.apply_async(args=[user.pk], countdown=3600)  # 1 hour from now
send_reminder.apply_async(args=[user.pk], eta=timezone.now() + timedelta(days=1))

# Apply with queue routing
sync_contact_to_crm.apply_async(args=[contact.pk], queue='high_priority')

# Run synchronously (tests / debugging only)
result = generate_pdf_report.apply(args=[report.pk])
```
