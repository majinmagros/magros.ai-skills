# Video Editing — Pipeline Overview

## Core Thesis

AI video editing is useful when you stop asking it to create the whole video and start using it to compress, structure, and augment real footage. The value is not generation. The value is compression.

## The Pipeline

```
Screen Studio / raw footage
  → Claude / Codex
  → FFmpeg
  → Remotion
  → ElevenLabs / fal.ai
  → Descript or CapCut
```

Each layer has a specific job. Do not skip layers. Do not try to make one tool do everything.

## Layer 1: Capture (Screen Studio / Raw Footage)

Collect the source material:
- **Screen Studio**: polished screen recordings for app demos, coding sessions, browser workflows
- **Raw camera footage**: vlog footage, interviews, event recordings
- **Desktop capture via VideoDB**: session recording with real-time context (see `videodb` skill)

Output: raw files ready for organization.

## Layer 2: Organization (Claude / Codex)

Use Claude Code or Codex to:
- **Transcribe and label**: generate transcript, identify topics and themes
- **Plan structure**: decide what stays, what gets cut, what order works
- **Identify dead sections**: find pauses, tangents, repeated takes
- **Generate edit decision list**: timestamps for cuts, segments to keep
- **Scaffold FFmpeg and Remotion code**: generate the commands and compositions

```
Example prompt:
"Here's the transcript of a 4-hour recording. Identify the 8 strongest segments
for a 24-minute vlog. Give me FFmpeg cut commands for each segment."
```

This layer is about structure, not final creative taste.
