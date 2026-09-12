## Prerequisites

### Option A: MCP Server (Recommended)

Install the `mcp-atlassian` MCP server. This exposes Jira tools directly to your AI agent.

**Requirements:**
- Python 3.10+
- `uvx` (from `uv`), installed via your package manager or the official `uv` installation documentation

**Add to your MCP config** (e.g., `~/.claude.json` → `mcpServers`):

```json
{
  "jira": {
    "command": "uvx",
    "args": ["mcp-atlassian==0.21.0"],
    "env": {
      "JIRA_URL": "https://YOUR_ORG.atlassian.net",
      "JIRA_EMAIL": "your.email@example.com",
      "JIRA_API_TOKEN": "your-api-token"
    },
    "description": "Jira issue tracking — search, create, update, comment, transition"
  }
}
```

> **Security:** Never hardcode secrets. Prefer setting `JIRA_URL`, `JIRA_EMAIL`, and `JIRA_API_TOKEN` in your system environment (or a secrets manager). Only use the MCP `env` block for local, uncommitted config files.

**To get a Jira API token:**
1. Go to <https://id.atlassian.com/manage-profile/security/api-tokens>
2. Click **Create API token**
3. Copy the token — store it in your environment, never in source code

### Option B: Direct REST API

If MCP is not available, use the Jira REST API v3 directly via `curl` or a helper script.

**Required environment variables:**

| Variable | Description |
|----------|-------------|
| `JIRA_URL` | Your Jira instance URL (e.g., `https://yourorg.atlassian.net`) |
| `JIRA_EMAIL` | Your Atlassian account email |
| `JIRA_API_TOKEN` | API token from id.atlassian.com |

Store these in your shell environment, secrets manager, or an untracked local env file. Do not commit them to the repo.

For direct `curl` examples, keep credentials out of command-line arguments by passing the Jira user config on stdin:

```bash
jira_curl() {
  printf 'user = "%s:%s"\n' "$JIRA_EMAIL" "$JIRA_API_TOKEN" |
    curl -s -K - "$@"
}
```
