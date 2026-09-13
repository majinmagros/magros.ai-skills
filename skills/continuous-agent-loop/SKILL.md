---
name: continuous-agent-loop
description: "Use when patterns for continuous autonomous agent loops with quality gates, evals, and recovery controls. Triggers on \"continuous-agent-loop\", \"continuous agent loop\", \"loop\"."
metadata:
  origin: ECC
---

# Continuous Agent Loop

This is the v1.8+ canonical loop skill name. It supersedes `autonomous-loops` while keeping compatibility for one release.

## Quando usar

- "roda esse pipeline em loop", "loop contínuo com quality gate"
- Pipeline sequencial/RFC/paralelo que precisa de gates, evals e recovery
- Loop com churn sem progresso ou custo derrapando (ver Failure Modes)
- Não use para: execução única (sem loop); DAG multi-agente com RFC (isso é ralphinho-rfc-pipeline)

## Loop Selection Flow

```text
Start
  |
  +-- Need strict CI/PR control? -- yes --> continuous-pr
  |
  +-- Need RFC decomposition? -- yes --> rfc-dag
  |
  +-- Need exploratory parallel generation? -- yes --> infinite
  |
  +-- default --> sequential
```

## Combined Pattern

Recommended production stack:
1. RFC decomposition (`ralphinho-rfc-pipeline`)
2. quality gates (`plankton-code-quality` + `/quality-gate`)
3. eval loop (`eval-harness`)
4. session persistence (`nanoclaw-repl`)

## Failure Modes

- loop churn without measurable progress
- repeated retries with same root cause
- merge queue stalls
- cost drift from unbounded escalation

## Recovery

- freeze loop
- run `/harness-audit`
- reduce scope to failing unit
- replay with explicit acceptance criteria
