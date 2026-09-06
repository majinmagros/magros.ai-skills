---
name: agentic-engineering
description: "Use when operate as an agentic engineer using eval-first execution, decomposition, and cost-aware model routing. Triggers on \"agentic-engineering\", \"agentic engineering\", \"engineering\"."
metadata:
  origin: ECC
---

# Agentic Engineering

Use this skill for engineering workflows where AI agents perform most implementation work and humans enforce quality and risk controls.

## Operating Principles

1. Define completion criteria before execution.
2. Decompose work into agent-sized units.
3. Route model tiers by task complexity.
4. Measure with evals and regression checks.

## Eval-First Loop

1. Define capability eval and regression eval.
2. Run baseline and capture failure signatures.
3. Execute implementation.
4. Re-run evals and compare deltas.

## Task Decomposition

Apply the 15-minute unit rule:
- each unit should be independently verifiable
- each unit should have a single dominant risk
- each unit should expose a clear done condition

## Model Routing

- Haiku: classification, boilerplate transforms, narrow edits
- Sonnet: implementation and refactors
- Opus: architecture, root-cause analysis, multi-file invariants

## Session Strategy

- Continue session for closely-coupled units.
- Start fresh session after major phase transitions.
- Compact after milestone completion, not during active debugging.

## Review Focus for AI-Generated Code

Prioritize:
- invariants and edge cases
- error boundaries
- security and auth assumptions
- hidden coupling and rollout risk

Do not waste review cycles on style-only disagreements when automated format/lint already enforce style.

## Cost Discipline

Track per task:
- model
- token estimate
- retries
- wall-clock time
- success/failure

Escalate model tier only when lower tier fails with a clear reasoning gap.

## Agentic Operating Levels (enriquecimento 2026-09-06 — IndyDevDan `rPWCYB62wvI`)

Where you + your agents focus attention. Bottom→top: lines/blocks/functions/types/classes → file/dir structure → DB tables + databases → scripts/CLIs → app (vibe-coding level) → repo (apps/) → plan/docs/intent → AI dev workflow → software factory.

- Higher = leverage + speed, lower = control + understanding. Higher is NOT better.
- Choose leverage when: you understand the domain, work is familiar/repeated (3x = automate: skill → reusable agent → ADW), many artifacts/steps, and you have raw agentic skill (prompt/context/harness/multi-agent/model routing).
- Move down (control) when: low domain understanding, unfamiliar system/new codebase, high-risk/high-impact domain, weak validation evidence, performance/detail/taste matters, or out-of-distribution work.
- Minimum bar for mid/long-term projects: media-rich docs (images/SVG), designed DB tables, known dir/file layout + types; lines only rarely. Never scale (factory/workflows) what you do not understand.
