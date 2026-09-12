# Queries and Transactions

### `include` vs `select`

| | `include` | `select` |
|---|---|---|
| Returns | All scalar fields + specified relations | Only specified fields |
| Use when | You need most fields plus a relation | Hot paths, large tables, avoiding over-fetch |
| Performance | May over-fetch on wide tables | Minimal payload, faster on large datasets |
| Prisma 5 note | Uses JOIN by default (`relationJoins`) | Same |

```ts
// include — all columns + relation
const user = await prisma.user.findUnique({
  where: { id },
  include: { posts: { select: { id: true, title: true } } },
});

// select — explicit allowlist
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, name: true },
});
```

Never return raw Prisma entities from API responses — map to response DTOs to control exposed fields:

```ts
// BAD: leaks passwordHash, deletedAt, internal fields
return await prisma.user.findUniqueOrThrow({ where: { id } });

// GOOD: explicit DTO mapping
const user = await prisma.user.findUniqueOrThrow({ where: { id } });
return { id: user.id, name: user.name, email: user.email };
```

### Transaction Form Selection

| Situation | Use |
|---|---|
| Independent operations, no inter-dependency | Array form |
| Later step depends on earlier result | Interactive form |
| External calls (email, HTTP) involved | Outside transaction entirely |

```ts
// Array form — batched in one round trip
const [user, post] = await prisma.$transaction([
  prisma.user.update({ where: { id }, data: { name } }),
  prisma.post.create({ data: { title, authorId: id } }),
]);

// Interactive form — use tx client only, never the outer prisma client
const post = await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUniqueOrThrow({ where: { id } });
  if (user.role !== 'ADMIN') throw new Error('Forbidden');
  return tx.post.create({ data: { title, authorId: user.id } });
});
```

### PrismaClient Singleton

Each `PrismaClient` instance opens its own connection pool. Instantiate once.

```ts
// lib/prisma.ts

// Option A — adapter-based initialization (required by newer Prisma installs)
import { PrismaClient } from '@prisma/client'; // or the generated client path for your setup
import { PrismaPg } from '@prisma/adapter-pg';

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Option B — direct initialization (older installs, no adapter needed)
// import { PrismaClient } from '@prisma/client';
// export const prisma = globalForPrisma.prisma ?? new PrismaClient({ ... });
```

Use Option A if your Prisma install requires an `adapter` argument in the `PrismaClient` constructor.
Use Option B if `new PrismaClient()` works without arguments. Let the compiler tell you which is correct.

The `globalThis` pattern prevents duplicate instances during hot reload (Next.js, nodemon, ts-node-dev).

### N+1 Problem

Loading relations inside a loop issues one query per row.

```ts
// BAD: N+1 — one extra query per user
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } });
}

// GOOD: single query
const users = await prisma.user.findMany({ include: { posts: true } });
```

With Prisma 5+ `relationJoins`, the `include` form uses a single JOIN. On large 1:N sets this may increase result set size — benchmark both approaches if the relation can return many rows per parent.
