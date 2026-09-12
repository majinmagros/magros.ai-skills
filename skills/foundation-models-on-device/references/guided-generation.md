# Guided Generation with @Generable

Generate structured Swift types instead of raw strings.

## 1. Define a Generable Type

```swift
@Generable(description: "Basic profile information about a cat")
struct CatProfile {
    var name: String

    @Guide(description: "The age of the cat", .range(0...20))
    var age: Int

    @Guide(description: "A one sentence profile about the cat's personality")
    var profile: String
}
```

## 2. Request Structured Output

```swift
let response = try await session.respond(
    to: "Generate a cute rescue cat",
    generating: CatProfile.self
)

// Access structured fields directly
print("Name: \(response.content.name)")
print("Age: \(response.content.age)")
print("Profile: \(response.content.profile)")
```

## Supported @Guide Constraints

- `.range(0...20)` — numeric range
- `.count(3)` — array element count
- `description:` — semantic guidance for generation

## Design Notes

- `@Generable` gives compile-time safety; prefer it over parsing raw strings.
- The macro auto-generates the `PartiallyGenerated` type used for streaming.
- Break complex multi-step logic into multiple focused prompts instead of one mega-prompt.
