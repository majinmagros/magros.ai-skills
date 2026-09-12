---
name: configure-ecc
description: "Use when installing, updating, or reconfiguring ECC from inside Claude Code, Codex, or Kimi. Triggers on \"configure-ecc\", \"configure ecc\"."
metadata:
  origin: ECC
---

# Configure Everything Claude Code

Route by harness: Claude wizard, Codex native lifecycle, or Kimi surface. Detalhes em `references/`.

## When to Activate

- Installing ECC from inside Claude Code, Codex, or Kimi
- Updating or reconfiguring ECC scope or hook mode
- Migrating ECC scope (user/project/local) in Claude Code
- Syncing ECC workspace between harnesses (Claude ↔ Codex)
- Verifying install state before rendering welcome

## Core Principles

1. **Route by harness** — Claude scopes/hooks; Codex native trust; Kimi `./.kimi-code`
2. **Inventory first** — `plugin list --json`; never mutate before reading state
3. **Preview then confirm once** — `--dry-run --json`, one yes/no, then apply
4. **Verify before welcome** — zero exit, scope/hooks match, single enabled entry
5. **Never hand-copy** — no temp clones; no shell from JSON values; non-TTY safe

## Example

```bash
node "$CLAUDE_PLUGIN_ROOT/scripts/setup.js" --mode claude-plugin \
  --scope project --hooks standard --dry-run --json
```

## References

- `references/claude-wizard.md` — inventory, 2 choices, preview/apply/verify, welcome
- `references/codex-lifecycle.md` — marketplace add/upgrade, install, installedPath welcome
- `references/kimi-install.md` — `./.kimi-code` preview/apply/doctor/welcome, hooks unsupported
- `references/migration.md` — sync script, 5-step checklist, memory limitation

## Checklist

- [ ] Harness identified from evidence; uncertain → ask before mutating
- [ ] Claude: exactly one scope + one hook mode collected
- [ ] Dry-run previewed; single confirmation obtained
- [ ] Post-apply JSON verifies scope/hooks and single enabled entry
- [ ] Welcome rendered once only after verified success
