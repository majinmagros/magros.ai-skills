---
name: grokbot-team-ops
description: "Use when building teams of single-job bots with shared templates, dual memory, unified computer, teach-by-recording, routines, and visible handoffs. Triggers on \"bot team\", \"grokbot\", \"teach-a-task\", \"dual memory\", \"bot routines\", \"group chat bots\". Non-triggers: single human-plus-agent workspace (use buzz-workspace-teaming), one-off file task automation (use claude-cowork-patterns). Outcome: a bot team with roles, templates, memory policy, routines, approvals, and full logs."
metadata:
  origin: ECC
---

# Grokbot Team Ops

Run a factory of single-job bots: one bot per job, a boss bot that
orchestrates, bots that delegate bot-to-bot, shareable templates, and
visible handoffs in group chats. Vendor plans and prices change fast -
check the current vendor plan before acting; no price is recorded here.

## When To Activate

- The user says bot team, bot factory, boss-of-bots, or names single-job
  bots (miner, writer, scheduler, inbox triage).
- The task needs roles with fixed jobs plus delegation between bots.
- The task needs routines (time or event triggers) plus webhook doorbells.
- A previous multi-bot run lost memory, skipped approvals, or hid handoffs.

## Workflow

1. Define roles: one job per bot (single-job descriptions), plus one boss
   bot that owns sequencing and acceptance. Write each description so any
   bot can delegate to it without extra context.
2. Package templates: make each team shareable by link (roles, routines,
   plugins, prompts). Version templates; never fork silently.
3. Set dual memory: global memory (team facts, brand voice, policies) vs
   per-bot memory (job state, credentials scope, routine history). Per-bot
   memory never leaks into global without an explicit promote step.
4. Attach one computer: persistent browser logins, shared workspace,
   terminal, and local-file access per bot scope. Least privilege first.
5. Teach by recording: for click-heavy jobs, record the navigation once,
   convert to a skill (record-shadow-to-skill), then review the generated
   skill before Pocket deploy. Prefer API or connector when one exists.
6. Schedule routines: time triggers (daily summaries, 9:05 weekday digest)
   plus event triggers plus webhook doorbells (external ping -> bot wakes).
   Every routine declares output channel and done condition.
7. Organize chats: org chart (C-suite + workers), group chats with
   mentions, and visible handoffs (who passed what to whom, with link).
8. Gate risk: approvals and human-takeover for money, publishing, or
   irreversible actions. Log everything: prompts, tool calls, handoffs,
   approvals. No log = did not happen.

## Anti-Patterns

- Multi-job mega-bot that does mining, writing, and posting in one role.
- Shared memory soup with no global vs per-bot boundary.
- Routines with no done condition or no output channel.
- Silent handoffs (DM side-channels nobody can audit).
- Auto-approving money, publishing, or deletes to "go faster".

## Relations

- `buzz-workspace-teaming`: human-plus-agent workspace the bot team plugs
  into (channels, inbox, 24/7 hosting).
- `claude-cowork-patterns`: single-task execution patterns reused per bot.
- `routines`: scheduling primitive behind step 6 (time/event triggers).
- `criar-skill`: turns a recording into a reviewed, versioned skill.

## Sources

- No vendor docs URL confirmed at write time - verify the current vendor