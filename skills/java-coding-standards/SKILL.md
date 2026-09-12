---
name: java-coding-standards
description: "Use when java coding standards for Spring Boot and Quarkus services: naming, immutability, Optional usage, streams, exceptions, generics, CDI, reactive patterns, and project layout. Automatically applies framework-specific conventions. Triggers on \"java-coding-standards\", \"java coding standards\", \"standards\"."
metadata:
  origin: ECC
---

# Java Coding Standards

Standards for readable, maintainable Java (17+) in Spring Boot and Quarkus services. Details and code in `references/`.

## When to Activate

- Writing or reviewing Java code in Spring Boot or Quarkus projects
- Enforcing naming, immutability, or exception handling conventions
- Working with records, sealed classes, or pattern matching (Java 17+)
- Reviewing use of Optional, streams, or generics
- Structuring packages and project layout
- **[QUARKUS]**: Working with CDI scopes, Panache entities, or reactive pipelines

## Example

```java
return market
    .map(MarketResponse::from)
    .orElseThrow(() -> new EntityNotFoundException("Market not found"));
```

## References

- `references/foundations.md` — framework detection, core principles
- `references/naming-types.md` — naming, immutability, Optional, streams, generics
- `references/di-reactive.md` — dependency injection, reactive patterns [QUARKUS]
- `references/errors-config.md` — exceptions, logging, null handling, configuration
- `references/structure-testing.md` — project structure, style, smells, testing

## Checklist

- Detect framework first: `quarkus` → [QUARKUS], `spring-boot` → [SPRING], else shared only
- Immutable by default (records, final fields); constructor injection, no field `@Autowired`
- Optional via map/flatMap, never bare get(); short stream pipelines
- Domain exceptions + centralized handler; fail fast with context
- Short methods, no magic numbers, no silent catches; tests: JUnit 5 + AssertJ + Mockito
