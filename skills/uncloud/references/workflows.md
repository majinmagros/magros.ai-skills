# Common Workflows and Mistakes

## Common Workflows

**Deploy from source:**
```bash
uc deploy                          # Build + push + deploy
uc build --push && uc deploy --no-build   # Separate steps
```

**Inspect a service:**
```bash
uc inspect web
uc logs -f web
uc logs --since 1h web
uc exec web                        # Opens shell
uc exec web /bin/sh -c "env"       # Run specific command
```

**Zero-downtime deploys** happen automatically; Uncloud waits for health checks before terminating old containers.

**Force recreate:**
```bash
uc deploy --recreate
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Editing the Caddyfile directly | Use `x-caddy` in compose or `--caddyfile` on `uc service run` |
| Proxying an HTTPS upstream with self-signed cert | Add `transport http { tls_insecure_skip_verify }` |
| `uc caddy config` shows no user-defined blocks | Caddy admin socket unreachable — check `uc inspect caddy` and `uc logs caddy` |
| Service can't reach external LAN IP from container | Verify Caddy container's host can route to target network |
| Volumes lost after `uc service rm` | Named volumes persist; only anonymous volumes are auto-removed |
