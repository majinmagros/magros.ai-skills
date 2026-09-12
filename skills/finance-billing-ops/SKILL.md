---
name: finance-billing-ops
description: Evidence-first revenue, pricing, refunds, team-billing, and billing-model truth workflow for ECC. Use when the user wants a sales snapshot, pricing comparison, duplicate-charge diagnosis, or code-backed billing reality instead of generic payments advice.
metadata:
  origin: ECC
---

# Finance Billing Ops

Use this when the user wants to understand money, pricing, refunds, team-seat logic, or whether the product actually behaves the way the website and sales copy imply.

This is broader than `customer-billing-ops`. That skill is for customer remediation. This skill is for operator truth: revenue state, pricing decisions, team billing, and code-backed billing behavior.

## Skill Stack

Pull these ECC-native skills into the workflow when relevant:

- `customer-billing-ops` for customer-specific remediation and follow-up
- `research-ops` when competitor pricing or current market evidence matters
- `market-research` when the answer should end in a pricing recommendation
- `github-ops` when the billing truth depends on code, backlog, or release state in sibling repos
- `verification-loop` when the answer depends on proving checkout, seat handling, or entitlement behavior

## When to Use

- user asks for Stripe sales, refunds, MRR, or recent customer activity
- user asks whether team billing, per-seat billing, or quota stacking is real in code
- user wants competitor pricing comparisons or pricing-model benchmarks
- the question mixes revenue facts with product implementation truth

## Guardrails

- distinguish live data from saved snapshots
- separate:
  - revenue fact
  - customer impact
  - code-backed product truth
  - recommendation
- do not say "per seat" unless the actual entitlement path enforces it
- do not assume duplicate subscriptions imply duplicate value

## Workflow

### 1. Start from the freshest billing evidence

Prefer live billing data. If the data is not live, state the snapshot timestamp explicitly.

Normalize the picture:

- paid sales
- active subscriptions
- failed or incomplete checkouts
- refunds
- disputes
- duplicate subscriptions

### 2. Separate customer incidents from product truth

If the question is customer-specific, classify first:

- duplicate checkout
- real team intent
- broken self-serve controls
- unmet product value
- failed payment or incomplete setup