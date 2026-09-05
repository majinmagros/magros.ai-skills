---
name: kotlin-exposed-patterns
description: "Use when jetBrains Exposed ORM patterns including DSL queries, DAO pattern, transactions, HikariCP connection pooling, Flyway migrations, and repository pattern. Only for Kotlin/Exposed — not for other stacks. Triggers on \"kotlin-exposed-patterns\", \"kotlin exposed patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Kotlin Exposed Patterns

Comprehensive patterns for database access with JetBrains Exposed ORM, including DSL queries, DAO, transactions, and production-ready configuration.

## When to Use

- Setting up database access with Exposed
- Writing SQL queries using Exposed DSL or DAO
- Configuring connection pooling with HikariCP
- Creating database migrations with Flyway
- Implementing the repository pattern with Exposed
- Handling JSON columns and complex queries

## When NOT to Use

- Other ORMs/stacks (use `kotlin-ktor-patterns` for Ktor, Django → `django-patterns`)
- Kotlin idioms in general (use `kotlin-patterns`)
- Kotlin testing in general (use `kotlin-testing`)

## How It Works

Exposed provides two query styles: DSL for direct SQL-like expressions and DAO for entity lifecycle management. HikariCP manages a pool of reusable database connections configured via `HikariConfig`. Flyway runs versioned SQL migration scripts at startup to keep the schema in sync. All database operations run inside `newSuspendedTransaction` blocks for coroutine safety and atomicity. The repository pattern wraps Exposed queries behind an interface so business logic stays decoupled from the data layer and tests can use an in-memory H2 database.

## Examples

**DSL query:**
```kotlin
suspend fun findUserById(id: UUID): UserRow? =
    newSuspendedTransaction {
        UsersTable.selectAll()
            .where { UsersTable.id eq id }
            .map { it.toUser() }
            .singleOrNull()
    }
```

**DAO entity usage:**
```kotlin
suspend fun createUser(request: CreateUserRequest): User =
    newSuspendedTransaction {
        UserEntity.new {
            name = request.name
            email = request.email
            role = request.role
        }.toModel()
    }
```

**HikariCP configuration:**
```kotlin
val hikariConfig = HikariConfig().apply {
    driverClassName = config.driver
    jdbcUrl = config.url
    username = config.username
    password = config.password
    maximumPoolSize = config.maxPoolSize
    isAutoCommit = false
    transactionIsolation = "TRANSACTION_READ_COMMITTED"
    validate()
}
```

## Contents

| Topic | Reference |
|---|---|
| HikariCP, Flyway, migrations | `references/setup.md` |
| Tables, DSL CRUD, pagination, batch | `references/tables-dsl.md` |
| DAO entities, transactions | `references/dao-transactions.md` |
| Repository, JSONB columns | `references/repository-json.md` |
| Testing, Gradle deps | `references/testing-deps.md` |

## Quick Reference: Exposed Patterns

| Pattern | Description |
|---------|-------------|
| `object Table : UUIDTable("name")` | Define table with UUID primary key |
| `newSuspendedTransaction { }` | Coroutine-safe transaction block |
| `Table.selectAll().where { }` | Query with conditions |
| `Table.insertAndGetId { }` | Insert and return generated ID |
| `Table.update({ condition }) { }` | Update matching rows |
| `Table.deleteWhere { }` | Delete matching rows |
| `Table.batchInsert(items) { }` | Efficient bulk insert |
| `innerJoin` / `leftJoin` | Join tables |
| `orderBy` / `limit` / `offset` | Sort and paginate |
| `count()` / `sum()` / `avg()` | Aggregation functions |

## Referências

- `references/setup.md` — HikariCP, Flyway
- `references/tables-dsl.md` — tabelas, CRUD, paginacao, batch
- `references/dao-transactions.md` — entidades, transacoes
- `references/repository-json.md` — repositorio, JSONB
- `references/testing-deps.md` — H2, Gradle

**Remember**: Use the DSL style for simple queries and the DAO style when you need entity lifecycle management. Always use `newSuspendedTransaction` for coroutine support, and wrap database operations behind a repository interface for testability.
