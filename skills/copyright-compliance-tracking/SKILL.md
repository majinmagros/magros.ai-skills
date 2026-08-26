---
name: copyright-compliance-tracking
description: Rastreia conformidade de direitos autorais e licenças de ativos de IA (datasets de treino, pesos de modelo, mídia gerada, código de terceiros) para evitar uso não licenciado. Gatilho: usuário vai usar dados/ modelo/ mídia gerada em produção ou comercialmente, pergunta "posso usar X comercialmente", ou precisa auditar licenças de um projeto de IA. Não-gatilho: não é registro de propriedade intelectual (use advogado); não é para licenciar sua própria obra (use copyright oficial). Outcome: inventário de ativos → licença resolvida por item (SPDX/model card) → obrigações (atribuição, uso comercial, restrição de derivado, direitos de dados de treino) → flag de risco + roteiro de remediação.
---

# Copyright & Compliance Tracking

Audita o "pedigree" de licença de tudo que entra num projeto de IA, de forma
**rastreável e por item**.

> ✅ **VERIFICADO (2026-08-26):** identificadores e fontes confirmados nesta sessão.

## Pipeline

### 1. Inventariar ativos
Liste tudo usado no projeto:
- Datasets de treino/fine-tune (origem, licença declarada).
- Pesos de modelo (licença do model card / hub).
- Mídia gerada (modelo, prompts, direitos da imagem base).
- Código de terceiros (repo, licença).

### 2. Resolver licença
- Normalize para identificador **SPDX** (lista oficial: `spdx.org/licenses/` —
  identificadores curtos padronizados como `MIT`, `Apache-2.0`, `CC-BY-4.0`,
  `CC-BY-NC`). Use o short identifier, não texto livre.
- Para modelo: licença está no **model card** / campo `license` do hub
  (ex.: cards de Llama/Mistral em docs do fabricante ou GitHub). Não assuma permissivo.

### 3. Checar obrigações
Por item, verifique:
- `ATRIBUIÇÃO` — precisa citar?
- `COMERCIAL` — uso comercial permitido?
- `DERIVADO` — restrição de redistribuir modificado?
- `DADOS-TREINO` — direitos sobre o corpus de treino estão declarados?

### 4. Sinalizar risco
- `ALTO`: comercial + sem licença clara / proibido.
- `MÉDIO`: precisa atribuição ou restrição de derivado.
- `BAIXO`: licença permissiva confirmada.

### 5. Relatório + remediação
- Tabela: ativo | licença | obrigação | risco.
- Sugira substituição (licença compatível) para itens de risco alto.

## Regras
- Licença "não declarada" = risco até prova em contrário.
- "Uso grátis para teste" ≠ "uso comercial permitido" — separe os dois.
- Recomende revisão jurídica para decisão vinculante/comercial.

## Exemplo real validado (2026-08-26)
- Ativo: `Llama-3.2` → licença *Llama 3.2 Community License* (custom, NÃO-SPDX;
  uso comercial permitido com limite de usuários/MAU). Risco: MÉDIO (atribuição + teto).
- Ativo: `MIT` genérico → `MIT` (SPDX). Risco: BAIXO.
- Ativo: mídia gerada por modelo sem licença declarada → risco ALTO até comprovar.
- output: tabela ativo|licença|obrigação|risco.
