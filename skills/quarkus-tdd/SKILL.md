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

## Best Practices

### Test Organization
- Use `@Nested` classes to group tests by method being tested
- Use `@DisplayName` for readable test descriptions visible in reports
- Follow `givenX_whenY_thenZ` naming convention for test methods
- Use `@BeforeEach` for common test data setup to reduce duplication

### Test Structure
- Follow AAA pattern with explicit comments (`// ARRANGE`, `// ACT`, `// ASSERT`)
- Use `assertDoesNotThrow` for success scenarios
- Use `assertThrows` for exception scenarios with message validation
- Verify exception messages match expected values using AssertJ `contains()` or `isEqualTo()`

### Test Coverage
- Test happy paths for all public methods
- Test null input handling
- Test edge cases (empty collections, boundary values, negative IDs, blank strings)
- Test exception scenarios comprehensively
- Mock all external dependencies (repositories, services, Camel endpoints)
- Aim for 80%+ line coverage, 70%+ branch coverage

### Assertions
- **Prefer AssertJ** (`assertThat`) over JUnit assertions for value checks
- Use fluent AssertJ API for readability: `assertThat(list).hasSize(3).contains(item)`
- For exceptions: use JUnit `assertThrows` to capture, then AssertJ to validate the message
- For non-throwing success paths: use JUnit `assertDoesNotThrow`
- For collections: `extracting()`, `filteredOn()`, `containsExactly()`

### Testing Integration
- Use `@QuarkusTest` for integration tests
- Use `@InjectMock` to mock dependencies in Quarkus tests
- Prefer REST Assured for API testing
- Use `@TestProfile` for test-specific configuration

### Event-Driven Testing
- Test Camel routes with `AdviceWith` and `MockEndpoint`
- Use `@CamelQuarkusTest` annotation (if using standalone Camel tests)
- Verify message content, headers, and routing logic
- Test error handling routes separately
- Mock external systems (RabbitMQ, S3, databases) in unit tests

### Camel Route Testing
- Use `MockEndpoint` for asserting message flow
- Use `AdviceWith` to modify routes for testing (replace endpoints with mocks)
- Test message transformation and marshalling
- Test exception handling and dead letter queues

### Testing Async Operations
- Test CompletableFuture success and failure scenarios
- Use `.join()` in tests to wait for async completion
- Test exception propagation from CompletableFuture
- Verify LogContext propagation to async operations

### Performance
- Keep tests fast and isolated
- Run tests in continuous mode: `mvn quarkus:test`
- Use parameterized tests (`@ParameterizedTest`) for input variations
- Build reusable test data builders or factory methods

### Quarkus-Specific
- Stay on latest LTS version (Quarkus 3.x)
- Test native compilation compatibility periodically
- Use Quarkus test profiles for different scenarios
- Leverage Quarkus dev services for local testing
- Use `@InjectMock` instead of `@MockBean` (Quarkus-specific)

### Verification Best Practices
- Always verify interactions on mocked dependencies
- Use `verify(mock, never())` to ensure methods are NOT called in error scenarios
- Use `argThat()` for complex argument matching
- Verify the order of calls when it matters: `InOrder` from Mockito

## Referências

- `references/unit-tests.md` — @Nested, padroes de teste
- `references/camel-routes.md` — rotas Camel
- `references/event-services.md` — event services
- `references/completablefuture.md` — async
- `references/rest-assured.md` — testes REST
- `references/integration-coverage.md` — integracao, JaCoCo
- `references/test-dependencies.md` — dependencias Maven

**Remember**: RED first, always. A Quarkus test that never failed proves nothing — watch it fail, then make it pass.
