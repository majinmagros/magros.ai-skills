---
name: laravel-patterns
description: "Use when building Laravel apps or APIs with controllers, Eloquent, validation, resources, queues, and caching. Triggers on \"laravel-patterns\", \"laravel patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Laravel Development Patterns

Production-grade Laravel architecture: thin controllers, services/actions, typed models. Detalhes em `references/`.

## When to Activate

- Building Laravel web applications or APIs
- Structuring controllers, services, and domain logic
- Working with Eloquent models and relationships
- Designing APIs with resources and pagination
- Adding queues, events, caching, and background jobs

## Core Principles

1. **Thin controllers** — orchestration in services, single-purpose logic in actions
2. **Scoped bindings** — `scopeBindings()` for nested routes; still enforce authorization
3. **Typed models** — casts, enums, scopes; eager load (`with()`) to kill N+1
4. **IO off the request** — queues for slow work, cache for expensive reads
5. **Config discipline** — secrets in `.env`, structure in `config/*`

## Example

```php
final class OrdersController extends Controller
{
    public function __construct(private CreateOrderAction $createOrder) {}

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->createOrder->handle($request->toDto());

        return response()->json([
            'success' => true,
            'data' => OrderResource::make($order),
            'error' => null,
            'meta' => null,
        ], 201);
    }
}
```

## References

- `references/structure-routing.md` — layout, controllers/services/actions, routing, bindings, container
- `references/eloquent.md` — casts, eager loading, query objects, scopes, soft deletes, transactions
- `references/validation-api.md` — migrations, form requests + DTOs, API resources + pagination
- `references/async-cache-config.md` — events/jobs/queues, caching, configuration

## Checklist

- [ ] Controllers thin; validation in form requests with `authorize()`
- [ ] Nested routes use `scopeBindings()` with consistent parameter names
- [ ] Eloquent eager loads relations; multi-step writes in `DB::transaction`
- [ ] API responses use resources with `{success, data, error, meta}` envelope
- [ ] Slow work queued (idempotent); read-heavy paths cached with invalidation
