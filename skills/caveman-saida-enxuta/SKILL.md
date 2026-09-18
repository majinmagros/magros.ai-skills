---
name: caveman-saida-enxuta
description: Prune model output verbosity (preamble, repeated summary, help offers) to save output tokens — source claims −65/−87%. Use when the user says "resposta direta", "sem enrolação", "cortar verbosidade", "economizar tokens de saída", "modo caveman", or in EN "concise output", "cut verbosity", "no preamble", "direct answer only", "caveman mode", "save output tokens".
---

# Caveman — Saída Enxuta

Pode a verbosidade de saída do modelo: corta preâmbulo, resumo repetido e
oferta de ajuda, preservando fatos, números e próximos passos acionáveis.
Conceito da skill Caveman (Maestros da IA, vídeo V1nMBWzXsCI). Números de
−65/−87% são alegação da fonte, não garantia.

## Quando usar / When to use

- Respostas operacionais: status, diagnósticos, diffs, logs, code review.
- Loops de agente onde cada token de saída multiplica custo.
- Usuário pediu "direto", "enxuto", "sem floreio".
- NÃO usar (ver exceções abaixo) em relatórios formais e tutoriais.

## Passos

1. **Fixar instrução de resposta direta** — abra com diretiva curta, ex.:
   `Responda direto: sem preâmbulo, sem resumo repetido, sem oferta de ajuda.`
   Em loops de agente, vá para o system prompt, não só para o turno.
2. **Cortar o previsível** — remova sempre:
   - preâmbulo ("Claro!", "Ótima pergunta", "Aqui está...");
   - reiteração do pedido ("Você pediu X, então...");
   - resumo que repete o corpo palavra por palavra;
   - oferta de ajuda ("Quer que eu...?", "Posso detalhar...?");
   - encerramentos vazios ("Espero ter ajudado!").
3. **Preservar o load-bearing** — NUNCA corte:
   - fatos, números, nomes, comandos, diffs, erros literais;
   - ressalvas de segurança e pré-condições;
   - o único próximo passo acionável (1 linha, se existir).
4. **Medir (amostragem, não sempre)** — em 3–5 respostas, compare
   `tokens antes → depois`. Se economia < 30%, a resposta já era enxuta:
   declare e não force mais corte.

## Quando NÃO cortar

- Relatórios formais, atas, docs para terceiros: estrutura completa vale o custo.
- Tutoriais passo a passo: repetição intencional ajuda o leitor.
- Feedback sensível ou conflito: tom reduz atrito; brevidade soa rude.
- Usuário pediu explicitamente detalhamento ou contexto.

## Regras

- NUNCA sacrifique corretude por brevidade: cortar palavras, não fatos.
- NUNCA remova warnings, erros ou comandos exatos para "enxugar".
- NUNCA aplique em texto de terceiros sem avisar (cite a edição).
- Se o corte gerar ambiguidade, reverta para a frase completa.

## Related skills

- `token-budget-advisor` — decide quando a economia de saída vale o trade-off.
- `context-budget` — enxugar saída + orçar entrada como par.
- `humanizar-texto` — oposto complementar: quando o tom importa mais que tokens.
