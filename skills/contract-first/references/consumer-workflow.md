# Consumer-First Workflow

## 1. Identify Consumers and Owners

Record:

- who consumes the boundary
- who owns the provider
- who may approve contract changes
- which artifact is authoritative

One owner resolves ambiguity; ownership does not mean the provider designs the
contract alone.

## 2. Describe Consumer Jobs

Start from what each consumer must render or accomplish. Ask:

- Which fields are actually required?
- What do missing, empty, and null mean?
- Which identifiers must remain strings?
- Which enum values can the consumer handle?
- Can one task-oriented response replace several coupled calls?
- What errors require different consumer behavior?

Do not expose a database row and call it a contract.

## 3. Define the Smallest Useful Contract

Example:

```yaml
# openapi.yaml
openapi: 3.1.0
components:
  schemas:
    OrderSummary:
      type: object
      required: [id, status, total]
      properties:
        id:
          type: string
          description: Opaque identifier; never parse as a number.
        status:
          type: string
          enum: [pending, paid, cancelled]
        total:
          type: number
          format: double
          minimum: 0
        cancellationReason:
          type: [string, "null"]
```

Define semantic constraints, not only syntax. For example, document whether
`cancellationReason` is null for every status except `cancelled`.

## 4. Generate or Derive Consumer Types

Prefer generated types over handwritten copies:

```bash
npm run generate:api-types
```

Back that script with the repository's existing, pinned OpenAPI generator.

```typescript
import type { components } from "./generated/api";

type OrderSummary = components["schemas"]["OrderSummary"];

export const paidOrderMock = {
  id: "9007199254740993123",
  status: "paid",
  total: 49.9,
  cancellationReason: null,
} satisfies OrderSummary;
```

The consumer can build against contract-valid mocks while the provider is still
in progress.

## 5. Verify the Provider

The provider must prove that real responses satisfy the same artifact:

```typescript
import type { components } from "./generated/api";

type OrderSummary = components["schemas"]["OrderSummary"];

export function toOrderSummary(row: OrderRow): OrderSummary {
  return {
    // OrderRow.id must arrive from storage as string or bigint, never an
    // already-rounded JavaScript number.
    id: String(row.id),
    status: row.status,
    total: row.total,
    cancellationReason: row.cancellation_reason,
  };
}
```

Static types catch many field and enum mistakes. Add runtime schema validation
or a framework-level contract test at serialization boundaries, where database
values, language coercion, and conditional response paths can still drift.
Converting an unsafe integer to a string after the database driver has rounded
it does not restore the original ID; configure the driver to return string or
bigint first.

Verify every materially different path:

- production and sandbox/mock mode
- success and each documented error
- empty collections
- nullable fields
- feature-flagged or versioned responses

## 6. Integrate by Comparing Evidence

Before merge:

- generate consumer types successfully
- validate consumer fixtures against the contract
- validate provider responses against the contract
- run at least one end-to-end happy path
- confirm no consumer uses undocumented fields

The integration question is not "did both sides pass their own tests?" It is
"did both sides pass against the same boundary artifact?"
