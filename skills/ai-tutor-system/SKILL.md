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

**Input:** Objetivo, tempo/dia, conhecimento prévio
**Output:** Perfil do aluno + configuração do tutor

```typescript
interface StudentProfile {
  domain: string;           // ex: "cybersecurity", "german", "python"
  goal: string;             // ex: "fundamentos amplos", "certificação X"
  level: "zero" | "basic" | "intermediate" | "advanced";
  dailyMinutes: number;     // 15-480
  harness: "cloud-code" | "codex" | "antigravity" | "openrouter";
  model: string;            // ex: "sonnet", "gpt-5.6", "qwen3"
  notebooklmEnabled: boolean;
  qwenTtsEnabled: boolean;
}
```

**Validação:** Harness instalado? NotebookLM acessível? Qwen3-TTS (GPU) disponível?

---

## Etapa 2: CURRÍCULO — Geração Adaptativa

**Processo:**
1. Buscar fontes confiáveis (Harvard/MIT/Stanford via transcripts, docs oficiais)
2. Gerar roadmap em fases: fundamentos → intermediário → avançado
3. Cada fase = módulos → aulas → objetivos de aprendizagem
4. Estimar tokens/tempo por aula baseado em `dailyMinutes`

**Exemplo estrutura:**
```json
{
  "domain": "cybersecurity",
  "phases": [
    { "name": "Fundamentos", "modules": 3, "lessons": 12, "estHours": 8 },
    { "name": "Redes", "modules": 2, "lessons": 8, "estHours": 6 },
    { "name": "Criptografia", "modules": 2, "lessons": 10, "estHours": 8 }
  ]
}
```

---

## Etapa 3: AULAS — Geração Multimodal (NotebookLM)

**Para cada aula, gerar:**

| Formato | Tool | Prompt Pattern |
|---|---|---|
| Texto base | Tutor LLM | "Explique [conceito] para [nível] com analogia [X]" |
| Imagem didática | NotebookLM / ai-media-generator | "Diagrama estilo [excalidraw/mermaid] de [conceito]" |
| Podcast (3-10 min) | NotebookLM `generate_audio` | "Podcast conversacional sobre [tópico], 2 hosts" |
| Vídeo curto (opcional) | Kling/Runway/Veo | "Animação 15s demonstrando [conceito]" |

**Exemplo prompt NotebookLM:**
```python
# Via notebooklm-py
task = studio_generate(notebook="Cybersec Aula 1", artifact_type="audio")
studio_status(notebook="Cybersec Aula 1", task_id=task)
studio_download(notebook="Cybersec Aula 1", artifact_type="audio", path="aula1_podcast.m4a")
```

---

## Etapa 4: FEYNMAN — Prática Ativa

**Loop por aula:**
1. Tutor pede: "Explique [conceito] com suas palavras, como se ensinasse a um leigo"
2. Aluno responde (texto/áudio)
3. Tutor valida: 
   - ✅ Correto → avança, cria flashcards
   - ⚠️ Parcial → aponta lacuna, pede revisão
   - ❌ Incorreto → re-explica, novo exercício

**Validação:** Semântica (embedding similarity > 0.85) + cobertura de key points

---

## Etapa 5: ANKI CONNECT — Criação de Flashcards

**Para cada conceito-chave da aula:**
```python
# Via Anki-Connect HTTP API
payload = {
  "action": "addNotes",
  "version": 6,
  "params": {
    "notes": [{
      "deckName": f"AI-Tutor::{domain}::{phase}",
      "modelName": "Basic (and reversed)",
      "fields": {
        "Front": f"O que é {concept}?",
        "Back": f"{explanation}\n\nAnalogia: {analogy}"
      },
      "tags": ["ai-tutor", domain, phase],
      "audio": [{"url": podcast_segment_url, "filename": f"{concept}.m4a", "fields": ["Back"]}]
    }]
  }
}
```

**Modelo recomendado:** "Basic (and reversed)" → cria 2 cards (Q→A e A→Q)

---

## Etapa 6: FLASHCARDS — Repetição Espaçada (FSRS)

**Scheduler TS-FSRS:**
```typescript
import { fsrs, createEmptyCard, Rating } from 'ts-fsrs';

const scheduler = fsrs();
const card = createEmptyCard();

// Após revisão do aluno:
const result = scheduler.next(card, new Date(), Rating.Good); // Again/Hard/Good/Easy
// result.card.due = próxima data de revisão
// result.card.stability, difficulty atualizados
```

**Ratings:** Again (1) < Hard (2) < Good (3) < Easy (4)
**Integração:** Armazenar `card` (JSON) no progress tracker; agendar revisão via cron/hook

---

## Etapa 7: PROGRESS TRACKING — Dashboard

**Métricas por domínio:**
```json
{
  "domain": "cybersecurity",
  "stats": {
    "lessonsCompleted": 15,
    "conceptsMastered": 47,
    "flashcardsDue": 12,
    "totalStudyMinutes": 420,
    "streakDays": 7,
    "weakAreas": ["criptografia", "protocolos TLS"],
    "nextReview": "2026-09-02T08:00:00Z"
  }
}
```

**Visualização:** CLI (rich/table) ou HTML dashboard (Chart.js)

---

## Etapa 8: MULTI-TUTOR — Isolamento por Domínio

**Estrutura de pastas:**
```
~/ai-tutors/
├── cybersecurity/
│   ├── config.json      # StudentProfile
│   ├── curriculum.json  # roadmap
│   ├── progress.json    # tracking
│   ├── flashcards/      # Anki deck export / FSRS state
│   └── lessons/         # aulas geradas (md, audio, images)
├── german/
└── python/
```

**Switch rápido:** `ai-tutor switch cybersecurity` → carrega perfil, retoma onde parou

---

## Referências (validados)

- `references/notebooklm-api.md` — endpoints, auth, audio generation
- `references/anki-connect.md` — addNotes, deck/create, media embed
- `references/fsrs-typescript.md` — scheduler, ratings, card state
- `references/qwen3-tts-clone.md` — voice clone, batch, reusable prompts
- `references/harness-configs.md` — Cloud Code, Codex, Antigravity agent setup

---

## Scripts

- `scripts/setup-tutor.ts` — wizard interativo (perfil, harness, modelos)
- `scripts/generate-curriculum.ts` — busca fontes → roadmap JSON
- `scripts/generate-lesson.ts` — texto + NotebookLM audio/image
- `scripts/feynman-exercise.ts` — validação semântica + feedback
- `scripts/create-flashcards.ts` — Anki Connect + FSRS init
- `scripts/schedule-reviews.ts` — cron job para revisões devidas
- `scripts/progress-dashboard.ts` — CLI/HTML stats
- `scripts/switch-tutor.ts` — troca de domínio

---

## Exemplo de Uso (CLI)

```bash
# 1. Setup inicial
npx ai-tutor setup
# → Pergunta: domínio, objetivo, nível, tempo/dia, harness, modelos

# 2. Gerar currículo
npx ai-tutor curriculum
# → Busca fontes, cria roadmap, salva curriculum.json

# 3. Próxima aula
npx ai-tutor next
# → Gera aula multimodal, salva em lessons/

# 4. Exercício Feynman
npx ai-tutor explain "O que é TLS?"
# → Valida resposta, cria flashcards se OK

# 5. Revisão agendada
npx ai-tutor review
# → Mostra cards devidos (FSRS), registra rating

# 6. Dashboard
npx ai-tutor stats
# → Progresso, streak, áreas fracas, próxima revisão

# 7. Trocar domínio
npx ai-tutor switch german
```

---

## Integração com Harnesses Existentes

| Harness | Config | Agent Template |
|---|---|---|
| **Cloud Code** | `.claude/agents/tutor.md` | `system: "Você é um tutor IA..."` |
| **Codex** | `.codex/agents/tutor.md` | `instructions: "Ensine [domínio]..."` |
| **Antigravity** | `.antigravity/agents/tutor.yaml` | `model: "sonnet", tools: [...]` |
| **OpenRouter** | `openrouter-config.json` | `model: "qwen/qwen3-tts", ...` |

---

## Próximos Passos (Roadmap)

- [ ] Implementar `scripts/setup-tutor.ts` (wizard interativo)
- [ ] Implementar `scripts/generate-lesson.ts` (NotebookLM integration)
- [ ] Implementar `scripts/create-flashcards.ts` (Anki Connect + FSRS)
- [ ] Testar pipeline completo: cybersecurity (3 aulas)
- [ ] Adicionar suporte a múltiplos idiomas (UI + TTS)
- [ ] Exportar deck Anki (.apkg) para backup/portabilidade
- [ ] Web dashboard opcional (Next.js + Chart.js)