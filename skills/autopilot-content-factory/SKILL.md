---
name: autopilot-content-factory
description: "Build 100% autopilot IG growth factory (Apify top 20% -> filter -> HeyGen+ElevenLabs -> Remotion/FFmpeg -> Metricool) with 3-trigger split. Use when need 0% human after setup, scrape->filter->produce->post. Triggers on \"autopilot content\", \"Apify\", \"HeyGen\", \"Metricool\", \"autopilot IG\""
---

# Autopilot Content Factory — IG 0→12k em Autopilot

> Fonte: `Maestros da IA — TWfHFHxI6go` (510 linhas, 0% humano pós-setup), transcript `TWfHFHxI6go.pt.dedup.txt:80-420`

**Prova:** 0→10k→12k, 500-1000/dia, 0% humano.

## Quando usar

- Autopilot aquisição orgânica (scrape→post)
- Quer 3-trigger split para token/CPU ótimo
- Micro-skills isoladas por contexto

## Pipeline 7 estágios (1 agente x 3 cron)

```
Scrape (Apify TikTok/IG) → Detective top 20% 24h (20/100) → Filtro brand-fit → Roteirista (hook reverse-engineer) → Video HeyGen + ElevenLabs → Editing Remotion+FFmpeg → Posting Metricool/Blotato
```

**Split 3-trigger (eficiência):**
- **Trigger-1** `1x/dia` scrape → `próximos-videos.json` queue (Apify quota)
- **Trigger-2** `madrugada` produce (script+HeyGen+edit, sem post, evita CPU dia)
- **Trigger-3** `1-2h dia` post (tiny token, `A+B=C` determinístico)

Arquitetura: per-skill context isolation, queue file, fragmented skills.

## Checklist

- [ ] Apify top 20% config
- [ ] HeyGen avatar + ElevenLabs voice
- [ ] Remotion library pronta
- [ ] 3 cron com custo justificado
- [ ] Queue `próximos-videos.json`

## Referências

- `references/trigger-split.md` — 3-trigger pattern
- Depende de `data-scraper-agent`, `content-engine`, `video-editing`, `autonomous-agent-harness`

## Enriquecimento 2026-09-06 — pattern GrokBot (Gabriel Adamuchi `azJHZfaVeJc`)

Produto fechado (sem docs oficiais) com 3 ideias reaproveitáveis na factory:

- **Time de 4 papéis**: minerador (Scrape Creators API no IG-alvo → dataset dos melhores posts) → copywriter → engenheiro audiovisual → social media (agenda/publica). Espelha os 7 estágios da factory.
- **Chat inter-bot nativo + routines**: bots enxergam o chat um do outro e trocam info direto (no Claude/Codex o equivalente é `/handover` manual) — para `sessoes-orquestradas`, prefira messaging nativo a copiar/colar entre sessões.
- **Templates compartilháveis**: exporte cada papel como template instalável (e importe de Hermes/OpenClaw) — pacotes de templates são também produto vendável.
