# Workspace Migration Between Harnesses

Source `cAeKDWa77xI` (Grace Leung). Scenario: same project must run in another harness (or the team uses both) without losing skills, instructions, subagents, MCP.

**Existing in repo**: `scripts/sync-ecc-to-codex.sh` — one-way ECC→Codex sync (backup of ~/.codex, marker-based AGENTS.md merge, prompts generated from commands, git hooks, add-only MCP merge into config.toml; `--dry-run` for preview).

**General migration checklist (any harness pair):**

1. **Scan**: inventory `.claude/` (skills/agents/commands/hooks/settings) vs Codex canonical destinations (`.codex/`, `.agents/`, `AGENTS.md`) — or target-harness equivalents.
2. **Plan + backup** before converting (script already auto-backs-up).
3. **Convert formats**: commands → prompt files; agents → target subagent format; skills are portable (Agent Skills spec); instructions → correct context file (CLAUDE.md vs AGENTS.md).
4. **Reconnect MCP**: re-declare servers in target config (add-only, never overwrite existing).
5. **Known limitation**: migration does NOT sync memory/session-history files — conversational context stays in the origin harness (see `unified-memory` for cross-harness memory sharing).

For the reverse path (Codex→ECC) or pairs not covered by the script, follow the manual checklist above and log divergences as script issues.

This skill is a post-install reconfiguration path. It cannot intercept or replace a provider's built-in first-install UI. If the harness is uncertain, state detected evidence and ask which harness to configure before any mutating command.
