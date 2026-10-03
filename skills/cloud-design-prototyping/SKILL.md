---
name: cloud-design-prototyping
description: "Use when prototyping UIs with AI — Cloud Design (/design command) or Open Design local-first alternative. Covers canvas workflow, DESIGN.md tokens, and export to HTML/CSS, PPTX, PDF, MP4. Triggers on \"cloud design\", \"protótipo ia\", \"design com ia\", \"/design command\"."
metadata:
  origin: ECC
---

# Cloud Design Prototyping

Prototype UIs with AI via Cloud Design (`/design`) or local-first Open Design. Detalhes em `references/`.

## When to Activate

- User wants to prototype a site/app with AI
- Using the Cloud Code `/design` command with interactive canvas
- Locking visual direction (5 curated options or brand extraction)
- Dual editing: manual clicks + prompts in the same canvas
- Mobile/desktop preview in the same flow
- Exporting to HTML/CSS, PPTX, PDF, or MP4 for engineering handoff

## Core Flow

1. **Brief** — natural-language brief or built-in template
2. **Direction** — lock visual direction (5 options or Figma/screenshot extract)
3. **Design** — plugin + skill + `DESIGN.md` tokens → canonical files
4. **Artifact** — real HTML/CSS preview with dual edit + dual preview
5. **Handoff** — export and continue as real code in Cursor/Codex/Code

## Design-system-first (Batch 17c, #61)

One-shot prompts produce generic output (padaria site = pizzaria site).
Teach the pattern BEFORE generating: a design system (button, type,
spacing, radius as tokens) is what separates generic from distinctive.
Cloud Design 2.0 also fixed the brutal token burn of v1 — but direction
lock (step 2) is still what saves cost: no system, no identity, more
iterations burned.

## Design-spike em side project (Claude Code + Artifacts, leva YouTube 2026-10-03)

Fonte: Claude `@claude/COJAZQM1aeQ` ("Build an App With Claude Design", 2026-10-02). Para a parte pequena que você não pensaria duas vezes (ex.: onboarding de side project), um spike rápido com o repo conectado rende mais que caprichar no vácuo:

1. Abra o Claude Code com o repo conectado → aba Artifacts → novo design pedindo para olhar o estado atual ("design a silly onboarding for this app").
2. Comente o que funciona/não funciona; corrija detalhes você mesmo no editor e gere novas opções em cima.
3. Peça o click-through prototype, clique de verdade, e só então mande construir ("OK, build it").
4. Vale quando o custo do spike é menor que o custo de decidir no escuro; não vale para fluxos críticos (esses pedem direction lock + DESIGN.md primeiro).

## Example

```bash
# New project from brief, then export for engineering
open-design new --brief "Landing page para produto SaaS"
open-design export --format html --output ./handoff
```

## References

- `references/workflow.md` — 5-stage pipeline, brief template, directions, canvas edit, memory, scripts
- `references/cloud-design-features.md` — `/design` command details
- `references/open-design-api.md` — CLI, plugins, BYOK
- `references/design-md-spec.md` — DESIGN.md canonical schema
- `references/artifact-sharing.md` — Anthropic Artifacts API sharing
- `references/export-formats.md` — HTML/PPTX/PDF/MP4 specs and handoff checklist

## Checklist

- [ ] Brief captured (type, audience, goal, constraints)
- [ ] Visual direction locked before generating pages
- [ ] `DESIGN.md` tokens bound (colors, type, spacing, radius)
- [ ] Mobile (375px) + desktop (1440px) preview verified
- [ ] Handoff exported in the format engineering consumes
