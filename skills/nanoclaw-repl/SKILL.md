---
name: nanoclaw-repl
description: "Use when operate and extend NanoClaw v2, ECC's zero-dependency session-aware REPL built on claude -p. Triggers on \"nanoclaw-repl\", \"nanoclaw repl\", \"repl\"."
metadata:
  origin: ECC
---

# NanoClaw REPL

Use this skill when running or extending `scripts/claw.js`.

## When to Use

- "Open a persistent REPL session"
- "Branch this session before the risky change"
- "Compact and export the session"
- "Search across past sessions"
- "Extend claw.js with a new command"

## Example

```bash
node scripts/claw.js          # start session
/load my-skill                # dynamic skill loading
/branch risky-refactor        # branch before risk
```

## Capabilities

- persistent markdown-backed sessions
- model switching with `/model`
- dynamic skill loading with `/load`
- session branching with `/branch`
- cross-session search with `/search`
- history compaction with `/compact`
- export to md/json/txt with `/export`
- session metrics with `/metrics`

## Operating Guidance

1. Keep sessions task-focused.
2. Branch before high-risk changes.
3. Compact after major milestones.
4. Export before sharing or archival.

## Extension Rules

- keep zero external runtime dependencies
- preserve markdown-as-database compatibility
- keep command handlers deterministic and local
