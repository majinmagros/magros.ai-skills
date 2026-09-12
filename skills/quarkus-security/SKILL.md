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