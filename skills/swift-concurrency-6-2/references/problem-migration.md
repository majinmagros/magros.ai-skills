# Problem and Migration

## Core Problem: Implicit Background Offloading

In Swift 6.1 and earlier, async functions could be implicitly offloaded to background threads, causing data-race errors even in seemingly safe code:

```swift
// Swift 6.1: ERROR
@MainActor
final class StickerModel {
    let photoProcessor = PhotoProcessor()

    func extractSticker(_ item: PhotosPickerItem) async throws -> Sticker? {
        guard let data = try await item.loadTransferable(type: Data.self) else { return nil }

        // Error: Sending 'self.photoProcessor' risks causing data races
        return await photoProcessor.extractSticker(data: data, with: item.itemIdentifier)
    }
}
```

Swift 6.2 fixes this: async functions stay on the calling actor by default.

```swift
// Swift 6.2: OK — async stays on MainActor, no data race
@MainActor
final class StickerModel {
    let photoProcessor = PhotoProcessor()

    func extractSticker(_ item: PhotosPickerItem) async throws -> Sticker? {
        guard let data = try await item.loadTransferable(type: Data.self) else { return nil }
        return await photoProcessor.extractSticker(data: data, with: item.itemIdentifier)
    }
}
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Single-threaded by default | Most natural code is data-race free; concurrency is opt-in |
| Async stays on calling actor | Eliminates implicit offloading that caused data-race errors |
| Isolated conformances | MainActor types can conform to protocols without unsafe workarounds |
| `@concurrent` explicit opt-in | Background execution is a deliberate performance choice, not accidental |
| MainActor default inference | Reduces boilerplate `@MainActor` annotations for app targets |
| Opt-in adoption | Non-breaking migration path — enable features incrementally |

## Migration Steps

1. **Enable in Xcode**: Swift Compiler > Concurrency section in Build Settings
2. **Enable in SPM**: Use `SwiftSettings` API in package manifest
3. **Use migration tooling**: Automatic code changes via swift.org/migration
4. **Start with MainActor defaults**: Enable inference mode for app targets
5. **Add `@concurrent` where needed**: Profile first, then offload hot paths
6. **Test thoroughly**: Data-race issues become compile-time errors
