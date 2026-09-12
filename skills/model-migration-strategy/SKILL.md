---
name: model-migration-strategy
description: Use when migrating between model families — eval suite first, avoid per-family hyper-optimization, hedge new failure modes, cost attribution. Triggers on "model migration", "gpt-5 gotchas", "em dashes model", "AI telltale signs", "hyper-optimization prompts", "model failure modes".
metadata:
  origin: ECC
  source_docs:
    - https://docs.anthropic.com/en/docs/managed-agents/models
  video_source: "hm8NzEd5io0 - How founders build on Claude Managed Agents (Claude Oficial)"
  related_skills:
    - roteamento-modelos-baratos
    - claude-model-router
    - eval-harness
    - verification-loop
    - cost-aware-llm-pipeline
---

# Skill: model-migration-strategy — Estratégia de Migração de Modelos

Migração segura entre famílias: **eval suite primeiro**, sem hyper-optimization por família, hedge de **novos failure modes**, cost attribution granular. Código em `references/implementation.md`.

## Quando usar

- Nova família de modelo lançada (GPT-5, Claude 4, etc.)
- Precisa migrar produção de um modelo para outro
- Quer evitar **hyper-optimization** para família específica
- Precisa detectar **novos failure modes** por família
- Quer **attribution granularity** de custos por modelo

## Quando NÃO usar

- Roteamento simples → use `roteamento-modelos-baratos`, `claude-model-router`
- Cost tracking genérico → use `cost-aware-llm-pipeline`
- Eval harness genérico → use `eval-harness`
- Subscription tier routing → use `subscription-tier-routing`

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| Eval suite FIRST before migration | ✅ | Video + Anthropic best practices |
| Avoid hyper-optimization per model family | ✅ | Video |
| GPT-5: mais em dashes, AI telltale signs | ✅ | Video (empirical) |
| New failure modes per family | ✅ | Video |
| Cost attribution granularity | ✅ | Video |

---

## Os 4 Princípios

1. **EVAL SUITE FIRST** — não migre sem evals que peguem regressão (vibes → curated → customer queries; mesmas rubricas offline + outcomes)
2. **AVOID HYPER-OPTIMIZATION** — prompts otimizados para Opus falham no Sonnet; para GPT-4 falham no GPT-5. Prompting robusto, não family-specific
3. **HEDGE NEW FAILURE MODES** — cada família tem gotchas: GPT-5 (em dashes, sentence structures, tom acadêmico), DeepSeek (caracteres chineses), Opus (over-thinking). Teste gotchas ANTES de otimizar
4. **COST ATTRIBUTION** — telemetria fine-grained: que calls custam o quê, por model/feature/operation; alerta se feature passa de 50% do budget

## Fases de Migração (com auto-rollback)

| Fase | Tráfego | Duração | Sucesso | Rollback |
|---|---|---|---|---|
| canary | 5% | 24h | pass ≥ 0.95 | pass < 0.90 |
| partial | 25% | 48h | pass ≥ 0.97 | pass < 0.93 |
| majority | 75% | 72h | pass ≥ 0.98 | pass < 0.95 |
| full | 100% | — | pass ≥ 0.99 | pass < 0.97 |
