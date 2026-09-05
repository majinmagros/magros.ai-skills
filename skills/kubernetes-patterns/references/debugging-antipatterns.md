# Debugging and Anti-Patterns

```bash
# --- Pod status and logs ---
kubectl get pods -n my-namespace
kubectl get pods -n my-namespace -o wide          # Show node assignment
kubectl describe pod <pod-name> -n my-namespace   # Events and state details
kubectl logs <pod-name> -n my-namespace           # Current logs
kubectl logs <pod-name> -n my-namespace --previous  # Logs from crashed container
kubectl logs <pod-name> -n my-namespace -c <container>  # Multi-container pod

# --- Execute into a running container ---
kubectl exec -it <pod-name> -n my-namespace -- sh
kubectl exec -it <pod-name> -n my-namespace -- bash

# --- Check resource usage ---
kubectl top pods -n my-namespace
kubectl top nodes

# --- Deployment operations ---
kubectl rollout status deployment/my-app -n my-namespace
kubectl rollout history deployment/my-app -n my-namespace
kubectl rollout undo deployment/my-app -n my-namespace      # Rollback
kubectl rollout undo deployment/my-app --to-revision=2 -n my-namespace

# --- Scale manually ---
kubectl scale deployment my-app --replicas=5 -n my-namespace

# --- Inspect events (cluster-wide issues) ---
kubectl get events -n my-namespace --sort-by='.lastTimestamp'

# --- Port-forward for local debugging ---
kubectl port-forward pod/<pod-name> 8080:8080 -n my-namespace
kubectl port-forward svc/my-app 8080:80 -n my-namespace

# --- Dry-run to validate YAML ---
kubectl apply -f deployment.yaml --dry-run=client
kubectl apply -f deployment.yaml --dry-run=server   # Validates against live cluster
```

## Diagnosing Common Errors

```bash
# CrashLoopBackOff: container keeps crashing
kubectl logs <pod-name> --previous -n my-namespace  # Check crash logs
kubectl describe pod <pod-name> -n my-namespace     # Check exit code & OOMKilled

# ImagePullBackOff: can't pull image
kubectl describe pod <pod-name> -n my-namespace     # Check Events section
# Causes: wrong image tag, missing imagePullSecret, private registry

# Pending pod: not scheduled
kubectl describe pod <pod-name> -n my-namespace
# Causes: insufficient resources, no matching node selector, taint/toleration mismatch

# OOMKilled: out of memory
# Increase memory limits, check for memory leaks
kubectl describe pod <pod-name> -n my-namespace | grep -A5 "Last State"
```

---

## Anti-Patterns

```yaml
# BAD: Using :latest tag — non-deterministic deployments
image: myapp:latest

# GOOD: Pin to a specific immutable tag (SHA or semver)
image: ghcr.io/org/myapp:1.4.2
# or
image: ghcr.io/org/myapp@sha256:abc123...

# ---

# BAD: Running as root
securityContext: {}    # Defaults to root

# GOOD: Non-root with explicit UID
securityContext:
  runAsNonRoot: true
  runAsUser: 1001

# ---

# BAD: No resource limits — one pod can starve the entire node
containers:
  - name: app
    image: myapp:1.0.0
    # No resources defined

# GOOD: Always set requests and limits
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "256Mi"

# ---

# BAD: Storing plaintext secrets in ConfigMaps
apiVersion: v1
kind: ConfigMap
data:
  DB_PASSWORD: "mysecretpassword"   # NEVER — use Secret or external secrets manager

# ---

# BAD: ClusterAdmin for application service accounts
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
roleRef:
  kind: ClusterRole
  name: cluster-admin    # Grants god-mode to your app

# ---

# BAD: minAvailable: 0 in PDB — defeats the purpose
spec:
  minAvailable: 0

# ---

# BAD: restartPolicy: Always in a Job (causes infinite restart loop)
spec:
  restartPolicy: Always   # Use OnFailure or Never for Jobs
```

---
