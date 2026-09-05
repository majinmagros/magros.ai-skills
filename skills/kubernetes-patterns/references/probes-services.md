# Probes, Services and Ingress

Understanding when to use each probe is critical:

| Probe | Failure Action | Use For |
|-------|---------------|---------|
| `startupProbe` | Kills container if slow to start | Slow-starting apps (JVM, Python) |
| `livenessProbe` | Restarts container | Deadlock / hung process detection |
| `readinessProbe` | Removes from Service endpoints | Temporary unavailability (DB reconnect) |

```yaml
# Correct pattern: startupProbe covers slow startup,
# then liveness/readiness take over
startupProbe:
  httpGet:
    path: /health
    port: 8080
  failureThreshold: 30  # 30 * 5s = 150s max startup time
  periodSeconds: 5

livenessProbe:
  httpGet:
    path: /health
    port: 8080
  periodSeconds: 30
  failureThreshold: 3   # 3 * 30s = 90s before restart

readinessProbe:
  httpGet:
    path: /ready         # Separate endpoint: checks DB, cache, etc.
    port: 8080
  periodSeconds: 10
  failureThreshold: 2
```

```yaml
# WRONG: initialDelaySeconds without startupProbe
# If the app takes 60s to start, set a startupProbe instead
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 60   # BAD: Arbitrary wait, race condition
```

---

## Services and Ingress

## Service Types

```yaml
# ClusterIP (default) — internal-only
apiVersion: v1
kind: Service
metadata:
  name: my-app
  namespace: my-namespace
spec:
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
      protocol: TCP
  type: ClusterIP
```

```yaml
# LoadBalancer — external traffic (cloud providers)
spec:
  type: LoadBalancer
  ports:
    - port: 443
      targetPort: 8080
```

## Ingress with TLS

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app
  namespace: my-namespace
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - myapp.example.com
      secretName: my-app-tls
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-app
                port:
                  number: 80
```

---
