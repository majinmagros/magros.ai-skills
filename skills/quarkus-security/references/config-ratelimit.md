# CORS, Secrets, Rate Limiting, Headers and Audit

```properties
# application.properties
quarkus.http.cors=true
quarkus.http.cors.origins=https://app.example.com,https://admin.example.com
quarkus.http.cors.methods=GET,POST,PUT,DELETE
quarkus.http.cors.headers=accept,authorization,content-type,x-requested-with
quarkus.http.cors.exposed-headers=Content-Disposition
quarkus.http.cors.access-control-max-age=24H
quarkus.http.cors.access-control-allow-credentials=true
```

## Secrets Management

```properties
# application.properties - NO SECRETS HERE

# Use environment variables
quarkus.datasource.username=${DB_USER}
quarkus.datasource.password=${DB_PASSWORD}
quarkus.oidc.credentials.secret=${OIDC_CLIENT_SECRET}

# Or use Vault
quarkus.vault.url=https://vault.example.com
quarkus.vault.authentication.kubernetes.role=my-role
```

### HashiCorp Vault Integration

```java
@ApplicationScoped
public class SecretService {

  @ConfigProperty(name = "api-key")
  String apiKey; // Fetched from Vault

  public String getSecret(String key) {
    return ConfigProvider.getConfig().getValue(key, String.class);
  }
}
```

## Rate Limiting

**Security Note**: Never use `X-Forwarded-For` directly — clients can spoof it.
Use the actual remote address from the servlet request, or an authenticated
identity (API key, JWT subject) when available.

```java
@ApplicationScoped
public class RateLimitFilter implements ContainerRequestFilter {
  private final Map<String, RateLimiter> limiters = new ConcurrentHashMap<>();

  @Inject
  HttpServletRequest servletRequest;

  @Override
  public void filter(ContainerRequestContext requestContext) {
    String clientId = getClientIdentifier();
    RateLimiter limiter = limiters.computeIfAbsent(clientId,
        k -> RateLimiter.create(100.0)); // 100 requests per second

    if (!limiter.tryAcquire()) {
      requestContext.abortWith(
          Response.status(429)
              .entity(Map.of("error", "Too many requests"))
              .build()
      );
    }
  }

  private String getClientIdentifier() {
    // Use the container-provided remote address (not X-Forwarded-For).
    // If behind a trusted proxy, configure quarkus.http.proxy.proxy-address-forwarding=true
    // so getRemoteAddr() returns the real client IP.
    return servletRequest.getRemoteAddr();
  }
}
```

## Security Headers

```java
@Provider
public class SecurityHeadersFilter implements ContainerResponseFilter {

  @Override
  public void filter(ContainerRequestContext request, ContainerResponseContext response) {
    MultivaluedMap<String, Object> headers = response.getHeaders();

    // Prevent clickjacking
    headers.putSingle("X-Frame-Options", "DENY");

    // XSS protection
    headers.putSingle("X-Content-Type-Options", "nosniff");
    headers.putSingle("X-XSS-Protection", "1; mode=block");

    // HSTS
    headers.putSingle("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

    // CSP — avoid 'unsafe-inline' for script-src as it negates XSS protection;
    // use nonces or hashes instead. 'unsafe-inline' for style-src is acceptable
    // when CSS frameworks require it, but prefer nonces where possible.
    headers.putSingle("Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
  }
}
```

## Audit Logging

```java
@ApplicationScoped
public class AuditService {
  private static final Logger LOG = Logger.getLogger(AuditService.class);

  @Inject
  SecurityIdentity securityIdentity;

  public void logAccess(String resource, String action) {
    String user = securityIdentity.isAnonymous()
        ? "anonymous"
        : securityIdentity.getPrincipal().getName();

    LOG.infof("AUDIT: user=%s action=%s resource=%s timestamp=%s",
        user, action, resource, Instant.now());
  }
}

// Usage in resource
@Path("/api/sensitive")
public class SensitiveResource {
  @Inject
  AuditService auditService;

  @GET
  @RolesAllowed("ADMIN")
  public Response getData() {
    auditService.logAccess("sensitive-data", "READ");
    return Response.ok(data).build();
  }
}
```
