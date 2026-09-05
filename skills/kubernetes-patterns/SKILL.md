---
name: kubernetes-patterns
description: "Use when kubernetes workload patterns, resource management, RBAC, probes, autoscaling, ConfigMap/Secret handling, and kubectl debugging for production-grade deployments. Only for Kubernetes — not for Docker Compose or other orchestrators. Triggers on \"kubernetes-patterns\", \"kubernetes patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Kubernetes Patterns

Production-grade Kubernetes patterns for deploying, managing, and debugging workloads reliably.

## When to Activate

- Writing Kubernetes manifests (Deployments, Services, Ingress, Jobs)
- Configuring resource requests/limits, liveness/readiness probes
- Setting up RBAC, namespaces, or ServiceAccounts
- Managing configuration and secrets in K8s
- Debugging CrashLoopBackOff, OOMKilled, pending pods, or image pull errors
- Configuring HPA (Horizontal Pod Autoscaler) or PodDisruptionBudgets
- Reviewing K8s YAML for security or correctness

## When to Use

> Same as **When to Activate** above. This alias satisfies repo skill-format conventions. Use this skill any time you are writing, reviewing, or debugging Kubernetes YAML and workloads.

## When NOT to Use

- Plain Docker/Compose (use `docker-patterns`)
- CI/CD pipelines (use `deployment-patterns`)
- App-level security review (use `security-review`)

## How It Works

This skill provides **copy-pasteable, production-grade YAML patterns** and **kubectl debugging commands** organized by task:

1. **Deployment template** — A fully configured production `Deployment` with security context, rolling update strategy, all three probe types, resource limits, and environment injection from ConfigMap/Secret.
2. **Probes** — Decision table for startup vs liveness vs readiness, with correct `failureThreshold × periodSeconds` math.
3. **Services & Ingress** — ClusterIP, LoadBalancer, and TLS Ingress patterns with cert-manager annotations.
4. **ConfigMaps & Secrets** — `envFrom`, file-mount, and external secrets guidance.
5. **Resource management** — Requests vs limits rules of thumb by workload type (web API, JVM, worker, sidecar).
6. **RBAC** — Least-privilege ServiceAccount → Role → RoleBinding chain.
7. **HPA & PDB** — Autoscaling and node-drain safety configurations.
8. **Jobs & CronJobs** — One-off and scheduled workload patterns with correct `restartPolicy`.
9. **kubectl cheatsheet** — Logs, exec, rollback, port-forward, dry-run, and common error diagnosis commands.
10. **Anti-patterns & checklist** — What NOT to do, and a security/reliability/observability checklist.

## Examples

| Task | Jump to |
|------|---------|
| Full production Deployment YAML | `references/workloads.md` |
| Probe configuration | `references/probes-services.md` |
| RBAC least-privilege setup | `references/rbac-autoscaling.md` |
| Debug a CrashLoopBackOff | `references/debugging-antipatterns.md` |
| Autoscaling | `references/rbac-autoscaling.md` |

## Example

```yaml
# The 3 probes, correctly combined
startupProbe:
  httpGet: { path: /ready, port: 8080 }
  failureThreshold: 30
  periodSeconds: 2
livenessProbe:
  httpGet: { path: /health, port: 8080 }
  periodSeconds: 10
readinessProbe:
  httpGet: { path: /ready, port: 8080 }
  periodSeconds: 5
```

## Best Practices Checklist

### Security
- [ ] Container runs as non-root (`runAsNonRoot: true`, `runAsUser` set)
- [ ] `readOnlyRootFilesystem: true` with `emptyDir` for writable paths
- [ ] `allowPrivilegeEscalation: false`
- [ ] All capabilities dropped (`capabilities.drop: [ALL]`)
- [ ] Dedicated ServiceAccount per app, not `default`
- [ ] `automountServiceAccountToken: false` unless needed
- [ ] RBAC follows least privilege (use `Role`, not `ClusterRole` unless needed)
- [ ] Secrets managed via Sealed Secrets or External Secrets Operator

### Reliability
- [ ] All 3 probe types configured (startup + liveness + readiness)
- [ ] Resource requests AND limits set on every container
- [ ] `minReplicas: 2+` for any production workload
- [ ] PodDisruptionBudget defined for stateful or critical services
- [ ] `RollingUpdate` strategy with `maxUnavailable: 0`
- [ ] HPA configured for variable-load services

### Observability
- [ ] App exposes `/health` (liveness) and `/ready` (readiness) endpoints
- [ ] Structured JSON logging (no PII in logs)
- [ ] Resource labels: `app`, `version`, `environment`

---

## Related Skills

- `docker-patterns` — Multi-stage Dockerfiles and image security
- `deployment-patterns` — CI/CD pipelines, rollback strategy, health check endpoints
- `security-review` — Broader security hardening context
- `git-workflow` — GitOps integration with K8s (ArgoCD / Flux patterns)

## Referências

- `references/workloads.md` — Deployment de producao
- `references/probes-services.md` — probes, Services, Ingress
- `references/config-resources.md` — ConfigMaps, Secrets, resources
- `references/rbac-autoscaling.md` — RBAC, HPA, PDB
- `references/multitenancy-jobs.md` — namespaces, Jobs, CronJobs
- `references/debugging-antipatterns.md` — cheatsheet, erros, anti-patterns
