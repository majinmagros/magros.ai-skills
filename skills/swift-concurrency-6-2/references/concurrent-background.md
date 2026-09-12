# @concurrent for Background Work

When you need actual parallelism, explicitly offload with `@concurrent`:

> **Important:** This example requires Approachable Concurrency build settings — SE-0466 (MainActor default isolation) and SE-0461 (NonisolatedNonsendingByDefault). With these enabled, `extractSticker` stays on the caller's actor, making mutable state access safe. **Without these settings, this code has a data race** — the compiler will flag it.

```swift
nonisolated final class PhotoProcessor {
    private var cachedStickers: [String: Sticker] = [:]

    func extractSticker(data: Data, with id: String) async -> Sticker {
        if let sticker = cachedStickers[id] {
            return sticker
        }

        let sticker = await Self.extractSubject(from: data)
        cachedStickers[id] = sticker
        return sticker
    }

    // Offload expensive work to concurrent thread pool
    @concurrent
    static func extractSubject(from data: Data) async -> Sticker { /* ... */ }
}

// Callers must await
let processor = PhotoProcessor()
processedPhotos[item.id] = await processor.extractSticker(data: data, with: item.id)
```

To use `@concurrent`:

1. Mark the containing type as `nonisolated`
2. Add `@concurrent` to the function
3. Add `async` if not already asynchronous
4. Add `await` at call sites
