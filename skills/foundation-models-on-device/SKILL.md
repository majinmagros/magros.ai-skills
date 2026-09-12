---
name: foundation-models-on-device
description: "Use when building on-device Apple Intelligence features with text generation, structured output, or tool calling. Triggers on \"foundation-models-on-device\", \"foundation models on device\", \"device\"."
metadata:
  origin: ECC
---

# FoundationModels: On-Device LLM (iOS 26)

Privacy-preserving on-device LLM via Apple's FoundationModels framework. Detalhes em `references/`.

## When to Activate

- Building AI-powered features using Apple Intelligence on-device
- Generating or summarizing text without cloud dependency
- Extracting structured data from natural language input
- Implementing custom tool calling for domain-specific AI actions
- Streaming structured responses for real-time UI updates
- Need privacy-preserving AI (no data leaves the device)

## Core Principles

1. **Availability first** — check `model.availability` before any session
2. **Structured over strings** — prefer `@Generable` + `@Guide` types
3. **One request per session** — check `isResponding`, fan out sessions
4. **Chunk to 4,096 tokens** — instructions + prompt + output combined
5. **Read `.content`** — never `.output`; snapshot-stream partials to UI

## Example

```swift
let session = LanguageModelSession()
let response = try await session.respond(
  to: "Generate a cute rescue cat", generating: CatProfile.self)
print(response.content.name)
```

## References

- `references/availability-sessions.md` — availability switch, single/multi-turn, instructions, session rules
- `references/guided-generation.md` — @Generable type, structured request, @Guide constraints
- `references/tool-calling.md` — Tool definition, session with tools, ToolCallError handling
- `references/streaming-practices.md` — snapshot streaming, SwiftUI, decisions, practices, anti-patterns

## Checklist

- [ ] `model.availability` handled for all unavailability cases
- [ ] Structured output via `@Generable`, not string parsing
- [ ] `isResponding` checked; inputs fit 4,096 tokens
- [ ] Results read via `response.content`
- [ ] Offline/privacy path verified on-device
