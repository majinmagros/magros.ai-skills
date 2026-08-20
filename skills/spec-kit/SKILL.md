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

> **Nota**: A integração instala arquivos de comando (`.claude/commands/`, `.github/copilot/`, etc.) no projeto.

## Workflow prático (exemplo do vídeo `8mNDmxHDmy4`)

```bash
# 1. Inicializa no projeto existente (ou cria novo)
specify init --here --integration claude --force

# 2. Define constituição global (uma vez por projeto)
/speckit.constitution "React 19, TypeScript strict, TDD, Library-First, design system versionado, componentes server-first"

# 3. Para cada feature nova:
/speckit.specify "Página de biolinks estilo Linktree: perfil, links, tema, QR code, analytics"
# → Cria branch 001-biolinks, specs/001-biolinks/spec.md

/speckit.plan "React 19 + Vite, Tailwind, Framer Motion, Supabase para auth/data, componentes em src/components, server components onde possível"
# → Gera plan.md, data-model.md, contracts/, research.md, quickstart.md, tasks.md

/speckit.tasks
# → tasks.md com fases: Setup → Config → User Story 1 → User Story 2...

/speckit.implement
# → Implementa tudo em ordem de dependência
# Ou por fase: /speckit.implement "apenas fase Setup e Config"
```

## Diferença para skills ECC genéricas

| Aspecto | `blueprint`/`plan`/`orch-*` | `spec-kit` |
|---|---|---|
| **Natureza** | Workflows ECC internos (prompts) | Tool CLI instalável (`specify` binary) |
| **Isolamento** | Worktrees manuais | **Branch git automática** por spec |
| **Constituição** | `CLAUDE.md` / `AGENTS.md` ad-hoc | `.specify/memory/constitution.md` versionado |
| **Comandos** | Prompts longos | Slash commands curtos (`/speckit.*`) |
| **Integração** | Apenas Claude Code | **Multi-agente** (Claude, Copilot, Gemini, Cursor) |
| **Gerenciador** | npm/pnpm/yarn | **UV (Astral)** obrigatório/recomendado |

## Validação oficial (2026-08-20)

| Claim | Fonte oficial |
|---|---|
| CLI `specify init` com `--integration`, `--here`, `--force` | https://github.com/github/spec-kit/blob/main/docs/reference/core.md |
| Constitution em `.specify/memory/constitution.md` | https://github.com/github/spec-kit/blob/main/docs/reference/agentic-sdd.md |
| Branch automática `NNN-nome` no `specify` | https://github.com/github/spec-kit/blob/main/spec-driven.md |
| Comandos `/speckit.plan`, `/speckit.tasks`, `/speckit.implement` | https://github.com/github/spec-kit/blob/main/spec-driven.md |
| UV como gerenciador Python recomendado | https://github.com/astral-sh/uv (docs.astral.sh/uv) |
| Integração multi-agente (Claude, Copilot, Gemini, Cursor) | https://github.com/github/spec-kit/blob/main/integrations/README.md |

## Referências

- **Repo oficial**: https://github.com/github/spec-kit
- **Documentação SDD**: https://github.com/github/spec-kit/blob/main/spec-driven.md
- **Referência CLI**: https://github.com/github/spec-kit/blob/main/docs/reference/core.md
- **UV (Astral)**: https://docs.astral.sh/uv
- **Vídeo origem**: `8mNDmxHDmy4` — @Sujeitoprogramador (2026-08-20)