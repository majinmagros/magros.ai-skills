# Autonomous Agent Harness — Computer Use, Hermes Replacement, Setup

## 4. Computer Use

Leverage Claude's computer-use MCP for physical world interaction.

**Capabilities:**
- Browser automation (navigate, click, fill forms, screenshot)
- Desktop control (open apps, type, mouse control)
- File system operations beyond CLI

**Use cases within the harness:**
- Automated testing of web UIs
- Form filling and data entry
- Screenshot-based monitoring
- Multi-app workflows

## Replacing Hermes

| Hermes Component | ECC Equivalent | How |
|------------------|---------------|-----|
| Gateway/Router | Claude Code dispatch + crons | Scheduled tasks trigger agent sessions |
| Memory System | Claude memory + MCP memory server | Built-in persistence + knowledge graph |
| Tool Registry | MCP servers | Dynamically loaded tool providers |
| Orchestration | ECC skills + agents | Skill definitions direct agent behavior |
| Computer Use | computer-use MCP | Native browser and desktop control |
| Context Manager | Session management + memory | ECC 2.0 session lifecycle |
| Task Queue | Memory-persisted task list | TodoWrite + memory files |

## Setup Guide

### Step 1: Configure MCP Servers

Ensure these are in `~/.claude.json`:

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@anthropic/memory-mcp-server"]
    },
    "scheduled-tasks": {
      "command": "npx",
      "args": ["-y", "@anthropic/scheduled-tasks-mcp-server"]
    },
    "computer-use": {
      "command": "npx",
      "args": ["-y", "@anthropic/computer-use-mcp-server"]
    }
  }
}
```

### Step 2: Create Base Crons

```bash
# Daily morning briefing
claude -p "Create a scheduled task: every weekday at 9am, review my GitHub notifications, open PRs, and calendar. Write a morning briefing to memory."

# Continuous learning
claude -p "Create a scheduled task: every Sunday at 8pm, extract patterns from this week's sessions and update the learned skills."
```

### Step 3: Initialize Memory Graph

```bash
# Bootstrap your identity and context
claude -p "Create memory entities for: me (user profile), my projects, my key contacts. Add observations about current priorities."
```

### Step 4: Enable Computer Use (Optional)

Grant computer-use MCP the necessary permissions for browser and desktop control.
