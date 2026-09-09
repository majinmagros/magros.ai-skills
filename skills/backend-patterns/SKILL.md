---
name: backend-patterns
description: "Use when backend architecture patterns, API design, database optimization, and server-side best practices for Node.js, Express, and Next.js API routes. Triggers on \"backend-patterns\", \"backend patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Backend Development Patterns

Backend architecture patterns and best practices for scalable server-side applications. Code in `references/`.

## When to Activate

- Designing REST or GraphQL API endpoints
- Implementing repository, service, or controller layers
- Optimizing database queries (N+1, indexing, connection pooling)
- Adding caching (Redis, in-memory, HTTP cache headers)
- Setting up background jobs or async processing
- Structuring error handling and validation for APIs
- Building middleware (auth, logging, rate limiting)

## Patterns (resumo — código em `references/`)

- **API design** (`api-design.md`): resource URLs + query params; Repository interface (Supabase impl); Service layer (business logic off data access); `withAuth` middleware pipeline
- **Database** (`database.md`): select columns (never `*`); N+1 → batch fetch + Map; transactions via Supabase RPC `plpgsql` function (auto-rollback on exception)
- **Caching + errors** (`caching-errors.md`): Redis decorator repo + `invalidateCache`; cache-aside (5min TTL); `ApiError` + centralized handler (Zod → 400, unknown → 500 + log); `fetchWithRetry` exponential backoff 1s/2s/4s

```typescript
// Regras de ouro:
const markets = await getMarkets();                    // nunca select('*')
const data = await fetchWithRetry(() => fetchFromAPI()); // backoff 1s/2s/4s
```

- **Auth** (`auth.md`): `verifyToken` + `requireAuth` (Bearer); RBAC matrix (admin/moderator/user) + `requirePermission('delete')` HOF wrapper
- **Rate limiting**: shared store only (Redis/gateway/native) — never per-process in-memory (resets on deploy, splits replicas, fails open serverless). HTTP contract → `api-design`; abuse review → `security-review`
- **Jobs + logging** (`jobs-logging.md`): `JobQueue<T>` (queue instead of blocking); JSON `Logger` (requestId, method/path, error+stack)

**Remember**: choose patterns that fit your complexity level.

## Related Skills

- `api-design` — HTTP contract (URLs, status codes, envelopes, versioning)
- `security-review` — abuse-case review for auth/rate-limit decisions
- `database-migrations` — schema evolution behind transactional services
