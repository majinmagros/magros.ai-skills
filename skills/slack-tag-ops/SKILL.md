---
name: slack-tag-ops
description: "Use when running a native Slack agent via Tag with decoupled UI, fan-out code review, agent-written MapReduce harness, HTML artifacts, and daily loops. Triggers on \"Slack Tag\", \"Slack agent\", \"fan-out review\", \"MapReduce harness\". Non-triggers: file-only async work with no Slack surface (use claude-cowork-patterns). Outcome: a Slack-native Tag operator with mock-to-monitor funnel and adversarial review."
metadata:
  origin: ECC
---

# Slack Tag Ops

Run a native Slack agent via Tag: the chat UI is decoupled from the transcript through a messaging tool, delegation is by objective (not per tool-call supervision), and heavy work runs as fan-out with adversarial review.

## When To Activate

- The user says Slack Tag, Claude in Slack, native Slack agent, or tag-the-agent.
- Code review or triage needs massive fan-out instead of one reviewer reading linearly.
- The agent should produce HTML artifacts instead of blocking on ask-user questions.
- A daily loop is needed (triage feedback, auto-fix high-confidence items, post summary).

## Workflow

### 1. Discovery

- Capture the objective in Slack: goal, scope, repos, channels, done-criteria.
- Confirm inputs/outputs and approval policy (what auto-runs, what needs human OK).
- Do not supervise tool calls; supervise the objective and the acceptance check.

### 2. Mock

- Post a small mock first: message shape, artifact outline, review rubric.
- Validate the interface (where results land, who approves) before building the harness.
- Kill or reshape here; mocks are cheap, harnesses are not.

### 3. Implement with agent-written harness

- Apply the MapReduce pattern: the agent writes its own orchestrator code (for-loop + LLM calls), then runs it.
- Map: fan-out workers per item (PR, file, ticket, thread) with a fixed rubric.
- Reduce: one converger merges verdicts, dedups, and attaches evidence links.
- Keep the harness in the repo so the run is reproducible, not chat-only.

### 4. Fan-out review with adversarial pass

- Run massive fan-out review: many reviewers in parallel, each with a narrow lens (correctness, security, perf, style).
- Add one adversarial reviewer with an explicit job: reject weak approvals and prove failures with tests or screenshots.
- Originate follow-up workflows from test-time compute: what the adversarial pass finds becomes the next work item.

### 5. Ship HTML artifacts, not questions

- Replace ask-user blocks with HTML artifacts (report, diff summary, dashboard) posted back to Slack.
- Each artifact carries: verdict, evidence, next action, owner.
- Human approves the artifact; the agent executes after approval.

### 6. Monitor with daily loops

- Install loops/routines: daily triage, high-confidence auto-fix, summary post.
- Track shelf-life: harnesses rot fast (treat ~2 months as a review point), then re-mock.
- Log every run: items in, verdicts out, overrides, cost.

## Anti-Patterns

- Supervising tool calls instead of delegating by objective.
- One reviewer reading 50 PRs linearly instead of fan-out + reduce.
- Blocking on ask-user when an HTML artifact with a verdict would unblock.
- Chat-only harness: orchestration that lives only in the transcript and cannot rerun.
- No adversarial pass: every reviewer approves, nothing is stress-tested.
- Permanent harness with no review date: rots silently as repos and APIs drift.