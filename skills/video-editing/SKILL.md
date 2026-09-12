---
name: video-editing
description: "Use when editing, cutting, or structuring real video footage into vlogs, tutorials, or short-form content. Triggers on \"video-editing\", \"edit video\", \"cut footage\"."
metadata:
  origin: ECC
---

# Video Editing

AI-assisted editing for real footage (not generation): compress, structure, augment. Detalhes em `references/`.

## When to Activate

- User wants to edit, cut, or structure video footage
- Turning long recordings into short-form content
- Building vlogs, tutorials, or demo videos from raw capture
- Adding overlays, subtitles, music, or voiceover to existing video
- Reframing video for different platforms (YouTube, TikTok, Instagram)
- User says "edit video", "cut this footage", "make a vlog", or "video workflow"

## Core Principles

1. **Edit, don't generate** — cut real footage, never create from prompts
2. **Structure before style** — story right (Layer 2) before anything visual
3. **FFmpeg is the backbone** — deterministic cuts, batch, concat, proxies
4. **Remotion for repeatability** — overlays and templates as code
5. **Taste is the last layer** — AI clears repetitive work, you finish

## Example

```bash
ffmpeg -i raw.mp4 -ss 00:12:30 -to 00:15:45 -c copy segment_01.mp4
```

## References

- `references/pipeline.md` — thesis, 6-layer pipeline, capture + organization
- `references/ffmpeg-cuts.md` — cut, batch, concat, proxy, audio extract/normalize
- `references/remotion-composition.md` — overlays, VlogComposition, render
- `references/generated-assets.md` — ElevenLabs voiceover, fal.ai music/visuals, VideoDB audio
- `references/polish-delivery.md` — Descript/CapCut polish, reframing, scene/silence detect, principles

## Checklist

- [ ] Edit decision list (timestamps) done before any visual work
- [ ] Cuts via FFmpeg (`-c copy`); proxies for heavy source files
- [ ] Overlays/templates as Remotion components, not manual edits
- [ ] AI generation only for missing assets (voiceover, music, b-roll)
- [ ] Reframed per platform (16:9 / 9:16 / 1:1) with human final polish
