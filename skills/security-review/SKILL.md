---
name: security-review
description: "Use when adding authentication, handling user input, working with secrets, creating API endpoints, or implementing payment/sensitive features. Manual checklist for stack-agnostic reviews. Only for manual review — not for automated SaaS scanning. Triggers on \"security-review\", \"security review\", \"review\"."
metadata:
  origin: ECC
---

# Security Review Skill

This skill ensures all code follows security best practices and identifies potential vulnerabilities.

## When to Activate

- Implementing authentication or authorization
- Handling user input or file uploads
- Creating new API endpoints
- Working with secrets or credentials
- Implementing payment features
- Storing or transmitting sensitive data
- Integrating third-party APIs

## When NOT to Use

- Automated SaaS scanning (use `vibe-security-scanner`)
- Stack-specific review (use `django-security`, `laravel-security`, `perl-security`, etc.)
- Pre-AI-generated code audit with scanners (use `security-scan`)

## Contents

| Topic | Reference |
|---|---|
| Secrets management, input validation | `references/secrets-input.md` |
| SQL injection, auth, authorization | `references/sql-auth.md` |
| XSS, CSRF, rate limiting | `references/xss-csrf-ratelimit.md` |
| Data exposure, blockchain, dependencies | `references/data-blockchain-deps.md` |
| Security testing, pre-deployment | `references/testing-predeploy.md` |

## Example

```typescript
// Test authentication
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

// Test input validation
test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})
```

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/security)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [Web Security Academy](https://portswigger.net/web-security)

---

**Remember**: Security is not optional. One vulnerability can compromise the entire platform. When in doubt, err on the side of caution.
