---
name: prompt-optimizer
description: Use when the user wants a prompt optimized or rewritten — analyze intent and gaps, match ECC components, output a ready-to-paste prompt. Triggers on "optimize prompt", "improve my prompt", "rewrite this prompt", "help me prompt", "优化prompt", "帮我优化这个指令".
metadata:
  origin: community
  author: YannJY02
  version: "1.0.0"
---

# Prompt Optimizer

Analyze a draft prompt, critique it, match ECC components, output a complete optimized prompt ready to paste and run. Pipeline completo, output format, exemplos e bench em `references/pipeline.md`.

## When to Use

- User says "optimize this prompt", "improve my prompt", "rewrite this prompt"
- User says "help me write a better prompt for..." / "how should I use ECC for..."
- User says "优化prompt", "改进prompt", "怎么写prompt", "帮我优化这个指令"
- User pastes a draft prompt asking for feedback
- User says "I don't know how to prompt for this"
- User explicitly invokes `/prompt-optimize`

### Do Not Use When

- User wants the task done directly (just execute it)
- "优化代码", "optimize this code" — refactoring tasks, not prompt optimization
- ECC configuration questions (use `configure-ecc`)
- Skill inventory (use `skill-stocktake`)
- User says "just do it" / "直接做"

## How It Works

**Advisory only — do not execute the user's task.** No code, files, commands, or implementation. Output = analysis + optimized prompt. If user says "just execute", tell them to make a normal task request.

6-phase pipeline (detalhe em `references/pipeline.md`):

```
Phase 0: Project Detection (CLAUDE.md + stack via manifest files)
  → Phase 1: Intent Detection (9 categorias EN+ZH)
  → Phase 2: Scope Assessment (TRIVIAL → EPIC → orchestration)
  → Phase 3: ECC Component Matching (intent × stack tables)
  → Phase 4: Missing Context (11-item checklist; 3+ missing → até 3 perguntas)
  → Phase 5: Workflow + Model Recommendation (lifecycle, Sonnet/Opus split, multi-prompt splitting)
```

Output em 5 seções (idioma do input): 1 Diagnosis (strengths/issues/clarifications) → 2 ECC Components → 3 Full optimized prompt (bloco único copiável) → 4 Quick version → 5 Rationale. Formato exato + 3 exemplos trabalhados (login Next.js ZH, REST Go, monolito→microsserviços) + bench SoT/ToT/ReAct em `references/pipeline.md`.

```markdown
# Quick patterns por intent
- New Feature: `/plan [feature]. /tdd to implement. /code-review. /verify.`
- Bug Fix: `/tdd — write failing test for [bug]. Fix to green. /verify.`
- EPIC: `Use blueprint skill for "[objective]". Execute phases with /verify gates.`
```

## Related Components

| Component | When to Reference |
|-----------|------------------|
| `configure-ecc` | User hasn't set up ECC yet |
| `skill-stocktake` | Audit installed components (not hardcoded catalog) |
| `search-first` | Research phase in optimized prompts |
| `blueprint` | EPIC-scope prompts (invoke as skill, not command) |
| `strategic-compact` | Long session context management |
| `cost-aware-llm-pipeline` | Token optimization recommendations |
