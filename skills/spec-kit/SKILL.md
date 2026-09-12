---
name: spec-kit
description: Use when doing spec-driven development with Spec Kit (Astral/GitHub) — CLI workflow: `constitution` → `specify` → `plan` → `tasks` → `implement` with automatic git branching per spec, project constitution memory, and UV package manager. Triggers on "spec kit", "spec-driven", "specify plan tasks implement", "constitution spec", "branch por spec", "UV astral". Não use para planejamento genérico (isso é `blueprint`/`plan`/`orch-*`); Spec Kit é tool concreta com CLI própria e fluxo opinionado.
metadata:
  origin: ecc
  module: agentic-patterns
  cost: medium
  stability: stable
  defaultInstall: false
---

# Skill: spec-kit — Spec-Driven Development com Spec Kit (Astral/GitHub)

**Spec Kit** é uma tool CLI open-source (Astral/GitHub) que implementa *Spec-Driven Development* (SDD): você escreve a especificação primeiro, a tool gera plano, tasks e implementação, com isolamento por branch git e constituição global do projeto.

## Quando usar

- Você quer seguir **spec-driven development** rigoroso: spec → plan → tasks → implement.
- Precisa de **isolamento automático por feature** (git branch criada automaticamente por spec).
- Quer uma **constituição global** do projeto (`.specify/memory/constitution.md`) que guia todas as specs.
- Usa **UV** (Astral) como gerenciador de pacotes Python (padrão do Spec Kit).
- Integra com **Claude Code, Copilot, Gemini, Cursor** via `--integration`.

Não use para:
- Planejamento genérico ECC → `blueprint`, `plan`, `orch-add-feature`, `orch-build-mvp`.
- Graph engineering paralelo → `engenharia-de-grafos`, `graph-engineering`.
- Apenas criar tasks → `orch-pipeline`/`orch-*`.

## Pipeline oficial (comandos CLI)

| Etapa | Comando | O que faz | Artefatos gerados |
|---|---|---|---|
| **0. Init** | `specify init <projeto> --integration <copilot\|claude\|gemini>` | Cria estrutura `.specify/`, templates, integração com agente | `.specify/`, `scripts/`, configs |
| **1. Constitution** | `/speckit.constitution "princípios do projeto"` | Define/atualiza constituição global em `.specify/memory/constitution.md` | `constitution.md` (memória base) |
| **2. Specify** | `/speckit.specify "descrição da feature"` | Cria branch `NNN-nome-feature`, gera `specs/NNN-nome/spec.md` com requisitos estruturados | `spec.md`, branch git |
| **3. Plan** | `/speckit.plan "detalhes técnicos: stack, arquitetura"` | Gera plano de implementação a partir da spec | `plan.md`, `data-model.md`, `contracts/`, `research.md`, `quickstart.md` |
| **4. Tasks** | `/speckit.tasks` | Deriva tasks executáveis do plano, marca paralelas | `tasks.md` |
| **5. Implement** | `/speckit.implement` ou `/speckit.implement "fase 1 apenas"` | Executa tasks em ordem de dependência, suporta execução por fases | Código implementado |

## Conceitos-chave

### Constitution (`.specify/memory/constitution.md`)
Arquivo **global** do projeto que define princípios, padrões de arquitetura, convenções de código, stack preferida. Toda spec herda essa constituição. Exemplo:
```
This project follows a "Library-First" approach. All features must be implemented as standalone libraries first. We use TDD strictly. We prefer functional programming patterns.
```

### Branch automática por spec
Cada `/speckit.specify` cria uma branch `NNN-nome-feature` (ex.: `003-chat-system`). Você **não trabalha na main** — isola a feature, implementa, abre PR, faz merge. Se der errado, deleta a branch.

### Memory/Constitution como contexto base
O agente lê a constituição + spec + plan + tasks como contexto. Isso evita "contexto vazio" no início de cada task.

### UV (Astral) — gerenciador padrão
`uv` substitui pip/poetry/pipx: `uv add`, `uv run`, `uv sync`, `uv pip install`. 10-100x mais rápido, lockfile universal (`uv.lock`). Spec Kit assume UV no ambiente.

## Integração com agentes

| Agente | Flag `--integration` | Como invoca comandos |
|---|---|---|
| **Claude Code** | `claude` | Slash commands `/speckit.*` no chat |
| **GitHub Copilot** | `copilot` | Slash commands no Copilot Chat |
| **Gemini CLI** | `gemini` | Via `@speckit` ou CLI direta |
| **Cursor** | `cursor` | Slash commands no Cursor Agent |
