---
name: springboot-security
description: "Use when spring Security best practices for authn/authz, validation, CSRF, secrets, headers, rate limiting, and dependency security in Java Spring Boot services. Triggers on \"springboot-security\", \"springboot security\", \"security\"."
metadata:
  origin: ECC
---

# Spring Boot Security Review

Deny by default: validate inputs, least privilege, secure-by-configuration. Detalhes em `references/`.

## When to Activate

- Adding authentication (JWT, OAuth2, session-based)
- Implementing authorization (@PreAuthorize, role-based access)
- Validating user input (Bean Validation, custom validators)
- Configuring CORS, CSRF, or security headers
- Managing secrets (Vault, environment variables)
- Adding rate limiting or scanning dependencies for CVEs

## Core Principles

1. **Deny by default** — expose only required scopes; guards on every sensitive path
2. **Stateless auth, hashed secrets** — Bearer JWT + BCrypt/Argon2, never plaintext
3. **Validate at the boundary** — `@Valid` DTOs, parameterized queries, no concatenation
4. **Externalize secrets** — env/Vault placeholders; nothing committed
5. **Defense in depth** — headers, CORS allowlist, rate limits, scanned dependencies

## Example

```java
public record CreateUserDto(
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Email String email
) {}

@PostMapping("/users")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserDto dto) {
  return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(dto));
}
```

## References

- `references/auth.md` — JWT filter, @PreAuthorize, BCrypt password encoding
- `references/input-data.md` — Bean Validation, SQL injection, uploads, PII logging
- `references/http-defense.md` — CSRF, secrets, headers, CORS, Bucket4j limits, CVEs

## Checklist

- [ ] Tokens validated and expired; authorization on every sensitive path
- [ ] All inputs validated; no string-concatenated SQL
- [ ] CSRF posture correct for app type; secrets externalized
- [ ] Security headers + restrictive CORS configured; APIs rate-limited
- [ ] Dependencies scanned; logs free of secrets and PII
