---
name: docker-patterns
description: Docker and Docker Compose patterns for local development, hardened CLI installer harnesses, container security, networking, volumes, and multi-service orchestration. Use when creating or reviewing Dockerfiles and Compose services, testing installers across Linux distributions, or planning accurate native macOS and Windows validation.
---

# Docker Patterns

Docker and Docker Compose best practices for containerized development. Full configs in `references/`.

## When to Activate

- Creating or reviewing Dockerfiles and Compose services
- Testing installer harnesses across Linux distributions
- Configuring container networking, volumes, or multi-service orchestration

## When NOT to Use

- Kubernetes manifests/Helm (use `kubernetes-patterns`)
- CI/CD pipeline definitions (use `deployment-patterns`)

## Stack & Images (resumo)

**Compose** (`references/compose.md`): app (dev target, hot-reload bind + node_modules guard, health-gated db/redis deps) + postgres:16-alpine (healthcheck, init.sql) + redis:7-alpine + mailpit. **Multi-stage Dockerfile**: deps → dev → build → production (non-root `appuser`, `--chown` copies, HEALTHCHECK). **Overrides**: `docker-compose.override.yml` auto (debug ports) vs `docker-compose.prod.yml` explicit (production target, restart, cpu/mem limits).

```bash
docker compose up                                                     # dev (auto override)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d # prod
```

## Networking, Volumes, Security (resumo)

**Networking** (`references/network-volumes.md`): service-name DNS; custom nets to isolate db (frontend-net/backend-net); bind `127.0.0.1:` or omit ports in prod. **Volumes**: named for data, bind for source, anonymous to protect container paths (`/app/node_modules`, `/.next`).

**Security** (`references/security.md`): pinned tags (never `:latest`); non-root user; `no-new-privileges` + `read_only` + `tmpfs` + `cap_drop: ALL`; secrets via gitignored `.env`/host env or Swarm secrets — never `ENV API_KEY=...` in image.

## Installer Harnesses (resumo)

**Boundary** (`references/installer-harness.md`): real Debian/Ubuntu containers only — Linux containers never validate macOS/Windows (native CI matrix for those). **Isolation contract**: digest-pinned images, numeric UID/GID, read-only mounts, tmpfs workspace (`noexec`, 0700), `read_only` + `cap_drop ALL` + `pids_limit`, `network_mode: none` by default, dry-run default, `spawnSync(shell:false)`, no host credentials. **ECC harness**: `docker/plugin-setup/compose.yaml` (`config --quiet` validate → build both images → `dry-run` per distro → named `shell` sessions with open/reconnect/cleanup protocol). Networked runs only via visible `--profile networked` opt-in.

## Ops (resumo)

`.dockerignore` (node_modules, .git, .env, dist, coverage, logs, compose/dockerfiles). **Debug** (`references/ops.md`): logs/exec/ps/top/stats, rebuild flags, `down -v` destructive warning, `prune`; network triage (nslookup, wget health, network inspect). **Anti-patterns**: compose-without-orchestration in prod · data without volumes · root user · `:latest` · god-container · secrets in compose.
