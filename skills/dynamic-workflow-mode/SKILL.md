---
name: dynamic-workflow-mode
description: "Use when design task-local harnesses, eval gates, and reusable skill extraction for Claude dynamic workflow mode and other adaptive agent harnesses. Triggers on \"dynamic-workflow-mode\", \"dynamic workflow mode\", \"mode\"."
metadata:
  origin: ECC
---

# Dynamic Workflow Mode

Use this skill when a coding agent can generate or adapt a task-local harness instead of only following a static command flow. The goal is to turn dynamic workflow mode into a disciplined system: temporary harnesses for one-off work, shared skill extraction for repeated work, and observable control pane checkpoints for teams.

## When To Activate

- The user mentions dynamic workflows, custom harnesses, harness-per-task, adaptive workflows, or Claude Code dynamic workflow mode.
- A task needs a custom loop, evaluator, crawler, fixture generator, watcher, or local dashboard.
- Multiple agents need the same repeatable process but the process is not yet captured as a shared skill.
- A workflow needs durable handoff artifacts, eval evidence, or operator approval before merge.

## Core Contract

Dynamic workflow mode should produce a task-local harness only when the harness is cheaper and safer than manually driving the same steps. The harness must have:

- **Objective**: the outcome it owns and the outcome it explicitly does not own.
- **Inputs**: files, URLs, prompts, data sources, credentials policy, and user-provided constraints.
- **Outputs**: commits, reports, screenshots, status files, or control pane snapshots.
- **Eval**: at least one pass/fail check tied to the task, not only "it ran".
- **Handoff**: a short artifact that tells the next operator what happened, what is blocked, and how to resume.

## Dynamic Harness Decision Tree

1. **One-shot task**: keep it inline. Do not invent a harness.
2. **Repeated task with changing inputs**: create a task-local harness and keep it under a temp or project-local working area.
3. **Repeated task across teammates or repos**: extract the pattern into a shared skill.
4. **Task with external state, queueing, or approvals**: add control pane visibility before adding more automation.
5. **Task with safety risk**: add an eval gate and a human merge gate before autonomous execution.

## Task-Local Harness Template

Use this structure before writing code:

```markdown
# Dynamic Workflow Harness

Objective:
- Ship:
- Do not ship:

Inputs:
- Repo or workspace:
- External systems:
- Credentials policy:

Loop:
1. Discover current state.
2. Generate or update the smallest useful artifact.
3. Run eval checks.
4. Record status and handoff.
5. Stop on failed gate, unclear ownership, or unsafe external action.

Eval:
- Command:
- Expected pass signal:
- Failure owner:

Handoff: