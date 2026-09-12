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
