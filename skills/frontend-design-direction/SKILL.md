---
name: frontend-design-direction
description: Set an ECC-specific frontend design direction for production UI work. Use when building or improving websites, dashboards, applications, components, landing pages, visual tools, or any web UI that needs stronger product-specific design judgment.
metadata:
  origin: community
---

# Frontend Design Direction

Use this skill when the work is not just making UI function, but making it feel
purposeful, polished, and appropriate to the product domain.

Source: salvaged from stale community PR #1659 by `linus707`.

Note: ECC intentionally does not rebundle the canonical Anthropic
`frontend-design` skill. Install that from `anthropics/skills` when you want the
official upstream skill. This skill is the ECC-specific design-direction salvage
of the useful local guidance from #1659.

## When to Use

- The user asks to build a web page, app, dashboard, artifact, component, or UI.
- The user asks to make an interface more polished, distinctive, beautiful, or
  less generic.
- The implementation needs visual hierarchy, typography, color, motion, layout,
  and interaction choices.
- The current UI works but reads as flat, generic, templated, or mismatched to
  the audience.

## Design Direction

Before coding, choose a specific direction:

1. Purpose: what job does the interface do?
2. Audience: who repeats this workflow, and what do they need to scan first?
3. Tone: utilitarian, editorial, playful, industrial, refined, technical,
   maximal, minimal, dense, calm, or another explicit direction.
4. Memorable detail: one design idea that makes the result feel intentional.
5. Constraints: framework, accessibility, performance, responsiveness, and
   existing design system.

Match the direction to the domain. A SaaS operations tool should usually be
dense, quiet, and scannable. A portfolio, launch page, game, or editorial piece
can be more expressive. Do not force a landing-page composition onto a tool that
needs repeated daily use.

## Implementation Guidance

- Build the actual usable experience as the first screen unless the user
  explicitly asks for marketing copy.
- Use existing project components, tokens, icon libraries, and routing patterns
  before introducing a new visual system.
- Use real or generated visual assets when the interface depends on images,
  products, places, people, gameplay, charts, or inspectable media.
- Prefer contextual typography and spacing over generic oversized hero text.
- Keep palettes multi-dimensional: avoid a UI dominated by one hue family.
- Use CSS variables or existing design tokens so the direction remains
  coherent across states.
- Design responsive constraints explicitly: grids, aspect ratios, min/max
  sizes, stable toolbars, and fixed-format controls should not shift when labels
  or hover states appear.
- Use motion sparingly but deliberately. Prefer high-signal transitions that
  clarify state over decorative animation.
- Verify text fit on mobile and desktop. Long labels must wrap or resize
  cleanly rather than overflowing.

## Anti-Patterns

- Do not default to common generated patterns: purple gradients, decorative
  blobs, oversized cards, vague hero copy, or stock-like atmospheric media.
- Do not add UI cards inside other cards.
- Do not use a single decorative style everywhere when the domain calls for
  restraint.
- Do not hide the primary product, tool, object, or workflow behind generic
  marketing sections.
- Do not add a new dependency for a design flourish unless it clearly pays for
  itself.
- Do not describe the UI's features inside the UI when the controls can speak
  for themselves.

## Review Checklist

- The first viewport immediately communicates the product, workflow, or object.
- The visual hierarchy supports scanning and repeated use.
- Typography fits the container and does not overlap adjacent content.
- Color choices have contrast and do not collapse into a one-note palette.
- Icons are used for familiar tool actions where available.
- Responsive layout has stable dimensions for boards, grids, toolbars,
  controls, tiles, and counters.
- Assets render and carry the subject matter instead of acting as filler.
- Motion improves orientation and does not mask sluggishness.
- The result matches the repo's existing frontend conventions unless there is a
  clear reason to depart.

## Cloud Design (Claude) — tool de prototipagem alta-fidelidade (enriquecimento 2026-08-20)

**Cloud Design** (`cloud-design` skill) é uma ferramenta concreta no Claude (planos Pro/Max) para criar protótipos fiéis **antes** de codar:

| Uso | Como ajuda no design direction |
|---|---|
| **Design system versionado** | Anexe JSON/CSS/Figma/URL → garante consistência across telas (cores, fontes, spacing, border radius) |
| **Referências visuais** | Screenshots Dribbble/Landing Folio/Lapa.Ninja → extrai layout, tipografia, componentes |
| **Iteração em linguagem natural** | "Remova blog", "mobile first", "fonte do Airbnb" → itera rápido sem recodar |
| **Export standalone HTML/PDF** | Handoff exato para Cursor/Cloud Code implementar (HTML+CSS+JS zipado) |
| **Link colaborativo** | Time visualiza/edita no `claude.ai/design` (view/edit) |

**Workflow integrado**:
```
Cloud Design (protótipo + design system)
    ↓ export HTML/PDF
frontend-design-direction (refinar direção, escolher tone/detail)
    ↓ handoff
Cursor / Cloud Code (implementação)
    → react-patterns, motion-patterns, design-system
    → e2e-testing / browser-qa (validar)
```

**Limites**: Cloud Design consome quota **separada** do Cloud Code (~20% limite semanal/sessão complexa). Monitorar em Settings → Usage.

**Alternativa gratuita**: Google Stitch (stitch.withgoogle.com) — ~300 telas/mês grátis, menos fiel em multi-telas.

Referência: skill `cloud-design`, vídeo `dsOGGuZi-JY` (@Sujeitoprogramador)
