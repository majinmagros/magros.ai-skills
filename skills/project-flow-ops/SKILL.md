---
name: project-flow-ops
description: Operate execution flow across GitHub and Linear by triaging issues and pull requests, linking active work, and keeping GitHub public-facing while Linear remains the internal execution layer. Use when the user wants backlog control, PR triage, or GitHub-to-Linear coordination.
metadata:
  origin: ECC
---

# Project Flow Ops

This skill turns disconnected GitHub issues, PRs, and Linear tasks into one execution flow.

Use it when the problem is coordination, not coding.

## When to Use

- Triage open PR or issue backlogs
- Decide what belongs in Linear vs what should remain GitHub-only
- Link active GitHub work to internal execution lanes
- Classify PRs into merge, port/rebuild, close, or park
- Audit whether review comments, CI failures, or stale issues are blocking execution

## Operating Model

- **GitHub** is the public and community truth
- **Linear** is the internal execution truth for active scheduled work
- Not every GitHub issue needs a Linear issue
- Create or update Linear only when the work is:
  - active
  - delegated
  - scheduled
  - cross-functional
  - important enough to track internally

## Core Workflow

### 1. Read the public surface first

Gather:

- GitHub issue or PR state
- author and branch status
- review comments
- CI status
- linked issues

### 2. Classify the work

Every item should end up in one of these states:

| State | Meaning |
|-------|---------|
| Merge | self-contained, policy-compliant, ready |
| Port/Rebuild | useful idea, but should be manually re-landed inside ECC |
| Close | wrong direction, stale, unsafe, or duplicated |
| Park | potentially useful, but not scheduled now |

### 3. Decide whether Linear is warranted

Create or update Linear only if:

- execution is actively planned
- multiple repos or workstreams are involved
- the work needs internal ownership or sequencing
- the issue is part of a larger program lane
