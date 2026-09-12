---
name: agentic-os
description: "Use when build persistent multi-agent operating systems on Claude Code. Covers kernel architecture, specialist agents, slash commands, file-based memory, scheduled automation, and state management without external databases. Triggers on \"agentic-os\", \"agentic os\"."
metadata:
  origin: ECC
---

# Agentic OS

Treat Claude Code as a persistent runtime / operating system: kernel config routing tasks to specialist agents, file-based memory, scheduled automation, JSON/markdown data layer. Detalhes em `references/`.

## When to Activate

- Building a multi-agent workflow inside Claude Code
- Setting up persistent Claude Code automation that survives session restarts
- Creating a "personal OS" or "agentic OS" for recurring tasks
- User says "agentic OS", "personal OS", "multi-agent", "agent coordinator", "persistent agent"
- Structuring long-running projects where context must survive across sessions

## Architecture

Four layers, each a directory in the project root. Kernel stays **small and declarative** — routing in markdown tables, not code.

```
project-root/
├── CLAUDE.md          # Kernel: identity, routing rules, agent registry
├── agents/            # Specialist agent definitions (markdown prompts)
├── .claude/commands/  # Slash commands: user-facing CLI
├── scripts/           # Daemon scripts: scheduled or event-driven tasks
└── data/              # State: JSON/markdown filesystem, no external DB
```

| Layer | Purpose |
|---|---|
| Kernel (`CLAUDE.md`) | Identity, routing, model policies, agent registry |
| Agents (`agents/`) | Specialist identities with scoped tools and memory |
| Commands (`.claude/commands/`) | Reusable workflows (`/daily-sync`, `/outreach`) |
| Scripts (`scripts/`) | Daemons via external cron (LaunchAgent, systemd, pm2) |
| State (`data/`) | Append-only logs, projects, decisions, inbox |

## References

- `references/kernel-agents.md` — kernel structure, agent format, multi-agent collaboration
- `references/commands-memory.md` — slash commands, memory layout, daily log, auto-reflection
- `references/automation-data.md` — LaunchAgent/systemd/pm2, JSON data layer, schema evolution
- `references/antipatterns.md` — monolith agent, stateless sessions, hardcoded creds, external DB, routing in code
- `references/enriquecimentos.md` — sandbox (exe.dev), brand context folder, team memory (YT 2026-08-20)

## Checklist

- [ ] `CLAUDE.md` under 200 lines, routing in tables
- [ ] One agent file per domain, each under 100 lines with `Memory Scope`
- [ ] Read `data/` at session start, append logs + reflection at end
- [ ] Logs append-only; decisions/specs git-tracked
- [ ] Scheduled tasks on external cron, never session cron
- [ ] Secrets in env/`.env`, never in agent files or `CLAUDE.md`
- [ ] Cost tracking per session in `data/logs/<date>-costs.json`
- [ ] One project = one Agentic OS
