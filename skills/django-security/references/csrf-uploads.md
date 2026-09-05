# CSRF Protection and File Upload Security

## Default CSRF Protection

```python
# settings.py - CSRF is enabled by default
CSRF_COOKIE_SECURE = True  # Only send over HTTPS
CSRF_COOKIE_HTTPONLY = True  # Prevent JavaScript access
CSRF_COOKIE_SAMESITE = 'Lax'  # Prevent CSRF in some cases
CSRF_TRUSTED_ORIGINS = ['https://example.com']  # Trusted domains

# Template usage
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Submit</button>
</form>

# AJAX requests
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

fetch('/api/endpoint/', {
    method: 'POST',
    headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
});
```

## Exempting Views (Use Carefully)

```python
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt  # Only use when absolutely necessary!
def webhook_view(request):
    # Webhook from external service
    pass
```

## File Upload Security

## File Validation

```python
import os
import magic  # pip install python-magic
from django.core.exceptions import ValidationError

ALLOWED_MIMES = {
    'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
}

MIME_TO_EXTENSIONS = {
    'image/jpeg': {'.jpg', '.jpeg'},
    'image/png': {'.png'},
    'image/gif': {'.gif'},
    'application/pdf': {'.pdf'},
}

def validate_file_type(value):
    """Validate file type using magic bytes and cross-check extension."""
    mime = magic.from_buffer(value.read(2048), mime=True)
    value.seek(0)

    if mime not in ALLOWED_MIMES:
        raise ValidationError('Unsupported file type.')

    ext = os.path.splitext(value.name)[1].lower()
    if ext not in MIME_TO_EXTENSIONS.get(mime, set()):
        raise ValidationError('File extension does not match file content.')

def validate_file_size(value):
    """Validate file size (max 5MB)."""
    if value.size > 5 * 1024 * 1024:
        raise ValidationError('File too large. Max size is 5MB.')

# models.py
class Document(models.Model):
    file = models.FileField(
        upload_to='documents/',
        validators=[validate_file_type, validate_file_size]
    )

```

For environments where installing libmagic is difficult (e.g., minimal containers),
use the pure-Python `filetype` package as an alternative:

```python
import os
from django.core.exceptions import ValidationError

import filetype  # pip install filetype

ALLOWED_MIMES = {
    'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
}

MIME_TO_EXTENSIONS = {
    'image/jpeg': {'.jpg', '.jpeg'},
    'image/png': {'.png'},
    'image/gif': {'.gif'},
    'application/pdf': {'.pdf'},
}

def validate_file_type(value):
    """Validate file type using magic bytes."""
    kind = filetype.guess(value.read(2048))
    value.seek(0)

    if kind is None or kind.mime not in ALLOWED_MIMES:
        raise ValidationError('Unsupported file type.')

    ext = os.path.splitext(value.name)[1].lower()
    if ext not in MIME_TO_EXTENSIONS.get(kind.mime, set()):
        raise ValidationError('File extension does not match file content.')
```

## Secure File Storage

```python
# settings.py
MEDIA_ROOT = '/var/www/media/'
MEDIA_URL = '/media/'

# Use a separate domain for media in production
MEDIA_DOMAIN = 'https://media.example.com'

# Don't serve user uploads directly
# Use whitenoise or a CDN for static files
# Use a separate server or S3 for media files
```
