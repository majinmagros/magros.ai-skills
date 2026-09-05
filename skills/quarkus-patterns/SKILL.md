---
name: quarkus-patterns
description: "Use when quarkus 3.x LTS architecture patterns with Camel for messaging, RESTful API design, CDI services, data access with Panache, and async processing. Use for Java Quarkus backend work with event-driven architectures. Only for Quarkus — not for other stacks. Triggers on \"quarkus-patterns\", \"quarkus patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Quarkus Development Patterns

Quarkus 3.x architecture and API patterns for cloud-native, event-driven services with Apache Camel.

## When to Activate

- Building REST APIs with JAX-RS or RESTEasy Reactive
- Structuring resource → service → repository layers
- Implementing event-driven patterns with Apache Camel and RabbitMQ
- Configuring Hibernate Panache, caching, or reactive streams
- Adding validation, exception mapping, or pagination
- Setting up profiles for dev/staging/production environments (YAML config)
- Custom logging with LogContext and Logback/Logstash encoder
- Working with CompletableFuture for async operations
- Implementing conditional flow processing
- Working with GraalVM native compilation

## When NOT to Use

- Other stacks (use `springboot-patterns` for Spring Boot, `django-patterns`, etc.)
- Quarkus testing specifically (use `quarkus-tdd`, `quarkus-verification`)
- Quarkus security review (use `quarkus-security`)

## Contents

| Topic | Reference |
|---|---|
| Service layer, logging context | `references/services-logging.md` |
| Events, Camel routes (RabbitMQ, file, bean) | `references/events-camel.md` |
| REST, Panache repo, transactions, DTOs | `references/rest-data.md` |
| Async, caching, YAML config | `references/async-config.md` |
| Health checks, Maven deps | `references/ops-deps.md` |

## Example

```java
// Panache repository + transactional service (idiomatic Quarkus)
@ApplicationScoped
public class OrderRepository implements PanacheRepository<Order> {
    public List<Order> findRecent(int limit) {
        return find("order by createdAt desc").page(0, limit).list();
    }
}

@ApplicationScoped
public class OrderService {
    @Inject OrderRepository orders;

    @Transactional
    public Order place(Order order) {
        orders.persist(order);
        return order;
    }
}
```

## Best Practices

### Architecture
- Use `@RequiredArgsConstructor` with Lombok for constructor injection
- Keep service layer thin; delegate complex logic to specialized classes
- Use Camel routes for message routing and integration patterns
- Prefer Panache Repository pattern for data access

### Event-Driven
- Always track operations with EventService (success/error events)
- Use Camel `direct:` endpoints for in-memory routing
- Use `spring-rabbitmq` component for RabbitMQ integration
- Implement async publishing with `ProducerTemplate.asyncSendBody()`

### Logging
- Use Logback with Logstash encoder for structured logging
- Propagate LogContext through service calls with `SafeAutoCloseable`
- Add contextual information to LogContext for request tracing
- Use `@Slf4j` instead of manual logger instantiation

### Async Operations
- Use CompletableFuture for non-blocking I/O operations
- Call `.join()` when you need to wait for completion
- Handle exceptions from CompletableFuture properly
- Pass LogContext to async operations for tracing

### Configuration
- Use YAML configuration (`quarkus-config-yaml`)
- Profile-aware configuration for dev/test/prod environments
- Externalize sensitive configuration to environment variables
- Use `@ConfigProperty` for type-safe config injection

### Validation
- Validate at resource layer with `@Valid`
- Use Bean Validation annotations on DTOs
- Map exceptions to proper HTTP responses with `@Provider`

### Transactions
- Use `@Transactional` on service methods that modify data
- Keep transactions short and focused
- Avoid calling async operations within transactions

### Testing
- Use `camel-quarkus-junit5` for route testing
- Use AssertJ for assertions
- Mock all external dependencies
- Test conditional flow logic thoroughly

### Quarkus-Specific
- Stay on latest LTS version (3.x)
- Use Quarkus dev mode for hot reload
- Add health checks for production readiness
- Test native compilation compatibility periodically

## Referências

- `references/services-logging.md` — services, LogContext
- `references/events-camel.md` — eventos, rotas Camel
- `references/rest-data.md` — REST, Panache, transacoes, DTOs
- `references/async-config.md` — CompletableFuture, cache, YAML
- `references/ops-deps.md` — health checks, Maven

**Remember**: Quarkus is Kubernetes-native Java. Keep services thin, routes explicit, and configuration externalized — dev mode gives you instant feedback, so use it.
