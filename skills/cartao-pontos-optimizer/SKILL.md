---
name: cartao-pontos-optimizer
description: Otimizador PF de cartões e pontos a partir de 2-6 faturas. Use quando o usuário pedir melhor cartão, milhas, cashback, anuidade, onde concentrar gasto. Triggers PT: otimizar cartões, pontos e milhas, qual cartão usar, cancelar cartão, analisar faturas. Triggers EN: credit card optimizer, points and miles, best card for spending, annual fee analysis.
---

# Cartão & Pontos Optimizer (PF)

Lê 2-6 faturas, mapeia gasto por categoria, aloca 1 cartão por categoria, decide cancelamento. Só prompt + planilha. Sem MCP.

## Quando usar

- "Tenho 3 cartões, qual uso para quê?"
- "Vale a pena a anuidade / sala VIP / pontos?"
- "Analisa minhas faturas e sugere".
- Plano de milhas para uma viagem específica.

Não usar para: PJ, conciliação contábil, imposto, fraude. Isso é `finance-billing-ops` (empresarial, distinto).

## Passos

### 1. Coletar faturas (2-6, sem exceção a mais)
1. Peça 2-6 faturas recentes (CSV do app ou PDF). Mínimo 2 para ver padrão, teto 6 para não virar auditoria.
2. Para cada fatura anote: cartão, bandeira, anuidade, programa de pontos, valor total.
3. Se vier PDF sem CSV: peça o usuário colar ou converter. Amostra de 30 dias basta.

### 2. Mapear gasto por categoria
1. Classifique em 8 categorias fixas: mercado, delivery/restaurante, combustível/transporte, viagens, assinaturas, saúde/farmácia, compras online, outros.
2. Monte a planilha: `categoria | cartão_A | cartão_B | cartão_C | total | %`.
3. Marque os 3 maiores gastos. Só eles decidem a alocação. O resto é ruído.

### 3. Alocar 1 cartão por benefício
1. Levante por cartão: pontos por R$/US$, cashback %, benefícios (VIP, seguro viagem, proteção compra), anuidade real (descontos incluídos).
2. Regra de alocação: cada categoria vai para o cartão com maior retorno líquido naquela categoria. Empate → concentra no que já tem mais gasto.
3. Saída: tabela `categoria → cartão → porquê (1 linha)`.
4. Trave regra anti-pulverização: máx 2 cartões no dia a dia + 1 para viagem. Mais que isso dilui ponto e complica.

### 4. Decidir cancelamento / downgrade
1. Para cada cartão com anuidade calcule: `retorno_anual_estimado - anuidade = líquido`.
2. Sugira cancelar/downgrade se: líquido negativo 2 ciclos seguidos, benefício-chave não usado em 6 meses, ou função duplicada por cartão gratuito.
3. Antes de sugerir cancelar: avise sobre perda de pontos, impacto em limite/score e prazo para transferir pontos.
4. Entregue: manter / downgrade / cancelar por cartão, com motivo em 1 frase cada.

### 5. Plano de 90 dias
1. Onde concentrar gasto, meta de pontos para a viagem/alvo, lembrete de resgate antes de expirar.
2. Formato: checklist de 5 itens, não relatório longo.

## Regras

- PF apenas. Sem CNPJ, sem reembolso corporativo, sem contabilidade.
- Sem MCP, sem acesso a banco. Trabalhe só com o que o usuário colar/enviar.
- Nunca peça senha, CVV, número completo do cartão ou token. Últimos 4 dígitos no máx.
- Não prometa valor de milha futura. Use valor atual do programa e declare a incerteza.
- Anuidade entra sempre no cálculo líquido. Ponto sem subtrair anuidade é propaganda, não análise.
- Planilha simples > modelo complexo. Se não cabe em 1 aba, está complicado demais.
- Distinto de `finance-billing-ops`: aquele é cobrança/subscription empresarial. Este nunca toca nisso.

## Related skills

- `finance-billing-ops` — billing e subscriptions empresariais (escopo distinto, não sobrepor).
