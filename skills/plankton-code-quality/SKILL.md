---
name: plankton-code-quality
description: "Use when enforcing write-time formatting, linting, and auto-fixes on every file edit via hooks. Triggers on \"plankton-code-quality\", \"plankton code quality\", \"quality\"."
metadata:
  origin: ECC
---

# Plankton Code Quality

Write-time enforcement: format → lint → subprocess fix → verify, via PostToolUse hooks. Detalhes em `references/`.

## When to Activate

- Automatic formatting and linting on every file edit, not just at commit
- Defense against agents editing linter configs instead of fixing code
- Tiered model routing for fixes (Haiku style, Sonnet logic, Opus types)
- Multi-language repos (Python, TS, Shell, YAML, JSON, TOML, Markdown, Dockerfile)

## Core Principles

1. **Format silently first** — fixes 40-50% with zero agent noise
2. **Collect structured violations** — `{line, column, code, message, linter}`
3. **Route by complexity** — Haiku 120s, Sonnet 300s, Opus 600s
4. **Protect configs** — block linter-config edits (PreToolUse + Stop hook)
5. **Verify after fix** — re-run format+lint; exit 2 only if violations remain

## Example

```bash
export ECC_HOOK_PROFILE=strict
export ECC_QUALITY_GATE_FIX=true
export ECC_QUALITY_GATE_STRICT=true
```

## References

- `references/architecture.md` — three phases, agent-visible outcomes, tier timeouts
- `references/setup-languages.md` — quick start, per-project integration, per-language deps
- `references/config-hooks.md` — config protection, package-manager blocks, config.json, env overrides
- `references/ecc-pairing.md` — ECC complement map, conflict resolution, CI pattern, metrics

## Checklist

- [ ] Hooks installed; only needed languages enabled
- [ ] Linter configs protected (no same-iteration suppression)
- [ ] Legacy package managers blocked (uv/bun enforced)
- [ ] ECC Prettier hook disabled where biome covers JS/TS
- [ ] CI runs the same formatter + lint gates
