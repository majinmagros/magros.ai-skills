---
name: agent-harness-construction
description: "Use when design and optimize AI agent action spaces, tool definitions, and observation formatting for higher completion rates. Triggers on \"agent-harness-construction\", \"agent harness construction\", \"construction\"."
metadata:
  origin: ECC
---

# Agent Harness Construction

Use this skill when you are improving how an agent plans, calls tools, recovers from errors, and converges on completion.

## When to Use

- "Redesign our agent's tool definitions"
- "Completion rate dropped after adding new tools"
- "Agent responses are bloated and hard to parse"
- "Add retry/stop rules to the agent loop"
- "Split one catch-all tool into safer micro-tools"

## Example

Every tool response follows the observation envelope:

```json
{
  "status": "success",
  "summary": "Migrated 3 tables",
  "next_actions": ["run backfill", "verify row counts"],
  "artifacts": ["db/migrations/004.sql"]
}
```

## Core Model

Agent output quality is constrained by:
1. Action space quality
2. Observation quality
3. Recovery quality
4. Context budget quality

## Action Space Design

1. Use stable, explicit tool names.
2. Keep inputs schema-first and narrow.
3. Return deterministic output shapes.
4. Avoid catch-all tools unless isolation is impossible.

## Granularity Rules

- Use micro-tools for high-risk operations (deploy, migration, permissions).
- Use medium tools for common edit/read/search loops.
- Use macro-tools only when round-trip overhead is the dominant cost.

## Observation Design

Every tool response should include:
- `status`: success|warning|error
- `summary`: one-line result
- `next_actions`: actionable follow-ups
- `artifacts`: file paths / IDs

## Error Recovery Contract

For every error path, include:
- root cause hint
- safe retry instruction
- explicit stop condition

## Context Budgeting

1. Keep system prompt minimal and invariant.
2. Move large guidance into skills loaded on demand.
3. Prefer references to files over inlining long documents.
4. Compact at phase boundaries, not arbitrary token thresholds.

## Architecture Pattern Guidance

- ReAct: best for exploratory tasks with uncertain path.
- Function-calling: best for structured deterministic flows.
- Hybrid (recommended): ReAct planning + typed tool execution.

## Benchmarking

Track:
- completion rate
- retries per task

## Reverse-engineer via JSONL (leva YouTube rodada 9)

Para clonar comportamento de harness bom: leia o JSONL de tool calls (ordem, verificacao, retries), replique o padrao monkey-see-monkey-do no seu harness, e arrende o cerebro (70-80 por cento local quando possivel). Copie o protocolo observado, nao o marketing do vendor.
