# Command Overview & Quick Reference

The CLI provides **130+ commands** across these groups:

| Group | Key Commands | Purpose |
|---|---|---|
| **files** | `read`, `create`, `append`, `prepend`, `move`, `rename`, `delete`, `files`, `folders`, `file`, `random` | Note CRUD and file discovery |
| **daily** | `daily`, `daily:read`, `daily:append`, `daily:prepend`, `daily:path` | Daily note operations |
| **search** | `search`, `search:context` | Full-text search; `search:context` returns matching lines |
| **properties** | `properties`, `property:read`, `property:set`, `property:remove`, `aliases` | Frontmatter/metadata management |
| **tags** | `tags`, `tag` | Tag listing, counts, and filtering |
| **tasks** | `tasks`, `task` | Task querying, filtering, and toggling |
| **links** | `backlinks`, `links`, `unresolved`, `orphans`, `deadends` | Graph and link analysis |
| **bookmarks** | `bookmarks`, `bookmark` | List and add bookmarks |
| **templates** | `templates`, `template:read`, `template:insert` | Template listing, rendering, insertion |
| **plugins** | `plugins`, `plugin`, `plugin:enable`, `plugin:disable`, `plugin:install`, `plugin:uninstall`, `plugins:restrict` | Plugin management |
| **sync** | `sync`, `sync:status`, `sync:history`, `sync:read`, `sync:restore`, `sync:deleted` | Obsidian Sync operations |
| **themes** | `themes`, `theme`, `theme:set`, `theme:install`, `theme:uninstall` | Theme management |
| **snippets** | `snippets`, `snippets:enabled`, `snippet:enable`, `snippet:disable` | CSS snippet management |
| **commands** | `commands`, `command`, `hotkeys`, `hotkey` | Execute Obsidian commands by ID; inspect hotkeys |
| **bases** | `bases`, `base:query`, `base:views`, `base:create` | Obsidian Bases (v1.12+ database feature) |
| **history** | `history`, `history:list`, `history:read`, `history:restore` | File version recovery (File Recovery plugin) |
| **workspace** | `workspace`, `tabs`, `tab:open` | Workspace layout and tab management |
| **diff** | `diff` | Compare local vs sync file versions |
| **dev** | `eval`, `dev:screenshot`, `dev:debug`, `dev:console`, `dev:errors`, `dev:css`, `dev:dom`, `devtools` | Developer/debugging tools |
| **vault** | `vault`, `vaults`, `version`, `reload`, `restart` | Vault info and app control |
| **other** | `outline`, `wordcount`, `recents` | Utility commands |

## Quick Reference — Most Common Commands

### Reading & Writing Notes

```bash
obsidian read path="folder/note.md"
obsidian create path="folder/note" content="# New Note"
obsidian create path="folder/note" template="meeting-notes"
obsidian append path="folder/note.md" content="New paragraph"
obsidian prepend path="folder/note.md" content="Top content"
obsidian move path="old/note.md" to="new/note.md"
obsidian delete path="folder/note.md"
obsidian delete path="folder/note.md" permanent
```

### Daily Notes

```bash
obsidian daily                          # Open today's daily note
obsidian daily:read                     # Print content of today's note
obsidian daily:append content="- [ ] New task"
obsidian daily:prepend content="## Morning Notes"
```

### Search

```bash
obsidian search query="project alpha"
obsidian search query="TODO" path="projects" limit=10
obsidian search query="meeting" format=json   # Returns JSON array of file paths
obsidian search query="urgent" case
```

### Properties & Tags

```bash
obsidian properties path="note.md"
obsidian property:set path="note.md" name="status" value="active"
obsidian property:read path="note.md" name="status"
obsidian property:remove path="note.md" name="draft"
obsidian tags counts sort=count
obsidian tag name="project/alpha"
```

### Tasks

```bash
obsidian tasks                          # All tasks (done + todo) — same as tasks all in v1.12
obsidian tasks all                      # All tasks (done + todo)
obsidian tasks done                     # Completed only
obsidian tasks daily                    # Tasks in today's daily note
obsidian task path="note.md" line=12 toggle
obsidian tasks | grep "\[ \]"           # Workaround: filter to incomplete only
```

### Developer & Automation

```bash
obsidian eval code="app.vault.getFiles().length"
obsidian dev:screenshot path="folder/screenshot.png"  # Path must be vault-relative
obsidian dev:debug on                                 # Required before dev:console
obsidian dev:console limit=20
obsidian dev:errors
```
