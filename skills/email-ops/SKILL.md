---
name: email-ops
description: Evidence-first mailbox triage, drafting, send verification, and sent-mail-safe follow-up workflow for ECC. Use when the user wants to organize email, draft or send through the real mail surface, or prove what landed in Sent.
metadata:
  origin: ECC
---

# Email Ops

Use this when the real task is mailbox work: triage, drafting, replying, sending, or proving a message landed in Sent.

This is not a generic writing skill. It is an operator workflow around the actual mail surface.

## Skill Stack

Pull these ECC-native skills into the workflow when relevant:

- `brand-voice` before drafting anything user-facing
- `investor-outreach` for investor, partner, or sponsor-facing mail
- `customer-billing-ops` when the thread is a billing/support incident rather than generic correspondence
- `knowledge-ops` when the message or thread should be captured into durable context afterward
- `research-ops` when a reply depends on fresh external facts

## When to Use

- user asks to triage inbox or archive low-signal mail
- user wants a draft, reply, or new outbound email
- user wants to know whether a mail was already sent
- the user wants proof of which account, thread, or Sent entry was used

## Guardrails

- draft first unless the user clearly asked for a live send
- never claim a message was sent without a real Sent-folder or client-side confirmation
- do not switch sender accounts casually; choose the account that matches the project and recipient
- do not delete uncertain business mail during cleanup
- if the task is really DM or iMessage work, hand off to `messages-ops`

## Workflow

### 1. Resolve the exact surface

Before acting, settle:

- which mailbox account
- which thread or recipient
- whether the task is triage, draft, reply, or send
- whether the user wants draft-only or live send

### 2. Read the thread before composing

If replying:

- read the existing thread
- identify the last outbound touch
- identify any commitments, deadlines, or unanswered questions

If creating a new outbound:

- identify warmth level
- select the correct channel and sender account
- pull `brand-voice` before drafting

### 3. Draft, then verify
