# Availability and Sessions

Always check model availability before creating a session.

```swift
struct GenerativeView: View {
    private var model = SystemLanguageModel.default

    var body: some View {
        switch model.availability {
        case .available:
            ContentView()
        case .unavailable(.deviceNotEligible):
            Text("Device not eligible for Apple Intelligence")
        case .unavailable(.appleIntelligenceNotEnabled):
            Text("Please enable Apple Intelligence in Settings")
        case .unavailable(.modelNotReady):
            Text("Model is downloading or not ready")
        case .unavailable(let other):
            Text("Model unavailable: \(other)")
        }
    }
}
```

## Single-Turn vs Multi-Turn

```swift
// Single-turn: create a new session each time
let session = LanguageModelSession()
let response = try await session.respond(to: "What's a good month to visit Paris?")
print(response.content)

// Multi-turn: reuse session for conversation context
let session = LanguageModelSession(instructions: """
    You are a cooking assistant.
    Provide recipe suggestions based on ingredients.
    Keep suggestions brief and practical.
    """)

let first = try await session.respond(to: "I have chicken and rice")
let followUp = try await session.respond(to: "What about a vegetarian option?")
```

Key points for instructions: define the model's role ("You are a mentor"), specify what to do ("Help extract calendar events"), set style ("Respond as briefly as possible"), add safety ("Respond with 'I can't help with that' for dangerous requests").

## Session Rules

- Check `isResponding` before sending a new request — one request per session at a time; create multiple sessions if needed.
- Access results via `response.content`, not `.output`.
- Break large inputs into chunks — 4,096 token limit covers instructions + prompt + output combined.
- Use `GenerationOptions(temperature:)` to tune creativity (higher = more creative).
- Monitor with Instruments (Xcode) to profile request performance.
