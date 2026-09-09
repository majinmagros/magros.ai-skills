---
name: laravel-security
description: "Use when laravel security best practices — authentication, authorization, Eloquent safety, CSRF, XSS prevention, API security, and secure deployment configurations. Only for Laravel — not for other frameworks. Triggers on \"laravel-security\", \"laravel security\", \"security\"."
metadata:
  origin: ECC
---

# Laravel Security Best Practices

Comprehensive security guidelines for Laravel applications. Code by area in `references/`.

## When to Activate

- Setting up Laravel authentication and authorization (Sanctum, Passport, Jetstream, Breeze)
- Implementing user roles, permissions, and policies
- Configuring production security settings and environment variables
- Reviewing Laravel applications for security vulnerabilities
- Deploying Laravel applications to production
- Writing secure Eloquent queries and migrations

## Areas (código em `references/`)

- **Auth** (`authentication.md`): Sanctum abilities + expiration; Argon2id/bcrypt + `Password::min(12)->uncompromised()`; session regenerate on login, invalidate on logout; suspicious-login notify + login throttling
- **Authorization** (`authorization.md`): Gates + `Gate::before` super-admin; Policies (viewAny→forceDelete) + `@can/@cannot`; `can:` middleware + `CheckRole`
- **Eloquent** (`eloquent.md`): `$fillable` whitelist (never `role`/`is_admin`; never `$request->all()` or `$guarded = []`); parameterized queries only (no `orderByRaw($input)`); casts (`hashed`, `encrypted:array`); `$hidden` secrets
- **Web** (`web.md`): `@csrf` everywhere (+ meta token for Axios/fetch; exclude only signed webhooks like `stripe/*`); Blade `{{ }}` + `@js/@json` (never `{!! $userInput !!}` or raw `json_encode`); HTMLPurifier whitelist; CSP + security headers middleware; FormRequest rules + post-validation sanitize; custom rules (StrongPassword, NotBlacklistedDomain)
- **API + Uploads** (`api-uploads.md`): `throttle:api/auth/uploads` limiters; Sanctum scoped abilities vs Passport OAuth2; CORS whitelist (never `*` in prod); upload MIME allowlist + dimensions + `extensions:` rule; store outside public + signed URLs + S3 SSE
- **Ops** (`ops.md`): `APP_DEBUG=false` + `APP_KEY` boot check; `.env` never committed + boot validation; HTTPS force + trusted proxy ranges; `composer audit` in CI + lockfile committed; secrets via manager; `ShouldBeEncrypted` jobs + retry/middleware limits; `security` log channel + `SecurityLogger` helper

```php
// Regras de ouro (memorize):
User::create($request->validated());   // nunca $request->all()
$request->session()->regenerate();     // sempre no login
{{ $x }}                               // nunca {!! $userInput !!}
```

## Quick Security Checklist

| Check | Description |
|-------|-------------|
| `APP_DEBUG=false` | Never run with debug enabled in production |
| `APP_KEY` set | Always run `php artisan key:generate` |
| HTTPS enforced | Force HTTPS in production via middleware or proxy |
| `$fillable` whitelisted | Never use `$guarded = []` |
| CSRF active | `@csrf` on all state-changing forms |
| Sanctum/Passport configured | API authentication with token abilities/scopes |
| Rate limiting applied | Throttle API and auth endpoints |
| Input validation | FormRequest with specific rules, never `$request->all()` |
| File upload restrictions | Validate MIME types, size, dimensions |
| `composer audit` in CI | Check dependencies for known vulnerabilities |
| `password_hash` / `password_verify` | Use Laravel's built-in hashing (bcrypt/Argon2) |
| Session regeneration on login | Call `$request->session()->regenerate()` |
| Security headers middleware | CSP, X-Frame-Options, X-Content-Type-Options |
| Logged security events | Audit log for auth failures, role changes, suspicious activity |
| `.env` not committed | Verify `.gitignore` includes `.env` |

## Related Skills

- `laravel-patterns` — Laravel architecture, routing, Eloquent, and API patterns
- `backend-patterns` — General backend API and database patterns
- `laravel-tdd` — Laravel testing with PHPUnit and Pest
