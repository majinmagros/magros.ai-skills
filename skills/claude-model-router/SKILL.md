---
name: claude-model-router
description: Use when routing Claude models by task — Sonet daily, Opus/Fable complex, mid-task swap, per-task cost tracking. Triggers on "claude model router", "roteamento modelos claude", "sonet vs opus", "swap model mid task", "cost tracking per task", "model routing strategy".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
    - https://docs.anthropic.com/en/docs/claude-code/settings
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Claude Model Router — Roteamento por Task

**Sonet** (diário, ≤$0.50/task) · **Opus** (complexo, ≤$5) · **Fable** (reasoning, ≤$10) + swap mid-task + cost tracking. Regras, router e tracker em `references/routing.md`.

## Quando usar (gatilhos concretos)

- "Roteamento de modelos no Claude Code"
- "Quando usar Sonet vs Opus vs Fable"
- "Swap de modelo mid-task"
- "Cost tracking por task"
- "Model routing strategy Claude"

## Quando NÃO usar

- Roteamento geral de LLMs → use `roteamento-modelos-baratos`
- Cost tracking geral → use `cost-aware-llm-pipeline`
- Model routing para outros provedores → use `roteamento-modelos-baratos`

## Regras (resumo)

- Upgrade → Opus se complexidade ≥8/10; downgrade → Sonet se ≤3/10 ou custo >3x esperado; considere Fable se contexto >100k
- `should_swap_model()` + `estimate_cost()` (70/30 in/out) + `record_task()` com budget + `get_session_report()` → `references/routing.md`
- CLI: `claude-model-router swap --to opus-5 --reason "..."` · `status` (modelo, custo, budget)

## Validação Contra Fonte

| Claim | Fonte | Status |
|---|---|---|
| Sonet diário / Opus-Fable complexo / swap economiza | Luciana Papini video | ✅ |
| Cost tracking per task | Anthropic Docs | ✅ |

## Enriquecimento 2026-09-06 — Opus 5 + rate limits (AI Code King `6m1vJqdsanQ`, docs oficiais)

- **Opus 5**: `claude-opus-5`, contexto **1M default e máximo**, 128K output, thinking on — [what's new](https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5). Preço API **$5/$25** por MTok.
- **Correção**: os **$10/$50** citados no vídeo são do **Fast mode / era Opus 4.8** (Week 30 digest), não do Opus 5 base. Não orçar Opus 5 a $10/$50.
- **Rate limits (14/set)**: boost temporário de 50% expira 13/set; aumento permanente de 25% sobre o baseline = **-17% vs o que você tem hoje** (admitido pela Anthropic). Limites 5h dobrados (maio) permanecem. Auto-mode classifier calls não contam mais no uso; auto-continue no reset reduz babysitting.
- Regra de roteamento: Opus 5 1M não dispensa curadoria — 1M cheio de ruído perde para 200K limpo (retrieval MRCR v2 cai com volume).

## Referências Oficiais

- [Luciana Papini Video](https://www.youtube.com/watch?v=Bezlzmti6_U)
- [Anthropic Model Docs](https://docs.anthropic.com/en/docs/claude-code/settings)
- [What's new in Claude Opus 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5)
- [Claude Code Week 30 — fast mode Opus 4.8 $10/$50](https://code.claude.com/docs/en/whats-new)

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...