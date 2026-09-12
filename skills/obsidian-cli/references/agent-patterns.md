# Agent Patterns, Tips, Troubleshooting

## Common Agent Patterns

### Daily Journal Automation

```bash
# Append a timestamped entry
obsidian daily:append content="## $(date '+%H:%M') — Status Update
- Completed: feature branch merge
- Next: code review for PR #42
- Blocked: waiting on API credentials"
```

### Create Note from Template with Metadata

```bash
obsidian create path="projects/new-feature" template="project-template"
obsidian property:set path="projects/new-feature.md" name="status" value="planning"
obsidian property:set path="projects/new-feature.md" name="created" value="$(date -I)"
obsidian daily:append content="- Started [[projects/new-feature|New Feature]]"
```

### Vault Analytics Script

```bash
obsidian files total                    # Total file count
obsidian tags counts sort=count         # Most used tags
obsidian tasks | grep "\[ \]"          # Incomplete tasks across vault
obsidian orphans                        # Notes needing integration
obsidian unresolved                     # Broken links to fix
```

### Search and Extract for AI Processing

```bash
obsidian search query="meeting notes" format=json | jq '.[]'
obsidian read path="meetings/standup.md" | grep "Action item"
```

### Sync Management

```bash
obsidian sync:status                    # Check sync health
obsidian sync:history path="important.md"  # Version history
obsidian sync:restore path="important.md" version=3  # Rollback
```

### Execute Obsidian Commands

```bash
# Find a command ID, then execute it
obsidian commands | grep "graph"
obsidian command id="graph:open"

# Open settings, trigger a plugin action
obsidian command id="app:open-settings"
obsidian command id="dataview:dataview-force-refresh-views"
```

## Tips

1. **Paths are vault-relative** — use `folder/note.md`, not absolute filesystem paths.
2. **`create` paths omit `.md`** — the extension is added automatically.
3. **`move` requires full target path** including `.md` extension.
4. **Pipe-friendly** — plain text output works with `grep`, `awk`, `sed`, `jq`.
5. **JSON output** — use `format=json` on `search` for a JSON array of file paths. The `files` command does not support JSON output.
6. **Stderr noise** — GPU/Electron warnings on headless are harmless; filter with `2>/dev/null`.
7. **`daily:prepend`** inserts content after frontmatter, not at byte 0.
8. **Use `eval`** to run arbitrary JavaScript against the Obsidian API (`app.*`).
9. **`template:insert`** inserts into the currently active file in the Obsidian UI — it does not accept a `path=` parameter. If no file is open, it returns `Error: No active editor. Open a file first.` To create a file from a template via CLI, use `obsidian create path="..." template="..."` instead.
10. **`property:set` stores list values as strings** — `value="tag1, tag2"` writes a literal comma-separated string, not a YAML array. For proper array fields, edit the note's frontmatter directly (e.g. via `read` → modify → `create --force`) or use `eval` to call the Obsidian API.
11. **`eval` requires single-line JavaScript** — multiline JS passed inline fails with a token error. Write the script to a temp file instead:
    ```bash
    cat > /tmp/obs.js << 'JS'
    var files = app.vault.getMarkdownFiles();
    files.length;
    JS
    obsidian eval code="$(cat /tmp/obs.js)"
    ```
12. **When colon subcommands are unavailable** (e.g. Windows Git Bash without wrapper), prefer non-colon alternatives: use `properties` instead of `property:read`, and `obsidian daily:path` + `append` instead of `daily:append`.

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Empty output / hangs | Obsidian not running, or admin terminal (Windows) | Start Obsidian; use normal-privilege terminal |
| Command not found | CLI not registered in PATH | Re-enable CLI in Settings; restart terminal |
| Unicode errors | Fixed in v1.12.2+ | Update Obsidian |
| Wrong vault targeted | Multi-vault ambiguity | Pass vault name as first arg |
| IPC socket not found (Linux) | `PrivateTmp=true` in systemd | Set `PrivateTmp=false` |
| Snap confinement issues | Snap restricts IPC | Use `.deb` package instead |
| Multi-vault `"Name" command` fails | Vault name matching issue | Omit vault name; target most recent vault |
| `property:set` list value is a string | CLI stores value as-is | Edit frontmatter directly or use `eval` |
| Colon+params exit 127 (missing `.com`) | Outdated installer — `Obsidian.com` absent | Reinstall from [obsidian.md/download](https://obsidian.md/download) |
| Colon+params exit 127 (Git Bash / MSYS2) | Bash resolves `obsidian` to `.exe` not `.com` | Create `~/bin/obsidian` wrapper: `#!/bin/bash` / `/c/path/to/Obsidian.com "$@"` and add `export PATH="$HOME/bin:$PATH"` to `~/.bashrc` |
