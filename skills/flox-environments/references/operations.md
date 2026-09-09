# Operations — Hooks/Profile Detail, Full-Stack Example, Sharing, AI Workflow, Debugging

## Hooks — Non-Interactive Setup

Hooks run on every activation. Keep them fast and idempotent. Rule of thumb: **if it should happen automatically, put it in `[hook]`; if the user should be able to type it, put it in `[profile]`.**

```toml
[hook]
on-activate = """
  setup_database() {
    if [ ! -d "$FLOX_ENV_CACHE/pgdata" ]; then
      initdb -D "$FLOX_ENV_CACHE/pgdata" --no-locale --encoding=UTF8
    fi
  }
  setup_database
"""
```

## Profile — Interactive Shell Configuration

```toml
[profile]
common = """
  dev() { npm run dev; }
  test() { npm run test -- "$@"; }
"""
```

## Full-Stack Example

A complete environment for a Python API with PostgreSQL:

```toml
[install]
python.pkg-path = "python311"
uv.pkg-path = "uv"
postgresql.pkg-path = "postgresql_16"
redis.pkg-path = "redis"
jq.pkg-path = "jq"
curl.pkg-path = "curl"

[vars]
UV_CACHE_DIR = "$FLOX_ENV_CACHE/uv-cache"
DATABASE_URL = "postgres://localhost:5432/myapp"
REDIS_URL = "redis://localhost:6379"

[hook]
on-activate = """
  if [ ! -d "$FLOX_ENV_CACHE/pgdata" ]; then
    initdb -D "$FLOX_ENV_CACHE/pgdata" --no-locale --encoding=UTF8
  fi

  venv="$FLOX_ENV_CACHE/venv"
  if [ ! -d "$venv" ]; then
    uv venv "$venv" --python python3
  fi
  if [ -f "$venv/bin/activate" ]; then
    source "$venv/bin/activate"
  fi

  if [ -f requirements.txt ] && [ ! -f "$FLOX_ENV_CACHE/.deps_installed" ]; then
    uv pip install --python "$venv/bin/python" -r requirements.txt --quiet
    touch "$FLOX_ENV_CACHE/.deps_installed"
  fi
"""

[profile]
common = """
  serve() { uvicorn app.main:app --reload --host 0.0.0.0 --port 8000; }
  migrate() { alembic upgrade head; }
"""

[services]
postgres.command = "postgres -D $FLOX_ENV_CACHE/pgdata -k $FLOX_ENV_CACHE"
redis.command = "redis-server --port 6379 --daemonize no"

[options]
systems = ["x86_64-linux", "aarch64-linux", "x86_64-darwin", "aarch64-darwin"]
```

Activate with services: `flox activate --start-services`

## Environment Sharing

Flox environments are git-native. Commit the `.flox/` directory and every collaborator gets the same environment:

```bash
git add .flox/
git commit -m "Add Flox environment"
# Teammates just run:
git clone <repo> && cd <repo> && flox activate
```

For reusable base environments across projects, push to FloxHub:

```bash
flox push                         # Push environment to FloxHub
flox activate -r owner/env-name   # Activate remote environment anywhere
```

Compose environments with `[include]`:

```toml
[include]
base.floxhub = "myorg/python-base"

[install]
# Project-specific additions on top of base
fastapi.pkg-path = "python311Packages.fastapi"
```

## AI-Assisted and Vibe Coding

Flox is ideal for AI-assisted development and vibe coding workflows. When an AI agent needs a tool that isn't available in the current environment — a compiler, a database, a linter, a CLI utility — it can add it to the project's Flox manifest without requiring sudo access, polluting system packages, or hitting sandbox restrictions.

**Why this matters for agents:**
- **No sudo required** — `flox install` works entirely in user space, so agents can add packages without elevated permissions
- **Project-scoped** — packages are installed into the project environment only, not globally, so different projects can have different versions without conflict
- **Sandbox-friendly** — agents running in sandboxed or restricted environments can still install the tools they need through Flox
- **Reversible** — every change is captured in `manifest.toml`, so unwanted packages can be removed cleanly with no system residue
- **Reproducible** — when an agent sets up an environment, that exact setup is committed to git and works for everyone

**Agent workflow pattern:**

```bash
# Agent discovers it needs a tool (e.g., jq for JSON processing)
flox search jq                    # Verify the package exists
flox install jq                   # Install into project environment

# Or for more control, edit the manifest directly
tmp_manifest="$(mktemp)"
flox list -c > "$tmp_manifest"
# Add the package to [install] section, then apply
flox edit -f "$tmp_manifest"

# Run a command with the tool available
flox activate -- jq '.results[]' data.json
```

This makes Flox a natural fit for any workflow where Claude Code or other AI agents need to bootstrap project tooling on the fly.

## Debugging

```bash
flox list -c                      # Show raw manifest
flox activate -- which python     # Check which binary resolves
flox activate -- env | grep FLOX  # See Flox environment variables
flox search <package> --all       # Broader package search (case-sensitive)
```

**Common issues:**
- **Package not found:** Search is case-sensitive — try `flox search --all`
- **File conflicts between packages:** Add `priority` to the package that should win
- **Hook failures:** Use `return` not `exit`; guard with `${FLOX_ENV_CACHE:-}`
- **Stale dependencies:** Delete the `$FLOX_ENV_CACHE/.deps_installed` flag file
