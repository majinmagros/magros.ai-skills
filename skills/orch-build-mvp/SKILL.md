---
name: orch-build-mvp
description: "Use when orchestrate bootstrapping a working MVP from a design or spec document — ingest the doc, plan thin vertical slices, scaffold the first end-to-end slice, then TDD-implement, review, and gated commit. Use to turn an SDD/PRD into a running starting point. Triggers on \"orch-build-mvp\", \"orch build mvp\"."
metadata:
  origin: ECC
---

# orch-build-mvp

Actor · action · target: **orch · build · mvp**. Thin wrapper over the shared
engine in [`orch-pipeline`](../orch-pipeline/SKILL.md).

## When to Use

- The user has a **design / spec document** (SDD, PRD, system_design) and wants a
  working vertical slice bootstrapped from it.
- Takes a doc path as its argument, e.g. `civicpulse/docs/SDD-v0.6.md`.

## Operation settings

- **Default size floor:** large — this is the full pipeline including Scaffold.
- **Phase mask:** 0 (read the spec) → 1 → 2 (heavy) → 3 (scaffold) → 4 → 5 → 6.
- **First move (phase 0 → 2):** read the doc; extract scope, locked decisions,
  and the feature list; order it into **thin vertical slices** (one end-to-end
  path first, not all-models-then-all-views). Phase 3 stands up that first slice.

## How It Works

1. Run the `orch-pipeline` engine with the settings above.
2. **Reuse the existing GAN harness** instead of hand-rolling an iterate loop:
   - Translate the SDD into `gan-harness/spec.md` + `gan-harness/eval-rubric.md`
     (this stands in for what `gan-planner` would generate — you already have the spec).
   - Drive the build with `/gan-build "<one-line brief>" --skip-planner`
     (defaults: `--max-iterations 15`, `--pass-threshold 7.0`,
     `--eval-mode playwright`; use `--eval-mode code-only` for non-UI slices).
   - That command runs the `gan-generator` → `gan-evaluator` loop and writes
     `gan-harness/feedback/feedback-NNN.md` until the score passes or plateaus.
3. Stop at **Gate 1** (slice plan) and **Gate 2** (pre-commit). Commit the
   scaffold and each slice as separate `feat:` commits.
4. Add `security-reviewer` for any slice touching a security trigger.

## Example

```
orch-build-mvp: civicpulse/docs/SDD-v0.6.md
→ read SDD → slice list (vertical) → scaffold slice 1  [GATE 1: approve]
→ /gan-build --skip-planner (generator → evaluator loop) scores vs spec → review
→ commit feat:  [GATE 2: confirm] → next slice
```

## Enriquecimento 2026-09-06 — caso Snag Time, clone de Calendly em 5 dias (Nate Herk `PYjbeY8sGLs`)

Evidência real de SaaS-clone com agentes (Codex): research de concorrentes (reviews) → plan de features → build com subagentes + DB + integrações (Google Calendar, Stripe) → **swarm de ~50 agentes testando em loop build→test→fix por dias** → rebrand (saída inicial com cara de "vibe coded") → perf via prompt `/goal` (1s→10ms) → mais testes.

- **Números**: 5d5h wall-clock (2 semanas corridas), 334h-agente agregadas, 76 subagentes únicos, 300+ delegações, 32B tokens in + 47M out ≈ **$15k de inferência** — coberto pelo plano Codex $200/mês (yield ≈ $14k; plano Claude $200 ≈ $8k). Out-of-pocket real: ~$150.
- **Caveat do autor**: interno/small-team ≠ escalar ($10k+/mês: inference, DB, bugs, features, ownership). Não venda "few prompts = SaaS" sem o custo de manutenção.
