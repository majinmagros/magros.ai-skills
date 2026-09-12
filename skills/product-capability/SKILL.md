---
name: product-capability
description: Translate PRD intent, roadmap asks, or product discussions into an implementation-ready capability plan that exposes constraints, invariants, interfaces, and unresolved decisions before multi-service work starts. Use when the user needs an ECC-native PRD-to-SRS lane instead of vague planning prose.
metadata:
  origin: ECC
---

# Product Capability

This skill turns product intent into explicit engineering constraints.

Use it when the gap is not "what should we build?" but "what exactly must be true before implementation starts?"

## When to Use

- A PRD, roadmap item, discussion, or founder note exists, but the implementation constraints are still implicit
- A feature crosses multiple services, repos, or teams and needs a capability contract before coding
- Product intent is clear, but architecture, data, lifecycle, or policy implications are still fuzzy
- Senior engineers keep restating the same hidden assumptions during review
- You need a reusable artifact that can survive across harnesses and sessions

## Canonical Artifact

If the repo has a durable product-context file such as `PRODUCT.md`, `docs/product/`, or a program-spec directory, update it there.

If no capability manifest exists yet, create one using the template at:

- `docs/examples/product-capability-template.md`

The goal is not to create another planning stack. The goal is to make hidden capability constraints durable and reusable.

## Non-Negotiable Rules

- Do not invent product truth. Mark unresolved questions explicitly.
- Separate user-visible promises from implementation details.
- Call out what is fixed policy, what is architecture preference, and what is still open.
- If the request conflicts with existing repo constraints, say so clearly instead of smoothing it over.
- Prefer one reusable capability artifact over scattered ad hoc notes.

## Inputs

Read only what is needed:

1. Product intent
   - issue, discussion, PRD, roadmap note, founder message
2. Current architecture
   - relevant repo docs, contracts, schemas, routes, existing workflows
3. Existing capability context
   - `PRODUCT.md`, design docs, RFCs, migration notes, operating-model docs
4. Delivery constraints
   - auth, billing, compliance, rollout, backwards compatibility, performance, review policy

## Core Workflow

### 1. Restate the capability

Compress the ask into one precise statement:

- who the user or operator is
- what new capability exists after this ships
- what outcome changes because of it

If this statement is weak, the implementation will drift.

### 2. Resolve capability constraints