---
name: team-agent-orchestration
description: "Use when run team-based orchestration for agent squads using work items, ownership, agent Kanban, merge gates, and control pane handoffs. Covers Paperclip as the fast self-hosted entry point. Triggers on \"team-agent-orchestration\", \"team agent orchestration\", \"orchestration\", \"Paperclip\", \"org chart de agentes\", \"conselho de modelos\"."
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

**Default is one chat.** Earn the team with a reason you can name: parallel
research, a clean file split, a separate check, or a job too long for one
context. If you cannot name it, stay in the main loop — splitting by problem
type (mirroring the org chart) is the most common way to add cost and lose
detail. The decision test lives in `sub-agent-cost-guard`
(`references/quando-dobrar-subagentes.md`).

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
2. **Assign owners**: one accountable agent per card; never two agents on the same files.
3. **Isolate**: branch or worktree per card, plus an explicit forbidden-areas list.
4. **Run and hand off**: the agent leaves a handoff artifact (diff, test output, notes), not just a chat message.
5. **Gate**: review tests and diff against the merge gate before integration.
6. **Merge and archive**: update mainline, then archive the card with the reason.

## Entry Point: Paperclip (fastest multi-agent setup)

When the ask is "put several agents working together this afternoon" rather than
"design a bespoke orchestrator", Paperclip is the lowest-friction entry point
(`github.com/paperclipai/paperclip`, MIT, self-hosted, `npx paperclipai onboard --yes`).

- **Org chart instead of prompt chain**: agents get role, boss, job description, and a shared mission; tasks trace back to the goal.
- **Separate context per agent**, which is exactly what ad-hoc fan-out lacks.
- **Budgets per agent**: hitting the limit stops the agent — the hard limit this skill's merge gates assume.
- **Heartbeats**: agents wake on a schedule, so delegation does not depend on a human poking them.
- **Governance**: you approve hires/strategy and can pause or terminate any agent.
- **Model-agnostic**: Claude, Codex, Gemini, Cursor, Hermes, OpenClaw, OpenCode behind one structure.

It also covers the "council" pattern: several models debate a topic and converge
on a refined result. Use Paperclip for the operational shell (org, tickets,
budgets) and keep this skill's card schema as the contract inside each agent.
Caveat: it is a young product — validate the local install and the agent
runtimes you depend on before moving a paid workflow onto it.