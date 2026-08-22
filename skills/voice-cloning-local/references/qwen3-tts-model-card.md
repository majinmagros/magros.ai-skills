# Qwen3-TTS Model Card (Copiado do Hugging Face)

Fonte original: https://huggingface.co/collections/Qwen/qwen3-tts
Data de acesso: 2026-08-22

---

## Overview

**Qwen3-TTS** é uma série de modelos de síntese de fala (TTS) open-source desenvolvidos pela equipe Qwen da Alibaba Cloud.

**Capabilities:**
- Stable, expressive, and streaming speech generation
- Free-form voice design (criar vozes via descrição natural)
- Vivid voice cloning (clone de voz a partir de 3 segundos de áudio)
- Ultra-high-quality human-like speech generation
- Natural language-based voice control

**Release Date:** 2026-01-22
**License:** Apache 2.0
**Languages:** Chinese, English, Japanese, Korean, German, French, Russian, Portuguese, Spanish, Italian (10 total)

---

## Model Variants

| Model ID | Description | Voice Clone | Voice Design | Languages |
|---|---|---|---|---|
| `Qwen/Qwen3-TTS-12Hz-1.7B-Base` | Base model, 3s rapid voice clone, fine-tunable | ✅ | ❌ | 10 |
| `Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice` | 9 premium timbres, instruction control | ❌ | ✅ | 10 |
| `Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign` | Voice design via natural language | ❌ | ✅ | 10 |
| `Qwen/Qwen3-TTS-12Hz-0.6B-Base` | Lighter clone model | ✅ | ❌ | 10 |
| `Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice` | Lighter speakers model | ❌ | ✅ | 10 |
| `Qwen/Qwen3-TTS-Tokenizer-12Hz` | Speech codec (REQUIRED by all above) | N/A | N/A | N/A |

**Architecture:** Qwen3-TTS-Tokenizer-12Hz (12.5 frames/sec, 24kHz output)
**Framework:** PyTorch, Transformers, vLLM-Omni (offline inference)

---

## Quickstart (Official)

### Python Package (Recommended)
```bash
pip install -U qwen-tts
```

```python
from qwen_tts import Qwen3TTSModel
import torch

# Voice Cloning
model = Qwen3TTSModel.from_pretrained(
    "Qwen/Qwen3-TTS-12Hz-1.7B-Base",
    device_map="cuda:0",
    dtype=torch.bfloat16,
    attn_implementation="flash_attention_2",
)

wavs, sr = model.generate_voice_clone(
    text="This is my cloned voice speaking.",
    language="English",
    ref_audio="reference.wav",
    ref_text="Exact transcript of reference audio.",
)

import torchaudio
torchaudio.save("output.wav", wavs.unsqueeze(0), sr)
```

### Voice Design
```python
model = Qwen3TTSModel.from_pretrained(
    "Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice",
    device_map="cuda:0",
    dtype=torch.bfloat16,
    attn_implementation="flash_attention_2",
)

wavs, sr = model.generate_voice_design(
    text="Hello, this is a designed voice.",
    language="English",
    voice_description="young female, warm and friendly, speaking slowly",
)
```

### HuggingFace CLI Download
```bash
pip install -U "huggingface_hub[cli]"

# Tokenizer (required)
huggingface-cli download Qwen/Qwen3-TTS-Tokenizer-12Hz --local-dir ./Qwen3-TTS-Tokenizer-12Hz

# Models
huggingface-cli download Qwen/Qwen3-TTS-12Hz-1.7B-Base --local-dir ./Qwen3-TTS-12Hz-1.7B-Base
huggingface-cli download Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice --local-dir ./Qwen3-TTS-12Hz-1.7B-CustomVoice
huggingface-cli download Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign --local-dir ./Qwen3-TTS-12Hz-1.7B-VoiceDesign
huggingface-cli download Qwen/Qwen3-TTS-12Hz-0.6B-Base --local-dir ./Qwen3-TTS-12Hz-0.6B-Base
huggingface-cli download Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice --local-dir ./Qwen3-TTS-12Hz-0.6B-CustomVoice
```

---

## Demos

| Demo | Link |
|---|---|
| Qwen3-TTS Main | https://huggingface.co/spaces/Qwen/Qwen3-TTS |
| Voice Cloning | https://huggingface.co/spaces/Qwen/Qwen-TTS-Clone-Demo |
| Voice Design | https://huggingface.co/spaces/Qwen/Qwen3-TTS-Voice-Design |
| ModelScope (China) | https://modelscope.cn/studios/Qwen/Qwen3-TTS |

---

## Hardware Requirements

| Model | VRAM (bf16) | System RAM | Disk |
|---|---|---|---|
| 1.7B variants | ~3.9 GB | 16 GB+ | ~8 GB |
| 0.6B variants | ~1.8 GB | 8 GB+ | ~4 GB |
| Tokenizer | ~0.68 GB | — | ~1 GB |

**GPU:** CUDA-capable (NVIDIA). Apple Silicon via MLX (community).
**CPU-only:** Not recommended for production (minutes per clip).

---

## Benchmarks (Reported by Qwen)

| Benchmark | Qwen3-TTS-VC-Flash | Qwen3-TTS-VD-Flash |
|---|---|---|
| Speaker Similarity | **0.789** (vs ElevenLabs 0.75, MiniMax 0.72) | N/A |
| MiniMax TTS Multilingual WER | **Best** (lower than MiniMax, ElevenLabs, GPT-4o-Audio) | N/A |
| InstructTTS-Eval Overall | N/A | **Best** (vs GPT-4o-mini-tts, Mimo-audio-7b) |
| InstructTTS-Eval Role-play | N/A | **Best** (vs Gemini-2.5-pro-preview-tts) |

---

## Limitations (Official)

1. **No Indian languages yet** — Hindi, Tamil, etc. não suportados (precisa fine-tune)
2. **GPU dependency** — CPU-only impraticável para produção
3. **vLLM serving** — Offline/batch inference only; online serving pending
4. **Transcript matters** — `ref_text` deve match exato do áudio para clone quality
5. **Cross-lingual** — Funciona mas qualidade pode variar; use ref no idioma alvo quando possível
6. **x_vector_only_mode** — Clone sem transcrição disponível mas qualidade reduzida

---

## Citation

```bibtex
@article{qwen3tts2026,
  title={Qwen3-TTS: Open-Source Voice Cloning and Voice Design},
  author={Qwen Team, Alibaba Cloud},
  year={2026},
  url={https://qwen.ai/blog?id=qwen3tts-0115}
}
```

@article{qwen3tts2025vdvc,
  title={Qwen3-TTS Steps Up: Voice Cloning and Voice Design!},
  author={Qwen Team},
  year={2025},
  url={https://qwen.ai/blog?id=qwen3-tts-vc-voicedesign}
}
```

---

## Links Oficiais

| Recurso | URL |
|---|---|
| Blog Release (Jan 2026) | https://qwen.ai/blog?id=qwen3tts-0115 |
| Blog Voice Design/Clone (Dec 2025) | https://qwen.ai/blog?id=qwen3-tts-vc-voicedesign |
| Paper (arXiv) | https://arxiv.org/abs/2601.15621 |
| GitHub | https://github.com/Qwen-TTS/Qwen3-TTS |
| HuggingFace Collection | https://huggingface.co/collections/Qwen/qwen3-tts |
| ModelScope | https://modelscope.cn/collections/Qwen/Qwen3-TTS |
| Discord | https://discord.gg/CV4E9rpNSD |
| API Docs (Alibaba Cloud) | https://help.aliyun.com/zh/model-studio/qwen-tts-realtime |