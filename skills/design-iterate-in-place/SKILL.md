---
name: design-iterate-in-place
description: "Use when iterating an existing design in place with A/B variants, an editable artboard, and anti-slop moodboards instead of generating from zero. Triggers on \"iterate design\", \"design variants\", \"artboard edit\", \"click to edit\", \"anti-slop\". Non-triggers: blank-page prototype generation (use cloud-design-prototyping), generic UI polish rules (use frontend-design-direction). Outcome: variant set against the existing system plus an edited winner ready to implement."
metadata:
  origin: ECC
---

# Design Iterate In Place

Iterate mid-process on a design that already exists: read its system,
produce variants, edit on an artboard, and kill AI slop per section.
Rule: respect the existing design system; this skill is mid-process,
not zero-to-one.

## When To Activate

- The user says iterate this design, variants A/B/C/D, artboard,
  click-to-edit, or fix this hero/landing.
- A design system or live page exists and must be respected.
- Output looks "AI-made" (neon glow overuse, repeated logo, 3+ text
  blocks, weak grid) and needs a human finish.
- A previous run regenerated from zero and broke brand consistency.

## Workflow

1. Read first: extract tokens, type scale, spacing, and components from
   the existing design or page. List what must not change.
2. Diagnose: name the competing elements (for example three dashed bands
   fighting, accent color on low-priority spots) in one short list.
3. Moodboard per section: collect 2-3 consistent references per section
   before generating. Famous skills all converge to "AI look" - the
   moodboard is the antidote.
4. Generate variants: produce A/B/C/D against the same brief (cleaner
   options first, one braver option last). Same content, different
   hierarchy and rhythm.
5. Artboard edit: open the winner on an editable artboard (properties
   panel, click-to-edit injects into the prompt). Edit in place, never
   restart from a blank canvas mid-round.
6. Human finish: fix grid and margins, redo type by hand where needed,
   add texture or glass sparingly, and run a side-by-side A/B before
   locking.
7. Hand off: ship the edited variant plus a delta list (what changed vs
   the original system) for implementation.

## Anti-Patterns

- Zero-to-one regeneration when a system already exists.
- Variant soup with no diagnosis of what is broken.
- One global moodboard for the whole page (slop returns per section).
- Editing screenshots by hand instead of via artboard -> prompt loop.
- Shipping without a side-by-side A/B against the original.

## Relations

- `cloud-design-prototyping`: external prototype flow; this skill is the
  in-place counterpart for existing designs.
- `frontend-design-direction`: product design judgment reused in diagnosis.
- `impeccable-design`: live multi-version editing behind the artboard step.

## Sources

- No external design-tool URL confirmed at write time - verify the native
  design skill and artboard protocol of your current harness before use.
- Variants A/B/C/D, Figma-style editable artboard (properties panel,
  click-to-edit into prompt), mid-process-not-zero-to-one rule, and the
  per-section moodboard anti-slop paradox are author measurement from
  videos `bZk0V_h0WfQ` and `117` context - two real-case tests, not a
  controlled benchmark.
