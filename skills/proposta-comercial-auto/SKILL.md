---
name: proposta-comercial-auto
description: Gera proposta comercial a partir de transcricao de reuniao + tabela de precos, com gate humano e follow-up. Use para transformar reuniao em proposta, montar orcamento, fazer follow-up de proposta sem resposta. Triggers PT: gerar proposta, proposta comercial, follow-up proposta, orcamento cliente. Triggers EN: draft proposal, follow up proposal, meeting to proposal, quote follow-up.
---

# Proposta Comercial Auto

## Quando usar

- Existe transcricao de reuniao de discovery/vendas e é preciso gerar proposta.
- Existe tabela de precos e linhas de negociacao definidas.
- É preciso cobrar propostas paradas sem resposta.

## Quando NAO usar

- Não cria tarefas/trackers a partir de reuniao — isso é `meeting-task-listener`.
- Não inventa copy criativa ou posicionamento — isso é `article-writing` / `brand-voice`.
- Sem transcricao e sem tabela de precos, pare e peça os inputs.

## Pre-requisitos

1. Transcricao da reuniao (ex.: Drive) com: dor, escopo pedido, prazo, decisor, objecoes.
2. Tabela de precos vigente + limites: desconto maximo, condicoes de pagamento, escopo incluso/excluso.
3. Template de proposta na identidade da marca.

## Pipeline

1. **Extrair fatos da transcricao:** cliente, contexto, escopo solicitado, prazo, orcamento sinalizado, objecoes, proximos passos combinados. Marcar o que é citacao vs. inferencia.
2. **Cruzar com tabela de precos:** mapear cada item do escopo a linha de preco. Sinalizar item sem preco como `fora-de-tabela — exige aprovacao`.
3. **Checar linhas de negociacao:** desconto pedido vs. piso permitido, prazo vs. capacidade, pagamento vs. politica. Gerar tabela `pedido | politica | status (ok/atencao/bloqueado)`.
4. **Preencher template:** escopo, investimento por item, total, condicoes, prazo de validade, exclusoes, proximos passos. Não alterar layout/identidade do template.
5. **Gate de revisao humana (obrigatorio):** emitir diff de revisao com: valores, descontos, promessas de escopo, riscos. Não enviar sem aprovacao explicita.
6. **Envio:** registrar versao enviada (v1, v2...), data, canal, validade.
7. **Modulo follow-up:** se sem resposta, cadencia D+3 / D+7 / D+14 com mensagens curtas por estagio: confirmacao de recebimento, quebra de objecao, ultimo contato antes de arquivar. Parar no primeiro retorno e registrar motivo de perda/ganho.

## Regras

- Nunca inventar preco, prazo ou escopo não dito na reuniao.
- Todo desconto fora do piso vai para aprovacao, não para a proposta final.
- Proposta sem validade e sem exclusoes é invalida — sempre incluir.
- Follow-up não é cobranca agressiva: maximo 3 toques, depois arquivar com motivo.
- Manter log: `proposta | versao | valor | status | ultimo-toque | proximo-toque`.

## Output

- `proposta-vN` preenchida + tabela de conformidade preco/politica + fila de follow-up com datas.
- Done = proposta aprovada por humano, enviada, com follow-up agendado ou proposta respondida.

## Related skills

- `meeting-task-listener` — trackers pós-reunião.
- `article-writing` — copy longa da proposta.
- `brand-voice` — tom de voz da marca no texto.
