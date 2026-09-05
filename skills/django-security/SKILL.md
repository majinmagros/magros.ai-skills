---
name: django-security
description: "Use when django security best practices, authentication, authorization, CSRF protection, SQL injection prevention, XSS prevention, and secure deployment configurations. Only for Django — not for other frameworks. Triggers on \"django-security\", \"django security\", \"security\"."
metadata:
  origin: ECC
---

# Django Security Best Practices

Comprehensive security guidelines for Django applications to protect against common vulnerabilities.

## When to Activate

- Setting up Django authentication and authorization
- Implementing user permissions and roles
- Configuring production security settings
- Reviewing Django application for security issues
- Deploying Django applications to production

## When NOT to Use

- Other frameworks (use `laravel-security`, `quarkus-security`, `security-review`, etc.)
- Django architecture in general (use `django-patterns`)
- Django testing (use `django-tdd`)

## Contents

| Topic | Reference |
|---|---|
| Core production settings | `references/core-settings.md` |
| Authentication (user model, hashing, sessions) | `references/authentication.md` |
| Authorization (permissions, RBAC) | `references/authorization.md` |
| SQL injection, XSS | `references/sqli-xss.md` |
| CSRF, file uploads | `references/csrf-uploads.md` |
| API security, headers, secrets, logging | `references/api-ops.md` |

## Example

```python
# settings/production.py — safe defaults
DEBUG = False
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
```

## Quick Security Checklist

| Check | Description |
|-------|-------------|
| `DEBUG = False` | Never run with DEBUG in production |
| HTTPS only | Force SSL, secure cookies |
| Strong secrets | Use environment variables for SECRET_KEY |
| Password validation | Enable all password validators |
| CSRF protection | Enabled by default, don't disable |
| XSS prevention | Django auto-escapes, don't use `&#124;safe` with user input |
| SQL injection | Use ORM, never concatenate strings in queries |
| File uploads | Validate file type and size |
| Rate limiting | Throttle API endpoints |
| Security headers | CSP, X-Frame-Options, HSTS |
| Logging | Log security events |
| Updates | Keep Django and dependencies updated |

## Referências

- `references/core-settings.md` — settings de producao
- `references/authentication.md` — user model, hashing, sessoes
- `references/authorization.md` — permissoes, RBAC
- `references/sqli-xss.md` — ORM seguro, escaping
- `references/csrf-uploads.md` — CSRF, uploads
- `references/api-ops.md` — throttling, headers, secrets, logs

Remember: Security is a process, not a product. Regularly review and update your security practices.
