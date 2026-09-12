---
name: swiftui-patterns
description: "Use when swiftUI architecture patterns, state management with @Observable, view composition, navigation, performance optimization, and modern iOS/macOS UI best practices. Triggers on \"swiftui-patterns\", \"swiftui patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# SwiftUI Patterns

Declarative, performant SwiftUI on Apple platforms: Observation framework, composition, type-safe navigation. Detalhes em `references/`.

## When to Activate

- Building SwiftUI views and managing state (`@State`, `@Observable`, `@Binding`)
- Designing navigation flows with `NavigationStack`
- Structuring view models and data flow
- Optimizing rendering performance for lists and complex layouts
- Injecting dependencies via environment values

## Core Principles

1. **Simplest wrapper that fits** — `@State` local, `@Binding` up, `@Observable` model, `@Environment` shared
2. **Small subviews** — only the view reading changed state re-renders
3. **Type-safe routing** — `NavigationStack` + `NavigationPath` + `Destination` enum
4. **Lazy + stable IDs** — `LazyVStack`, never index-based `ForEach`
5. **No work in `body`** — async in `.task {}`, cheap modifiers in lists

## Example

```swift
@Observable
final class ItemListViewModel {
    private(set) var items: [Item] = []
    func load() async { items = (try? await repository.fetchAll()) ?? [] }
}
```

## References

- `references/state-management.md` — wrapper table, @Observable VM, environment
- `references/composition.md` — subviews, ViewModifier, previews
- `references/navigation.md` — Router, Destination enum, RootView
- `references/performance.md` — lazy containers, IDs, Equatable, anti-patterns

## Checklist

- [ ] `@Observable`, not `ObservableObject`/`@StateObject` in new code
- [ ] Views split so invalidation stays local; no `AnyView`
- [ ] `NavigationStack(path:)` with `navigationDestination(for:)`
- [ ] Lists lazy with stable IDs; no I/O in `body`
- [ ] `#Preview` with mock repos for empty + loaded states
