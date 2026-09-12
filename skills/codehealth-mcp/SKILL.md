---
name: codehealth-mcp
description: Real-time structural Code Health via CodeScene MCP — review before edits, verify score deltas after changes, gate commits and PRs. Use when reviewing code quality, refactoring, checking if AI changes degraded a file, or before commit/PR.
metadata:
  origin: community
---

# Code Health MCP (CodeScene)

Structural maintainability feedback for AI-assisted coding. Complements style/lint skills (`coding-standards`, `plankton-code-quality`) with **design-level** health scores and regression gates.

**Upstream:** [codescene-oss/codescene-mcp-server](https://github.com/codescene-oss/codescene-mcp-server)
**Package:** `@codescene/codehealth-mcp` (stdio via npx)

## Security and boundaries

**Opt-in (ECC):** The `codescene` block in `mcp-configs/mcp-servers.json` is a template only. ECC plugin installs do not auto-enable bundled MCP servers. Copy the entry into your config only if you want it. You can exclude it during ECC install/sync with `ECC_DISABLED_MCPS=codescene,...`.

**Credentials:** No bundled token. Set `CS_ACCESS_TOKEN` yourself (see [getting-a-personal-access-token.md](https://github.com/codescene-oss/codescene-mcp-server/blob/main/docs/getting-a-personal-access-token.md) in the upstream repo). Never commit tokens to the repo.

**What the tools read:** When invoked, tools analyze files and git state **in the local repository** you point them at (paths you pass, plus branch context for `analyze_change_set`). They do not run by themselves. For standalone mode, follow upstream privacy docs: [codescene-mcp-server README](https://github.com/codescene-oss/codescene-mcp-server#frequently-asked-questions) and [CodeScene policies](https://codescene.com/policies). Do not use this skill for secrets, credentials, or paths you do not want analyzed.

**If the MCP is unavailable (offline, bad token, server crash):** Do not invent Code Health scores. Tell the user the check was skipped. Continue only with explicit user approval. Prefer lint/tests/verification-loop for gating when MCP is down. Re-enable checks once the server connects.

## When to Use

- User asks to **review code quality**, **refactor** a file, or check if **AI changes degraded** maintainability
- Before editing a **hotspot**, legacy module, or unfamiliar file
- Before **commit** or **pull request** when you need a maintainability safeguard
- After a large agent-written diff — verify Code Health did not regress
- Pair with `verification-loop`, `tdd-workflow`, or `/quality-gate` as a structural check (not a replacement for tests/lint)

## When to Activate

Same triggers as **When to Use** above — this heading is what ECC uses for skill auto-activation.

## How It Works

### 1. Connect the MCP server

Copy the `codescene` entry from `mcp-configs/mcp-servers.json` into your harness MCP config.

**Claude Code** (`~/.claude.json` → `mcpServers`):

```json
"codescene": {
  "command": "npx",
  "args": ["-y", "@codescene/codehealth-mcp"],
  "env": {
    "CS_ACCESS_TOKEN": "YOUR_CS_ACCESS_TOKEN_HERE"
  }
}
```

**Project-scoped:** merge the same block into `.mcp.json` at the repo root.

Token setup is documented in the upstream repo (link above). Standalone mode does not require a paid CodeScene platform account for the four tools listed below. Restart the session and confirm the `codescene` server is connected before relying on scores.

### 2. Call standalone tools only

| Tool | When to use |
|------|-------------|
| `code_health_review` | Full structural analysis **before** modifying a file |
| `code_health_score` | Quick numeric score after each change (delta check) |
| `pre_commit_code_health_safeguard` | Block commits that introduce Code Health regressions |