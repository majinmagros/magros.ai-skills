# Events, Queues, Caching and Config

## Events, Jobs, and Queues

- Emit domain events for side effects (emails, analytics)
- Use queued jobs for slow work (reports, exports, webhooks)
- Prefer idempotent handlers with retries and backoff

## Caching

- Cache read-heavy endpoints and expensive queries
- Invalidate caches on model events (created/updated/deleted)
- Use tags when caching related data for easy invalidation

```php
$projects = Cache::tags(['projects'])->remember(
    "projects:user:{$user->id}:page:{$page}",
    now()->addMinutes(10),
    fn () => Project::ownedBy($user->id)->active()->paginate(25),
);
```

## Configuration and Environments

- Keep secrets in `.env` and config in `config/*.php`
- Use per-environment config overrides and `config:cache` in production

```php
// config/orders.php
return [
    'max_items' => (int) env('ORDERS_MAX_ITEMS', 50),
    'queue' => env('ORDERS_QUEUE', 'default'),
];
```
