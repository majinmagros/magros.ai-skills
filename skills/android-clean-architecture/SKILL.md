---
name: android-clean-architecture
description: "Use when clean Architecture patterns for Android and Kotlin Multiplatform projects — module structure, dependency rules, UseCases, Repositories, and data layer patterns. Triggers on \"android-clean-architecture\", \"android clean architecture\", \"architecture\"."
metadata:
  origin: ECC
---

# Android Clean Architecture

Clean Architecture patterns for Android and KMP projects. Covers module boundaries, dependency inversion, UseCase/Repository patterns, and data layer design with Room, SQLDelight, and Ktor.

## When to Activate

- Structuring Android or KMP project modules
- Implementing UseCases, Repositories, or DataSources
- Designing data flow between layers (domain, data, presentation)
- Setting up dependency injection with Koin or Hilt
- Working with Room, SQLDelight, or Ktor in a layered architecture

## Module Structure

### Recommended Layout

```
project/
├── app/                  # Android entry point, DI wiring, Application class
├── core/                 # Shared utilities, base classes, error types
├── domain/               # UseCases, domain models, repository interfaces (pure Kotlin)
├── data/                 # Repository implementations, DataSources, DB, network
├── presentation/         # Screens, ViewModels, UI models, navigation
├── design-system/        # Reusable Compose components, theme, typography
└── feature/              # Feature modules (optional, for larger projects)
    ├── auth/
    ├── settings/
    └── profile/
```

### Dependency Rules

```
app → presentation, domain, data, core
presentation → domain, design-system, core
data → domain, core
domain → core (or no dependencies)
core → (nothing)
```

**Critical**: `domain` must NEVER depend on `data`, `presentation`, or any framework. It contains pure Kotlin only.

## Domain Layer

### UseCase Pattern

Each UseCase represents one business operation. Use `operator fun invoke` for clean call sites:

```kotlin
class GetItemsByCategoryUseCase(
    private val repository: ItemRepository
) {
    suspend operator fun invoke(category: String): Result<List<Item>> {
        return repository.getItemsByCategory(category)
    }
}

// Flow-based UseCase for reactive streams