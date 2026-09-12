---
name: nestjs-patterns
description: "Use when building NestJS APIs with modules, validation, guards, config, and testing. Triggers on \"nestjs-patterns\", \"nestjs patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# NestJS Development Patterns

Modular TypeScript backends: thin controllers, validated DTOs, guarded routes. Detalhes em `references/`.

## When to Activate

- Building NestJS APIs or services
- Structuring modules, controllers, and providers
- Adding DTO validation, guards, interceptors, or exception filters
- Configuring environment-aware settings and database integrations
- Testing NestJS units or HTTP endpoints

## Core Principles

1. **Thin controllers** — parse input, call service, return response DTO
2. **Validate globally** — one ValidationPipe with whitelist + forbidNonWhitelisted
3. **Guards coarse, services fine** — roles in guards, ownership in services
4. **One error envelope** — central filter; never leak hashes/tokens
5. **Env fails at boot** — typed config; transactions owned by services

## Example

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

## References

- `references/structure-bootstrap.md` — feature-module layout, global ValidationPipe bootstrap
- `references/modules-controllers.md` — module/controller/service split, class-validator DTOs
- `references/auth-errors-config.md` — guards, exception filter, env validation, transactions
- `references/testing-production.md` — TestingModule patterns, logging, health, jobs, rate limits

## Checklist

- [ ] Global pipe: whitelist + forbidNonWhitelisted + transform
- [ ] No business logic in controllers; no ORM entities in responses
- [ ] Guards + service-level authorization both present
- [ ] Single error envelope; env validated at boot
- [ ] Tests reuse production pipes/filters
