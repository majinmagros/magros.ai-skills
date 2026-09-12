# CLI Quick Reference (`uc`)

## Machines

| Command | Purpose |
|---------|---------|
| `uc machine init user@host` | Bootstrap first machine / new cluster |
| `uc machine add user@host` | Join machine to existing cluster |
| `uc machine ls` | List machines |
| `uc machine update NAME --public-ip IP` | Update public IP for ingress |
| `uc machine rm NAME` | Remove machine |

Key `init` flags: `--name`, `--network 10.210.0.0/16`, `--no-caddy`, `--no-dns`, `--public-ip auto|IP|none`

## Services

| Command | Purpose |
|---------|---------|
| `uc service ls` / `uc ls` | List services |
| `uc service run IMAGE` | Run a single container service |
| `uc deploy` | Deploy from `compose.yaml` |
| `uc deploy --no-build` | Deploy already-pushed images without rebuilding |
| `uc deploy --recreate` | Force service recreation |
| `uc scale SERVICE N` | Set replica count |
| `uc service logs SERVICE` | View logs |
| `uc service exec SERVICE` | Shell into container |
| `uc service inspect SERVICE` | Detailed info |
| `uc service rm SERVICE` | Remove service (keeps named volumes) |
| `uc ps` | All containers across cluster |

## Images

```bash
uc image push myapp:latest                    # Push local image to all machines
uc image push myapp:latest -m machine1,machine2  # Push to specific machines
uc images                                     # List images in cluster
```

## Volumes

```bash
uc volume ls                  # All volumes
uc volume ls -m machine1      # On specific machine
uc volume create NAME -m MACHINE
uc volume rm NAME
```

## Caddy

```bash
uc caddy config    # Show current generated Caddyfile (read-only)
uc caddy deploy    # Deploy/upgrade Caddy across cluster
```

## DNS & Context

```bash
uc dns show        # Show reserved *.uncld.dev domain
uc dns reserve     # Reserve a new domain
uc ctx ls          # List cluster contexts
uc ctx use prod    # Switch context
```
