---
name: contract-first
description: "Use when frontend/backend or service-to-service teams must evolve a shared API or event schema without field drift or integration surprises. Triggers on \"contract-first\", \"contract first\", \"boundary contract\"."
metadata:
  origin: ECC
---

# Contract-First Collaboration

Coordinate parallel work through one authoritative, machine-checkable contract. Detalhes em `references/`.

## When to Activate

- Frontend and backend work will proceed in parallel
- Two or more services exchange API payloads, events, or commands
- Field names, nullability, enums, or error shapes regularly drift
- One consumer needs several calls because the provider exposed storage models
- A provider change can break consumers maintained by another person or agent
- Mock responses and production responses no longer have the same shape

## Core Principles

1. **One canonical artifact per boundary** — OpenAPI, AsyncAPI, Protobuf, or JSON Schema
2. **Consumer jobs first** — smallest useful contract, never a leaked DB row
3. **Generated types over copies** — mocks and clients derive from the contract
4. **Verify serialized output** — runtime validation at provider boundaries, not casts
5. **Contract diff = cross-team change** — never implement first, document after

## Example

```yaml
# openapi.yaml — smallest useful contract
components:
  schemas:
    OrderSummary:
      type: object
      required: [id, status, total]
      properties:
        id: { type: string }
        status: { type: string, enum: [pending, paid, cancelled] }
        total: { type: number, minimum: 0 }
        cancellationReason: { type: [string, "null"] }
```

## References

- `references/boundary-artifact.md` — artifact choice, authority, security, observable behavior
- `references/consumer-workflow.md` — consumer jobs, minimal contract, generated types, provider verification
- `references/change-antipatterns.md` — change protocol, anti-patterns, best practices, related skills

## Checklist

- [ ] Owners and authoritative artifact named
- [ ] Required fields, nullability, enums, errors explicit
- [ ] Consumer types/fixtures generated from the contract
- [ ] Provider serialized responses verified, incl. errors and nullables
- [ ] Breaking changes have a migration or versioning plan
