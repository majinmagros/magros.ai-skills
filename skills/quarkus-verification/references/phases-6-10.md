# Phases 6–10 — Performance, Health, Container, Config, Docs

## Phase 6: Performance Testing

### Load Testing with K6

```javascript
// load-test.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = http.get('http://localhost:8080/api/markets');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

Run:
```bash
k6 run load-test.js
```

### Metrics to Monitor

- Response time (p50, p95, p99)
- Throughput (requests/sec)
- Error rate
- Memory usage
- CPU usage

## Phase 7: Health Checks

```bash
# Liveness
curl http://localhost:8080/q/health/live

# Readiness
curl http://localhost:8080/q/health/ready

# All health checks
curl http://localhost:8080/q/health

# Metrics (if enabled)
curl http://localhost:8080/q/metrics
```

Expected responses:
```json
{
  "status": "UP",
  "checks": [
    {
      "name": "Database connection",
      "status": "UP"
    }
  ]
}
```

## Phase 8: Container Image Build

```bash
# Build container image
mvn package -Dquarkus.container-image.build=true

# Or with specific registry
mvn package \
  -Dquarkus.container-image.build=true \
  -Dquarkus.container-image.registry=docker.io \
  -Dquarkus.container-image.group=myorg \
  -Dquarkus.container-image.tag=1.0.0

# Test container
docker run -p 8080:8080 myorg/my-quarkus-app:1.0.0
```

### Container Security Scan

```bash
# Trivy
trivy image myorg/my-quarkus-app:1.0.0

# Grype
grype myorg/my-quarkus-app:1.0.0
```

## Phase 9: Configuration Validation

```bash
# Check all configuration properties
mvn quarkus:info

# List all config sources
curl http://localhost:8080/q/dev/io.quarkus.quarkus-vertx-http/config
```

### Environment-Specific Checks

- [ ] Database URLs configured per environment
- [ ] Secrets externalized (Vault, env vars)
- [ ] Logging levels appropriate
- [ ] CORS origins set correctly
- [ ] Rate limiting configured
- [ ] Monitoring/tracing enabled

## Phase 10: Documentation Review

- [ ] OpenAPI/Swagger docs up to date (`/q/swagger-ui`)
- [ ] README has setup instructions
- [ ] API changes documented
- [ ] Migration guide for breaking changes
- [ ] Configuration properties documented

Generate OpenAPI spec:
```bash
curl http://localhost:8080/q/openapi -o openapi.json
```
