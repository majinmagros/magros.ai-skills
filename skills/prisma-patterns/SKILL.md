---
name: prisma-patterns
description: "Use when prisma ORM patterns for TypeScript backends — schema design, query optimization, transactions, pagination, and critical traps like updateMany returning count not records, $transaction timeouts, migrate dev resetting the DB, @updatedAt skipped on bulk writes,... Triggers on \"prisma-patterns\", \"prisma patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Prisma Patterns

Production patterns and non-obvious traps for Prisma ORM in TypeScript backends.

> **Check your version before applying patterns.** The Prisma API surface has evolved across major releases:
>
> ```bash
> npx prisma --version
> ```
>
> Notable API differences across versions:
> - `relationJoins` can load relations via JOIN rather than separate queries, but may cause row explosion on large 1:N relations or deep `include` — benchmark both approaches
> - `omit` field modifier and `prisma.$extends` Client Extensions API were added
> - **Newer installs**: the package may be named `prisma` instead of `@prisma/client`; `PrismaClient` may require a driver adapter (e.g. `@prisma/adapter-pg`); `datasource.url` may live in `prisma.config.ts` instead of `schema.prisma`
> - CLI commands (`migrate dev`, `migrate deploy`, `generate`) are unchanged across versions

## When to Activate

- Designing or modifying Prisma schema models and relations
- Writing queries, transactions, or pagination logic
- Using `updateMany`, `deleteMany`, or any bulk operation
- Running or planning database migrations
- Deploying to serverless environments (Vercel, Lambda, Cloudflare Workers)
- Implementing soft delete or multi-tenant row filtering

## Core Concepts

### ID Strategy

| Strategy | Use When | Avoid When |
|---|---|---|
| `@default(cuid())` | Default choice — URL-safe, sortable, no collisions | Sequential IDs needed for external systems |
| `@default(uuid())` | Interoperability with non-Prisma systems required | High-write tables (random UUIDs fragment B-tree indexes) |
| `@default(autoincrement())` | Internal join tables, audit logs | Public-facing IDs (exposes record count) |

### Schema Defaults

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique  // @unique already creates an index — no @@index needed
  name      String
  role      Role      @default(USER)
  posts     Post[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@index([createdAt])
  @@index([deletedAt, createdAt]) // composite for soft-delete + sort queries
}
```

- Add `@@index` on every foreign key and column used in `WHERE` or `ORDER BY`.
- Declare `deletedAt DateTime?` upfront when soft delete is a foreseeable requirement — adding it later requires a migration on a live table.
- `updatedAt @updatedAt` is set automatically by Prisma on `update` and `upsert` only (see Anti-Patterns for bulk update trap).

### `include` vs `select`