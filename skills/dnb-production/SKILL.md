---
name: dnb-production
description: Use when creating or refining Drum'n Bass tracks in this project. Triggers on "gerar musica", "drum and bass", "dnb", "loop engineering", "graph engineering", "gerar loops", "pipeline", "MusicGen", "orquestrador". Encodes the Harness workflow: Generation, Loop Engineering (iterate until score>=80), Graph Engineering (parallel verification), and Creator/Verifier separation.
---

# Skill de ProduÃ§Ã£o DnB â€” Harness

Procedimento padronizado para criar ou refinar mÃºsicas Drum'n Bass originais em
`E:\Projeto DnB`, inspiradas em artistas, sem usar material protegido.

## 1. Leia o contexto antes de agir

- Sempre leia `contexto\00-contexto-sessao.md` antes de iniciar uma tarefa de criaÃ§Ã£o.
- Sempre leia `harness\RULES.md` (regras) e `harness\config.jsonc` (configuraÃ§Ã£o).
- Regra de ouro: **100% original, nunca stems/samples de artistas**.

## 2. Fluxo de criaÃ§Ã£o (Harness)

Use o **orquestrador** `scripts\run_pipeline.ps1`:

```
powershell -ExecutionPolicy Bypass -File scripts\run_pipeline.ps1 [-elemento <nome>] [-minNota 80] [-maxIters 3]
```

Ele aplica, nesta ordem:

- **Graph Engineering**: gera `amostras` candidatos por elemento e os verifica **em paralelo**.
- **Loop Engineering**: ranqueia por nota (0â€“100) e **itera** atÃ© `nota >= minNota`.

### Sem elementos-chave

- `break_limpo`, `sub_bass`, `pad_atmosferico` â€” jÃ¡ listados em `harness\config.jsonc`.
Bill adicionar novos: edite `harness\config.jsonc` (`elementos[]`) com `nome`, `duracao`,
`amostras`, `prompts[]`.

### Finalizar a mÃºsica

ApÃ³s os elementos aprovados, o **compositor** Ã© `build_original.ps1` (instalado
manual ou via prompt). A masterpiece final vai em `export\`.

## 3. CritÃ©rios do Verificador (`scripts\verify_loop.ps1`)

| CritÃ©rio | Peso | Regra |
|---|---|---|
| Clip | 30 | pico <= -1 dB = 30 |
| BPM | 40 | â‰ˆ174 (Â±2)=40, Â±5=20 |
| Energia | 30 | RMS -18..-10 = 30 |

Nota >= 80 â†’ aprovado. Abaixo â†’ itera (max `maxIters`), depois entrega best-effort.

## 4. ParÃ¢metros do Criador (`scripts\gen_dnb.py`)

- Modelo `facebook/musicgen-small`, device `cuda`
- `temperature=0.6`, `cfg_coef=4.0`, `top_k=100` (som conservador)
- Prompts: inglÃ©s, esboÃ§o estilo/sonoridade â€” **NUNCA nomes de artistas**.
- PÃ³s-processa pico <= 0.95 (evita clip).

## 5. TransiÃ§Ãµes (aplicar no compositor)

- Sincronia: 174 BPM, barra 1.37931 s, grid 0.086207 s.
- TransiÃ§Ãµes suaves: crossfade de 1 barra, puis fades.
- Evitar mudanÃ§as bruscas entre seÃ§Ãµes.

## 6. Ratifica-se

- NÃ£o usar arquivos de `E:\Samples\Simula Library` nem `E:\Simula\**` como material.
- NÃ£o usar prompts com nomes de artistas/mÃºsicas.
- Deliverables em `public\ai_gerados\*` sÃ£o originais (gerado por IA).

## 7. VerificaÃ§Ã£o final de qualidade

Antes de entregar, garanta:
- pico < -1 dB (sem clip), BPM â‰ˆ 174.
- NÃ£o mostrar cÃ³digo sem o push/task; pergunta ao usuÃ¡rio antes de grandes mudanÃ§as.