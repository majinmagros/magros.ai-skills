# Setup and Language Dependencies

> **Note:** Plankton requires manual installation from its repository. Review the code before installing.

```bash
# Install core dependencies
brew install jaq ruff uv

# Install Python linters
uv sync --all-extras

# Start Claude Code — hooks activate automatically
claude
```

No install command, no plugin config. The hooks in `.claude/settings.json` are picked up automatically when you run Claude Code in the Plankton directory.

## Per-Project Integration

1. Copy `.claude/hooks/` directory to your project.
2. Copy `.claude/settings.json` hook configuration.
3. Copy linter config files (`.ruff.toml`, `biome.json`, etc.).
4. Install the linters for your languages.

## Language-Specific Dependencies

| Language | Required | Optional |
|----------|----------|----------|
| Python | `ruff`, `uv` | `ty` (types), `vulture` (dead code), `bandit` (security) |
| TypeScript/JS | `biome` | `oxlint`, `semgrep`, `knip` (dead exports) |
| Shell | `shellcheck`, `shfmt` | — |
| YAML | `yamllint` | — |
| Markdown | `markdownlint-cli2` | — |
| Dockerfile | `hadolint` (>= 2.12.0) | — |
| TOML | `taplo` | — |
| JSON | `jaq` | — |
