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
