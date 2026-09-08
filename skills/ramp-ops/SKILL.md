---
name: ramp-ops
description: "Use when running ops agents in the Ramp pattern: repetitive loops vs exploratory dynamic workflows, declarative correct-trace, trace-debug over benchmarks, least-privilege, and cost culture. Triggers on \"Ramp ops\", \"loops vs workflows\", \"correct-trace\", \"trace-debug\". Non-triggers: generic workflow orchestration with no ops surface (use workflows). Outcome: an ops loop system with least-privilege, cost control, and on-call-ready inspection."
metadata:
  origin: ECC
---

# Ramp Ops

Operate agents the Ramp way: cheap **loops** for repetitive toil, **dynamic workflows** for exploratory work, declarative traces for debugging, least-privilege by default, and cost culture that platformizes top spenders.

## When To Activate

- The user says Ramp pattern, loops vs workflows, babysit PR, rebase train, dead-code sweep.
- On-call, SRE, or platform work needs a digital coworker across GitHub/Linear/Slack/Datadog/Sentry/Zendesk.
- Debugging relies on slogans or benchmarks instead of real execution traces.
- Agent spend concentrates in a few workflows nobody owns.

## Workflow

### 1. Split loops vs dynamic workflows

- Loops (repetitive, stable shape): babysit PR, rebase, dead-code removal, flaky-test rerun, dependency bumps.
- Dynamic workflows (exploratory, unknown shape): incident triage, new integration, migration planning.
- Rule: if it ran the same way 3 times, convert it to a loop; if it never runs the same way twice, keep it dynamic.

### 2. Write declarative correct-trace

- Declare the expected trace first: steps, tools allowed, artifacts produced, done-criteria.
- Run the agent, then diff actual trace vs declared trace.
- A deviation is a finding, not noise: fix the declaration or fix the agent, never both silently.

### 3. Prefer trace-debug over benchmarks

- When something fails, read the full trace (inputs, tool calls, outputs, timing) before quoting any benchmark.
- Reproduce from the trace with the smallest input that still diverges.
- Benchmarks rank models; traces fix systems. Never substitute one for the other.

### 4. Enforce least-privilege

- Each loop gets minimum scopes: only the repos, channels, and APIs it needs.
- Destructive actions (merge, close, page, deploy) require an explicit gate or allow-listed target.
- Review scopes when the loop changes shape; privilege creep is the default failure.

### 5. Build cost culture

- Track cost per loop: tokens, calls, wall-clock, owner.
- Platformize top spenders first: shared cache, smaller model for the stable part, batching, fewer wakeups.
- Report weekly: top 5 loops by spend, action taken, delta next week.

### 6. Inspect with a digital coworker

- Stand up Inspect-style coverage: GitHub (PRs, CI), Linear (issues), Slack (signals), Datadog/Sentry (telemetry/errors), Zendesk (tickets).
- Add Glass-style visibility: what the agent saw, did, and skipped, per run.
- Wire on-call SRE: page on loop failure, attach the trace, keep a runbook link in the alert.

## Anti-Patterns

- Dynamic workflow for pure toil: expensive reasoning where a loop would do.
- Rigid loop for exploration: forcing incidents into a script that cannot adapt.
- Debugging by benchmark: quoting scores instead of reading the trace.
- Broad credentials for a narrow loop: one token that can do everything.
- No cost owner: top-spender loops with no name attached.
- Alert without trace: paging a human with a verdict but no evidence.

## Relations

- `dynamic-workflow-mode`: design rules for the exploratory side of the split.
- `workflows`: run-order, parallel lanes, and stop conditions reused by loops.
- `cost-aware-llm-pipeline`: model routing, budget tracking, and caching behind cost culture.
- `enterprise-agent-ops`: boundaries, lifecycle, and observability for long-lived ops agents.

## Sources

- Evidence video `i4odXOmgMLw` (loops vs dynamic, declarative correct-trace, trace-debug over benchmarks, least-privilege, cost-culture with platformized top spenders, Inspect digital coworker across GitHub/Linear/Slack/Datadog/Sentry/Zendesk plus Glass and on-call SRE, CI 18min to 6min): all run numbers and time claims in that video are author measurement, not a benchmark - medicao do autor, nao benchmark.
- Watch link built from evidence id: https://www.youtube.com/watch?v=i4odXOmgMLw
- Cross-session messaging docs: https://code.claude.com/docs/en/cross-session-messaging
- GitHub REST reference: https://docs.github.com/en/rest
- Datadog home: https://www.datadoghq.com/
- Sentry home: https://sentry.io/
