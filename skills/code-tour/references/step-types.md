# Step Types

## Content

Use sparingly, usually only for a closing step:

```json
{ "title": "Next Steps", "description": "You can now trace the request path end to end." }
```

Do not make the first step content-only.

## Directory

Use to orient the reader to a module:

```json
{ "directory": "src/services", "title": "Service Layer", "description": "The core orchestration logic lives here." }
```

## File + line

This is the default step type:

```json
{ "file": "src/auth/middleware.ts", "line": 42, "title": "Auth Gate", "description": "Every protected request passes here first." }
```

## Selection

Use when one code block matters more than the whole file:

```json
{
  "file": "src/core/pipeline.ts",
  "selection": {
    "start": { "line": 15, "character": 0 },
    "end": { "line": 34, "character": 0 }
  },
  "title": "Request Pipeline",
  "description": "This block wires validation, auth, and downstream execution."
}
```

## Pattern

Use when exact lines may drift:

```json
{ "file": "src/app.ts", "pattern": "export default class App", "title": "Application Entry" }
```

## URI

Use for PRs, issues, or docs when helpful:

```json
{ "uri": "https://github.com/org/repo/pull/456", "title": "The PR" }
```
