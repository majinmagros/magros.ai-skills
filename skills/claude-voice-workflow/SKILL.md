---
name: claude-voice-workflow
description: Use when dictating prompts via voice (Sponcle/Whisper) to Claude — voice interview, transcription cleanup, prompt engineering from audio. Triggers on "voice workflow", "Sponcle", "ditado por voz", "entrevista por voz", "Whisper prompt".
---

# Claude Voice Workflow — Ditado por Voz para Prompts

> Fonte: `Maestros da IA — Luciana Papini` (pending materialization). Exclusivo comunidade, aqui stub ECC.

Transforma áudio em prompt estruturado sem fricção.

## Quando usar

- Quer ditar ideia longa caminhando, sem digitar
- Entrevista por voz para extrair requisitos (prompt interview)
- Transcrição ruidosa que precisa virar prompt dos 4 pilares

## Workflow

1. Grave em Sponcle/Whisper (pt-BR) → `transcript.txt`
2. Limpe: remova hesitações, normalize, preserve intenção
3. Converta para prompt dos 4 pilares (`prompt-builder`) → valide com usuário
4. Envie para Claude/Code

## Checklist

- [ ] Áudio 3-60s com contexto
- [ ] Transcript limpo
- [ ] Prompt validado antes de executar
