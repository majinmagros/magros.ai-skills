---
name: computer-use-agent-patterns
description: Use when implementing Computer Use API patterns — OS World 72.6%, screen reading, mouse/keyboard/slide/drag-drop, self-correction, 150k context, 40min memory. Triggers on "computer use api", "os world benchmark", "screen reading agent", "slide controls", "self correcting agent", "40min memory agent".
metadata:
  origin: ECC
  source_docs:
    - https://platform.openai.com/docs/guides/computer-use
    - https://github.com/xlang-ai/OSWorld
  video_source: "l4EJUm6KwM0 - IA Acaba de Fazer o Impossível: Reverteu o Envelhecimento Humano (AI Revolution PT)"
  related_skills:
    - agent-harness-construction
    - browser-qa
    - autonomous-agent-harness
    - testsprite-cli-integration
    - closed-loop-verifier-pattern
---

# Skill: computer-use-agent-patterns — Computer Use API (OS World 72.6%)

Padrões **Computer Use API**: **OS World 72.6%** (vs 65.7%), screen reading, mouse/keyboard/slide/drag-drop, **self-correction**, **150k context**, **40min memory**. Caso GPT-6 Astra no "I'm Not a Robot" (48 níveis). Código em `references/implementation.md`.

## Quando usar

- Agents que **operam computador real** (não browser-only)
- **Screen reading** + mouse/keyboard/slide/drag-drop
- **Self-correction** baseada em feedback visual
- Tasks longas (40min) com **150k context window**
- Benchmarking contra **OS World**
- Automação de **desktop apps, installers, system settings**

## Quando NÃO usar

- Browser-only → use `browser-qa`, `testsprite-cli-integration`
- Mobile → use Appium/XCUITest
- Scripted simples → use `automacao-deterministica`
- Verificação de deployed app → use `closed-loop-verifier-pattern`

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| OS World 2.0: 72.6% Astra vs 65.7% anterior | ✅ | OS World leaderboard |
| 40min/task; 150k context window | ✅ | Benchmark + API docs |
| Screen, mouse, keyboard, slide, drag-drop, function keys | ✅ | API capabilities |
| Self-correction; 48 níveis "I'm Not a Robot" | ✅ | Video |

---

## O Loop (resumo)

```
SCREENSHOT → MODEL (150k ctx) → ACTION (click/type/slide/drag/keys)
     ↑                                                       │
     └────── SELF-CORRECT (expected vs actual screen) ───────┘
              + 40-MIN MEMORY (150k = lembra o goal do minuto 1)
```

Ações: click, double/right-click, type, key_press, key_combo (Ctrl+C), drag_drop, **slide** (sliders), scroll, wait. Self-correct: `element_not_found` → tenta coordenadas vizinhas; `slider_not_moved` → arrasto mais longo. Contexto perto do limite → comprime (recente + milestones). Timeout 40min. `ComputerUseAgent` completo em `references/implementation.md`.

## Padrões Prontos (resumo)

- **OSWorldBenchmark**: roda tasks do dataset xlang-ai/OSWorld → success_rate, avg_steps, avg_duration
- **CaptchaSolverAgent**: 48 levels (checkbox → traffic lights → waldo → perfect circle → parallel park → puzzles → whack-a-mole → AI faces → wrong answers → rhythm game); `solve_all_48()` para no primeiro fail
- **SlideControlHandler**: `calculate_slide_path(bbox, %)` + `execute_slide(verify=True)` com tolerância 5%; detecção de posição via CV

---

## Integração com Skills Existentes

| Skill | Relação |
|---|---|
| `agent-harness-construction` | Computer use = action space |
| `browser-qa` | Browser é subset de computer use |
| `autonomous-agent-harness` | Computer use para tasks 40min |
| `testsprite-cli-integration` | TestSprite = verifier; computer use = actor |
| `closed-loop-verifier-pattern` | Computer use drives app; verifier checks |

---

## Referências

- `references/implementation.md` — agent, benchmark, captcha solver, slide handler
- [OSWorld](https://github.com/xlang-ai/OSWorld) · [Computer Use API](https://platform.openai.com/docs/guides/computer-use)
- Video: `l4EJUm6KwM0.pt.dedup.txt` — linhas 246-317
