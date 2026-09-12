---
name: obsidian-cli
description: "Use when interacting with an Obsidian vault from the terminal — reading, writing, searching notes, daily notes, tasks, tags, links, and automation via the official CLI. Triggers on \"obsidian-cli\", \"obsidian cli\", \"vault\"."
metadata:
  origin: ECC
---

# Obsidian CLI

Control Obsidian Desktop (v1.12+) from the terminal via IPC — 130+ commands. Detalhes em `references/`.

## When to Activate

- Reading, creating, appending, moving, or deleting vault notes
- Working with daily notes (read, append, prepend)
- Searching vault contents or extracting lines for AI processing
- Managing tasks, tags, properties, backlinks, or orphans
- Automating journals, templates, sync, or vault analytics

## Core Principles

1. **Obsidian must be running** — CLI talks to the desktop app via IPC
2. **`key=value` syntax** — quote values with spaces; paths are vault-relative
3. **`create` omits `.md`** — extension added automatically; `move` needs full target
4. **Pipe-friendly output** — combine with `grep`/`jq`; `format=json` on `search`
5. **Full flags in `command-reference.md`** — all 130+ commands with parameter tables

## Example

```bash
obsidian daily:append content="- [ ] Review PR #42"
obsidian search query="meeting notes" format=json | jq '.[]'
obsidian tasks | grep "\[ \]"   # incomplete tasks across vault
```

## References

- `references/setup.md` — prerequisites, Windows/Linux notes, syntax, multi-vault, TUI
- `references/core-commands.md` — command groups table + quick reference
- `references/agent-patterns.md` — journal/template/analytics recipes, tips, troubleshooting
- `references/command-reference.md` — all 130+ commands, flags, output formats

## Checklist

- [ ] Obsidian running, CLI enabled; normal-privilege terminal on Windows
- [ ] Vault-relative paths; `create` without `.md`, `move` with full target
- [ ] `daily:prepend` lands after frontmatter — expected, not a bug
- [ ] List frontmatter via `eval`, not `property:set` (stores strings)
- [ ] Colon-subcommand failure → check `Obsidian.com` / Git Bash wrapper
