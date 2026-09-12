---
name: ai-tutor-system
description: Use when building AI tutor systems for personalized learning — adaptive curriculum, multimodal lessons (text/image/audio/video), Feynman technique exercises, spaced repetition flashcards (SM-2/FSRS), progress tracking, multi-tutor domains. Triggers on "tutor ia", "aprender com ia", "currículo adaptativo", "repetição espaçada", "flashcards ia", "técnica feynman", "notebooklm tutor", "estudar com ia", "universidade ia", "ai tutor", "spaced repetition", "anki automation".
metadata:
  origin: ECC
  module: agentic-patterns
  cost: medium
  stability: beta
  defaultInstall: false
---

# Skill: ai-tutor-system — AI Tutor Personalizado Multimodal

Pipeline completo para criar sistemas de tutoria IA que combinam:
- **Nivelamento inicial** → currículo adaptativo por objetivo/tempo
- **Aulas multimodais** → texto + imagens didáticas + podcasts + vídeos (via NotebookLM)
- **Prática ativa** → exercícios Feynman (explicar de volta) + validação do agente
- **Memória de longo prazo** → flashcards (Anki Connect) + repetição espaçada (FSRS/SM-2)
- **Progress tracking** → dashboard de tópicos dominados/fracos + revisão agendada
- **Multi-tutor** → pastas isoladas por domínio (cybersec, idiomas, programação, etc.)
- **Harness-agnóstico** → funciona com Cloud Code, Codex, Antigravity, OpenRouter

---

## Validação Oficial (obrigatória antes de materializar)

| Claim | Status | Fonte |
|---|---|---|
| NotebookLM API: podcast generation (audio artifacts) | ✅ Confirmado | `notebooklm-py` (`/teng-lin/notebooklm-py`), `client.artifacts.generate_audio` |
| Anki Connect API: addNotes programmatic | ✅ Confirmado | `Anki-Connect` (`/websites/git_sr_ht_foosoft_anki-connect`), `addNotes` endpoint |
| FSRS Algorithm: TypeScript scheduler | ✅ Confirmado | `ts-fsrs` (`/open-spaced-repetition/ts-fsrs`), `fsrs()`, `createEmptyCard`, `Rating.Good` |
| Qwen3-TTS: voice clone 3s reference audio | ✅ Confirmado | `Qwen3-TTS` (`/qwenlm/qwen3-tts`), `generate_voice_clone(ref_audio, ref_text)` |
| Cloud Code / Codex / Antigravity agent configs | 🔄 Verificar | Configs locais (`.claude/agents/`, `.codex/agents/`) |

---

## Quando usar

- "Quero um tutor IA para aprender X"
- "Crie um sistema de repetição espaçada com flashcards"
- "Transforme PDFs em aulas com podcasts e exercícios"
- "Aplicar técnica Feynman com validação de IA"
- "Dashboard de progresso de aprendizado com revisão agendada"
- "Múltiplos tutores por domínio (cybersec, alemão, python)"

---

## Pipeline (8 etapas)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 1. SETUP    │───▶│ 2. CURRÍCULO│───▶│ 3. AULAS    │───▶│ 4. FEYNMAN  │
│ Nivelamento │    │ Adaptativo  │    │ Multimodais │    │ Explicação  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                    │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────▼────┐
│ 8. MULTI-   │◀───│ 7. PROGRESS │◀───│ 6. FLASHCARDS│◀───│ 5. ANKI     │
│ TUTOR       │    │ TRACKING    │    │ (FSRS/SM-2) │    │ CONNECT     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Etapa 1: SETUP — Nivelamento Inicial
