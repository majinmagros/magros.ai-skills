---
name: tinystruct-patterns
description: "Use when developing with the tinystruct Java framework — Application classes, @Action routes, JSON, persistence, SSE, uploads, and MCP tools. Triggers on \"tinystruct-patterns\", \"tinystruct\", \"@Action\"."
metadata:
  origin: ECC
---

# tinystruct Development Patterns

Dual-mode Java framework: CLI and HTTP are equal citizens, no `main()` needed. Detalhes em `references/`.

## When to Activate

- Creating `Application` modules extending `AbstractApplication`
- Defining routes and CLI actions with `@Action`
- JSON via native `Builder`/`Builders`; persistence via `AbstractData` POJOs
- SSE push, file uploads, outbound HTTP with `URLRequest`
- MCP tools/servers, config, or routing/CLI debugging

## Core Principles

1. **Dual-mode actions** — every `@Action` runs from terminal and browser
2. **`init()` for setup, `@Action` for discovery** — no `main()`, no manual registry
3. **Zero-dependency JSON** — `Builder`/`Builders`, never Gson/Jackson
4. **Mode-aware actions** — restrict sensitive ops to CLI or specific HTTP verbs
5. **Sanitize MCP inputs** — tool returns feed the model context (prompt injection)

## Example

```java
public class MyService extends AbstractApplication {
    @Override public void init() { setTemplateRequired(false); }
    @Action("greet")
    public String greet(String name) { return "Hello, " + name + "!"; }
}
```

## References

- `references/architecture.md` — abstractions, package map, properties
- `references/routing.md` — annotation details, modes, parameters
- `references/data-handling.md` — Builder, Builders, JSON serialization
- `references/database.md` — AbstractData POJOs, CRUD, mapping XML, generation
- `references/system-usage.md` — Context, sessions, SSE, uploads, events, networking
- `references/testing.md` — JUnit 5 unit and HTTP integration testing
- `references/mcp-integration.md` — MCP tools/servers, prompt-injection sanitizing
- `references/config-antipatterns.md` — application.properties, red flags, best practices

## Checklist

- [ ] `public` `@Action` methods; `setTemplateRequired(false)` for API-only apps
- [ ] `Builders` for arrays, `Builder` for objects; no external JSON lib
- [ ] Explicit `mode` where GET/POST or CLI/HTTP could collide
- [ ] MCP tool args validated (length, charset, nullity) before returning
- [ ] Config externalized in `application.properties`; entry via `bin/dispatcher`
