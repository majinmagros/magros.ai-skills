# Dependency Scanning and Best Practices

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
