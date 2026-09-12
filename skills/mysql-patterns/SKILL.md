---
name: mysql-patterns
description: "Use when designing MySQL/MariaDB schemas, debugging slow queries, locks, or pools, and configuring replication or security. Triggers on \"mysql-patterns\", \"mysql patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# MySQL Patterns

MySQL/MariaDB schema, query, transaction, pool, and ops patterns for production. Detalhes em `references/`.

## When to Activate

- Designing MySQL or MariaDB tables, indexes, and constraints
- Reviewing migrations before they run on large production tables
- Debugging slow queries, lock waits, deadlocks, or connection exhaustion
- Adding keyset pagination, upserts, full-text search, JSON columns, or queues
- Configuring application connection pools, read replicas, TLS, or slow logs

## Core Principles

1. **Version first** — `SELECT VERSION()`; MySQL and MariaDB diverge, never assume
2. **Equality-first indexes** — composite order follows predicates; `EXPLAIN` before adding
3. **Keyset over OFFSET** — deep `OFFSET` scans and discards; cursor + matching index
4. **Short transactions** — deterministic lock order, no external calls inside
5. **Least privilege** — app user gets CRUD on its DB only, TLS across hosts

## Example

```sql
SELECT id, name, created_at
FROM products
WHERE (created_at, id) < (?, ?)
ORDER BY created_at DESC, id DESC
LIMIT 50;
-- index: CREATE INDEX idx_products_created_id ON products (created_at, id);
```

## References

- `references/schema-indexing.md` — version check, schema defaults, composite indexes, `EXPLAIN` signals
- `references/queries.md` — upsert (both engines), keyset pagination, JSON, full-text
- `references/transactions-pools.md` — locking order, deadlocks, `SKIP LOCKED` queues, pools
- `references/ops-security.md` — diagnostics, replication, users/TLS, config, anti-patterns, related

## Checklist

- [ ] Engine/version confirmed before engine-specific syntax
- [ ] Explicit columns, matching index, `EXPLAIN` clean (no `ALL`/filesort on hot paths)
- [ ] Transactions short, locks ordered, deadlock retry bounded
- [ ] Pool recycle below `wait_timeout`; read-after-write pinned to primary
- [ ] App user least-privilege + TLS; secrets in manager, never in repo
