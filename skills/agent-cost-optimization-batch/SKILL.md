---
name: agent-cost-optimization-batch
description: Use when optimizing agent costs via batch mode — 50-75% savings running 24h ahead, pre-warm sandboxes, multi-model allocation. Triggers on "agent batch mode", "batch processing agents", "pre-warm sandboxes", "multi-model cost allocation", "cost savings 50-75%".
metadata:
  origin: ECC
  source_docs:
    - https://docs.anthropic.com/en/docs/managed-agents/batch
  video_source: "hm8NzEd5io0 - How founders build on Claude Managed Agents (Claude Oficial)"
  related_skills:
    - cost-aware-llm-pipeline
    - roteamento-modelos-baratos
    - claude-managed-agents-patterns
    - subscription-tier-routing
---

# Skill: agent-cost-optimization-batch — Otimização de Custo via Batch Mode

**Batch mode** do Managed Agents SDK: **50-75% savings** rodando 24h antes + **pre-warm sandboxes** + **multi-model allocation** (frontier coordena, barato executa volume). Código em `references/implementation.md`.

## Quando usar

- Você usa **Managed Agents SDK** e quer reduzir custos drasticamente
- Tem jobs que podem rodar **24h antes** (nightly, batch processing)
- Precisa de **pre-warm sandboxes** para reduzir cold start latency
- Quer alocar **modelos caros só onde necessário** (coordenação) vs baratos (volume)
- Processa **centenas de accounts** em paralelo (fan-out)

## Quando NÃO usar

- Tasks real-time → use normal mode
- Cost tracking genérico → use `cost-aware-llm-pipeline`
- Roteamento simples → use `roteamento-modelos-baratos`
- Subscription tier routing → use `subscription-tier-routing`

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| Batch 50-75% savings com 24h de antecedência | ✅ | https://docs.anthropic.com/en/docs/managed-agents/batch |
| Pre-warm sandboxes para latency-sensitive | ✅ | Video + docs |
| Frontier coordena, barato faz fan-out (500 accounts) | ✅ | Video |

---

## Economia (resumo)

On-demand: 500 queries × Opus = $X/run → $30X/mês. Batch (24h antes): $0.25X–$0.5X/run → $7.5X–$15X/mês. **Savings: 50-75%.**

## Alocação Multi-Modelo (resumo)

| Papel | Modelo | $/1k tokens | Uso |
|---|---|---|---|
| **Coordinator** (1 agent) | claude-opus-4 | 0.015 | Planning, reasoning, decisões |
| **Fan-out workers** (500) | deepseek-v4-flash / glm-4.5 | 0.0002 | Avaliação, extração, queries simples |
| **Verification** | claude-sonnet-4 | 0.003 | Checks, rubricas |

Exemplo 500 accounts (50k coord + 10k/worker + 5k/verifier): **~70-80% savings vs all-frontier**. `calculate_batch_cost()` em `references/implementation.md`.

## Jobs Prontos (resumo)

- **Watchtower nightly** (`0 2 * * *`): avalia 500 accounts → prioridades do dia; paralelismo 200, timeout 3h
- **Funnel analysis nightly** (`0 3 * * *`): detecta drops de conversão (lookback 4 semanas) → sugere fixes
- **SandboxPool**: `prewarm(repo, count=10)` antes de jobs críticos; get/return no loop; fallback cold start