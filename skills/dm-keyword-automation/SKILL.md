---
name: dm-keyword-automation
description: "Use when automating comment keyword to DM flows with UTM tracking and qualification scripts as a self-hosted ManyChat replacement. Triggers on \"keyword DM\", \"comment automation\", \"manychat replacement\", \"DM funnel\". Non-triggers: paid ads account operation (use ads-operator). Outcome: keyword map plus DM scripts plus UTM log plus qualification flow."
metadata:
  origin: ECC
---

# DM Keyword Automation

Replace hosted comment-to-DM tools (ManyChat-style) with a self-hosted loop:
public comment with keyword -> auto DM -> qualification script -> tracked link.

## When To Activate

- The user wants "comment X and I will send you Y" automation.
- The user wants to replace ManyChat with owned infrastructure.
- A funnel needs per-keyword DM scripts plus UTM tracking.
- Qualification must happen inside the DM before a human takes over.

## Workflow

### 1. Map keywords to assets

- List each trigger keyword and the asset it promises.
- One keyword -> one DM script -> one destination link. No shared links.
- Record the map in a table: keyword | script file | link | owner.

### 2. Build the DM script

- Opening line delivers the promised asset, no small talk first.
- Follow with at most 3 qualification questions, one per message.
- End with a single call to action (book, buy, reply).
- Keep each message under 45 words; mobile-first line breaks.

### 3. Tag every link with UTM

- Format: `?utm_source=<platform>&utm_medium=dm&utm_campaign=<keyword>`.
- One campaign value per keyword so reply rate maps to source post.
- Log sent links per day: date | keyword | sends | replies | clicks.

### 4. Wire the trigger

- Connect the platform messaging API or an automation bridge.
- Match comments case-insensitively; strip punctuation before matching.
- Rate-limit sends per account per hour; queue overflow for next window.
- Log every send with timestamp for audit.

### 5. Pixel and conversion check

- Fire the pixel event on link click and on the goal page.
- Compare DM clicks vs goal completions weekly per keyword.
- Kill keywords with clicks but zero completions after 200 sends.

### 6. Human handoff

- Route qualified replies to a human closer with full transcript.
- Unqualified replies get a polite exit plus one fallback asset.
- Never loop questions the user already answered.

## Anti-Patterns

- One generic DM script for all keywords -> untraceable funnel.
- Shared links without UTM -> source attribution lost.
- Instant send with no rate limit -> account flag or ban.
- Pixel on click but not on goal -> vanity metrics.