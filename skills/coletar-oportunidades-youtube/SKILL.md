---
name: coletar-oportunidades-youtube
description: Use when the user wants to check a YouTube channel against local transcripts, collect skill/automation opportunities from videos, download missing transcripts, analyze videos for new skill ideas, or keep a catalog up to date. Triggers on "defasagem do canal", "oportunidades de skill", "analisa os vídeos", "transcrições faltando", "baixar transcrição", "vídeos novos", "coletar oportunidades", "yt-oportunidades". Uses scripts/yt-oportunidades.mjs (sync-check/catalog/diff/download/dedup/mark/analyzed) with transcripts kept OUTSIDE the public repo.
metadata:
  origin: ECC
---

# Skill: Coletar Oportunidades do YouTube (transcrições + análise)

Pipeline determinístico para descobrir o que um canal publicou, baixar as
transcrições faltantes (localmente, fora do repo), ler os vídeos novos e
extrair oportunidades de skills/automações — cruzando SEMPRE com o inventário
existente para não criar redundância.

## Quando usar

- "O canal publicou vídeos novos? Estamos defasados?"
- "Analisa os últimos vídeos e me diz que skills criar."
- "Baixa as transcrições que faltam do canal X."
- "Registra esse vídeo como já analisado."

## Regras de segurança (repo PÚBLICO)

- Transcrições de terceiros **NUNCA** vão para o repo público. Ficam só em
  pastas locais (`YT_DIR`). Se alguém já committou transcrições, mova para a
  pasta local e `git rm` (sem commit) antes de continuar.
- Scripts que o pipeline cria devem ser portáteis (sem caminhos pessoais
  hardcoded; config por env vars) para não vazar o caminho da sua máquina.
- Credenciais de API nunca entram no repo.

## Pipeline

### 0. Checar sync com o GitHub (OBRIGATÓRIO antes de tudo)

Com 2+ PCs coletando, o outro PC pode já ter capturado o canal. Rode SEMPRE
antes de `catalog`/`diff`:

```
node scripts/yt-oportunidades.mjs sync-check
```

- Exit 0 (`EM DIA`) → pode coletar.
- Exit 1 (`BLOQUEADO`) → NÃO colete: o repo está atrás (`git pull --rebase`),
  com worktree suja (commit/stash antes do pull) ou com commits sem push
  (`git push` — o outro PC não vê esses commits). Re-rode o `sync-check` depois.
- Exit 2 (`INVERIFICÁVEL`, offline) → re-rode com rede; só use
  `--allow-stale` assumindo o risco de duplicar coleta.
- `--json` imprime só o JSON (branch, SHAs, behind/ahead, última coleta
  publicada, resumo do `state/yt-control.json`).

O `sync-check` mostra também a última coleta publicada e o
`state/yt-control.json` (fonte da verdade por canal, só ids/datas).

### 1. Catalogar o canal

Roda o catálogo oficial do canal (título, id, data) e salva como JSON:

```
node scripts/yt-oportunidades.mjs catalog
```

Config por env:
- `YT_CHANNEL` (padrão `https://www.youtube.com/@maestrosdaia/videos`)
- `YT_DIR` — pastas de transcrições locais, separadas por `;`. **Sempre setar
  explicitamente** — o default (`~/projetos/...`) expande para a pasta do