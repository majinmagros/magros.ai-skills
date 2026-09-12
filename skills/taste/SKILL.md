---
name: taste
description: "Use when building a music video, lyric video, fancam, or short-form edit where the feel matters — angelcore / cloud-trance / hyperpop direction, mood, and beat-synced grammar. Triggers on \"taste\", \"angelcore\", \"music video\", \"edit direction\"."
metadata:
  origin: ECC
---

# Taste

Creative-direction layer above video mechanics: decide what frames look like, in what order, cut to what rhythm. Detalhes em `references/`.

## When to Activate

- Building a music video, lyric video, fancam, or visualizer
- Making a short-form edit/reel where feel matters more than information
- Driving AI b-roll generation with one coherent direction
- Assembling a moodboard or choosing a visual genre before rendering
- The edit works but reads flat, generic, or stylistically incoherent

## Core Principles

1. **Decide genre first** — one primary family + one accent, before any render
2. **Coherence beats novelty** — one look across 30 shots beats 30 looks
3. **Cut to the song** — every hard cut lands on a beat or transient
4. **Generate selectively, edit ruthlessly** — throw away 80%
5. **One accent per shot** — gold in dark frames, iridescence in light, red once

## Example

```ts
const FPS = 30, BPM = 138;
const beat = (n: number) => Math.round(n * (60 / BPM) * FPS);
<Sequence from={beat(0)} durationInFrames={beat(2)}><Video src="/selects/key.mp4" /></Sequence>
```

## References

- `references/genre-taxonomy.md` — full named-genre catalog (existing)
- `references/mood-system.md` — thesis, families, palette, light, motion
- `references/editing-grammar.md` — 7 techniques, do-nots, key principles
- `references/pipeline-beatmath.md` — skill chain, beat math, shot plan
- `references/presets-recipes.md` — fal.ai presets, FFmpeg, Remotion skeleton

## Checklist

- [ ] Primary family + accent chosen before first generation
- [ ] Palette follows one-accent-per-shot rule
- [ ] Hard cuts snapped to beats (no dissolves in tempo sections)
- [ ] Hero-on-black macro carries the verses
- [ ] No UI chrome, single aspect ratio, graded to palette
