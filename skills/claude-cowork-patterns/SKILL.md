---
name: claude-cowork-patterns
description: Use when applying Claude Cowork patterns — task execution, file ops, folder processing, recurring tasks, approval gates. Triggers on "claude cowork patterns", "cowork patterns claude", "task execution patterns", "file operations patterns", "folder processing patterns", "recurring tasks claude".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
    - https://docs.anthropic.com/en/docs/claude-code/cowork
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Claude Cowork Patterns - Padrões Cowork

Padrões Cowork: **task execution, file ops, folder processing, recurring tasks, approval gates**. Código em `scripts/`.

## Quando usar (gatilhos concretos)

- "Cowork task execution patterns"
- "File operations patterns"
- "Folder processing patterns"
- "Recurring tasks patterns"
- "Approval gates patterns"

## Quando NÃO usar

- Automação apenas API (use `api-connector-builder`)
- Automação desktop-only (use `automacao-deterministica`)
- Automação mobile-only

## Core Patterns (resumo — código em `scripts/`)

**1. Task execution** (`task_execution.py`): decompose em subtarefas atômicas via LLM → `execute_with_checkpoints` (falha se checkpoint inválido) → `parallel_execution` (semáforo asyncio, max 3).

**2. File ops** (`file_operations.py`): `safe_read` (existe + ≤10MB) · `safe_write` (backup `.bak.timestamp` + mkdir) · `atomic_write` (temp + rename) · `organize_downloads` (regex → pastas).

**3. Folder processing** (`folder_processing.py`): `process_folder_recursive` (processor + pattern + max_depth → {processed, errors, skipped}) · `watch_folder` (watchdog, patterns, recursive).

**4. Recurring tasks** (`recurring_tasks.py`): `add_recurring_task` (cron-like via `schedule`) + scheduler em background thread (daemon, 60s tick).

**5. Approval gates** (`approval_gates.py`): `require_approval` decorator (input y/N) · `auto_approve_low_risk` (read/list/search/analyze) · `log_execution` (audit: action, params, resumo, ms, timestamp).

**Integração** (`integration.py`): exemplo `research_and_organize` com `claude-chrome-automation` (pesquisa multi-tab → organiza downloads por tópico).

```python
from skills.claude-cowork-patterns.scripts.file_operations import FileOperationPatterns
FileOperationPatterns.atomic_write("relatorio.md", conteudo)  # sem corrupção parcial
```

## Referências Oficiais

- [Luciana Papini Video](https://www.youtube.com/watch?v=Bezlzmti6_U)
- [Claude Code Cowork Docs](https://docs.anthropic.com/en/docs/claude-code/cowork)

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...
```
