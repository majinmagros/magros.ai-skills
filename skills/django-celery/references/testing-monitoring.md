# Django + Celery — Testing, monitoring e anti-patterns

## Unit Testing (No Broker)

```python
# tests/test_tasks.py
import pytest
from unittest.mock import patch, MagicMock
from apps.notifications.tasks import send_welcome_email

class TestSendWelcomeEmail:

    @pytest.mark.django_db
    def test_sends_email_to_existing_user(self, user):
        with patch('apps.notifications.services.EmailService') as mock_email:
            send_welcome_email(user.pk)
            mock_email.send_welcome.assert_called_once_with(user)

    @pytest.mark.django_db
    def test_skips_missing_user_gracefully(self):
        """Should not raise when user is deleted between enqueue and execute."""
        send_welcome_email(99999)  # Non-existent user — must not raise
```

## Integration Testing with CELERY_TASK_ALWAYS_EAGER

```python
# config/settings/test.py
CELERY_TASK_ALWAYS_EAGER = True      # Run tasks synchronously in tests
CELERY_TASK_EAGER_PROPAGATES = True  # Re-raise exceptions from tasks

# tests/test_integration.py
@pytest.mark.django_db
def test_registration_triggers_welcome_email(client):
    with patch('apps.notifications.services.EmailService') as mock_email:
        response = client.post('/api/users/', {
            'email': 'new@example.com',
            'password': 'strongpass123',
        })

    assert response.status_code == 201
    mock_email.send_welcome.assert_called_once()
```

## Testing Retries

```python
@pytest.mark.django_db
def test_task_retries_on_connection_error():
    with patch('apps.crm.services.CRMClient.sync') as mock_sync:
        mock_sync.side_effect = ConnectionError('timeout')

        with pytest.raises(ConnectionError):
            sync_contact_to_crm.apply(args=[1], throw=True)

        assert mock_sync.call_count == 1  # First attempt only when eager
```

## Monitoring

```bash
# Inspect active workers and queues
celery -A config inspect active
celery -A config inspect stats
celery -A config inspect reserved

# Check queue lengths (Redis)
redis-cli llen celery

# Flower: web-based real-time monitor
pip install flower
celery -A config flower --port=5555
```

## Anti-Patterns

```python
# BAD: Passing model instances — they may be stale by execution time
send_welcome_email.delay(user)        # Never pass ORM objects
send_welcome_email.delay(user.pk)     # Always pass PKs

# BAD: Calling tasks synchronously in production views
result = generate_report.apply()      # Blocks the request thread

# BAD: Non-idempotent task without guards
@shared_task
def charge_and_fulfill(order_id):
    order.charge()     # May charge twice if task retries!
    order.fulfill()

# GOOD: Idempotent with status guard
@shared_task
def charge_and_fulfill(order_id):
    order = Order.objects.select_for_update().get(pk=order_id)
    if order.status != Order.Status.PENDING:
        return  # Already processed
    order.charge()
    order.fulfill()
```
