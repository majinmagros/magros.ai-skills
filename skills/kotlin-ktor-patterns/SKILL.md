---
name: kotlin-ktor-patterns
description: "Use when ktor server patterns including routing DSL, plugins, authentication, Koin DI, kotlinx.serialization, WebSockets, and testApplication testing. Only for Kotlin/Ktor — not for other frameworks. Triggers on \"kotlin-ktor-patterns\", \"kotlin ktor patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Ktor Server Patterns

Comprehensive Ktor patterns for building robust, maintainable HTTP servers with Kotlin coroutines.

## When to Activate

- Building Ktor HTTP servers
- Configuring Ktor plugins (Auth, CORS, ContentNegotiation, StatusPages)
- Implementing REST APIs with Ktor
- Setting up dependency injection with Koin
- Writing Ktor integration tests with testApplication
- Working with WebSockets in Ktor

## When NOT to Use

- Other frameworks (use `kotlin-ktor-patterns` only for Ktor; Spring Boot → `springboot-patterns`)
- Kotlin idioms in general (use `kotlin-patterns`)
- Kotlin testing in general (use `kotlin-testing`)

## Contents

| Topic | Reference |
|---|---|
| Project layout, entry point, routing | `references/structure-routing.md` |
| Serialization (kotlinx.serialization) | `references/serialization.md` |
| JWT auth, auth routes, StatusPages | `references/auth-errors.md` |
| CORS, Koin DI, validation | `references/cors-koin.md` |
| WebSockets, testApplication | `references/websockets-testing.md` |
| application.yaml config | `references/config.md` |

## Example

```kotlin
// Thin route → service (idiomatic Ktor)
routing {
    authenticate("auth-jwt") {
        get("/orders") {
            call.respond(orderService.listRecent())
        }
    }
}
```

## Quick Reference: Ktor Patterns

| Pattern | Description |
|---------|-------------|
| `route("/path") { get { } }` | Route grouping with DSL |
| `call.receive<T>()` | Deserialize request body |
| `call.respond(status, body)` | Send response with status |
| `call.parameters["id"]` | Read path parameters |
| `call.request.queryParameters["q"]` | Read query parameters |
| `install(Plugin) { }` | Install and configure plugin |
| `authenticate("name") { }` | Protect routes with auth |
| `by inject<T>()` | Koin dependency injection |
| `testApplication { }` | Integration testing |

## Referências

- `references/structure-routing.md` — layout, entry point, rotas
- `references/serialization.md` — models, serializers custom
- `references/auth-errors.md` — JWT, rotas auth, StatusPages
- `references/cors-koin.md` — CORS, Koin, validacao
- `references/websockets-testing.md` — WebSockets, testes
- `references/config.md` — application.yaml

**Remember**: Ktor is designed around Kotlin coroutines and DSLs. Keep routes thin, push logic to services, and use Koin for dependency injection. Test with `testApplication` for full integration coverage.
