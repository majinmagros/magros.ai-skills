---
name: ecc-tools-cost-audit
description: Evidence-first ECC Tools burn and billing audit workflow. Use when investigating runaway PR creation, quota bypass, premium-model leakage, duplicate jobs, or GitHub App cost spikes in the ECC Tools repo.
metadata:
  origin: ECC
---

# ECC Tools Cost Audit

Use this skill when the user suspects the ECC Tools GitHub App is burning cost, over-creating PRs, bypassing usage limits, or routing free users into premium analysis paths.

This is a focused operator workflow for the sibling [ECC-Tools](../../ECC-Tools) repo. It is not a generic billing skill and it is not a repo-wide code review pass.

## Skill Stack

Pull these ECC-native skills into the workflow when relevant:

- `autonomous-loops` for bounded multi-step audits that cross webhooks, queues, billing, and retries
- `agentic-engineering` for tracing the request path into discrete, provable units
- `customer-billing-ops` when repo behavior and customer-impact math must be separated cleanly
- `search-first` before inventing helpers or re-implementing repo-local utilities
- `security-review` when auth, usage gates, entitlements, or secrets are touched
- `verification-loop` for proving rerun safety and exact post-fix state
- `tdd-workflow` when the fix needs regression coverage in the worker, router, or billing paths

## When To Use

- user says ECC Tools burn rate, PR recursion, over-created PRs, usage-limit bypass, or premium-model leakage
- the task is in the sibling `ECC-Tools` repo and depends on webhook handlers, queue workers, usage reservation, PR creation logic, or paid-gate enforcement
- a customer report says the app created too many PRs, billed incorrectly, or analyzed code without producing a usable result

## Scope Guardrails

- work in the sibling `ECC-Tools` repo, not in `everything-claude-code`
- start read-only unless the user clearly asked for a fix
- do not mutate unrelated billing, checkout, or UI flows while tracing analysis burn
- treat app-generated branches and app-generated PRs as red-flag recursion paths until proved otherwise
- separate three things explicitly:
  - repo-side burn root cause
  - customer-facing billing impact
  - product or entitlement gaps that need backlog follow-up

## Workflow

### 1. Freeze repo scope

- switch into the sibling `ECC-Tools` repo
- check branch and local diff first
- identify the exact surface under audit:
  - webhook router
  - queue producer
  - queue consumer
  - PR creation path
  - usage reservation / billing path
  - model routing path

### 2. Trace ingress before theorizing

- inspect `src/index.*` or the main entrypoint first
- map every enqueue path before suggesting a fix
- confirm which GitHub events share a queue type
- confirm whether push, pull_request, synchronize, comment, or manual re-run events can converge on the same expensive path

### 3. Trace the worker and side effects
