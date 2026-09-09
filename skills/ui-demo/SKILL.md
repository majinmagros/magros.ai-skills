---
name: ui-demo
description: Record polished UI demo videos using Playwright. Use when the user asks to create a demo, walkthrough, screen recording, or tutorial video of a web application. Produces WebM videos with visible cursor, natural pacing, and professional feel.
metadata:
  origin: ECC
---

# UI Demo Video Recorder

Record polished demo videos of web applications using Playwright's video recording with an injected cursor overlay, natural pacing, and storytelling flow. Helpers em `scripts/demo-helpers.js`, template em `scripts/demo-script.template.cjs`, fases em `references/phases.md`.

## When to Use

- User asks for a "demo video", "screen recording", "walkthrough", or "tutorial"

## Three-Phase Process

Every demo goes through three phases: **Discover -> Rehearse -> Record**. Never skip straight to recording.

**Phase 1 — Discover:** dump interactive elements per page (tag/type/name/placeholder/role) before scripting; map selects (values AND text), rich text, required fields, dynamic fields, exact button labels, table headers. Assumptions break recordings silently.

**Phase 2 — Rehearse:** run `{label, selector}` steps through `ensureVisible` (fails loudly + visible-element dump); fix selectors; only proceed when all green.

**Phase 3 — Record:** story flow (entry → context → action → variation → result); pacing (login 4s, nav 3s, click 2s, steps 1.5-2s, final 3s, typing 25-40ms/char); SVG cursor overlay (re-inject every navigation); move-before-click; visible typing; smooth scroll; dashboard panning; subtitles (`Step N - Action`, <60 chars).

```bash
node demo-script.cjs --rehearse   # Phase 2: valida seletores
node demo-script.cjs              # Phase 3: grava WebM 1280x720
```

## Checklist Before Recording

- [ ] Discovery completed; rehearsal passes all selectors OK
- [ ] Headless on; resolution `1280x720`
- [ ] Cursor + subtitles re-injected after every navigation
- [ ] `showSubtitle('Step N - ...')` at transitions; `moveAndClick` (labeled) for clicks; `typeSlowly` for input
- [ ] No silent catches (helpers warn); smooth scroll for reveals
- [ ] Pauses visible to humans; flow matches story order and discovered UI

## Common Pitfalls

Cursor dies on navigate → re-inject · too fast → add pauses · dot cursor → SVG overlay · teleports → move first · wrong selects → show move then pick · abrupt modals → read pause · random video path → copy to stable name · swallowed selector failures → never silent-catch · assumed field types/features → discover first · `"0"`/`"Select..."` placeholders look real · popups = separate videos (capture explicitly, merge later).
