---
name: kotlin-patterns
description: "Use when idiomatic Kotlin patterns, best practices, and conventions for building robust, efficient, and maintainable Kotlin applications with coroutines, null safety, and DSL builders. Only for Kotlin — not for other languages. Triggers on \"kotlin-patterns\", \"kotlin patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Kotlin Development Patterns

Idiomatic Kotlin patterns and best practices for building robust, efficient, and maintainable applications.

## When to Use

- Writing new Kotlin code
- Reviewing Kotlin code
- Refactoring existing Kotlin code
- Designing Kotlin modules or libraries
- Configuring Gradle Kotlin DSL builds

## When NOT to Use

- Other languages (use `golang-patterns`, `python-patterns`, etc.)
- Kotlin test strategy specifically (use `kotlin-testing`)
- Ktor/Exposed specifics (use `kotlin-ktor-patterns`, `kotlin-exposed-patterns`)

## How It Works

This skill enforces idiomatic Kotlin conventions across seven key areas: null safety using the type system and safe-call operators, immutability via `val` and `copy()` on data classes, sealed classes and interfaces for exhaustive type hierarchies, structured concurrency with coroutines and `Flow`, extension functions for adding behaviour without inheritance, type-safe DSL builders using `@DslMarker` and lambda receivers, and Gradle Kotlin DSL for build configuration.

## Examples

**Null safety with Elvis operator:**
```kotlin
fun getUserEmail(userId: String): String {
    val user = userRepository.findById(userId)
    return user?.email ?: "unknown@example.com"
}
```

**Sealed class for exhaustive results:**
```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Failure(val error: AppError) : Result<Nothing>()
    data object Loading : Result<Nothing>()
}
```

**Structured concurrency with async/await:**
```kotlin
suspend fun fetchUserWithPosts(userId: String): UserProfile =
    coroutineScope {
        val user = async { userService.getUser(userId) }
        val posts = async { postService.getUserPosts(userId) }
        UserProfile(user = user.await(), posts = posts.await())
    }
```

## Contents

| Topic | Reference |
|---|---|
| Core principles (null safety, immutability, data classes) | `references/core-principles.md` |
| Sealed classes and interfaces | `references/sealed-classes.md` |
| Scope functions | `references/scope-functions.md` |
| Extension functions | `references/extensions.md` |
| Coroutines (structured, Flow, cancellation) | `references/coroutines.md` |
| Delegation (property, interface) | `references/delegation.md` |
| DSL builders | `references/dsl-builders.md` |
| Sequences and Gradle Kotlin DSL | `references/sequences-gradle.md` |
| Error handling and collections | `references/error-collections.md` |

## Quick Reference: Kotlin Idioms

| Idiom | Description |
|-------|-------------|
| `val` over `var` | Prefer immutable variables |
| `data class` | For value objects with equals/hashCode/copy |
| `sealed class/interface` | For restricted type hierarchies |
| `value class` | For type-safe wrappers with zero overhead |
| Expression `when` | Exhaustive pattern matching |
| Safe call `?.` | Null-safe member access |
| Elvis `?:` | Default value for nullables |
| `let`/`apply`/`also`/`run`/`with` | Scope functions for clean code |
| Extension functions | Add behavior without inheritance |
| `copy()` | Immutable updates on data classes |
| `require`/`check` | Precondition assertions |
| Coroutine `async`/`await` | Structured concurrent execution |
| `Flow` | Cold reactive streams |
| `sequence` | Lazy evaluation |
| Delegation `by` | Reuse implementation without inheritance |

## Anti-Patterns to Avoid

```kotlin
// Bad: Force-unwrapping nullable types
val name = user!!.name

// Bad: Platform type leakage from Java
fun getLength(s: String) = s.length // Safe
fun getLength(s: String?) = s?.length ?: 0 // Handle nulls from Java

// Bad: Mutable data classes
data class MutableUser(var name: String, var email: String)

// Bad: Using exceptions for control flow
try {
    val user = findUser(id)
} catch (e: NotFoundException) {
    // Don't use exceptions for expected cases
}

// Good: Use nullable return or Result
val user: User? = findUserOrNull(id)

// Bad: Ignoring coroutine scope
GlobalScope.launch { /* Avoid GlobalScope */ }

// Good: Use structured concurrency
coroutineScope {
    launch { /* Properly scoped */ }
}

// Bad: Deeply nested scope functions
user?.let { u ->
    u.address?.let { a ->
        a.city?.let { c -> process(c) }
    }
}

// Good: Direct null-safe chain
user?.address?.city?.let { process(it) }
```

## Referências

- `references/core-principles.md` — null safety, imutabilidade, data classes
- `references/sealed-classes.md` — hierarquias restritas, API responses
- `references/scope-functions.md` — quando usar cada uma
- `references/extensions.md` — sem heranca
- `references/coroutines.md` — structured, Flow, cancelamento
- `references/delegation.md` — property e interface
- `references/dsl-builders.md` — type-safe builders, config DSL
- `references/sequences-gradle.md` — lazy eval, build.gradle.kts
- `references/error-collections.md` — Result, require/check, collections

**Remember**: Kotlin code should be concise but readable. Leverage the type system for safety, prefer immutability, and use coroutines for concurrency. When in doubt, let the compiler help you.
