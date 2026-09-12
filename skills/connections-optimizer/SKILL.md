---
name: connections-optimizer
description: Reorganize the user's X and LinkedIn network with review-first pruning, add/follow recommendations, and channel-specific warm outreach drafted in the user's real voice. Use when the user wants to clean up following lists, grow toward current priorities, or rebalance a social graph around higher-signal relationships.
metadata:
  origin: ECC
---

# Connections Optimizer

Reorganize the user's network instead of treating outbound as a one-way prospecting list.

This skill handles:

- X following cleanup and expansion
- LinkedIn follow and connection analysis
- review-first prune queues
- add and follow recommendations
- warm-path identification
- Apple Mail, X DM, and LinkedIn draft generation in the user's real voice

## When to Activate

- the user wants to prune their X following
- the user wants to rebalance who they follow or stay connected to
- the user says "clean up my network", "who should I unfollow", "who should I follow", "who should I reconnect with"
- outreach quality depends on network structure, not just cold list generation

## Required Inputs

Collect or infer:

- current priorities and active work
- target roles, industries, geos, or ecosystems
- platform selection: X, LinkedIn, or both
- do-not-touch list
- mode: `light-pass`, `default`, or `aggressive`

If the user does not specify a mode, use `default`.

## Tool Requirements

### Preferred

- `x-api` for X graph inspection and recent activity
- `lead-intelligence` for target discovery and warm-path ranking
- `social-graph-ranker` when the user wants bridge value scored independently of the broader lead workflow
- Exa / deep research for person and company enrichment
- `brand-voice` before drafting outbound

### Fallbacks

- browser control for LinkedIn analysis and drafting
- browser control for X if API coverage is constrained
- Apple Mail or Mail.app drafting via desktop automation when email is the right channel

## Safety Defaults

- default is review-first, never blind auto-pruning
- X: prune only accounts the user follows, never followers
- LinkedIn: treat 1st-degree connection removal as manual-review-first
- do not auto-send DMs, invites, or emails
- emit a ranked action plan and drafts before any apply step

## Platform Rules
