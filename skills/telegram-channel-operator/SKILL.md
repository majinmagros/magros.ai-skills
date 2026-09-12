---
name: telegram-channel-operator
description: "Use when operating Telegram channels and code channels with approval-in-terminal policy, scheduled routines, and mandatory logging. Triggers on \"telegram channel\", \"code channel\", \"approval bypass\", \"channel routine\". Non-triggers: one-off DM reading or replying (use messages-ops). Outcome: channel runbook plus approval policy plus routine schedule plus append-only log."
metadata:
  origin: ECC
---

# Telegram Channel Operator

Operate Telegram channels (broadcast) and code channels (agent posts via
bots on Telegram or Discord created with BotFather) with an explicit policy:
approve in the terminal by default, bypass only on a written allowlist,
run on routines, log everything.

## When To Activate

- The user wants an agent posting to a Telegram channel or group.
- The user wants code channels: agent output delivered to Telegram or Discord.
- There is a decision between approval-in-terminal and auto-send bypass.
- A channel needs scheduled routines (digests, alerts, build reports).

## Workflow

### 1. Create the bot and the channel topology

- Create the bot with BotFather; store the token outside the repo.
- Map topology: channel | purpose | audience | posting bot | admin.
- Broadcast channels: only the bot posts; discussion goes to a linked group.
- Code channels: one thread or topic per source (builds, alerts, agent notes).

### 2. Set the approval policy in writing

- Default: every outbound post needs terminal approval (show full text first).
- Bypass allowlist: named routine plus named channel plus content template.
- Anything off-template falls back to approval, no exceptions.
- Record the policy in the runbook; changes need human sign-off.

### 3. Define routines

- Each routine: trigger (cron or event) -> draft -> approval or bypass -> send.
- Morning digest, build status, and alert fan-out are separate routines.
- Quiet hours: queue non-urgent posts; only P1 alerts bypass quiet hours.

### 4. Send with idempotency

- One routine run -> one message; retries reuse the same dedupe key.
- Split messages over platform limits; keep part numbering (1/3, 2/3, 3/3).
- Never edit a sent alert to change its meaning; send a correction instead.

### 5. Log everything (mandatory)

- Append-only log per day: time | channel | routine | approval or bypass | message id | result.
- Missing log entry = failed run, even if the message was sent.
- Review the log weekly; shrink the bypass allowlist on any surprise.

## Anti-Patterns

- Bypass as default -> spam channel with no human in the loop.
- Token in the repo or chat transcript -> rotate immediately.
- Approval shown as summary instead of full text -> bait-and-switch posts.
- No log -> no way to audit what the agent sent.
- Broadcast and discussion in the same channel -> noise drowns signal.
- Routines without quiet hours -> 3am pings that train users to mute.

## Relations