# Writing Rule: SMIG

Each description should answer:

- **Situation**: what the reader is looking at
- **Mechanism**: how it works
- **Implication**: why it matters for this persona
- **Gotcha**: what a smart reader might miss

Keep descriptions compact, specific, and grounded in the actual code.

# Narrative Shape

Use this arc unless the task clearly needs something different:

1. orientation
2. module map
3. core execution path
4. edge case or gotcha
5. closing / next move

The tour should feel like a path, not an inventory.

# Example

```json
{
  "$schema": "https://aka.ms/codetour-schema",
  "title": "API Service Tour",
  "description": "Walkthrough of the request path for the payments service.",
  "ref": "main",
  "steps": [
    {
      "directory": "src",
      "title": "Source Root",
      "description": "All runtime code for the service starts here."
    },
    {
      "file": "src/server.ts",
      "line": 12,
      "title": "Entry Point",
      "description": "The server boots here and wires middleware before any route is reached."
    },
    {
      "file": "src/routes/payments.ts",
      "line": 8,
      "title": "Payment Routes",
      "description": "Every payments request enters through this router before hitting service logic."
    },
    {
      "title": "Next Steps",
      "description": "You can now follow any payment request end to end with the main anchors in place."
    }
  ]
}
```

# Anti-Patterns

| Anti-pattern | Fix |
| --- | --- |
| Flat file listing | Tell a story with dependency between steps |
| Generic descriptions | Name the concrete code path or pattern |
| Guessed anchors | Verify every file and line first |
| Too many steps for a quick tour | Cut aggressively |
| First step is content-only | Anchor the first step to a real file or directory |
| Persona mismatch | Write for the actual reader, not a generic engineer |

# Best Practices

- keep step count proportional to repo size and persona depth
- use directory steps for orientation, file steps for substance
- for PR tours, cover changed files first
- for monorepos, scope to the relevant packages instead of touring everything
- close with what the reader can now do, not a recap

# Related Skills

- `codebase-onboarding`
- `coding-standards`
- `council`
- official upstream format: `microsoft/codetour`
