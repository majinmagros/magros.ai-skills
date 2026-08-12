---
name: graph-engineering
description: Use when generating/verifying candidates in parallel or iterating to a quality score — music elements, research, any rankable output. Triggers on "graph engineering", "grafos", "verificar em paralelo", "loop engineering", "gerar candidatos", "rankear", "nota 80", "pipeline". Encodes parallel verification (Graph) + iterate-until-score (Loop). Companion to dnb-production for audio; use together.
---

# Skill: Graph & Loop Engineering (DnB)

Componente de engenharia do harness: produzir candidatos de áudio, verificar em
PARALELO (graph) e iterar até a nota mínima (loop). É companheira da
`dnb-production` — use junto.

## 1. Contexto primeiro

- Leia `contexto\00-contexto-sessao.md` e `harness\RULES.md` antes de agir.
- Leia `harness\config.jsonc` para ver os elementos configurados (`nome`,
  `duracao`, `amostras`, `prompts[]`, `notaMin`, `maxIters`).

## 2. Graph Engineering (verificação paralela)

- O orquestrador dispara `scripts\verify_loop.ps1` em paralelo (Start-Job) para
  TODOS os candidatos de um elemento de uma vez.
- Cada job mede: **Clip** (pico <= -1 dB), **BPM** (≈174), **Densidade** (RMS
  -18..-10 dB) e devolve nota 0–100.
- Regra de ouro: **Criador ≠ Verificador**. Quem gera nunca avalia o próprio
  resultado.
- Use `Start-Job` / `ForEach-Object -Parallel`; junte resultados no fim.

## 3. Loop Engineering (iterar até qualidade)

1. Gere `amostras` candidatos por elemento (`scripts\gen_dnb.py`).
2. Verifique todos em paralelo (passo 2).
3. **Ranking**: ordene por nota, guarde o melhor.
4. Se `melhor < notaMin` e iterações ainda disponíveis → refine os prompts e
   volte ao passo 1.
5. Senão, entregue o vencedor em `export\ai_gerados\<elemento>.wav`
   (best-effort se esgotar `maxIters`).

| Critério | Peso | Regra |
|---|---|---|
| Clip | 30 | pico <= -1 dB = 30; -1..0 = 15; clip = 0 |
| BPM | 40 | ≈174 (±2) = 40; ±5 = 20; fora = 0 |
| Densidade | 30 | RMS -18..-10 = 30; fora penaliza |

Aprovado: nota >= 80. Mín 3 candidatos p/ elemento; máx 3 iterações.

## 3. Refino de prompts

- Desc significado do som no estilo (dark, jump-up, neuro) e timbre desejado.
- Params do gerador: `facebook/musicgen-small`, `temperature=0.6`,
  `cfg_coef=4.0`, `top_k=100`, pico <= 0.95.
- **Proibido**: nomes de artistas/músicas em prompts e uso de stems de
  `E:\Samples\Simula Library` / `E:\Simula\**`.

## 4. Verificação final

- Confirme com o verificador (não com opinião) antes de declarar aprovado.
- Se BPM do MusicGen sair fora de 174, registre no report que o compositor deve
  ajustar com `atempo`.