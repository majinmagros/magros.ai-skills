---
name: quarkus-tdd
description: "Test-driven development for Quarkus 3.x LTS using JUnit 5, Mockito, REST Assured, Camel testing, and JaCoCo. Use when adding features, fixing bugs, or refactoring event-driven services. Only for Quarkus — not for other stacks. Triggers on \"quarkus-tdd\", \"quarkus tdd\", \"tdd\"."
metadata:
  origin: ECC
---

# Quarkus TDD Workflow

TDD guidance for Quarkus 3.x services with 80%+ coverage (unit + integration). Optimized for event-driven architectures with Apache Camel.

## When to Use

- New features or REST endpoints
- Bug fixes or refactors
- Adding data access logic, security rules, or reactive streams
- Testing Apache Camel routes and event handlers
- Testing event-driven services with RabbitMQ
- Testing conditional flow logic
- Validating CompletableFuture async operations
- Testing LogContext propagation

## When NOT to Use

- Other stacks (use `springboot-tdd`, `django-tdd`, `laravel-tdd`, etc.)
- Quarkus patterns in general (use `quarkus-patterns`)
- Quarkus verification loop (use `quarkus-verification`)

## Workflow

1. Write tests first (they should fail)
2. Implement minimal code to pass
3. Refactor with tests green
4. Enforce coverage with JaCoCo (80%+ target)

## Example

```java
// AAA with @Nested + AssertJ (idiomatic Quarkus test)
@QuarkusTest
class OrderServiceTest {
    @InjectMock OrderRepository orders;

    @Test
    void rejectsEmptyOrder() {
        // ARRANGE
        var order = new Order(List.of());
        // ACT + ASSERT
        assertThatThrownBy(() -> service.place(order))
            .isInstanceOf(ValidationException.class);
    }
}
```

## Contents

| Topic | Reference |
|---|---|
| Unit tests (@Nested, patterns) | `references/unit-tests.md` |
| Camel route testing | `references/camel-routes.md` |
| Event service testing | `references/event-services.md` |
| CompletableFuture testing | `references/completablefuture.md` |
| REST Assured resource tests | `references/rest-assured.md` |
| Integration tests, JaCoCo | `references/integration-coverage.md` |
| Maven test dependencies | `references/test-dependencies.md` |