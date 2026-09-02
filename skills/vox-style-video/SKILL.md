---
name: vox-style-video
description: "Create Vox paper-collage explainers (audio-first, word-sync, craft) with Gemini Omni + GPT Image. Use when need Vox aesthetic, paper texture, 4-8 clips, revise-before-animate. Triggers on \"Vox style\", \"Vox video\", \"paper collage\", \"Gemini Omni video\", \"explainer Vox\""
---

# Vox-Style Video — Paper Collage Explainer

> Fonte: `Maestros da IA — wLxlN7VgXXQ` (578 linhas, Vox factory), transcript `wLxlN7VgXXQ.pt.dedup.txt:40-480`

**Fórmula Vox:** 1) Narration-led, 2) Word-sync image, 3) Graphic craft collage (cutout, limited palette, 4-8 clips).

## Quando usar

- Explainer narrado sem apresentador
- Precisa estética paper/craft vs footage real
- Quer pipeline Claude Code `config.json` com approval gate

## Pipeline (audio-first)

```
tema → pesquisa → narração (ElevenLabs VOICE_ID) → plano clips (aprovação humana) → imagens (GPT Image 2) → anima (Gemini Omni, fallback Seedance 2.0) → revise ANTES de animar
```

**Invariante:** `tempo de cada palavra define cortes`; 1 imagem/clipe; custo `~$8/demo, ~$10/min` (animação é mais cara).

## Scaffold

```
assets/ (6+ craft textures) | music/ (Epidemic Sound) | .env (ELEVENLABS_API_KEY, FAL_API_KEY) | config.json (modular? checkpoints? lang? voiceID?)
```

APIs: `FAL_API_KEY` (router, alt Higgsfield), `VOICE_ID` clone.

## Checklist

- [ ] `assets/` + `music/` + `.env` prontos
- [ ] Narração com timestamps
- [ ] Aprovado antes de animar (cost control)

## Referências

- `references/vox-style-guide.md` — 3 regras Vox
