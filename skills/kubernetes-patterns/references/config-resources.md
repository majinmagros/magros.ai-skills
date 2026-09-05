# ConfigMaps, Secrets and Resources

## ConfigMap — Non-sensitive configuration

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-app-config
  namespace: my-namespace
data:
  LOG_LEVEL: "info"
  APP_ENV: "production"
  MAX_CONNECTIONS: "100"
  # Mount as a file for complex config
  app.yaml: |
    server:
      port: 8080
      timeout: 30s
```

```yaml
# Mount ConfigMap as a file
volumes:
  - name: config
    configMap:
      name: my-app-config
      items:
        - key: app.yaml
          path: app.yaml
volumeMounts:
  - name: config
    mountPath: /etc/app
    readOnly: true
```

## Secrets — Sensitive data

```bash
# Create secret from literal (CLI, then store in Vault/SOPS)
kubectl create secret generic my-app-secrets \
  --from-literal=db-password='s3cr3t' \
  --namespace=my-namespace \
  --dry-run=client -o yaml | kubectl apply -f -
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-app-secrets
  namespace: my-namespace
type: Opaque
# Values are base64-encoded (NOT encrypted — use Sealed Secrets or ESO for real encryption)
data:
  db-password: czNjcjN0  # base64 of 's3cr3t'
```

> **Important:** Raw Kubernetes Secrets are only base64-encoded, not encrypted at rest unless your cluster has encryption configured. Use [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) or [External Secrets Operator](https://external-secrets.io) for production.

---

## Resource Requests and Limits

```yaml
resources:
  requests:       # Scheduler uses this to place the pod
    cpu: "100m"   # 100 millicores = 0.1 CPU
    memory: "128Mi"
  limits:         # Container is killed/throttled above this
    cpu: "500m"
    memory: "256Mi"
```

**Rules of thumb:**

| Workload Type | CPU Request | Memory Request | Notes |
|---------------|-------------|----------------|-------|
| Web API | 100–250m | 128–256Mi | Set limits 2-4x requests |
| Worker/consumer | 250–500m | 256–512Mi | Memory limit = request for predictability |
| JVM app | 500m–1 | 512Mi–2Gi | Allow headroom above `-Xmx` for JVM overhead |
| Sidecar | 10–50m | 32–64Mi | Keep minimal |

```yaml
# WRONG: No requests or limits — unpredictable scheduling, OOM evictions
containers:
  - name: app
    image: myapp:latest
    # Missing resources: {} — this is dangerous in production

# WRONG: Limits without requests — requests default to limits, over-reserves capacity
resources:
  limits:
    cpu: "2"
    memory: "1Gi"
  # requests missing — will default to limits values
```

---
