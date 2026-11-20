---
name: context-handoff-compact
description: "Use when managing context windows in long agent sessions — strategic manual compaction at logical boundaries, handoff.md preservation, and 1-hour cache awareness for session resumption. Triggers on \"context compaction\", \"handoff.md\", \"strategic compact\", \"retomar sessão cache\", \"preservar contexto agente\"."
metadata:
  origin: ECC
---

# Context Handoff & Strategic Compaction

Patterns for preserving critical context across long-running or multi-session agent work, avoiding arbitrary auto-compaction loss.

## When to Activate

- Running long sessions approaching context limits
- Switching between unrelated tasks in the same session
- Resuming sessions after cache expiry (1-hour window)
- Need to preserve decisions, progress, and next steps across compaction

## Core Practices

1. **Strategic Manual Compaction**: Compact at logical boundaries (after exploration, before execution; after milestone completion) with explicit instruction on what to preserve.
2. **handoff.md Artifact**: Write a concise handoff document before `/compact` or session end containing:
   - Objective & acceptance criteria
   - Completed work (with evidence)
   - Next steps
   - Files touched
   - Key decisions & what failed
3. **Cache Awareness**: Session signature cache lasts ~1 hour; resuming after expiry re-reads full context at full token cost (~5x). Prefer handoff.md for overnight/context switches.
4. **Audit Tools**: Use `/context` (CLAUDE.md < 200 lines) and `/usage` to detect skill/MCP bloat before it hurts performance.

## Anti-Patterns

- Relying on auto-compaction (arbitrary midpoint loss)
- Skipping handoff.md before context reset
- Letting unused skills/MCP servers inflate context window