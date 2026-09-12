---
name: database-migrations
description: "Use when database migration best practices for schema changes, data migrations, rollbacks, and zero-downtime deployments across PostgreSQL, MySQL, and common ORMs (Prisma, Drizzle, Kysely, Django, TypeORM, golang-migrate). Triggers on \"database-migrations\", \"database migrations\", \"migrations\"."
metadata:
  origin: ECC
---

# Database Migration Patterns

Safe, reversible schema changes: forward-only in production, schema and data migrations separate, expand-contract for renames. Detalhes em `references/`.

## When to Activate

- Creating or altering database tables
- Adding/removing columns or indexes
- Running data migrations (backfill, transform)
- Planning zero-downtime schema changes
- Setting up migration tooling for a new project

## Core Principles

1. **Every change is a migration** — never alter production manually
2. **Forward-only in production** — rollbacks are new forward migrations
3. **Schema and data separate** — never mix DDL and DML
4. **Test at production scale** — 100 rows OK can lock at 10M
5. **Immutable once deployed** — never edit a ran migration

## Safety Checklist

- [ ] UP and DOWN (or explicitly irreversible)
- [ ] No full table locks (concurrent ops on large tables)
- [ ] New columns nullable or with default
- [ ] Indexes via `CONCURRENTLY`, backfill in separate migration
- [ ] Tested on production-data copy, rollback plan documented

## Example

```sql
-- Safe: nullable first, no lock, no rewrite
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- Unsafe: NOT NULL without default rewrites every row
-- ALTER TABLE users ADD COLUMN role TEXT NOT NULL;
```

## References

- `references/postgres-patterns.md` — safe ADD COLUMN, concurrent index, rename/drop, batched backfill
- `references/orms-ts.md` — Prisma, Drizzle, Kysely workflows + migration files
- `references/orms-py-go.md` — Django data migrations, SeparateDatabaseAndState, golang-migrate
- `references/zero-downtime.md` — expand-contract phases, timeline, anti-patterns table
