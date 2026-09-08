---
name: video-cut-pipeline
description: "Use when turning raw footage into short vertical cuts: silence removal, layout pass, vertical crop, and reviewable draft for TikTok/Shorts/Reels. Triggers on \"video cut\", \"cut silences\", \"vertical cut\", \"tiktok draft\". Non-triggers: full creative edit with story and effects (use video-editing). Outcome: a repeatable raw-to-draft cut pipeline with timed captions and exportable vertical draft."
metadata:
  origin: ECC
---

# Video Cut Pipeline

Raw footage -> silence cut -> layout -> vertical -> reviewable draft.
Deterministic steps run as scripts; the model only decides cuts and hooks.

## When To Activate

- The user says cut this video, remove silences, make vertical cuts, or
  prepare a TikTok/Shorts/Reels draft.
- Input is a long raw file and output is one or more short vertical drafts.
- Captions need word-level timing for review.
- Cost matters and local transcription is preferred over paid APIs.

## Workflow

1. Ingest: copy the raw file to a work folder, probe duration and audio
   levels, and pick target outputs (one vertical draft per hook).
2. Transcribe local-first: run a local Whisper-class model to get
   word-level timestamps. Use a paid transcription API only when local
   quality fails on the sample.
3. Cut silences: remove gaps above a threshold (start with 0.6s), keep
   natural breaths, and export an edit decision list for review.
4. Select hooks: pick the first 3 seconds per cut from the transcript
   (claim, question, or payoff). One hook = one draft.
5. Layout pass: frame the speaker, place captions in the safe area, and
   lock font size, stroke, and keyword highlight rules.
6. Vertical pass: crop or reframe to 9:16, blur-fill or clean background
   when the source is horizontal, and check safe zones.
7. Draft export: render low-bitrate drafts plus caption files, then a
   side-by-side checklist (audio sync, caption timing, hook strength).
8. Review gate: human picks keep, fix, or drop per draft. Only approved
   drafts go to the final polish step.

## Cost Rule

- Default to local transcription (free on your own machine).
- Paid transcription price seen in the source video (about 0.40 per hour
  for one vendor) is author measurement, not a quote. Check the vendor
  pricing page before promising any number.

## Anti-Patterns

- Cutting by waveform alone with no transcript -> kills context.
- Auto-publishing drafts with no human review.
- Burning paid transcription on every take before testing local quality.
- Hard-coding caption styles per cut instead of one shared layout.
- Cropping to vertical without checking faces and captions.
- Skipping the edit decision list -> no way to audit a bad cut.

## Relations

- `video-editing`: full creative edit; this skill feeds it approved drafts.
- `voice-cloning-local`: local audio models and offline-first approach.
- `pipeline-video-agente`: long-form pipeline; this skill owns the cut stage.
- `autopilot-content-factory`: scheduled posting after drafts are approved.

## Sources

- FFmpeg docs (cut, crop, loudness, captions): https://ffmpeg.org/documentation.html
- Whisper overview (model behavior): https://openai.com/index/whisper/
- ElevenLabs docs (paid transcription option): https://elevenlabs.io/docs
- Tool names and prices from the source video (Palme Air MCP, videose,
  Hyperframes, per-hour transcription cost) are author measurement, not
  verified benchmarks. Confirm against official docs before production use.
