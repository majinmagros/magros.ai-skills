---
name: graph-engineering-patterns
description: Use when building graphs for agent orchestration — code-as-graph (dynamic workflow) or LLM-as-graph (skill + SOP + scripts), with I/O schemas, state management and verifier/planner separation. Triggers on "graph engineering patterns", "code as graph", "llm as graph", "dynamic workflow templates".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=_9OT25ZvrWs (AI Jason video)
    - https://github.com/anthropics/claude-code/tree/main/docs/dynamic-workflow
    - https://docs.anthropic.com/en/docs/claude-code/hooks
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Graph Engineering Patterns — Templates Unificados

Biblioteca de templates para Graph Engineering em dois modos: **code-as-graph** (dynamic workflow, código executa) + **LLM-as-graph** (skill + SOP + scripts, modelo orquestra). Engines em `scripts/`.

## Quando usar (gatilhos concretos)

- "Graph engineering patterns"
- "Code as graph templates"
- "LLM as graph patterns"
- "Dynamic workflow templates"

## Quando NÃO usar

- Orchestration runtime → use `orchestration` skills
- Basic workflow → use `routines`
- Simple orchestration → use `agent-harness-construction`

## Core: Dual Approach

**1. Code-as-Graph** (`scripts/code-as-graph.js`) — `CodeAsGraph`: nós tipados (`agent`, `script`, `tool`, `decision`, `parallel`, `loop`) com I/O schemas, retries e timeout; arestas com condição; execução em ordem topológica (detecta ciclo); `executeParallel` e `addLoop` inclusos.

```javascript
import { CodeAsGraph } from './scripts/code-as-graph.js';
const g = new CodeAsGraph();
g.addNode('implement', { type: 'agent', config: { task: 'Implement feature' } });
g.addNode('test', { type: 'script', config: { script: 'run-tests.sh' } });
g.addEdge('implement', 'test');
await g.execute({ repo: 'org/repo' });
```

**2. LLM-as-Graph** (`scripts/llm-as-graph.js`) — `LLMAsGraph`: registra skills (triggers + schemas + steps), SOP templates (steps + variables + decision points) e scripts determinísticos; `executeNode` resolve SOP → steps → scripts → valida output contra schema.

**3. State** (`scripts/state-management.js`) — `GraphStateManager`: state por nó + global, schemas I/O por nó, snapshot/restore, persistência JSON (save/load).

**4. Verifier/Planner** (`scripts/verifier-planner.js`) — `VerifierPlanner`: verifiers com severidade (`error`/`warning`/`info`) + planners; `verify()` barra em erro; `plan()` seleciona planner e valida o plano. Verifiers padrão: output-schema, no-hallucination, completeness.

## I/O Schemas (`scripts/io-schemas.js`)

| Schema | Input chave | Output chave |
|---|---|---|
| `agentNode` | `task*` + context/tools/maxTokens | `result*`, `success*`, artifacts, tokensUsed |
| `scriptNode` | `script*` + args/env | `exitCode*`, stdout/stderr, artifacts |
| `decisionNode` | `condition*` + context | `decision*` + reason |
| `parallelNode` | `branches*` (nodeId + input) | `results*` |
| `skillInvocation` | `skill*` + `input*` | result, artifacts, stateChanges |
| `sopExecution` | `sop*` + `variables*` | `steps*`, `finalState*` |

## Templates Prontos (`scripts/templates.js`)

- `shipChange` (code): setup → implement → verify → test → pr
- `dailyTriage` (code): fetch → filter → evaluate → rank → publish + improve
- `shipChangeSOP` (LLM): setup → grill → spec → tickets → implement → verify → pr (com variáveis `scope/plan/repo`)