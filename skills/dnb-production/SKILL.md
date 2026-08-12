---
name: dnb-production
description: Use when creating or refining Drum'n Bass tracks in this project. Triggers on "gerar musica", "drum and bass", "dnb", "loop engineering", "graph engineering", "gerar loops", "pipeline", "MusicGen", "orquestrador". Encodes the Harness workflow: Generation, Loop Engineering (iterate until score>=80), Graph Engineering (parallel verification), and Creator/Verifier separation.
---

# Skill de Produção DnB — Harness

Procedimento padronizado para criar ou refinar músicas Drum'n Bass originais em
`E:\Projeto DnB`, inspiradas em artistas, sem usar material protegido.

## 1. Leia o contexto antes de agir

- Sempre leia `contexto\00-contexto-sessao.md` antes de iniciar uma tarefa de criação.
- Sempre leia `harness\RULES.md` (regras) e `harness\config.jsonc` (configuração).
- Regra de ouro: **100% original, nunca stems/samples de artistas**.

## 2. Fluxo de criação (Harness)

Use o **orquestrador** `scripts\run_pipeline.ps1`:

```
powershell -ExecutionPolicy Bypass -File scripts\run_pipeline.ps1 [-elemento <nome>] [-minNota 80] [-maxIters 3]
```

Ele aplica, nesta ordem:

- **Graph Engineering**: gera `amostras` candidatos por elemento e os verifica **em paralelo**.
- **Loop Engineering**: ranqueia por nota (0–100) e **itera** até `nota >= minNota`.

### Sem elementos-chave

- `break_limpo`, `sub_bass`, `pad_atmosferico` — já listados em `harness\config.jsonc`.
Bill adicionar novos: edite `harness\config.jsonc` (`elementos[]`) com `nome`, `duracao`,
`amostras`, `prompts[]`.

### Finalizar a música

Após os elementos aprovados, o **compositor** é `build_original.ps1` (instalado
manual ou via prompt). A masterpiece final vai em `export\`.

## 3. Critérios do Verificador (`scripts\verify_loop.ps1`)

| Critério | Peso | Regra |
|---|---|---|
| Clip | 30 | pico <= -1 dB = 30 |
| BPM | 40 | ≈174 (±2)=40, ±5=20 |
| Energia | 30 | RMS -18..-10 = 30 |

Nota >= 80 → aprovado. Abaixo → itera (max `maxIters`), depois entrega best-effort.

## 4. Parâmetros do Criador (`scripts\gen_dnb.py`)

- Modelo `facebook/musicgen-small`, device `cuda`
- `temperature=0.6`, `cfg_coef=4.0`, `top_k=100` (som conservador)
- Prompts: inglés, esboço estilo/sonoridade — **NUNCA nomes de artistas**.
- Pós-processa pico <= 0.95 (evita clip).

## 5. Transições (aplicar no compositor)

- Sincronia: 174 BPM, barra 1.37931 s, grid 0.086207 s.
- Transições suaves: crossfade de 1 barra, puis fades.
- Evitar mudanças bruscas entre seções.

## 6. Ratifica-se

- Não usar arquivos de `E:\Samples\Simula Library` nem `E:\Simula\**` como material.
- Não usar prompts com nomes de artistas/músicas.
- Deliverables em `public\ai_gerados\*` são originais (gerado por IA).

## 7. Verificação final de qualidade

Antes de entregar, garanta:
- pico < -1 dB (sem clip), BPM ≈ 174.
- Não mostrar código sem o push/task; pergunta ao usuário antes de grandes mudanças.