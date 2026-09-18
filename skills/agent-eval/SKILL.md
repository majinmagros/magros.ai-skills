---
name: agent-eval
description: "Use when head-to-head comparison of coding agents (Claude Code, Aider, Codex, etc.) on custom tasks with pass rate, cost, time, and consistency metrics. Triggers on \"agent-eval\", \"agent eval\", \"eval\"."
license: MIT
metadata:
  origin: ECC
tools: Read, Write, Edit, Bash, Grep, Glob
---

# Agent Eval Skill

A lightweight CLI tool for comparing coding agents head-to-head on reproducible tasks. Every "which coding agent is best?" comparison runs on vibes — this tool systematizes it.

## When to Activate

- Comparing coding agents (Claude Code, Aider, Codex, etc.) on your own codebase
- Measuring agent performance before adopting a new tool or model
- Running regression checks when an agent updates its model or tooling
- Producing data-backed agent selection decisions for a team

## Installation

> **Note:** Install agent-eval from its repository after reviewing the source.

## Core Concepts

### YAML Task Definitions

Define tasks declaratively. Each task specifies what to do, which files to touch, and how to judge success:

```yaml
name: add-retry-logic
description: Add exponential backoff retry to the HTTP client
repo: ./my-project
files:
  - src/http_client.py
prompt: |
  Add retry logic with exponential backoff to all HTTP requests.
  Max 3 retries. Initial delay 1s, max delay 30s.
judge:
  - type: pytest
    command: pytest tests/test_http_client.py -v
  - type: grep
    pattern: "exponential_backoff|retry"
    files: src/http_client.py
commit: "abc1234"  # pin to specific commit for reproducibility
```

### Git Worktree Isolation

Each agent run gets its own git worktree — no Docker required. This provides reproducibility isolation so agents cannot interfere with each other or corrupt the base repo.

### Metrics Collected

| Metric | What It Measures |
|--------|-----------------|
| Pass rate | Did the agent produce code that passes the judge? |
| Cost | API spend per task (when available) |
| Time | Wall-clock seconds to completion |
| Consistency | Pass rate across repeated runs (e.g., 3/3 = 100%) |

## Workflow

### 0. Duel Setup (Batch 17g, #86)

Same prompt, two harnesses: fases explicitas research → plan → build →
verify + "do not stop at prototype, keep breaking/fixing/retesting
until genuinely complete". Fase de plan separada evita vitoria de
prototipo bonito inacabado. Meca custo + tempo por fase, nao so total.

### 1. Define Tasks
### Terminal-Bench / Deep-SWE protocol (leva YouTube rodada 6)

Para eval agêntico além de tasks do próprio codebase, use o protocolo:

- **Harness loop em container** — task → container preparado → loop comando→resultado → verifier valida estado final (pass/fail). Sem verifier, sem score.
- **Colunas obrigatórias por task** — steps, tokens, tempo, custo ($/task), além do pass/fail. Compare tiers: SOTA / workhorse / leve.
- **Prompts curtos, horizonte longo** (Deep-SWE) — prompts realistas e vagos como usuário real escreveria; mede autonomia com spec mínima, não obediência a spec detalhada.
- **Regra variância-vs-saturação** — benchmark com todos empatados (~85-90%+) está saturado: descarte ou troque de pacote.
- Veja `agentic-benchmark-top5` para montar seu índice pessoal antes de rodar.
