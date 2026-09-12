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