# AI Tutor System — Pipeline (Setup → Currículo → Aulas → Feynman → Flashcards → Progress → Multi-Tutor)

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

API depth: `references/notebooklm-api.md`, `references/anki-connect.md`,
`references/fsrs-typescript.md`, `references/qwen3-tts-clone.md`, `references/harness-configs.md`.

## Validação Oficial (antes de materializar)

| Claim | Status | Fonte |
|---|---|---|
| NotebookLM API: podcast generation (audio artifacts) | ✅ Confirmado | `notebooklm-py` (`/teng-lin/notebooklm-py`), `client.artifacts.generate_audio` |
| Anki Connect API: addNotes programmatic | ✅ Confirmado | `Anki-Connect` (`/websites/git_sr_ht_foosoft_anki-connect`), `addNotes` endpoint |
| FSRS Algorithm: TypeScript scheduler | ✅ Confirmado | `ts-fsrs` (`/open-spaced-repetition/ts-fsrs`), `fsrs()`, `createEmptyCard`, `Rating.Good` |
| Qwen3-TTS: voice clone 3s reference audio | ✅ Confirmado | `Qwen3-TTS` (`/qwenlm/qwen3-tts`), `generate_voice_clone(ref_audio, ref_text)` |
| Cloud Code / Codex / Antigravity agent configs | 🔄 Verificar | Configs locais (`.claude/agents/`, `.codex/agents/`) |

## Etapa 1: SETUP — Nivelamento Inicial

**Input:** Objetivo, tempo/dia, conhecimento prévio. **Output:** Perfil do aluno + configuração do tutor.

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

## Etapa 2: CURRÍCULO — Geração Adaptativa

1. Buscar fontes confiáveis (Harvard/MIT/Stanford via transcripts, docs oficiais)
2. Gerar roadmap em fases: fundamentos → intermediário → avançado
3. Cada fase = módulos → aulas → objetivos de aprendizagem
4. Estimar tokens/tempo por aula baseado em `dailyMinutes`

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

## Etapa 3: AULAS — Geração Multimodal (NotebookLM)

| Formato | Tool | Prompt Pattern |
|---|---|---|
| Texto base | Tutor LLM | "Explique [conceito] para [nível] com analogia [X]" |
| Imagem didática | NotebookLM / ai-media-generator | "Diagrama estilo [excalidraw/mermaid] de [conceito]" |
| Podcast (3-10 min) | NotebookLM `generate_audio` | "Podcast conversacional sobre [tópico], 2 hosts" |
| Vídeo curto (opcional) | Kling/Runway/Veo | "Animação 15s demonstrando [conceito]" |

```python
# Via notebooklm-py
task = studio_generate(notebook="Cybersec Aula 1", artifact_type="audio")
studio_status(notebook="Cybersec Aula 1", task_id=task)
studio_download(notebook="Cybersec Aula 1", artifact_type="audio", path="aula1_podcast.m4a")
```

## Etapa 4: FEYNMAN — Prática Ativa

1. Tutor pede: "Explique [conceito] com suas palavras, como se ensinasse a um leigo"
2. Aluno responde (texto/áudio)
3. Tutor valida: ✅ Correto → avança, cria flashcards · ⚠️ Parcial → aponta lacuna · ❌ Incorreto → re-explica

**Validação:** Semântica (embedding similarity > 0.85) + cobertura de key points.

## Etapa 5-6: ANKI CONNECT + FSRS

Anki: deck `AI-Tutor::<domain>::<phase>`, modelo "Basic (and reversed)", tags `ai-tutor` — ver `references/anki-connect.md`.
FSRS (`ts-fsrs`): `scheduler.next(card, new Date(), Rating.Good)`; Again(1) < Hard(2) < Good(3) < Easy(4); estado em JSON no progress tracker — ver `references/fsrs-typescript.md`.

## Etapa 7: PROGRESS TRACKING — Dashboard

```json
{
  "domain": "cybersecurity",
  "stats": {
    "lessonsCompleted": 15, "conceptsMastered": 47, "flashcardsDue": 12,
    "totalStudyMinutes": 420, "streakDays": 7,
    "weakAreas": ["criptografia", "protocolos TLS"],
    "nextReview": "2026-09-02T08:00:00Z"
  }
}
```

Visualização: CLI (rich/table) ou HTML dashboard (Chart.js).

## Etapa 8: MULTI-TUTOR — Isolamento por Domínio

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

Switch rápido: `ai-tutor switch cybersecurity` → carrega perfil, retoma onde parou.

## CLI + Scripts

```bash
npx ai-tutor setup    # perfil, harness, modelos
npx ai-tutor curriculum  # roadmap → curriculum.json
npx ai-tutor next     # aula multimodal → lessons/
npx ai-tutor explain "O que é TLS?"  # Feynman + flashcards se OK
npx ai-tutor review   # cards devidos (FSRS)
npx ai-tutor stats    # progresso, streak, áreas fracas
npx ai-tutor switch german
```

Scripts em `scripts/`: `setup-tutor.ts`, `generate-curriculum.ts`, `generate-lesson.ts`,
`feynman-exercise.ts`, `create-flashcards.ts`, `schedule-reviews.ts`, `progress-dashboard.ts`, `switch-tutor.ts`.

## Harnesses

| Harness | Config | Agent Template |
|---|---|---|
| **Cloud Code** | `.claude/agents/tutor.md` | `system: "Você é um tutor IA..."` |
| **Codex** | `.codex/agents/tutor.md` | `instructions: "Ensine [domínio]..."` |
| **Antigravity** | `.antigravity/agents/tutor.yaml` | `model: "sonnet", tools: [...]` |
| **OpenRouter** | `openrouter-config.json` | `model: "qwen/qwen3-tts", ...` |

Detalhes em `references/harness-configs.md`.

## Roadmap

- [ ] `scripts/setup-tutor.ts` (wizard interativo)
- [ ] `scripts/generate-lesson.ts` (NotebookLM integration)
- [ ] `scripts/create-flashcards.ts` (Anki Connect + FSRS)
- [ ] Pipeline completo: cybersecurity (3 aulas)
- [ ] Múltiplos idiomas (UI + TTS)
- [ ] Exportar deck Anki (.apkg)
- [ ] Web dashboard opcional (Next.js + Chart.js)
