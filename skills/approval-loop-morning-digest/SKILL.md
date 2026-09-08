---
name: approval-loop-morning-digest
description: "Use when an operator wants chat-based approval loops plus a multi-source morning digest, where scheduled jobs propose in chat and a human approves before execution. Triggers on \"approval loop\", \"morning digest\", \"chat approval\", \"daily briefing\", \"approved execute\", \"CPA ROAS digest\". Non-triggers: unattended scheduled runs with no approval step (use routines), general background agents with no digest (use autonomous-agent-harness). Outcome: gated proposals approved in chat and executed, plus a daily multi-source digest with a decision log."
metadata:
  origin: ECC
---

# Approval Loop Morning Digest

Close the loop that scheduled jobs leave open: a cron proposes in chat, the
human replies with a short approval token (for example "approved A1"), and
only then the agent executes. Each morning a multi-source digest (news,
content queue, paid-traffic numbers) lands in the same chat. Pieces exist
in `routines` and crons; this skill is the loop itself.

## When To Activate

- The user wants jobs that ask first and execute later, with approval
  happening in chat (Telegram, Slack, or equivalent).
- The user says approval loop, morning digest, daily briefing, approve
  before running, approved-go, gated execution, or digest at 7h.
- A digest must combine multiple sources: news brief, content pipeline
  status, and paid-traffic metrics such as CPA and ROAS.
- The operator needs a rule for what deserves an active loop versus
  what stays a passive on-demand task.

## Workflow

### 1. Decide what earns an active loop

- Delegate to an active loop only work that requires approval (spend,
  publish, send, delete, or external commitment).
- Require N passive rounds with zero corrections before promoting a
  task to an active loop. Default N = 3; record the chosen N.
- Everything else stays passive: the human calls the agent on demand.

### 2. Define the proposal contract

- Each scheduled job posts one proposal message with: job name, run
  time, options labeled A1/A2/A3, cost or risk of each option, and a
  default action if the human stays silent (default = do nothing).
- Approval tokens are short and exact: "approved A1", "approved A2",
  "rejected", or "snooze 24h".
- No token, no execution. Silence never means yes.

### 3. Run the morning digest

- Slot 1 - news brief: overnight items relevant to the operation,
  each one line with source and why it matters.
- Slot 2 - content queue: what ships today (for example carousel),
  status per item, and what is blocked.
- Slot 3 - paid traffic: spend, CPA, and ROAS per account since the
  last digest, plus the proposed move per account.
- Keep the digest skimmable: headers, numbers first, details behind
  a thread or attachment. Consistency daily beats perfection once.

### 4. Execute approved work only

- On a valid token, execute exactly the approved option, then reply
  with DONE plus what changed and a link or id as proof.
- On "rejected" or timeout, log the decision and stop. Never retry
  silently and never substitute another option.
- Rate-limit proposals: max one approval request per job per day
  unless the human asks for more.

### 5. Keep the decision log

- Append every proposal, token, execution result, and digest to a
  daily log (`output/approval-log.md` or equivalent relative path).
- Review weekly: approval rate, silent timeouts, corrections after
  approval. High correction rate demotes the job back to passive.

## Anti-Patterns

- Auto-executing on silence -> silence is rejection, not consent.
- Proposing without labeled options -> the human cannot answer short.
- Active loop for everything -> notification fatigue; keep passive
  default and promote only after N clean rounds.
- Executing a different option than approved -> breaks trust in the gate.
- Digest as a wall of text -> numbers first, one line per item.
- Approval in DMs plus execution logs elsewhere -> keep proposal,
  token, and proof in the same thread.

## Relations

- `routines`: schedules and recurring triggers; this skill adds the
  propose-approve-execute gate on top.
- `autonomous-agent-harness`: 24/7 agent operation substrate; this
  skill adds the human-in-the-loop policy.
- `agent-guardrails`: approval gates, allowlists, and scope control;
  use it to harden the write path behind each token.
- `unified-notifications-ops`: routing and dedup of alerts; use it
  so digest and approval pings land in the right channel once.
- `claude-cowork-patterns`: task execution and recurring file work
  that an approved job may call into.

## Sources

- Human-in-the-loop pattern (passive vs active agents, delegate only
  what needs approval after N passive rounds, three real crons with
  approve-to-execute): https://www.youtube.com/watch?v=akSOO2Arb1s
- Anthropic docs home for agent and scheduling reference: https://docs.anthropic.com
- Telegram Bot API home for chat approval delivery: https://core.telegram.org/bots/api
- Any run counts, costs, or timing statements in the video above are
  author measurements, not benchmarks. Do not quote them as facts.
