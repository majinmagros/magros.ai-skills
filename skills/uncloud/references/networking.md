# External Devices, Service DNS, Scaling, Image Tags

## Routing to External (Non-Cluster) Devices

To expose an external device (e.g. BMC, NAS, router UI) via Caddy without running a real container:

**1. Create a Caddyfile snippet** (e.g. `~/device.caddyfile`):

```caddyfile
https://device.example.com {
    reverse_proxy https://192.168.1.x {
        transport http {
            tls_insecure_skip_verify   # needed for self-signed BMC certs
        }
    }
    log
}
```

For plaintext upstream: `reverse_proxy http://192.168.1.x:port`

**2. Register as a named service with no-op container:**

```bash
uc service run \
  --name device-bmc \
  --caddyfile ~/device.caddyfile \
  registry.k8s.io/pause:3.9
```

`pause` is a minimal no-op container — it does nothing, but gives Uncloud a service entry to attach the Caddyfile to.

**3. Verify:**

```bash
uc caddy config   # device.example.com block should appear
```

> `--caddyfile` cannot be combined with non-`@host` published ports.

**DNS tip:** A wildcard record (`*.yourdomain.com → cluster-public-ip`) means any new subdomain works immediately — no DNS change needed per service.

## Service DNS (Internal)

Services inside the cluster resolve each other by name:

| DNS name | Resolves to |
|----------|------------|
| `service-name` | Any healthy container |
| `service-name.internal` | Same |
| `rr.service-name.internal` | Round-robin |
| `nearest.service-name.internal` | Machine-local first |

## Scaling & Global Services

```bash
uc scale web 5    # 5 replicas (spread across machines)
uc scale web 1    # Scale down
```

```yaml
services:
  caddy:
    deploy:
      mode: global   # One container on every machine
```

## Image Tag Templates (in compose.yaml)

```yaml
image: myapp:{{gitdate "20060102"}}.{{gitsha 7}}
image: myapp:{{gitsha 7}}.${GITHUB_RUN_ID:-local}
```

| Function | Output |
|----------|--------|
| `{{gitsha N}}` | First N chars of commit SHA |
| `{{gitdate "format"}}` | Git commit date in Go format |
| `{{date "format"}}` | Current date |
