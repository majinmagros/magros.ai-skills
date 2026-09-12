# dmux Concepts and Setup

dmux is a tmux-based orchestration tool that manages AI agent panes:

- Press `n` to create a new pane with a prompt
- Press `m` to merge pane output back to the main session
- Supports: Claude Code, Codex, OpenCode, Cline, Gemini, Qwen

**Install:** Install dmux from its repository after reviewing the package.
See [github.com/standardagents/dmux](https://github.com/standardagents/dmux)

## Quick Start

```bash
# Start dmux session
dmux

# Create agent panes (press 'n' in dmux, then type prompt)
# Pane 1: "Implement the auth middleware in src/auth/"
# Pane 2: "Write tests for the user service"
# Pane 3: "Update API documentation"

# Each pane runs its own agent session
# Press 'm' to merge results back
```

## Complementary Tools

| Tool | What It Does | When to Use |
|------|-------------|-------------|
| **dmux** | tmux pane management for agents | Parallel agent sessions |
| **Superset** | Terminal IDE for 10+ parallel agents | Large-scale orchestration |
| **Claude Code Task tool** | In-process subagent spawning | Programmatic parallelism within a session |
| **Codex multi-agent** | Built-in agent roles | Codex-specific parallel work |
