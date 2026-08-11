---
name: graph-engineering
description: Use when generating/verifying candidates in parallel or iterating to a quality score â€” music elements, research, any rankable output. Triggers on "graph engineering", "grafos", "verificar em paralelo", "loop engineering", "gerar candidatos", "rankear", "nota 80", "pipeline". Encodes parallel verification (Graph) + iterate-until-score (Loop). Companion to dnb-production for audio; use together.
---

# Skill: Graph & Loop Engineering (DnB)

Componente de engenharia do harness: produzir candidatos de Ã¡udio, verificar em
PARALELO (graph) e iterar atÃ© a nota mÃ­nima (loop). Ã‰ companheira da
`dnb-production` â€” use junto.

## 1. Contexto primeiro

- Leia `contexto\00-contexto-sessao.md` e `harness\RULES.md` antes de agir.
- Leia `harness\config.jsonc` para ver os elementos configurados (`nome`,
  `duracao`, `amostras`, `prompts[]`, `notaMin`, `maxIters`).

## 2. Graph Engineering (verificaÃ§Ã£o paralela)

- O orquestrador dispara `scripts\verify_loop.ps1` em paralelo (Start-Job) para
  TODOS os candidatos de um elemento de uma vez.
- Cada job mede: **Clip** (pico <= -1 dB), **BPM** (â‰ˆ174), **Densidade** (RMS
  -18..-10 dB) e devolve nota 0â€“100.
- Regra de ouro: **Criador â‰  Verificador**. Quem gera nunca avalia o prÃ³prio
  resultado.
- Use `Start-Job` / `ForEach-Object -Parallel`; junte resultados no fim.

## 3. Loop Engineering (iterar atÃ© qualidade)

1. Gere `amostras` candidatos por elemento (`scripts\gen_dnb.py`).
2. Verifique todos em paralelo (passo 2).
3. **Ranking**: ordene por nota, guarde o melhor.
4. Se `melhor < notaMin` e iteraÃ§Ãµes ainda disponÃ­veis â†’ refine os prompts e
   volte ao passo 1.
5. SenÃ£o, entregue o vencedor em `export\ai_gerados\<elemento>.wav`
   (best-effort se esgotar `maxIters`).

| CritÃ©rio | Peso | Regra |
|---|---|---|
| Clip | 30 | pico <= -1 dB = 30; -1..0 = 15; clip = 0 |
| BPM | 40 | â‰ˆ174 (Â±2) = 40; Â±5 = 20; fora = 0 |
| Densidade | 30 | RMS -18..-10 = 30; fora penaliza |

Aprovado: nota >= 80. MÃ­n 3 candidatos p/ elemento; mÃ¡x 3 iteraÃ§Ãµes.

## 3. Refino de prompts

- Desc significado do som no estilo (dark, jump-up, neuro) e timbre desejado.
- Params do gerador: `facebook/musicgen-small`, `temperature=0.6`,
  `cfg_coef=4.0`, `top_k=100`, pico <= 0.95.
- **Proibido**: nomes de artistas/mÃºsicas em prompts e uso de stems de
  `E:\Samples\Simula Library` / `E:\Simula\**`.

## 4. VerificaÃ§Ã£o final

- Confirme com o verificador (nÃ£o com opiniÃ£o) antes de declarar aprovado.
- Se BPM do MusicGen sair fora de 174, registre no report que o compositor deve
  ajustar com `atempo`.