---
name: visual-qa-designer
description: "Use when reviewing UI screenshots with a designer-eye checklist covering layout, typography, spacing, and hierarchy inside a verification loop. Triggers on \"visual QA\", \"designer eye\", \"screenshot review\", \"UI checklist\". Non-triggers: automated E2E assertions without visual judgment (use e2e-testing). Outcome: screenshot checklist plus annotated findings plus re-check loop."
metadata:
  origin: ECC
---

# Visual QA Designer

Apply a designer eye to UI screenshots: layout, typography, spacing, and
hierarchy, inside a verification loop. Screenshots in, annotated findings
out, re-check until the checklist passes.

## When To Activate

- The user wants a UI reviewed "like a designer would".
- A build loop needs screenshot verification before sign-off.
- Generated pages look "off" but nobody can say why.
- E2E tests pass yet the page looks broken to humans.

## Workflow

### 1. Capture consistent screenshots

- Fixed viewport, fixed route, fixed seed data per capture.
- Full-page plus one above-the-fold shot per screen.
- Same captures every loop so diffs are meaningful.

### 2. Run the layout pass

- Alignment: edges and columns share baselines; no orphan drift.
- Balance: one focal element per viewport; competing heroes flagged.
- Overflow: no clipped text, no horizontal scroll, no overlap at target widths.

### 3. Run the typography pass

- At most 2 families and 4 sizes per screen; scale is consistent.
- Contrast passes for body text; muted text still readable.
- No widows in headings, no wall-of-text paragraphs without breaks.

### 4. Run the spacing pass

- One spacing scale (for example 4/8/16/24/32); off-scale gaps flagged.
- Related items grouped; unrelated groups separated by whitespace, not lines.
- Touch targets meet minimum size with breathing room.

### 5. Run the hierarchy pass

- Primary action is visually first; secondary actions recede.
- Headings nest in order; visual weight matches information priority.
- Every screen answers in 3 seconds: what is this, what do I do next.

### 6. Log findings and re-check

- Finding format: screen | area | rule broken | severity | fix.
- Fix, re-capture, re-run the checklist; close only on full pass.
- Recurring finding 3+ times -> propose a design-system rule.

## Anti-Patterns

- Reviewing compressed thumbnails -> misses spacing and type defects.
- New viewport every loop -> diffs are noise.
- "Looks good to me" with no checklist -> unrepeatable QA.
- Flagging taste as defect -> taste goes to discussion, not blockers.
- Skipping re-check -> fixes that break another pass.
- E2E green treated as visual done -> layout bugs ship.

## Relations

- `design-system`: owns tokens and component rules; this skill checks screenshots against them.
- `e2e-testing`: owns automated browser assertions and captures; this skill adds human-style visual judgment.
- `verification-loop`: owns the verify-fix-reverify loop; this skill plugs the designer checklist into it.

## Sources

- Playwright screenshot and visual comparison docs: https://playwright.dev
- Checklist shape (layout, typography, spacing, hierarchy) from video evidence #161 (id RX6tRSGpd_8) is author measurement, not a standard - adapt the rules to your own design system before enforcing.
