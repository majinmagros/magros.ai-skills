---
name: frontend-slides
description: Create stunning, animation-rich HTML presentations from scratch or by converting PowerPoint files. Use when the user wants to build a presentation, convert a PPT/PPTX to web, or create slides for a talk/pitch. Helps non-designers discover their aesthetic through visual exploration rather than abstract choices.
metadata:
  origin: ECC
---

# Frontend Slides

Create zero-dependency, animation-rich HTML presentations that run entirely in the browser.

Inspired by the visual exploration approach showcased in work by zarazhangrui (credit: @zarazhangrui).

## When to Activate

- Creating a talk deck, pitch deck, workshop deck, or internal presentation
- Converting `.ppt` or `.pptx` slides into an HTML presentation
- Improving an existing HTML presentation's layout, motion, or typography
- Exploring presentation styles with a user who does not know their design preference yet

## Non-Negotiables

1. **Zero dependencies**: default to one self-contained HTML file with inline CSS and JS.
2. **Viewport fit is mandatory**: every slide must fit inside one viewport with no internal scrolling.
3. **Show, don't tell**: use visual previews instead of abstract style questionnaires.
4. **Distinctive design**: avoid generic purple-gradient, Inter-on-white, template-looking decks.
5. **Production quality**: keep code commented, accessible, responsive, and performant.

Before generating, read `STYLE_PRESETS.md` for the viewport-safe CSS base, density limits, preset catalog, and CSS gotchas.

## Workflow

### 1. Detect Mode

Choose one path:
- **New presentation**: user has a topic, notes, or full draft
- **PPT conversion**: user has `.ppt` or `.pptx`
- **Enhancement**: user already has HTML slides and wants improvements

### 2. Discover Content

Ask only the minimum needed:
- purpose: pitch, teaching, conference talk, internal update
- length: short (5-10), medium (10-20), long (20+)
- content state: finished copy, rough notes, topic only

If the user has content, ask them to paste it before styling.

### 3. Discover Style

Default to visual exploration.

If the user already knows the desired preset, skip previews and use it directly.

Otherwise:
1. Ask what feeling the deck should create: impressed, energized, focused, inspired.
2. Generate **3 single-slide preview files** in `.ecc-design/slide-previews/`.
3. Each preview must be self-contained, show typography/color/motion clearly, and stay under roughly 100 lines of slide content.
4. Ask the user which preview to keep or what elements to mix.

Use the preset guide in `STYLE_PRESETS.md` when mapping mood to style.

### 4. Build the Presentation

Output either: