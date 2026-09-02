---
name: local-ai-hardware
description: "Deploy local AI hardware (Nvidia DGX Spark $3k, AI PC) vs cloud. Use when deciding buy vs rent GPU, need 100% offline or TCO analysis. Triggers on \"DGX Spark\", \"AI PC\", \"local hardware\", \"Nvidia DGX\", \"hardware local\""
---

# Local AI Hardware — DGX Spark

> Fonte: `1p0HXLv_5wM` (DGX Spark $3k), transcript `1p0HXLv_5wM.pt.dedup.txt:130-180`

Transição cloud → edge: DGX Spark na mesa, 100% grátis/offline, hoje nicho (heavy users), tendência baratear para notebooks.

## Quando usar

- Heavy user/empresa, custo cloud > $500/mês
- Precisa offline, privacidade, latência zero
- Comparar DGX Spark vs `ito-compute` (aluguel) vs Apple Silicon

## Decisão Buy vs Rent

| Critério | Comprar (DGX Spark) | Alugar (ito-compute) |
|---|---|---|
| Custo inicial | $3k | $0 |
| Custo/mês | $0 (energia) | $50-300 |
| Offline | Sim | Não |
| Upgrade | Manual | Instant |

TCO = `hardware + energia*meses` vs `tokens/mês * $/token` (`cost-aware-llm-pipeline`).

## Workflow

1. Estime tokens/mês + custo cloud (`roteamento-modelos-baratos`)
2. Calcule TCO 12 meses
3. Se buy: `DGX Spark` → `vLLM` local → benchmark `local-llm-efficiency`
4. Se rent: use `ito-compute`

## Referências

- `references/tco-calculator.md` — planilha TCO
