---
name: hyperframes-codex-video
description: "Use when editing video with an AI coding agent (Codex, Claude Code) through Hyperframes HTML-to-video: transcript-first beats, HTML/CSS/JS motion graphics, Studio preview, screenshot verify loop. Triggers on \"hyperframes\", \"codex edit video\", \"html to video\", \"motion graphics with ai\", \"transcript beats\". Non-triggers: React-based programmatic video (use remotion-video-creation); raw silence-cut only (use video-cut-pipeline). Outcome: a rendered MP4 plus a reusable skill that repeats the style."
metadata:
  origin: ECC
---

# Hyperframes Codex Video

Edit video by vibe-coding: the agent writes HTML/CSS/JS, Hyperframes renders
deterministic MP4 (same input = identical output). Source: Nate Herk
`o3IEkKXXXvo` (transcript in local YT_DIR, `@nateherk`).

## When To Activate

- The user says edit this video with Codex/Claude, add motion graphics,
  animate this reel, or turn footage into a polished edit.
- Output is YouTube 16:9, reel/Shorts 9:16, or an ad with B-roll and captions.
- There is footage to start from, or a rough outline for motion-only pieces.
- Repeatable style matters more than one-off manual timeline work.

## Non-Triggers

- React/Remotion stack -> use `remotion-video-creation`.
- Only cutting silences and making a vertical draft -> `video-cut-pipeline`.
- Paper-collage narrated explainer -> `vox-style-video`.

## Setup (once per project)

1. Open a local project folder in the coding agent (Codex desktop app works).
2. Pull the framework repo and install deps, then run the doctor check:
   `npx hyperframes doctor` (requires Node.js >= 22 and FFmpeg).
   Official install for agents: `npx skills add heygen-com/hyperframes`.
3. Transcription provider: create an API key scoped to speech-to-text and
   store it in `.env` (never commit it). Local Whisper-class models are the
   free fallback when paid quality is not needed on the sample.
4. Record the choice as a living rule in `AGENTS.md`, e.g.
   "whenever transcribing video in this project, use provider X".
   The agent reads this file every session, so the rule compounds.

## Workflow (the loop)

1. Transcribe first: word-level text with millisecond timestamps. Every
   animation, caption, and cut syncs to this transcript. No transcript,
   no motion pass.
2. Cut second: remove mistakes, stutters, and dead space (start with gaps
   above ~0.5s for fast-paced edits). A 14-minute raw can become 9 minutes
   before any graphics exist.
3. Plan beats: one beat = one scene. Have the model read the transcript,
   infer intent per section, and list beats with their on-screen plan
   (layout, music, SFX). Beats drive everything downstream.
4. Generate motion: the agent writes plain HTML files with data attributes
   plus a JS animation runtime (GSAP, CSS, Lottie, Three.js). Face-cam goes
   in rounded crops with drop shadow; captions sit in the lower third with
   word-level highlight; B-roll is collected or AI-generated per beat.
5. Verify loop: render, screenshot scenes, re-read the transcript, check
   sync, bounds, and readability. Loop generate -> verify until the agent
   reports confidence. Never ship version one unreviewed.
6. Studio tweak: open Hyperframes Studio (localhost preview with hot reload)
   for small manual fixes (text size, position) instead of re-prompting
   a full render on long videos.

## Skill-ify (the compounding step)

- The first edit uses one big explicit prompt (style, timing, layouts).
- When the output is good, tell the agent: "turn that into a skill".
  Next time the prompt shrinks to "edit this video, use this skill".
- Each round of feedback ("do X next time") updates the skill file.
  This is the `self-improving-skill` pattern applied to video.

## Hooks and Retention

- First 2 seconds need a dedicated hook (animated text or motion, never
  covering the speaker's face). Open loops ("three missing pieces...")
  keep Shorts retention; switch scenes every 1-2 seconds.
- For ads: pull real context (past videos, logos from Drive, event assets)
  so the piece feels specific, not theoretical.

## Cost Rule

- Default to local transcription; pay only when speed or quality on the
  sample justifies it. Vendor prices seen in source videos are author
  measurements, not quotes. Check the vendor pricing page first.
- Rendering is local (headless browser + FFmpeg); the expensive part is
  model tokens during the generate -> verify loop, so converge beats
  before generating.

## Anti-Patterns

- Generating motion before transcribing -> nothing syncs.
- Shipping the first render with no screenshot verify pass.
- Overlapping 3D layers with broken physics (fan clips behind each other,
  never cutting through).
- Committing `.env` with API keys; hard-coding brand hex values inside
  compositions instead of one shared theme.
- Full-screen cutaways laid over the speaker's face.

## Relations

- `remotion-video-creation`: same job on the React motor; pick one motor
  per project, never mix.
- `video-cut-pipeline`: owns transcribe + cut; this skill consumes its
  output and adds beats + motion.
- `vox-style-video`: word-sync discipline for narrated explainers.
- `goal`: goal-driven loop prompts for multi-pass renders.
- `self-improving-skill`: the prompt -> skill -> iterate mechanism.
- `ui-demo`: screen-capture verification sibling.

## Sources

- Framework (open source, site declares Apache 2.0 - confirm LICENSE in
  the repo before redistributing):
  https://github.com/hyperframes/hyperframes
- Docs: https://hyperframes.heygen.com
- Student kit (free teaching repo: 14 skills, transcript-driven cuts,
  motion-graphics cards, templates - own LICENSE, check before reuse):
  https://github.com/nateherkai/hyperframes-student-kit

## Exemplo

```text
Projeto local + npx hyperframes doctor OK + AGENTS.md: "transcribe via provider X"
Bruto 65s -> transcript (ms) -> cut 28s -> 6 beats -> HTML+GSAP (liquid-glass cards)
Studio: texto 80px, fan 3D sem overlap -> verify screenshots OK -> render MP4
"Turn that into a skill" -> proxima edicao: "edit this video, use this skill"
```
