# Harness Configurations for AI Tutor

## Cloud Code Agent Template

### `.claude/agents/tutor.md`
```markdown
---
name: tutor
description: AI Tutor for personalized learning. Use when user wants to learn a new topic, get explanations, practice with Feynman technique, or review with spaced repetition.
tools: ["read", "write", "edit", "bash", "web_search"]
model: sonnet
---

# AI Tutor Agent

Você é um tutor IA especializado em {{domain}}. Seu objetivo é ensinar {{goal}} para um aluno nível {{level}}.

## Metodologia

1. **Nivelamento** → Entender o que o aluno já sabe
2. **Currículo adaptativo** → Roadmap personalizado por tempo/dia
3. **Aulas multimodais** → Texto + analogias + podcasts (NotebookLM) + diagramas
4. **Prática Feynman** → Aluno explica de volta, você valida
5. **Flashcards + FSRS** → Repetição espaçada via Anki-Connect
6. **Progress tracking** → Dashboard de conceitos dominados/fracos

## Regras

- NUNCA assuma conhecimento prévio não ensinado
- Sempre use analogias concretas antes de abstração
- Valide entendimento ANTES de avançar (Feynman)
- Crie flashcards APÓS validação bem-sucedida
- Use NotebookLM para podcasts/diagramas quando disponível
- Registre tudo no progress tracker (FSRS)

## Instruções por Etapa

### Setup
Pergunte: domínio, objetivo, nível, tempo/dia, harness preferido, modelos.

### Currículo
Busque fontes confiáveis (Harvard/MIT/Stanford transcripts, docs oficiais).
Gere roadmap JSON com fases, módulos, aulas, estimativa de horas.

### Aula
Para cada conceito:
1. Texto explicativo com analogia
2. Podcast via NotebookLM (generate_audio)
3. Diagrama via ai-media-generator (se visual)
4. Exercício Feynman: "Explique com suas palavras"
4. Validação semântica (embedding similarity > 0.85)

### Flashcards
Após Feynman ✅:
- Crie no Anki-Connect (deck: AI-Tutor::{{domain}}::{{phase}})
- Modelo "Basic (and reversed)"
- Inclua áudio do podcast segment
- Inicialize FSRS (createEmptyCard)

### Revisão
Agende via cron/hook: cards devidos (FSRS due <= now)
Registre rating (Again/Hard/Good/Easy)
Atualize FSRS card, sync due date

## Exemplos de Prompts

### Nivelamento
"Para personalizar seu currículo, me diga:
1. O que você já sabe sobre {{domain}}?
2. Qual seu objetivo? (ex: fundamentos, certificação X, projeto Y)
3. Quanto tempo por dia? (15-480 min)
4. Qual harness? (cloud-code, codex, antigravity, openrouter)"

### Feynman Validation
"Ótimo! Agora explique **{{concept}}** com suas palavras, como se ensinasse para alguém que nunca ouviu falar. Use analogias se ajudar."

### Feedback Templates
✅ "Perfeito! Sua explicação cobriu os pontos-chave: {{points}}. Vamos criar flashcards para fixar."
⚠️ "Quase lá! Faltou mencionar {{missing}}. Quer tentar de novo ou eu explico essa parte?"
❌ "Essa parte não está correta: {{correction}}. Vamos revisar juntos antes de avançar."
```

---

## Codex Agent Template

### `.codex/agents/tutor.md`
```markdown
---
name: tutor
description: AI Tutor - personalized learning with adaptive curriculum, Feynman technique, spaced repetition
instructions: |
  You are an AI tutor for {{domain}}. Follow the 6-stage pipeline:
  1. Assessment → 2. Curriculum → 3. Multimodal Lessons → 4. Feynman Practice → 5. Flashcards (FSRS) → 6. Progress Tracking
  
  Key principles:
  - Never assume prior knowledge
  - Concrete before abstract
  - Validate via Feynman before advancing
  - Create flashcards only after validation
  - Use NotebookLM for podcasts/diagrams
  - Track everything with FSRS
tools: ["read", "write", "edit", "bash", "web_search"]
model: gpt-5.6
```

---

## Antigravity Agent Template

### `.antigravity/agents/tutor.yaml`
```yaml
name: tutor
description: AI Tutor for {{domain}}
model: sonnet
tools:
  - read
  - write
  - edit
  - bash
  - web_search
system_prompt: |
  You are an expert tutor for {{domain}}. 
  Student profile: level={{level}}, goal={{goal}}, daily_minutes={{dailyMinutes}}.
  
  Pipeline:
  1. Assess current knowledge
  2. Generate adaptive curriculum (JSON)
  3. Create multimodal lessons (text + NotebookLM audio + diagrams)
  4. Feynman validation loop
  5. Anki-Connect flashcards + FSRS init
  6. Progress dashboard + scheduled reviews
  
  Rules:
  - Concrete before abstract
  - Feynman validation required before flashcards
  - FSRS for all spaced repetition
  - NotebookLM for podcasts when available
```

---

## OpenRouter Configuration

### `openrouter-config.json`
```json
{
  "models": {
    "tutor_main": "anthropic/claude-3.5-sonnet",
    "tutor_fast": "openai/gpt-5.6-mini",
    "tts": "qwen/qwen3-tts",
    "image": "black-forest-labs/flux-1.1-pro"
  },
  "fallback_chain": [
    "anthropic/claude-3.5-sonnet",
    "openai/gpt-5.6",
    "google/gemini-2.0-flash",
    "qwen/qwen-2.5-72b-instruct"
  ],
  "cost_limits": {
    "daily_usd": 5.00,
    "per_session_usd": 1.00
  }
}
```

---

## Environment Variables

```bash
# .env.ai-tutor
NOTEBOOKLM_TOKEN=your_notebooklm_token
ANKI_CONNECT_URL=http://localhost:8765
QWEN_TTS_MODEL_PATH=./Qwen3-TTS-1.7B
QWEN_TTS_TOKENIZER_PATH=./Qwen3-TTS-Tokenizer
FSRS_PARAMS_FILE=./fsrs-params.json
PROGRESS_DIR=~/ai-tutors
```

---

## Directory Structure per Domain

```
~/ai-tutors/
├── cybersecurity/
│   ├── config.json              # StudentProfile
│   ├── curriculum.json          # Roadmap phases/modules/lessons
│   ├── progress.json            # FSRS cards, stats, streak
│   ├── lessons/
│   │   ├── 01-fundamentos/
│   │   │   ├── lesson.md        # Texto + analogias
│   │   │   ├── podcast.m4a      # NotebookLM audio
│   │   │   ├── diagram.png      # ai-media-generator
│   │   │   └── flashcards.json  # Anki notes created
│   │   └── ...
│   └── flashcards/              # FSRS state backup
│       ├── tls_card.json
│       └── ...
├── german/
└── python/
```

### `config.json` Example
```json
{
  "domain": "cybersecurity",
  "goal": "fundamentos amplos",
  "level": "zero",
  "dailyMinutes": 60,
  "harness": "cloud-code",
  "model": "sonnet",
  "ttsModel": "qwen3-tts",
  "notebooklmEnabled": true,
  "createdAt": "2026-09-01T...",
  "updatedAt": "2026-09-01T..."
}
```

### `curriculum.json` Example
```json
{
  "domain": "cybersecurity",
  "phases": [
    {
      "name": "Fundamentos",
      "order": 1,
      "modules": [
        {
          "name": "Conceitos Básicos",
          "lessons": [
            {"id": "01", "title": "O que é Segurança da Informação", "concepts": ["CIA triad", "ameaças", "vulnerabilidades"]},
            {"id": "02", "title": "Criptografia Básica", "concepts": ["simétrica", "assimétrica", "hash"]},
            {"id": "03", "title": "TLS/SSL", "concepts": ["handshake", "certificados", "PKI"]}
          ]
        }
      ],
      "estimatedHours": 8
    }
  ],
  "totalEstimatedHours": 24
}
```

### `progress.json` Example
```json
{
  "domain": "cybersecurity",
  "stats": {
    "lessonsCompleted": 3,
    "conceptsMastered": 12,
    "flashcardsDue": 5,
    "totalStudyMinutes": 180,
    "streakDays": 3,
    "weakAreas": ["PKI", "hash functions"],
    "lastSession": "2026-09-01T20:00:00Z"
  },
  "fsrsCards": {
    "cia-triad": {"due": "2026-09-02", "stability": 2.5, "difficulty": 5.2, "reps": 2, "state": "Review"},
    "symmetric-crypto": {"due": "2026-09-03", "stability": 1.8, "difficulty": 6.1, "reps": 1, "state": "Learning"}
  }
}
```

---

## Validation Checklist per Harness

| Harness | Agent File | Model | Tools | Test Command |
|---|---|---|---|---|
| Cloud Code | `.claude/agents/tutor.md` | sonnet | read/write/edit/bash/web_search | `claude -p "tutor setup"` |
| Codex | `.codex/agents/tutor.md` | gpt-5.6 | read/write/edit/bash/web_search | `codex exec "tutor setup"` |
| Antigravity | `.antigravity/agents/tutor.yaml` | sonnet | read/write/edit/bash/web_search | `antigravity run tutor` |
| OpenRouter | `openrouter-config.json` | multi | via proxy | `openrouter chat "tutor setup"` |