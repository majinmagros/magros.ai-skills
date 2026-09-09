---
name: fusion-harness
description: Use when orchestrating multiple models as architect + builders — debate, collaborate, cost tracking, software factory. Triggers on "fusion harness", "multi-model orchestration", "architect builder pattern", "model debate collaboration", "cost-aware agent routing", "software factory agents".
metadata:
  origin: ECC
  source_docs:
    - https://github.com/indydevdan/fusion-harness (repo referenciado no vídeo)
    - https://docs.anthropic.com/en/docs/claude-code/sub-agents
    - https://docs.anthropic.com/en/docs/claude-code/hooks
  skills_used:
    - agent-harness-construction
    - engenharia-de-grafos
    - graph-engineering
    - cost-aware-llm-pipeline
    - autonomous-agent-harness
---

# Fusion Harness — Multi-Model Orchestration (Architect + Builders)

Fusion Harness V2 (IndyDevDan): **Architect + Builders**, modos **Debate** e **Collaborate**, custo/velocidade/tokens por modelo, **Software Factory** (out-loop). Scripts em `references/scripts/`, templates em `references/`.

## Quando usar (gatilhos concretos)

- "Configure multi-model orchestration com architect + builders"
- "Quero debate entre modelos (Fable, Gemini, DeepSeek) antes de decidir"
- "Preciso de collaboration workflow: architect planeja → builders executam → architect integra"
- "Rastrear custo/tokens/latência por modelo em tempo real"
- "Software factory: agendar agentes 24/7 para trabalhar sem supervisão"
- "Combine compute don't select — usar melhor modelo para cada tarefa"
- "Model stack registry com aliases (esconder nomes dos modelos)"

## Quando NÃO usar

- Workflows single-model (Claude Code padrão já resolve)
- Delegação simples de sub-agentes (`/task` nativo)
- Orquestração que não precisa de cost tracking ou model routing

## Arquitetura (resumo)

**Model Stack Registry** (`references/config/model-stack-template.yaml`): tiers S/A com aliases anti-sabotage (Rune=Fable 5, Flux=Gem 3.7, Drift=DS V4, Local=Qwen3.8) + custo/1k + roles.

**Workflows:** `/fh opinion` (1 pergunta → N opiniões + tabela custo/latência + síntese architect) · `/fh debate` (tese → 3 rounds → consensus) · `/fh collaborate` (goal → planos → execução paralela por nível → integração). Scripts: `references/scripts/fh-{opinion,debate,collaborate}.py`.

**Software Factory** (`references/scripts/factory-scheduler.py`): variantes SDLC (`references/variant-templates/`: nightly-refactor, pr-review, feature-build) agendadas (cron/webhook); humano só reviewa.

**Cost tracking** (`references/scripts/cost-tracker.py` + `references/settings-hooks.json`): hooks Pre/PostToolUse em `Task` → SQLite → `fh cost` dashboard/export CSV.

**Projeto** (`.fusion-harness/`): `config/` (model-stack, factory-schedule, variants) + `scripts/` + `state/` (decisions.md append-only, context.md, .locks) + `costs.db` + `logs/`. Slash commands em `references/claude-commands/`.

```bash
pip install -e .  # instala fh CLI
fh stack && fh opinion "como implementar X?" && fh cost
```

## Regras de Ouro (do vídeo)

| Princípio | Implementação |
|---|---|
| **Combine compute, don't select** | Stack multi-tier; architect escolhe por task |
| **Hide model names** | Aliases — previne sabotagem/competição |
| **Cost transparency** | Dashboard realtime; exit se budget exceeded |
| **Verification layer** | Architect = verifier; stop hooks determinísticos |
| **Out-loop > In-loop** | Factory agenda variantes; humano reviewa |
| **State persistence** | Markdown + append-only locks |

## Validação contra Fonte (IndyDevDan Video 2026-08-25)

- [Vídeo: Intelligence EXPLOSION](https://www.youtube.com/watch?v=rqZHR-hRllI) — transcrição em `C:\projetos\Oportunidades\indyddevdan\rqZHR-hRllI.en.dedup.txt`
- Conceitos: `/fh opinion`, `/fh debate`, `/fh collaborate`, model aliases, cost table, software factory

## Outcome Esperado

1. **`fh stack`** → registry configurado
2. **`fh opinion "X?"`** → 3+ opiniões + tabela + síntese
3. **`fh debate "tese"`** → 3 rounds → consensus/rejection
4. **`fh collaborate "feature"`** → plano → paralelo → integração
5. **`fh factory schedule`** → daemon 24/7 (nightly, PR review)
6. **`fh cost`** → dashboard por modelo/sessão/workflow + CSV
7. **Hooks** rastreiam sub-agentes em realtime
