---
name: team-agent-orchestration
description: "Use when run team-based orchestration for agent squads using work items, ownership, agent Kanban, merge gates, and control pane handoffs. Triggers on \"team-agent-orchestration\", \"team agent orchestration\", \"orchestration\"."
metadata:
  origin: ECC
---

# Team Agent Orchestration

Use this skill when agents are being managed like a team rather than a single assistant. The purpose is to make team-based orchestration reliable: clear work items, explicit ownership, agent Kanban state, branch isolation, control pane visibility, and merge gates.

## When To Activate

- The task spans multiple agents, tools, harnesses, branches, or worktrees.
- The user mentions team orchestration, agent Kanban, squad, conductor, control pane, manager, desktop app, Zellij, tmux, Hermes, Devin, Codex, Claude Code, or multi-agent work.
- A project needs shared workflow state across people and agents.
- Existing agent fan-out is producing output but not mergeable product.

## Operating Model

Treat every agent as a teammate with a narrow contract:

- **Owner**: the person or agent accountable for the work item.
- **Scope**: files, branch, tool surface, and forbidden areas.
- **State**: backlog, ready, running, review, blocked, merged, or archived.
- **Evidence**: tests, screenshots, logs, review notes, or eval reports.
- **Merge gate**: the exact condition that allows integration.

## Agent Kanban

Use agent Kanban when work must be visible across sessions.

| Column | Meaning | Exit Criteria |
| --- | --- | --- |
| Backlog | Candidate work item, not yet shaped | Acceptance criteria written |
| Ready | Shaped and assignable | Owner and branch/worktree assigned |
| Running | Agent is actively working | Handoff artifact and changed files exist |
| Review | Work is complete but not merged | Tests, diff review, and risk check pass |
| Blocked | Needs external input or failed gate | Blocker has owner and next action |
| Merged | Integrated into mainline | PR merged or local main updated |
| Archived | No longer relevant | Reason recorded |

Each card should fit this schema:

```json
{
  "id": "agent-card-001",
  "title": "Build dynamic workflow skill",
  "owner": "codex",
  "state": "running",
  "branch": "product/dynamic-workflow-team-orchestration",
  "worktree": ".",
  "acceptance": [
    "Skill exists",
    "Tests cover required concepts",
    "Content artifact contains video and article angles"
  ],
  "merge_gate": "lint, focused tests, and catalog check pass",
  "handoff": "path/to/handoff.md"
}
```

## Team-Based Orchestration Flow

1. **Shape the board**: convert fuzzy ambition into work items with owners and merge gates.