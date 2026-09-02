---
name: ai-media-generator
description: "Use when generating AI images, video, or audio via fal.ai, Kling, Seedance, Suno, Midjourney. Triggers on \"ai-media-generator\", \"ai media generator\", \"gerar imagem\", \"gerar video\""
---

# AI Media Generator

Generates high-quality AI media prompts and automates browser execution.

## When to Use

- Text-to-image/video/audio
- Need platform-specific prompt crafting (Kling, Seedance, Suno, etc.)
- Want automated site operation via click-protocol

## Core Workflow

1. Select platform via `references/selector.md`
2. Read platform reference (kling.md, seedance.md, suno.md, etc.)
3. Craft prompt with 5-8 high-signal tokens
4. Validate with 10-point gate (≥8) before submit
5. Automate via `automation/click-protocol.md` if requested

## References

- `references/selector.md` — platform picker
- `templates/preset-packs.md` — 30+ presets
- Full docs in original submodule commit edc8aa5

## Checklist

- [ ] Platform selected with trigger
- [ ] Prompt scored ≥8
- [ ] No generic slop tokens
