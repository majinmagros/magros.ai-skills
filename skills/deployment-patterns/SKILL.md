---
name: deployment-patterns
description: "Use when deployment workflows, CI/CD pipeline patterns, Docker containerization, health checks, rollback strategies, and production readiness checklists for web applications. Triggers on \"deployment-patterns\", \"deployment patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Deployment Patterns

Production deployment workflows and CI/CD best practices. Detalhes em `references/`.

## When to Activate

- Setting up CI/CD pipelines
- Dockerizing an application
- Planning deployment strategy (blue-green, canary, rolling)
- Implementing health checks and readiness probes
- Preparing for a production release
- Configuring environment-specific settings

## Strategy Chooser

| Strategy | Rollout | Rollback | Use when |
|---|---|---|---|
| Rolling (default) | Gradual, 2 versions live | Redeploy previous | Standard, backward-compatible changes |
| Blue-green | Atomic traffic switch | Instant switch-back | Critical services, zero-tolerance |
| Canary | 5% → 50% → 100% traffic | Stop canary | High-traffic, risky changes |

## Example

```typescript
// Minimal health check every service needs
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
```

```bash
# Instant rollback (K8s)
kubectl rollout undo deployment/app
```

## References

- `references/strategies.md` — rolling, blue-green, canary (pros/cons/when)
- `references/docker.md` — multi-stage Dockerfiles (Node/Go/Python) + best practices
- `references/cicd-health.md` — GitHub Actions pipeline, stages, health endpoint, K8s probes
- `references/release-ops.md` — twelve-factor env, rollback, full production readiness checklist

## Checklist

- [ ] Strategy fits risk (rolling default, blue-green critical, canary risky)
- [ ] Multi-stage image, pinned tags, non-root user, HEALTHCHECK
- [ ] Pipeline: lint → typecheck → tests → image → staging → smoke → prod
- [ ] `/health` + K8s probes (liveness/readiness/startup)
- [ ] Env via secrets manager, validated at startup (fail fast)
- [ ] Rollback tested in staging; migrations backward-compatible
