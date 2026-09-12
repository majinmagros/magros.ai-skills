---
name: unified-memory
description: Share durable, inspectable context and handoffs between Claude, Codex, Hermes, Cursor, OpenCode, and other agents through the local ECC Memory Vault. Use when an agent must save work state, transfer context, resume another agent's task, or search shared project knowledge.
metadata:
  origin: ECC
---

# Unified Memory

Use the ECC Memory Vault as the common context layer between harnesses. The
vault stores portable `ecc.memory.v1` Markdown documents rather than
harness-specific transcripts or inboxes.

## Runtime Prerequisite

This skill is guidance, not the Memory Vault executable. Skill-only, minimal,
manual, and Claude plugin installs do not create the required commands on
`PATH`. Install the `ecc-universal` npm runtime separately before using the CLI
or MCP examples:

```bash
npm install -g ecc-universal
ecc memory --help
command -v ecc-memory-mcp
```

A repository checkout may instead run the CLI as
`node scripts/ecc.js memory ...`, but MCP configurations that name
`ecc-memory-mcp` still require that binary on `PATH`.

## When To Use

- Save durable context that another agent or later session will need.
- Hand work from Claude to Codex, Hermes to Claude, or any other harness pair.
- Resume a task and search for prior decisions, facts, lessons, or handoffs.
- Diagnose malformed memories, broken links, duplicate IDs, or skipped
  symbolic links.

Do not use the vault as a task tracker, secret store, policy engine, or
substitute for governed project documentation.

## Memory Architecture: 3-Job Framework (New)

Estrutura recomendada para sistemas de memória persistente em agentes:
1. **Storage**: Decisão de quando e o que armazenar (evitar transcrições cruas).
2. **Injection**: Injeção contextual leve no prompt (context window management).
3. **Retrieval**: Busca semântica por significado (ex: vetores/PG Vector + RLS para time, ou Vault local) em 3 níveis (curto, médio, longo prazo).
*Origem: Simon Scrapes (Leva 1 - 2026).*

| Scope | Location | Use |
|---|---|---|
| `project` | `<repo>/.ecc/memory/project/` | Repo-local context protected by a fail-closed `.gitignore` |
| `team` | `<repo>/.ecc/memory/team/` | Context intended for human review and version-controlled sharing |
| `user` | `~/.ecc/memory/` | Operator context that follows the user across repositories |

All participating harnesses must use the same repository working directory or
the same `ECC_MEMORY_PROJECT_ROOT` and `ECC_MEMORY_USER_ROOT` overrides.
Normal search recall covers active `project` and `team` memories. A direct ID
read may inspect a non-active entry. Request `user`
explicitly with `--scope user`; it is never included implicitly. Project-scope
initialization and writes fail closed if the vault's protective `.gitignore`
exists with unexpected content.

## Workflow
