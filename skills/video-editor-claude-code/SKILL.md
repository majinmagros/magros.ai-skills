---
name: video-editor-claude-code
description: "Use when automating video editing workflows with Claude Code — local transcription, multimodal OpenRouter review, cut pipelines, captions, thumbnails, and short-form generation. Triggers on \"editar vídeo com ia\", \"video editor Claude Code\", \"automacao de video openrouter\", \"corte automático vídeo\"."
metadata:
  origin: ECC
---

# Video Editor Agent via Claude Code

Automate end-to-end video editing (long-form and short-form) using Claude Code, local transcription tools, and multimodal OpenRouter models for quality verification and adjustments.

## When to Activate

- Automating raw footage assembly and cutting
- Generating YouTube shorts or carousels from long-form video
- Reviewing audio/video synchronization and visual glitches with multimodal AI
- Producing educational or presentation videos at low cost (~$3 per video)

## Core Workflow

1. **Local Transcription & Ingestion**: Extract transcripts and raw sync markers locally without sending unnecessary payloads.
2. **Rough Cut & Silence Removal**: Remove dead air and silent gaps automatically.
3. **Multimodal Quality Pass**: Use OpenRouter multimodal endpoints to inspect exported frames/audio for subtle timing errors or quality flaws.
4. **Packaging & Export**: Generate title variants, thumbnails, and vertical shorts metadata.

## Best Practices

- Keep raw file processing local (`ffmpeg`, whisper tools).
- Use cost-efficient multimodal routing for frame verification rather than heavy continuous streaming.
- Save winning script templates and edit configurations for iterative runs.
