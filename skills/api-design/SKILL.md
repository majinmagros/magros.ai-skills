---
name: api-design
description: "Use when rEST API design patterns including resource naming, status codes, pagination, filtering, error responses, versioning, and rate limiting for production APIs. Triggers on \"api-design\", \"api design\", \"design\"."
metadata:
  origin: ECC
---

# API Design Patterns

Conventions and best practices for designing consistent, developer-friendly REST APIs. Contract in `references/contract.md`, implementations in `references/implementations.md`.

## When to Activate

- Designing new API endpoints
- Reviewing existing API contracts
- Adding pagination, filtering, or sorting
- Implementing error handling for APIs
- Planning API versioning strategy
- Building public or partner-facing APIs

## Contract Rules (resumo)

- **Resources:** plural lowercase kebab-case nouns (`/api/v1/team-members`); sub-resources for ownership (`/users/:id/orders`); verbs sparingly, only non-CRUD (`POST /orders/:id/cancel`)
- **Methods:** GET safe/idempotent (reads) · POST create/actions · PUT full replace · PATCH partial · DELETE remove
- **Status:** 200 GET/PUT/PATCH · 201 + `Location` on create · 204 no-body · 400 validation · 401 unauthenticated · 403 unauthorized · 404 · 409 conflict · 422 semantic errors · 429 + `Retry-After` · 500 never leaks details (502 upstream, 503 + `Retry-After`)
- **Envelopes:** `{data}` + `{error: {code, message, details[]}}`; collections add `{meta: {total, page, per_page, total_pages}, links: {self, next, last}}`; public = envelope wrapper, internal = flat + status codes
- **Pagination:** offset for dashboards/search (<10K, page numbers); cursor for feeds/large/public (stable, `has_next` + opaque `next_cursor`)
- **Query:** `?status=active` equality · `price[gte]/[lte]` ranges · comma multi-values · dot nested fields · `sort=-created_at` · `?q=` full-text · `?fields=` sparse fieldsets
- **Auth:** Bearer header / API keys server-to-server; ownership check (404 then 403) + role middleware
- **Rate limits:** headers (`X-RateLimit-*`, 429 + `Retry-After` + code); tiers 30/min anon → 100 user → 1000 premium → 10000 internal
- **Versioning:** URL path (recommended); max 2 active versions; 6-month sunset (`Sunset` header → 410); additive changes don't version, breaking ones do

```http
POST /api/v1/users → 201 Created + Location: /api/v1/users/abc-123
GET  /api/v1/users?status=active&sort=-created_at&fields=id,name  → 200 + {data, meta, links}
```

## Implementations

Same create-user contract (Zod/DRF validation → 422 envelope → 201 + Location; Go: domain-error switch → 409/500) in TypeScript (Next.js), Python (DRF), Go (net/http) → `references/implementations.md`.

## API Design Checklist

Before shipping a new endpoint:

- [ ] Resource URL follows naming conventions (plural, kebab-case, no verbs)
- [ ] Correct HTTP method used (GET for reads, POST for creates, etc.)
- [ ] Appropriate status codes returned (not 200 for everything)
- [ ] Input validated with schema (Zod, Pydantic, Bean Validation)
- [ ] Error responses follow standard format with codes and messages
- [ ] Pagination implemented for list endpoints (cursor or offset)
- [ ] Authentication required (or explicitly marked as public)
- [ ] Authorization checked (user can only access their own resources)
- [ ] Rate limiting configured
- [ ] Response does not leak internal details (stack traces, SQL errors)
- [ ] Consistent naming with existing endpoints (camelCase vs snake_case)
- [ ] Documented (OpenAPI/Swagger spec updated)
