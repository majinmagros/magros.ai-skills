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
