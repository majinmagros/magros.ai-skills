---
name: financiamento-imobiliario
description: "Use when analyzing Brazilian real estate financing (CAIXA, FGTS, ITBI, SIOPI, contracts, buyer rights). Triggers on \"financiamento\", \"imobiliário\", \"CAIXA\", \"FGTS\", \"ITBI\", \"SIOPI\"."
metadata:
  origin: ECC
---

# Financiamento Imobiliário

Guia em português claro para quem financia imóvel no Brasil: documentos, cálculos e próximos passos. Detalhes em `references/`.

## When to Activate

- User financia ou vai financiar imóvel (CAIXA ou outro banco)
- Precisa comparar valores entre SIOPI, contrato, DAMP/FGTS, SCR
- Dúvida sobre taxas (nominal, efetiva, CET, CESH), ITBI, escritura
- Classificação HIS/HMP/R2V/NR, vaga de garagem, prazo de entrega
- Quer checklist, e-mail à CAIXA ou notificação à incorporadora

## Core Principles

1. **Documento manda** — nunca assuma valor; confira no PDF/extrato
2. **Cite a fonte** — arquivo, página e cláusula de cada número
3. **Separe fato de estimativa** — projeção nunca é valor oficial do banco
4. **Previsão do banco ≠ prazo contratual** — só o contrato + tolerância valem
5. **Advogado para decisão legal** — a skill organiza, não substitui counsel

## Example

```text
1. Ler SIOPI + contrato + SCR + extrato da construtora
2. Extrair: valor financiado, taxas, parcela, fase da obra
3. Projetar fluxo de caixa (obra → amortização) e explicar em português claro
```

## References

- `references/workflow-documentos.md` — entender caso, extrair SIOPI/DAMP/contrato/SCR, checklist de problemas
- `references/calculos-juridico.md` — fase obra, PRICE/SAC, ITBI, base legal (CDC, Leis, Decretos SP)
- `references/templates-checks.md` — e-mail CAIXA, notificação incorporadora, issues, safety rules
- `references/projeto-contexto.md` — estrutura de pastas, contexto projeto-lorem-ipsum, exemplos de uso

## Checklist

- [ ] Banco, documentos disponíveis e pergunta específica identificados
- [ ] Valores extraídos com fonte (arquivo/página/cláusula) e divergências tabeladas
- [ ] Encargo obra e amortização projetados sem vender estimativa como oficial
- [ ] Entregável gerado (análise, fluxo de caixa, minuta) + próximos passos
- [ ] Orientado a guardar tudo e consultar advogado antes de ato legal
