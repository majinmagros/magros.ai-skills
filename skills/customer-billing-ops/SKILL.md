---
name: customer-billing-ops
description: Operate customer billing workflows such as subscriptions, refunds, churn triage, billing-portal recovery, and plan analysis using connected billing tools like Stripe. Use when the user needs to help a customer, inspect subscription state, or manage revenue-impacting billing operations.
metadata:
  origin: ECC
---

# Customer Billing Ops

Use this skill for real customer operations, not generic payment API design.

The goal is to help the operator answer: who is this customer, what happened, what is the safest fix, and what follow-up should we send?

## When to Use

- Customer says billing is broken, they want a refund, or they cannot cancel
- Investigating duplicate subscriptions, accidental charges, failed renewals, or churn risk
- Reviewing plan mix, active subscriptions, yearly vs monthly conversion, or team-seat confusion
- Creating or validating a billing portal flow
- Auditing support complaints that touch subscriptions, invoices, refunds, or payment methods

## Preferred Tool Surface

- Use connected billing tools such as Stripe first
- Use email, GitHub, or issue trackers only as supporting evidence
- Prefer hosted billing/customer portals over custom account-management code when the platform already provides the needed controls

## Guardrails

- Never expose secret keys, full card details, or unnecessary customer PII in the response
- Do not refund blindly; first classify the issue
- Distinguish among:
  - accidental duplicate purchase
  - deliberate multi-seat or team purchase
  - broken product / unmet value
  - failed or incomplete checkout
  - cancellation due to missing self-serve controls
- For annual plans, team plans, and prorated states, verify the contract shape before taking action

## Workflow

### 1. Identify the customer cleanly

Start from the strongest identifier available:

- customer email
- Stripe customer ID
- subscription ID
- invoice ID
- GitHub username or support email if it is known to map back to billing

Return a concise identity summary:

- customer
- active subscriptions
- canceled subscriptions
- invoices
- obvious anomalies such as duplicate active subscriptions

### 2. Classify the issue

Put the case into one bucket before acting:

| Case | Typical action |
|------|----------------|