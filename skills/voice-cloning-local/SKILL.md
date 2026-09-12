---
name: voice-cloning-local
description: Use when cloning a voice locally (offline, free, no API) from 3 seconds of reference audio with Qwen3-TTS. Triggers on "clonar voz local", "voice clone offline", "alternativa ElevenLabs grátis", "Qwen3-TTS", "TTS local Apache 2.0".
metadata:
  origin: ECC
  validated: 2026-08-22
  source_video: npVm4tBalp8
  official_sources:
    - https://huggingface.co/spaces/Qwen/Qwen3-TTS
    - https://github.com/Qwen-TTS/Qwen3-TTS
    - https://localaimaster.com/blog/qwen3-tts-local-setup (2026-08-16)
---

## Pipeline Qwen3-TTS (Voice Cloning Local)

Qwen3-TTS (Alibaba, Apache 2.0): **voice cloning** (3s de referência → qualquer texto), **voice design** (descrição natural), 10 idiomas, modelos 0.6B (1.8GB) e 1.7B (3.9GB) — roda em GPU consumer, 100% offline.

## Quando usar

- Clonar voz localmente sem API, grátis, offline
- Criar voz via descrição natural (idade, gênero, estilo)
- Batch de narrações com a mesma voz clonada
- Servidor local com Web UI para testes rápidos

## Quando NÃO usar

- Síntese genérica sem referência → use `fal-ai-media`
- Streaming TTS real-time ou 50+ idiomas (Qwen suporta 10)

### Validação Oficial (2026-08-22)
| Claim | Status | Fonte |
|---|---|---|
| Apache 2.0 | ✅ | HF model cards, GitHub LICENSE |
| Clone 3s / roda local (`pip install qwen-tts`) | ✅ | Base models, vLLM-Omni, ComfyUI |
| 10 idiomas | ✅ | Model card |
| Similarity 0.789 vs ElevenLabs 0.75/MiniMax 0.72 | ✅ | Benchmark (`references/benchmark-comparison.md`) |

---

## Passo a Passo

### 1. Ambiente

```bash
pip install -U qwen-tts          # simples; + FFmpeg; Python 3.10+, CUDA 4GB+ (0.6B) / 8GB+ (1.7B)
# Pesos manuais:
huggingface-cli download Qwen/Qwen3-TTS-Tokenizer-12Hz --local-dir ./Qwen3-TTS-Tokenizer-12Hz
huggingface-cli download Qwen/Qwen3-TTS-12Hz-1.7B-Base --local-dir ./Qwen3-TTS-12Hz-1.7B-Base
```

### 2. Clone / Design / Batch (scripts prontos em `scripts/`)

```bash
python scripts/voice_clone.py '<texto>' ref.wav '<transcrição EXATA do ref>' Portuguese 1.7B
python scripts/voice_design.py  # voz via descrição natural
python scripts/tts_cli.py clone "Texto" ref.wav "Transcrição" --lang Portuguese --model 1.7B
python scripts/tts_cli.py design "Texto" "young female, warm, Portuguese" --lang Portuguese
python scripts/batch_clone.py    # múltiplos textos, mesma voz
```

Regras: `ref_text` = match EXATO do áudio (crítico p/ qualidade); ref limpo 10-30s, 16kHz+; cross-lingual funciona mas pode vazar sotaque — prefira ref no idioma alvo.

### 3. Web UI local (`http://localhost:7861`, modelo em cache)

```bash