---
name: sub-agent-cost-guard
description: Use when guarding sub-agent token costs — 7x multiplier detection, main context vs fork decision, fold-vs-sub-agent architecture, fast mode guardrail, cache rebuild penalty. Triggers on "sub-agent cost guard", "sub-agent token optimizer", "claude sub-agent cost", "fast mode guardrail", "sub-agent token limit", "api credits guardrail", "quando dobrar sub-agente", "sub-agent sprawl".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=icM0ewXGvAw (Simon Scrapes - 19 Claude Code Mistakes)
    - https://docs.anthropic.com/en/docs/claude-code/sub-agents
    - https://docs.anthropic.com/en/docs/claude-code/hooks
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Sub-Agent Cost Guard — Guardrail de Custo para Sub-Agents

Guardrail que **detecta uso excessivo de sub-agents** (~7x tokens por context replication), **fast mode API credits trap** e **cache rebuild penalty**. Código em `scripts/`.

> *"Agent teams use approximately seven times more tokens than standard sessions... each teammate maintains its own individual context window."* — Anthropic Docs

## Quando usar (gatilhos concretos)

- "Sub-agent cost guard" / "Sub-agent token optimizer"
- "Claude sub-agent cost" / "Sub-agent 7x tokens"
- "Fast mode guardrail" / "Sub-agent token limit" / "API credits guardrail"

## Quando NÃO usar

- General cost tracking → use `cost-aware-llm-pipeline`
- Model routing → use `claude-model-router`
- General budget tracking → use `cost-tracking`

## Guardrails (resumo — `scripts/sub-agent-cost-guard.js`)

- **Registro + thresholds**: budget 1M default; WARNING 70%, CRITICAL 90%; alerta se sub-agents >50% dos tokens ou count ≥ max (3)
- **Main vs fork**: `forkCost = est × 7` vs `mainCost = contexto + est` → recomenda o menor (`analyzeMainContextVsFork`)
- **Fast mode**: usa API credits (não subscription) + penalty ~50k tokens no primeiro request uncached → sugere desabilitar
- **Cache rebuild**: cada troca de modelo ≈ 10% do contexto
- **Report**: summary (ratio, avg/agent, top-5) + recomendações automáticas

```bash
node scripts/cli.js report                              # relatório da sessão
node scripts/cli.js analyze "refactor X" 50000          # fork ou main context?
node scripts/cli.js fast-mode-check                     # guardrails do fast mode
```

**Hooks** (`scripts/hooks/` + `scripts/settings-patch.json`): PreToolUse em `Task` bloqueia fork caro; Stop gera relatório final. Integração com `cost-aware-llm-pipeline` em `references/integration.md`.

## Validação Contra Fonte

| Claim | Fonte | Status |
|---|---|---|
| Sub-agents 7x tokens / context isolation / multiplier | Anthropic Docs | ✅ |
| Fast mode API credits / uncached penalty / cache rebuild | Simon Scrapes Video | ✅ |

## Checklist de Entrega

- [ ] `scripts/sub-agent-cost-guard.js` — core
- [ ] `scripts/hooks/` + `scripts/settings-patch.json` — PreToolUse + Stop
- [ ] `scripts/cli.js` — report, analyze, fast-mode-check
- [ ] Testes de integração

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, commands, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...
```

## Dobrar ou desdobrar: a decisão arquitetural (leva 2026-10-31)

Custo é consequência da forma. Antes de contar token, decida se o trabalho
pertence a um loop único ou a um sub-agente:

- **Fica no loop principal** quando cada passo depende do anterior, os passos
  compartilham os mesmos dados, ou você quase sempre chama os dois juntos.
- **Vira sub-agente só com uma razão nomeável**: contexto dele piora o principal
  (medido), paralelo em contexto novo descartável, ou o agente único trava em
  escolha de ferramenta/instruções conflitantes.
- **Divida por contexto, não por tipo de problema.** Copiar o organograma para
  dentro do agente ("lei de Conway") produz brawl de sub-agentes, FrankenPrompt,
  telefone sem fio e latência — cada sub-agente é uma execução completa.
- Migração: dobre um por vez, prompt→skill, API→tool, e meça com ~10 exemplos
  dourados **rodados mais de uma vez**.

Detalhe, modos de falha e o teste de decisão em
`references/quando-dobrar-subagentes.md`. Para orquestração de time com vários
agentes, ver `team-agent-orchestration`.
## TTL do cache e retorno minimo (leva YouTube 2026-11-11)

Fonte `ZRKAw472Nmk`. Subagente nasce com cache frio: paga o preco cheio do contexto
(~5x) e vive so o TTL de 1h. Por isso: (a) dispare sob demanda e em lote, nao em
pinga-pinga; (b) peca retorno **so do essencial** (resumo + caminho do arquivo), nunca o
transcript inteiro de volta ao pai; (c) defina `effort`/modelo no INICIO da sessao -
trocar no meio descarta o cache. Worker barato para volume, modelo forte para decidir.
