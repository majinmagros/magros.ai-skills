# Setup, Syntax, Platforms

The official Obsidian CLI (released in v1.12, February 2026) lets you control every aspect of Obsidian from the terminal. It communicates with a running Obsidian desktop instance via IPC.

> Read `references/command-reference.md` when you need specific flags, output formats, or
> subcommands for any command group. It covers all 130+ commands with full parameter tables
> and has a table of contents at the top.

## Prerequisites

| Requirement | Details |
|---|---|
| Obsidian Desktop | **v1.12.0+** |
| CLI enabled | Settings → Command line interface → Toggle ON |
| Obsidian running | The desktop app **must be running** for CLI to work (IPC) |

## Platform Notes

- **macOS / Linux**: The `obsidian` binary is registered in PATH automatically when you enable CLI in settings.
- **Windows**: Requires an `Obsidian.com` redirector file placed alongside `Obsidian.exe`. **Must run with normal user privileges** — admin terminals produce silent failures.
  - If colon subcommands (`property:set`, `daily:append`, etc.) with parameters return exit 127, check that `Obsidian.com` exists alongside `Obsidian.exe`. If missing, you have an outdated installer — download the latest from [obsidian.md/download](https://obsidian.md/download) and reinstall.
  - **Git Bash / MSYS2 users**: Bash resolves `obsidian` to `Obsidian.exe` (GUI) instead of `Obsidian.com` (CLI), causing colon+params to fail with exit 127 even when `Obsidian.com` is present. Create a wrapper script — see Troubleshooting in `agent-patterns.md`.
- **Headless Linux**: Use the `.deb` package (not snap). Run under `xvfb`. Prefix commands with `DISPLAY=:5` (or your xvfb display number). Ensure `PrivateTmp=false` if running as a service.

## Syntax

All parameters use **`key=value`** syntax. Quote values containing spaces.

```bash
obsidian <command> [subcommand] [key=value ...] [flags]
```

## Multi-Vault

Target a specific vault by making it the **first argument**:

```bash
obsidian "My Vault" daily:read
obsidian "Work Notes" search query="meeting"
```

If omitted, the CLI targets the most recently active vault.

**Multi-vault targeting may not work in all environments** — `obsidian "My Vault" command` can return `Error: Command "My Vault" not found` on some setups. If this happens, omit the vault name (CLI targets the most recently active vault) and switch vaults manually in the Obsidian UI.

## TUI Mode

Running `obsidian` with no arguments launches an interactive TUI (Terminal User Interface):

| Key | Action |
|---|---|
| `↑↓` | Navigate files |
| `Enter` | Open file |
| `/` | Search |
| `n` | Create new file |
| `d` | Delete file |
| `r` | Rename file |
| `q` | Quit |
