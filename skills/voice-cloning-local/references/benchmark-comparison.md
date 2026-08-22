# Benchmark: Qwen3-TTS vs ElevenLabs vs MiniMax

Fonte: TamilTech (2026-04-19), LocalAIMaster (2026-08-16), Qwen Blog (2025-12-22)

---

## Speaker Similarity (Quanto a voz clonada soa como a original)

| Modelo | Score | Fonte |
|---|---|---|
| **Qwen3-TTS** | **0.789** | TamilTech, Qwen blog |
| ElevenLabs | 0.75 | TamilTech |
| MiniMax | 0.72 | TamilTech |

> **Interpretação**: 0.789 = "quase indistinguível do original em testes cegos"

---

## Word Error Rate (WER) - Multilingual Test Set (MiniMax TTS Benchmark)

| Modelo | WER Médio | Notas |
|---|---|---|
| **Qwen3-TTS-VC-Flash** | **Melhor** | Consistentemente melhor que MiniMax, ElevenLabs, GPT-4o-Audio-Preview |
| MiniMax | Mais alto | |
| ElevenLabs | Mais alto | |
| GPT-4o-Audio-Preview | Mais alto | |

---

## Voice Design (InstructTTS-Eval)

| Modelo | Score Geral | Role-Playing |
|---|---|---|
| **Qwen3-TTS-VD-Flash** | **Supera** GPT-4o-mini-tts, Mimo-audio-7b-instruct | **Supera** Gemini-2.5-pro-preview-tts |
| GPT-4o-mini-tts | Baseline | |
| Mimo-audio-7b-instruct | Baseline | |

---

## Modelos Disponíveis (Qwen3-TTS Series)

| Modelo | Params | VRAM (bf16) | Capacidades |
|---|---|---|---|
| Qwen3-TTS-12Hz-1.7B-Base | 1.7B | ~3.9GB | Voice clone 3s, fine-tune base |
| Qwen3-TTS-12Hz-1.7B-CustomVoice | 1.7B | ~3.9GB | 9 premium timbres + instruction control |
| Qwen3-TTS-12Hz-1.7B-VoiceDesign | 1.7B | ~3.9GB | Voice design via natural language |
| Qwen3-TTS-12Hz-0.6B-Base | 0.6B | ~1.8GB | Voice clone 3s (lighter) |
| Qwen3-TTS-12Hz-0.6B-CustomVoice | 0.6B | ~1.8GB | 9 premium timbres (lighter) |
| Qwen3-TTS-Tokenizer-12Hz | — | ~0.68GB | Speech codec (OBRIGATÓRIO para todos) |

**Todos modelos**: Apache 2.0 license, 10 idiomas, 24kHz output, 12.5Hz frame rate

---

## Hardware Requirements (Local Inference)

| Modelo | VRAM Mínima | RAM Sistema | Tempo/clip (1.7B, RTX 3090) |
|---|---|---|---|
| 0.6B Base | ~2GB | 8GB+ | ~2-5s |
| 1.7B Base | ~4GB | 16GB+ | ~3-8s |
| 1.7B CustomVoice | ~4GB | 16GB+ | ~3-8s |
| 1.7B VoiceDesign | ~4GB | 16GB+ | ~3-8s |

**CPU-only**: Impraticável para produção (minutos por clip)

---

## Comparação de Custo (Mensal - 1000 clips de 10s)

| Opção | Custo Mensal | Notas |
|---|---|---|
| **Qwen3-TTS Local** | **$0** (apenas eletricidade) | Requer GPU própria |
| ElevenLabs | ~$22-99/mês | Subscription tiers, limites de caracteres |
| MiniMax API | ~$10-50/mês | Pay-per-second, free trial limitado |
| OpenAI TTS | ~$15-60/mês | $15/1M chars |

---

## Qualidade Subjetiva (Testes Comunitários)

| Critério | Qwen3-TTS | ElevenLabs | MiniMax |
|---|---|---|---|
| Naturalidade | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Controle de emoção | ⭐⭐⭐⭐ (VoiceDesign) | ⭐⭐⭐ | ⭐⭐⭐ |
| Consistência cross-lingual | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Facilidade de uso (local) | ⭐⭐⭐ (precisa setup) | ⭐⭐⭐⭐⭐ (API) | ⭐⭐⭐⭐ (API) |
| Latência (local GPU) | ⭐⭐⭐⭐⭐ (<1s) | ⭐⭐⭐ (rede) | ⭐⭐⭐ (rede) |
| Custo marginal | ⭐⭐⭐⭐⭐ ($0) | ⭐⭐ | ⭐⭐⭐ |

---

## Conclusão para DJ/Content Creator

**Qwen3-TTS vence para:**
- ✅ Custo zero marginal (rode quantos clips quiser)
- ✅ Privacidade total (dados não saem da máquina)
- ✅ Qualidade speaker similarity líder (0.789)
- ✅ Voice design via linguagem natural (único no open source)
- ✅ Offline total (shows, estúdios sem internet)

**Considere ElevenLabs/MiniMax se:**
- Precisa de 50+ idiomas (Qwen só tem 10)
- Não tem GPU disponível
- Precisa de streaming TTS real-time (Qwen vLLM serving ainda offline-only)
- Quer API gerenciada sem manter infra