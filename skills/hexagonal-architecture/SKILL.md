---
name: hexagonal-architecture
description: "Use when design, implement, and refactor Ports & Adapters systems with clear domain boundaries, dependency inversion, and testable use-case orchestration across TypeScript, Java, Kotlin, and Go services. Triggers on \"hexagonal-architecture\", \"hexagonal architecture\", \"architecture\"."
metadata:
  origin: ECC
---

# Hexagonal Architecture

Ports and Adapters: business logic independent from frameworks, transport, and persistence. Detalhes em `references/`.

## When to Use

- Building new features where long-term maintainability and testability matter
- Refactoring layered or framework-heavy code with domain logic mixed into I/O
- Supporting multiple interfaces for one use case (HTTP, CLI, queue, cron)
- Replacing infrastructure (DB, APIs, bus) without rewriting business rules
- Requests involving boundaries, decoupling, or domain-centric design

## Core Principles

1. **Dependencies point inward** — adapters → application/domain; domain → nothing
2. **Ports model capabilities** — `OrderRepositoryPort`, not `PostgresClient`
3. **Use cases orchestrate only** — mapping stays in adapters at the edge
4. **One composition root** — centralized wiring, no hidden service locators
5. **Migrate slice-by-slice** — strangler + characterization tests, never big-bang

## Example

```typescript
export class CreateOrderUseCase {
  constructor(
    private readonly orders: OrderRepositoryPort,
    private readonly payments: PaymentGatewayPort,
  ) {}
  async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    const order = Order.create(input);
    const auth = await this.payments.authorize(order);
    await this.orders.save(order.markAuthorized(auth.authorizationId));
    return { orderId: order.id, authorizationId: auth.authorizationId };
  }
}
```

## References

- `references/boundaries.md` — concepts, dependency direction, 6 steps, diagram, module layout
- `references/typescript-example.md` — ports, use case, outbound adapter, composition root
- `references/multilang-migration.md` — TS/Java/Kotlin/Go mapping, anti-patterns, migration, testing, practices

## Checklist

- [ ] Domain imports nothing external; use cases take ports via constructor
- [ ] Every side effect behind an outbound port; mapping in adapters
- [ ] Explicit composition root, auditable in one place
- [ ] Use cases unit-tested with fakes; adapters integration-tested
- [ ] Refactor started from one high-churn, low-blast-radius slice
