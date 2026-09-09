---
name: dart-flutter-patterns
description: "Use when production-ready Dart and Flutter patterns covering null safety, immutable state, async composition, widget architecture, popular state management frameworks (BLoC, Riverpod, Provider), GoRouter navigation, Dio networking, Freezed code generation,... Triggers on \"dart-flutter-patterns\", \"dart flutter patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Dart/Flutter Patterns

## When to Use

Use this skill when:
- Starting a new Flutter feature and need idiomatic patterns for state management, navigation, or data access
- Reviewing or writing Dart code and need guidance on null safety, sealed types, or async composition
- Setting up a new Flutter project and choosing between BLoC, Riverpod, or Provider
- Implementing secure HTTP clients, WebView integration, or local storage
- Writing tests for Flutter widgets, Cubits, or Riverpod providers
- Wiring up GoRouter with authentication guards

## How It Works

Copy-paste-ready patterns by concern (full code in `references/`):

1. **Null safety** — avoid `!`, prefer `?.`/`??`/pattern matching (`foundations.md`)
2. **Immutable state** — sealed classes, `freezed`, `copyWith` (`foundations.md`)
3. **Async composition** — concurrent `Future.wait`, safe `BuildContext` after `await` (`foundations.md`)
4. **Widget architecture** — extract to classes, `const` propagation, scoped rebuilds (`foundations.md`)
5. **State management** — BLoC/Cubit events, Riverpod notifiers + derived providers (`state-management.md`)
6. **Navigation** — GoRouter with reactive auth guards via `refreshListenable` (`navigation-networking.md`)
7. **Networking** — Dio with interceptors, token refresh with one-time retry guard (`navigation-networking.md`)
8. **Error handling** — global capture, `ErrorWidget.builder`, crashlytics (`error-testing.md`)
9. **Testing** — unit (BLoC test), widget (ProviderScope overrides), fakes over mocks (`error-testing.md`)

## Examples

```dart
// Sealed state — prevents impossible states
sealed class AsyncState<T> {}
final class Loading<T> extends AsyncState<T> {}
final class Success<T> extends AsyncState<T> { final T data; const Success(this.data); }
final class Failure<T> extends AsyncState<T> { final Object error; const Failure(this.error); }

// GoRouter with reactive auth redirect
final router = GoRouter(
  refreshListenable: GoRouterRefreshStream(authCubit.stream),
  redirect: (context, state) {
    final authed = context.read<AuthCubit>().state is AuthAuthenticated;
    if (!authed && !state.matchedLocation.startsWith('/login')) return '/login';
    return null;
  },
  routes: [...],
);

// Riverpod derived provider with safe firstWhereOrNull
@riverpod
double cartTotal(Ref ref) {
  final cart = ref.watch(cartNotifierProvider);
  final products = ref.watch(productsProvider).valueOrNull ?? [];
  return cart.fold(0.0, (total, item) {
    final product = products.firstWhereOrNull((p) => p.id == item.productId);
    return total + (product?.price ?? 0) * item.quantity;
  });
}
```

---

Practical, production-ready patterns for Dart and Flutter applications. Library-agnostic where possible, with explicit coverage of the most common ecosystem packages.

---

## References

- `references/foundations.md` — null safety, immutability, async, widgets
- `references/state-management.md` — BLoC/Cubit, Riverpod
- `references/navigation-networking.md` — GoRouter, Dio
- `references/error-testing.md` — error handling, testing
- [Effective Dart: Design](https://dart.dev/effective-dart/design)
- [Flutter Performance Best Practices](https://docs.flutter.dev/perf/best-practices)
- [Riverpod](https://riverpod.dev/) · [BLoC](https://bloclibrary.dev/) · [GoRouter](https://pub.dev/packages/go_router) · [Freezed](https://pub.dev/packages/freezed)
- Skill: `flutter-dart-code-review` — comprehensive review checklist
- Rules: `rules/dart/` — coding style, patterns, security, testing, hooks
