---
name: agentic-benchmark-top5
description: Mount your personal Top-5 agentic benchmarks aligned to your work instead of a global index. Use when choosing models, building a model stack, or comparing performance/cost/speed. Use quando montar top-5 de benchmarks, escolher modelos, comparar custo x performance, fugir de índice global genérico.
---

# Agentic Benchmark Top-5

Monte seu Top-5 pessoal de benchmarks agênticos e escolha uma stack de modelos, não um modelo único.

## Quando usar

Quando o índice global fica borrado, quando dois modelos parecem empatados no score mas diferem em custo/velocidade, ou quando você precisa justificar SOTA vs. workhorse vs. leve para trabalho agêntico real.

## Passos

1. **Declare o trabalho-alvo** — escreva em 1 frase o que seus agentes farão sem supervisão (ex. "codar features longas + operar rotinas de backoffice"). O alvo define quais benchmarks valem.
2. **Monte a ficha dos 5** — use estes como base, troque no máximo 1-2 pelo seu domínio:
   - **Terminal-Bench:** coding agêntico puro. Agente em container preparado, loop comando→resultado, verificador valida estado final. Sinal: capacidade bruta de engenharia.
   - **Apex Agents:** proxy de knowledge work. Banking, consulting, legal, com tasks criadas por experts. Prompt vago + workspace de documentos. Sinal: transferência para domínios duros fora de SWE.
   - **Automation Bench:** tasks em domínios reais (finance, HR, marketing, operations, sales, support) com apps reais. Score = objetivo cumprido SEM violar guardrails. Sinal: alinhamento/instruction-following.
   - **Omniscience:** honestidade. Respostas graded como correct / incorrect / partial / not-attempted, sem penalidade para "não sei". Sinal: taxa de alucinação e custo da honestidade.
   - **Deep SWE:** SWE de horizonte longo a partir de issues/PRs, com prompts curtos realistas. Sinal: autonomia com spec mínima.
3. **Aplique o triângulo performance/custo/velocidade** — para cada benchmark levante: score, tokens por task, tempo por task, custo por task. Métrica final: output útil de agente por hora por dólar. Performance sozinha não decide.
4. **Aplique a regra variância-vs-saturação** — descarte benchmark "flat line" (todos empatados, saturação ~85-90%+). Sem variância não há alfa. Procure a curva com queda: ali está a informação de qual tier usar.
5. **Monte o índice pessoal** — fixe 1 modelo controle, separe em 3 tiers: SOTA / workhorse / leve. SOTA para horizonte longo e crítico, workhorse 10-20x mais barato para volume, leve para triagem/delegação com handoff bem desenhado.
6. **Reporte a decisão** — tabela: benchmark | o que proxya | quem vence | custo/velocidade caveat | decisão de tier. Declare o que ficou de fora e por quê.

## Regras

- NEVER decidir por 1 benchmark ou pelo índice global sozinho.
- NEVER comparar só score: sempre anexe tokens, tempo e custo por task.
- Descarte benchmark saturado, salvo se seu trabalho vive exatamente do 1-3% residual.
- Prefira proxies alinhados ao seu trabalho, não os mais famosos.
- Modelo que você não pode pagar é irrelevante: preço entra na definição de "melhor".

## Related skills

- `agent-eval` — avaliação first-party de agentes via CLI.
- `llm-leaderboard-tracker` — acompanhamento contínuo de leaderboards.
- `benchmark-methodology` — desenho e scoring de benchmarks próprios.
