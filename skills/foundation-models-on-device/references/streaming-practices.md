# Snapshot Streaming and Best Practices

Stream structured responses for real-time UI with `PartiallyGenerated` types (snapshots, not deltas — each snapshot is a complete partial state).

```swift
@Generable
struct TripIdeas {
    @Guide(description: "Ideas for upcoming trips")
    var ideas: [String]
}

let stream = session.streamResponse(
    to: "What are some exciting trip ideas?",
    generating: TripIdeas.self
)

for try await partial in stream {
    // partial: TripIdeas.PartiallyGenerated (all properties Optional)
    print(partial)
}
```

## SwiftUI Integration

```swift
@State private var partialResult: TripIdeas.PartiallyGenerated?
@State private var errorMessage: String?

var body: some View {
    List {
        ForEach(partialResult?.ideas ?? [], id: \.self) { idea in
            Text(idea)
        }
    }
    .overlay {
        if let errorMessage { Text(errorMessage).foregroundStyle(.red) }
    }
    .task {
        do {
            let stream = session.streamResponse(to: prompt, generating: TripIdeas.self)
            for try await partial in stream {
                partialResult = partial
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| On-device execution | Privacy — no data leaves the device; works offline |
| 4,096 token limit | On-device model constraint; chunk large data across sessions |
| Snapshot streaming (not deltas) | Structured output friendly; each snapshot is a complete partial state |
| `@Generable` macro | Compile-time safety; auto-generates `PartiallyGenerated` type |
| Single request per session | `isResponding` prevents concurrent requests; create multiple sessions if needed |
| `response.content` (not `.output`) | Correct API — always access results via `.content` property |

## Best Practices

- Always check `model.availability` before creating a session — handle all unavailability cases.
- Use `instructions` to guide behavior — they take priority over prompts.
- Check `isResponding` before sending a new request.
- Break large inputs into chunks (4,096 token limit).
- Use `@Generable` for structured output; use `GenerationOptions(temperature:)` to tune creativity.
- Monitor with Instruments.

## Anti-Patterns to Avoid

- Creating sessions without checking `model.availability` first.
- Sending inputs exceeding the 4,096 token context window.
- Concurrent requests on a single session.
- Using `.output` instead of `.content`.
- Parsing raw strings when `@Generable` would work.
- Complex multi-step logic in a single prompt — break into focused prompts.
- Assuming the model is always available — eligibility and settings vary.
