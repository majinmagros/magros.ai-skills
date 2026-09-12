---
name: swift-concurrency-6-2
description: "Use when adopting Swift 6.2 Approachable Concurrency, MainActor isolation, or @concurrent offloading. Triggers on \"swift-concurrency-6-2\", \"swift concurrency 6 2\"."
metadata:
  origin: ECC
---

# Swift 6.2 Approachable Concurrency

Single-threaded by default; async stays on the caller, `@concurrent` opts into background. Detalhes em `references/`.

## When to Activate

- Migrating Swift 5.x or 6.0/6.1 projects to Swift 6.2
- Resolving data-race safety compiler errors
- Designing MainActor-based app architecture
- Offloading CPU-intensive work to background threads
- Implementing protocol conformances on MainActor-isolated types
- Enabling Approachable Concurrency build settings in Xcode 26

## Core Principles

1. **Single-threaded default** — async stays on calling actor, no implicit offload
2. **Isolated conformances** — `@MainActor` types conform without workarounds
3. **`@concurrent` is opt-in** — background only as deliberate performance choice
4. **Inference mode** — MainActor by default for app targets, less boilerplate
5. **Migrate incrementally** — one build setting at a time, profile before offload

## Example

```swift
@MainActor
final class StickerModel {
    let photoProcessor = PhotoProcessor()
    func extractSticker(_ item: PhotosPickerItem) async throws -> Sticker? {
        guard let data = try await item.loadTransferable(type: Data.self) else { return nil }
        return await photoProcessor.extractSticker(data: data, with: item.itemIdentifier)
    }
}
```

## References

- `references/problem-migration.md` — implicit-offload problem, design decisions, migration steps
- `references/isolated-conformances.md` — isolated conformances, globals/statics, inference mode
- `references/concurrent-background.md` — `@concurrent` pattern with SE-0466/SE-0461 warning
- `references/practices-antipatterns.md` — best practices, anti-patterns, when to use

## Checklist

- [ ] Approachable Concurrency settings enabled (SE-0466, SE-0461) where needed
- [ ] Globals/statics protected by MainActor or inference mode
- [ ] `@concurrent` only on profiled CPU-intensive paths with await call sites
- [ ] No `nonisolated` suppression or legacy DispatchQueue without reason
