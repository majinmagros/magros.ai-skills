---
name: flutter-dart-code-review
description: "Use when library-agnostic Flutter/Dart code review checklist covering widget best practices, state management patterns (BLoC, Riverpod, Provider, GetX, MobX, Signals), Dart idioms, performance, accessibility, security, and clean architecture. Triggers on \"flutter-dart-code-review\", \"flutter dart code review\", \"review\"."
metadata:
  origin: ECC
---

# Flutter/Dart Code Review Best Practices

Library-agnostic review checklists for Flutter/Dart apps — any state management, routing, or DI solution. Detalhes em `references/`.

## When to Activate

- Reviewing Flutter/Dart pull requests or auditing an existing codebase
- Checking widget best practices, state management (BLoC, Riverpod, Provider, GetX, MobX, Signals), or Dart idioms
- Evaluating Flutter app performance, accessibility, or security
- Enforcing clean architecture in a Dart/Flutter project

## When NOT to Use

- Native Android (Kotlin) or iOS (Swift) code (use platform-specific skills)
- Backend Dart servers (use `backend-patterns`)

## Example

```dart
// BAD — boolean flag soup allows impossible states
class UserState {
  bool isLoading = false;
  bool hasError = false; // isLoading && hasError is representable!
  User? user;
}

// GOOD — sealed types make impossible states unrepresentable
sealed class UserState {}
class UserLoading extends UserState {}
class UserLoaded extends UserState {
  final User user;
  const UserLoaded(this.user);
}
class UserError extends UserState {
  final String message;
  const UserError(this.message);
}
```

## References

- `references/project-health.md` — folder structure, separation of concerns, Dart pitfalls
- `references/widgets-state.md` — widget decomposition, const/keys, state management, quick-ref table
- `references/perf-testing.md` — rebuilds, images, lazy loading, test types and quality
- `references/platform-a11y.md` — semantics, screen reader, platform differences, responsive
- `references/security-deps.md` — secure storage, API keys, pub.dev review, version constraints
- `references/app-concerns.md` — navigation, errors, l10n, DI, static analysis, sources

## Top-10 Critical Checks

- [ ] No business logic in widgets; `build()` pure (no I/O, no `.listen()`)
- [ ] Sealed/union states, not boolean flags; all variants handled exhaustively
- [ ] `const` everywhere possible; consumers scoped narrowly; selectors for rebuilds
- [ ] `context.mounted` after every async gap; context never stored
- [ ] Strict analyzer (`strict-casts/inference/raw-types`); `flutter analyze` green in CI
- [ ] Secrets via `--dart-define`/env, never hardcoded; HTTPS everywhere
- [ ] Contrast ≥ 4.5:1, 48px targets, no color-only state signals
- [ ] Tests: 80%+ business logic, transitions covered, no shared mutable state