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

## Lógica de Roteamento (resumo)

1. **Pula tiers esgotados** (≥95% usado e sem banked reset)
2. **Allowance efetivo** = restante × multiplicador de cache (Codex 1.25x, Claude 1.093x)
3. **Custo da task** em % do allowance (codegen 2.0, review 1.0, research 3.0, debug 1.5, refactor 2.5; fast mode ×2)
4. **Score** = custo 0.5 + cache 0.3 + tier 0.2 → escolhe o maior
5. **Fallback:** banked reset disponível → GLM $18

Regras rápidas: fast mode só com allowance folgado (<70% usado) ou urgência crítica; GLM quando allowances esgotados, C/C++, browser automation ou budget apertado. Código em `references/implementation.md` (`SubscriptionTierRouter`, `BankedResetManager`, `should_use_glm_budget`, `should_use_fast_mode`).

## Uso Rápido

```python
router = SubscriptionTierRouter(subscriptions)  # Tier → SubscriptionState
decision = router.route(TaskSpec(type="code_generation"))
print(decision.provider, decision.tier, decision.model)  # ex: codex pro_20x gpt-4o
```

---

## Integração com Skills Existentes

| Skill | Como Complementa |
|---|---|
| `roteamento-modelos-baratos` | Adiciona tier awareness (allowances, cache, resets) |
| `claude-model-router` | Estende com subscription state tracking |
| `cost-aware-llm-pipeline` | Fornece subscription-tier cost model |
| `glm-integration-patterns` | GLM como fallback budget tier |

---

## Referências

- `references/implementation.md` — router, resets, GLM config, fast mode, exemplo
- [OpenAI Pricing](https://platform.openai.com/docs/pricing) · [Anthropic Pricing](https://docs.anthropic.com/en/docs/pricing) · [Z.ai Pricing](https://z.ai/pricing)
- Video: `EIiXhCaZ4rw.en.dedup.txt` — linhas 94-169, 172-198, 278-335
