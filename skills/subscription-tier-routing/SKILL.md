---
name: subscription-tier-routing
description: Use when routing LLM calls by subscription tier allowance — Codex/Claude weekly allowances, cache-aware routing, fast mode, banked resets, GLM $18 budget. Triggers on "subscription tier routing", "weekly allowance routing", "cache aware routing", "banked resets", "glm budget tier".
metadata:
  origin: ECC
  source_docs:
    - https://platform.openai.com/docs/api-reference
    - https://docs.anthropic.com/en/api
    - https://z.ai/pricing
  video_source: "EIiXhCaZ4rw - I Mathematically CALCULATED the worth of Codex & Claude Code PLANS (AI Code King)"
  related_skills:
    - roteamento-modelos-baratos
    - claude-model-router
    - cost-aware-llm-pipeline
    - glm-integration-patterns
---

# Skill: subscription-tier-routing — Roteamento Ciente de Tier de Assinatura

Roteamento que considera **weekly allowances por tier**, **cache hit rates**, **fast mode**, **banked resets** e **GLM como budget tier**. Implementação completa em `references/implementation.md`.

## Quando usar

- Você paga assinaturas (Codex Pro 5X/20X, Claude Max 5X/20X) e quer maximizar valor
- Precisa rotear por **allowance restante**, não só custo por token
- Quer aproveitar **cache hit rates** (94% Astra, 79% Sonnet) para estender allowance
- Precisa lidar com **banked resets** (OpenAI promotional one-time refills)
- Quer usar **GLM $18/mo** como tier orçamentário para volume
- Decide quando usar **fast mode** (~2x créditos) vs normal

## Quando NÃO usar

- Roteamento simples por custo/token → use `roteamento-modelos-baratos`
- Model routing genérico → use `claude-model-router`
- Cost tracking sem tier awareness → use `cost-aware-llm-pipeline`
- GLM patterns específicos → use `glm-integration-patterns`

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| Codex Pro 20X ~$4900 / Claude Max 20X ~$2013 API equiv/mês | ⚠️ Projetado (small sample) | Video + pricings oficiais |
| Cache: 94% Astra, 79% Sonnet input cached | ✅ | Video measurement |
| GLM $18: browser automation, C coding, trial quota | ✅ | Z.ai pricing |
| Banked resets: promocional, refresh 5h+weekly | ✅ | OpenAI usage settings |
| Fast mode: ~2x créditos, respostas mais rápidas | ✅ | OpenAI/Anthropic docs |

---

## Subscription Tier Matrix

| Provider | Plan | $/mês | Weekly | API equiv/mês | Cache | Ideal para |
|---|---|---|---|---|---|---|
| Codex | Plus | $20 | 1X | ~$240 | 94% | Light coding |
| Codex | Pro 5X | $100 | 5X | ~$1,200 | 94% | Daily coding |
| Codex | Pro 20X | $200 | 20X | ~$4,900 | 94% | Heavy volume |
| Claude | Pro | $20 | 1X (5h/dia) | ~$101 | 79% | Light coding |
| Claude | Max 5X | $100 | 5X | ~$503 | 79% | Daily coding |
| Claude | Max 20X | $200 | 20X | ~$2,013 | 79% | Heavy volume |
| GLM/Z.ai | Coding | $18 | Generous | N/A | N/A | Budget volume |
| GLM/Z.ai | Higher | $80/$168 | More | N/A | N/A | Scale |

---