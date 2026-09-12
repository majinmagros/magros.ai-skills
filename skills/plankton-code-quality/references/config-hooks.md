# Config Protection, Package Managers, Hook Config

## Config Protection (Defense Against Rule-Gaming)

LLMs will modify `.ruff.toml` or `biome.json` to disable rules rather than fix code. Three layers:

1. **PreToolUse hook** — `protect_linter_configs.sh` blocks edits to all linter configs before they happen.
2. **Stop hook** — `stop_config_guardian.sh` detects config changes via `git diff` at session end.
3. **Protected files list** — `.ruff.toml`, `biome.json`, `.shellcheckrc`, `.yamllint`, `.hadolint.yaml`, and more.

During quality enforcement, also flag same-iteration changes to `biome.json`, `.eslintrc*`, `prettier.config*`, `tsconfig.json`, `pyproject.toml`. If config is changed to suppress violations, require explicit review before merge.

## Package Manager Enforcement

A PreToolUse hook on Bash blocks legacy package managers:

- `pip`, `pip3`, `poetry`, `pipenv` → Blocked (use `uv`)
- `npm`, `yarn`, `pnpm` → Blocked (use `bun`)
- Allowed exceptions: `npm audit`, `npm view`, `npm publish`

## Configuration Reference

Plankton's `.claude/hooks/config.json` controls all behavior:

```json
{
  "languages": {
    "python": true,
    "shell": true,
    "yaml": true,
    "json": true,
    "toml": true,
    "dockerfile": true,
    "markdown": true,
    "typescript": {
      "enabled": true,
      "js_runtime": "auto",
      "biome_nursery": "warn",
      "semgrep": true
    }
  },
  "phases": {
    "auto_format": true,
    "subprocess_delegation": true
  },
  "subprocess": {
    "tiers": {
      "haiku":  { "timeout": 120, "max_turns": 10 },
      "sonnet": { "timeout": 300, "max_turns": 10 },
      "opus":   { "timeout": 600, "max_turns": 15 }
    },
    "volume_threshold": 5
  }
}
```

Disable languages you don't use to speed up hooks.

## Environment Overrides

| Variable | Purpose |
|----------|---------|
| `HOOK_SKIP_SUBPROCESS=1` | Skip Phase 3, report violations directly |
| `HOOK_SUBPROCESS_TIMEOUT=N` | Override tier timeout |
| `HOOK_DEBUG_MODEL=1` | Log model selection decisions |
| `HOOK_SKIP_PM=1` | Bypass package manager enforcement |
