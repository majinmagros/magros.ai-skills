---
name: quarkus-security
description: "Use when quarkus Security best practices for authentication, authorization, JWT/OIDC, RBAC, input validation, CSRF, secrets management, and dependency security. Only for Quarkus — not for other stacks. Triggers on \"quarkus-security\", \"quarkus security\", \"security\"."
metadata:
  origin: ECC
---

# Quarkus Security Review

Best practices for securing Quarkus applications with authentication, authorization, and input validation.

## When to Activate

- Adding authentication (JWT, OIDC, Basic Auth)
- Implementing authorization with @RolesAllowed or SecurityIdentity
- Validating user input (Bean Validation, custom validators)
- Configuring CORS or security headers
- Managing secrets (Vault, environment variables, config sources)
- Adding rate limiting or brute-force protection
- Scanning dependencies for CVEs
- Working with MicroProfile JWT or SmallRye JWT

## When NOT to Use

- Other stacks (use `springboot-security`, `django-security`, `security-review`, etc.)
- Quarkus patterns in general (use `quarkus-patterns`)
- Quarkus verification loop (use `quarkus-verification`)

## Contents

| Topic | Reference |
|---|---|
| JWT/OIDC, filters, RBAC | `references/auth.md` |
| Bean Validation, SQLi | `references/validation-sqli.md` |
| CORS, Vault, rate limiting, headers, audit | `references/config-ratelimit.md` |
| Dependency scanning, best practices | `references/deps-best.md` |

## Example

```java
@ApplicationScoped
public class PasswordService {

  public String hash(String plainPassword) {
    return BcryptUtil.bcryptHash(plainPassword);
  }

  public boolean verify(String plainPassword, String hashedPassword) {
    return BcryptUtil.matches(plainPassword, hashedPassword);
  }
}

// In service
@ApplicationScoped
public class UserService {
  @Inject
  PasswordService passwordService;

  @Transactional
  public User register(CreateUserDto dto) {
    String hashedPassword = passwordService.hash(dto.password());
    User user = new User();
    user.email = dto.email();
    user.password = hashedPassword;
    user.persist();
    return user;
  }

  public boolean authenticate(String email, String password) {
    return User.find("email", email)
        .firstResultOptional()
        .map(u -> passwordService.verify(password, u.password))
        .orElse(false);
  }
}
```

## Dependency Security Scanning

```bash
# Maven
mvn org.owasp:dependency-check-maven:check

# Gradle
./gradlew dependencyCheckAnalyze

# Check Quarkus extensions
quarkus extension list --installable
```

## Best Practices

- Always use HTTPS in production
- Enable JWT or OIDC for stateless authentication
- Use `@RolesAllowed` for declarative authorization
- Validate all input with Bean Validation
- Hash passwords with BCrypt (never plaintext)
- Store secrets in Vault or environment variables
- Use parameterized queries to prevent SQL injection
- Add security headers to all responses
- Implement rate limiting for public endpoints
- Audit sensitive operations
- Keep dependencies updated and scan for CVEs
- Use SecurityIdentity for programmatic checks
- Set appropriate CORS policies
- Test authentication and authorization paths

## Referências

- `references/auth.md` — JWT/OIDC, filtros, RBAC
- `references/validation-sqli.md` — Bean Validation, SQLi
- `references/config-ratelimit.md` — CORS, Vault, rate limiting, headers, audit
- `references/deps-best.md` — scanning, best practices

**Remember**: Never trust the network. Authenticate everything, authorize every action, and hash every password — Quarkus gives you the tools, this skill tells you where they go.
