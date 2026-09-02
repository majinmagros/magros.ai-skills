---
name: agent-harness-construction
description: "Use when design and optimize AI agent action spaces, tool definitions, and observation formatting for higher completion rates. Triggers on \"agent-harness-construction\", \"agent harness construction\", \"construction\"."
metadata:
  origin: ECC
---

# Agent Harness Construction

Use this skill when you are improving how an agent plans, calls tools, recovers from errors, and converges on completion.

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
- pass@1 and pass@3
- cost per successful task

## Anti-Patterns

- Too many tools with overlapping semantics.
- Opaque tool output with no recovery hints.
- Error-only output without next steps.
- Context overloading with irrelevant references.

## Referências práticas de harness (enriquecimento 2026-08-20)

### Cursor Agent Harness (video `7phrurXJwH8`)

O Cursor implementa um harness completo com padrões que valem referenciar:

| Componente | Função | Paralelo ECC |
|---|---|---|
| **Agent MD** (`.agent.md`) | Instruções de projeto injetadas no contexto do agente | `agent-harness-construction` context budgeting + `codebase-onboarding` |
| **Rules** (`.cursor/rules/*.mdc`) | Regras sempre injetadas (always apply) — padrões de código, arquitetura | `coding-standards` + `agent-harness-construction` action space |
| **Skills** (`.cursor/skills/`) | Carregamento sob demanda (description + triggers), scripts Python/JS | `criar-skill` progressive disclosure + `scripts/` (camada S) |
| **Multitask** | Subagentes com contexto separado, executam em paralelo | `sessoes-orquestradas` + `graph-engineering` (isolamento de contexto) |
| **Model Routing** | Auto (custo/qualidade), Composer 2.5 (barato/implementação), Opus/Sonnet/GPT-4.5 (caro/raciocínio) | `roteamento-modelos-baratos` + `cost-aware-llm-pipeline` |

**Padrão recomendado (do vídeo)**: Planejar com modelo caro (Opus) → Implementar com modelo barato (Composer/Auto).

### Frameworks de orquestração de agentes (video `PNP10gVp4Is`)

| Framework | Linguagem | Características | Tradeoffs |
|---|---|---|---|
| **LangChain** (TS/Python) | Tools com Zod, session memory, orchestration flexível | Verboso; curva de aprendizado alta; muito configurável |
| **Crew AI** | Roles, multiagentes opinionados, delegation built-in | Opinionado; ótimo para multiagente; menos flexível para casos atípicos |
| **AI SDK** (Vercel) | Streaming, tool calling, integrado Next.js/React | Ecossistema Vercel; excelente para web; menos para CLI/backoffice |
| **AG2 / AutoGen** | Conversação multiagente, group chat, code execution | Forte em conversação; mais acadêmico; runtime Python |

**Escolha prática**:
- Web/Next.js + streaming → **AI SDK**
- Multiagente com roles claros → **Crew AI**
- Flexibilidade máxima, tools customizadas → **LangChain**
- Conversação entre agentes → **AG2**

Todos usam **schemas tipados (Zod/Pydantic)** para tools — alinhado com `contract-first` e `agent-harness-construction` (Observation Design).
