---
name: dmux-workflows
description: "Use when running multiple agent sessions in parallel with dmux/tmux panes across harnesses. Triggers on \"dmux\", \"multi-agent\", \"parallel agents\", \"tmux panes\"."
metadata:
  origin: ECC
---

# dmux Workflows

Orchestrate parallel AI agent sessions using dmux, a tmux pane manager. Detalhes em `references/`.

## When to Activate

- Running multiple agent sessions in parallel
- Coordinating work across Claude Code, Codex, and other harnesses
- Complex tasks that benefit from divide-and-conquer parallelism
- User says "run in parallel", "split this work", "use dmux", or "multi-agent"

## Core Principles

1. **Independent tasks only** — never parallelize dependent outputs
2. **Clear boundaries** — each pane owns distinct files or concerns
3. **Merge strategically** — review pane output before merging
4. **Isolate with worktrees** when panes touch overlapping files
5. **Cap at 5-6 panes** — each pane is a full session burning tokens

## Example

```bash
dmux
# press 'n', then prompt per pane:
# Pane 1: "Create the billing schema and migrations"
# Pane 2: "Build the billing API endpoints"
# press 'm' to merge results back
```

## References

- `references/concepts-setup.md` — what is dmux, install, quick start, tools table
- `references/workflow-patterns.md` — research+implement, multi-file, test/fix, cross-harness, review
- `references/worktrees-orchestration.md` — git worktrees, ECC helper, seedPaths
- `references/signals-enrichment.md` — troubleshooting, cmux vs tmux, wait-for signals

## Checklist

- [ ] Tasks are independent with clear file/concern boundaries
- [ ] Worktrees created when file overlap is likely
- [ ] Pane count kept at 5-6 max for token control
- [ ] Output reviewed before merge; completion signal defined

## Herdr status-aware e multi-maquina (leva YouTube 2026-11-11)

Fonte `LDxan-w2LVw`. O Herdr (repo ~**49k** estrelas) ficou **status-aware**: cada painel
mostra o estado real do agente (rodando/esperando/erro) lido do session file, inclusive
status do Codex - pare de inferir pelo scroll. Adicione hosts com `machine add` (SSH) e
direcione a sessao com `--machine`, para rodar agentes em servidor e nao no laptop.
Operacao: stagger de ~**100 ms** ao disparar varios paineis (thundering herd) e guarde ate
**48 snapshots** de layout por sessao para restaurar o arranjo.
