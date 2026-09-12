---
name: unified-notifications-ops
description: Operate notifications as one ECC-native workflow across GitHub, Linear, desktop alerts, hooks, and connected communication surfaces. Use when the real problem is alert routing, deduplication, escalation, or inbox collapse.
metadata:
  origin: ECC
---

# Unified Notifications Ops

Use this skill when the real problem is not a missing ping. The real problem is a fragmented notification system.

The job is to turn scattered events into one operator surface with:
- clear severity
- clear ownership
- clear routing
- clear follow-up action

## When to Use

- the user wants a unified notification lane across GitHub, Linear, local hooks, desktop alerts, chat, or email
- CI failures, review requests, issue updates, and operator events are arriving in disconnected places
- the current setup creates noise instead of action
- the user wants to consolidate overlapping notification branches or backlog proposals into one ECC-native lane
- the workspace already has hooks, MCPs, or connected tools, but no coherent notification policy

## Preferred Surface

Start from what already exists:
- GitHub issues, PRs, reviews, comments, and CI
- Linear issue/project movement
- local hook events and session lifecycle signals
- desktop notification primitives
- connected email/chat surfaces when they actually exist

Prefer ECC-native orchestration over telling the user to adopt a separate notification product.

## Non-Negotiable Rules

- never expose tokens, secrets, webhook secrets, or internal identifiers
- separate:
  - event source
  - severity
  - routing channel
  - operator action
- default to digest-first when interruption cost is unclear
- do not fan out every event to every channel
- if the real fix is better issue triage, hook policy, or project flow, say so explicitly

## Event Pipeline

Treat the lane as:

1. **Capture** the event
2. **Classify** urgency and owner
3. **Route** to the correct channel
4. **Collapse** duplicates and low-signal churn
5. **Attach** the next operator action

The goal is fewer, better notifications.

## Default Severity Model

| Class | Examples | Default handling |
| --- | --- | --- |
| Critical | broken default-branch CI, security issue, blocked release, failed deploy | interrupt now |