# music-ai-knowledge

Unified knowledge base for AI music production — consolidates the best references from three major open-source skills.

## Sources

| Source | Repo | Focus |
|--------|------|-------|
| **ai-media-generator** | [Hao0321/ai-media-generator](https://github.com/Hao0321/ai-media-generator) | Prompt engineering for Suno, Veo, Kling, Seedance, Runway, Midjourney, Flux, etc. + browser automation |
| **claude-music** | [AgriciDaniel/claude-music](https://github.com/AgriciDaniel/claude-music) | ACE-Step 1.5 local generation (full songs, covers, LoRA, stems, Studio DAW) |
| **varg-ai** | [vargHQ/skills](https://github.com/vargHQ/skills) | Cloud multi-modal (ElevenLabs music/speech, Kling/Seedance/Sora video, Nano Banana/Flux images) |

## Contents

```
music-ai-knowledge/
├── references/
│   ├── ai-media-generator/     # 34 platform-specific prompt guides
│   │   ├── suno.md                    # Suno v5.5 complete guide (Style/Lyrics, Voices, Custom Models, Studio)
│   │   ├── sound-design.md            # 4-layer audio (Dialogue, Ambience, SFX, Soundtrack) for Veo/Sora/Vidu
│   │   ├── model-picker.md            # Decision tree: task → best platform
│   │   ├── selector.md                # Media × purpose × budget → platform
│   │   ├── quality-control.md         # 7 artifact types + fixes
│   │   ├── concept-first-prompting.md # Fix empty/meaningless prompts
│   │   ├── prompt-craft-engine.md     # 6-layer anatomy + 10-point quality gate (≥8 to send)
│   │   ├── cinematic-direction.md     # DP-grade: lighting, lenses, film stock, color grading
│   │   ├── commercial-direction.md    # Brand/MV/advertising prompt patterns
│   │   ├── vfx-effects.md             # Physics, atmosphere, particles
│   │   ├── editing-transitions.md     # Match cut, whip pan, J/L-cut, ASL rhythm
│   │   ├── camera-language.md         # Shot types, movements, lenses
│   │   ├── community-prompt-patterns.md # Platform-specific verified tokens + forbidden
│   │   ├── proven-prompts.md          # 26+ copy-paste ready prompts (Veo, Kling, Seedance, etc.)
│   │   ├── director-style-library.md  # Director/DP signatures (Wes Anderson, Deakins, etc.)
│   │   ├── preset-packs.md            # 30+ style presets (cyberpunk, Ghibli, Nike ad, etc.)
│   │   └── ... (flux.md, kling.md, seedance*.md, veo.md, runway.md, midjourney.md, etc.)
│   ├── claude-music/                  # ACE-Step 1.5 references
│   │   ├── prompt-guide.md            # Caption/lyrics crafting for ACE-Step
│   │   ├── genre-recipes.md           # Genre-specific parameter presets
│   │   ├── music-theory.md            # BPM, key, time sig, song structure
│   │   ├── parameters.md              # All ACE-Step params deep-dive
│   │   ├── post-processing.md         # Mastering, loudnorm, stem separation
│   │   ├── song-structures.md         # Standard/extended/ambient structures
│   │   ├── lora-training.md           # LoRA/LoKr fine-tuning (3-10 songs)
│   │   └── ranking-method.md          # Batch evaluation methodology
│   └── varg-ai/                       # varg cloud references
│       ├── models.md                  # Full model catalog (video, image, speech, music) + pricing
│       ├── prompting.md               # 4D video prompt formula + music prompt tips
│       ├── components.md              # All JSX component props (Render, Clip, Music, etc.)
│       ├── recipes.md                 # Talking head, lipsync, character consistency workflows
│       ├── cloud-render.md            # API render via curl
│       ├── local-render.md            # Bun + ffmpeg local render
│       ├── gateway-api.md             # Single-asset REST API
│       ├── common-errors.md           # Debugging guide
│       └── templates.md               # Complete copy-paste templates
├── templates/
│   ├── preset-packs.md          # 30+ ready prompts (swap placeholders)
│   ├── auto-pilot.md            # One-shot → full production pipeline
│   ├── advanced-recipes.md      # 13 chain workflows (Extend, Persona, Motion Control)
│   ├── asset-library.md         # Reusable character/style/scene cards
│   ├── music-video.md           # BPM-sync, match cut, J-cut templates
│   ├── storyboard.md            # Multi-shot storyboard structure
│   ├── negative-bank.md         # Curated negative prompts per platform
│   ├── user-flags.md            # Natural language → parameter mapping
│   └── token-efficient-mode.md  # 7-layer strategy to avoid context bloat
└── automation/
    ├── click-protocol.md        # Universal browser automation protocol
    ├── site-profiles/           # OiiOii, Kling, Flow, Suno, Midjourney, etc.
    └── browser-guide.md         # High-level flow per site
```

## Quick Start

### For Prompt Engineering (any platform)
```bash
# Need a Suno prompt?
cat references/ai-media-generator/suno.md

# Need to fix plastic/artifact output?
cat references/ai-media-generator/quality-control.md

# Don't know which model to use?
cat references/ai-media-generator/model-picker.md
```

### For Local Generation (ACE-Step / MusicGen)
```bash
# Genre recipes for DnB, ambient, etc.
cat references/claude-music/genre-recipes.md

# Song structure templates
cat references/claude-music/song-structures.md

# Mastering chain
cat references/claude-music/post-processing.md
```

### For Cloud Multi-Modal (varg)
```bash
# Model selection + pricing
cat references/varg-ai/models.md

# Prompting formula
cat references/varg-ai/prompting.md
```

## Installation

### OpenCode / Claude Code
```bash
git clone https://github.com/magros/music-ai-knowledge.git ~/.config/opencode/skills/music-ai-knowledge
```

### Manual
Copy `music-ai-knowledge/` folder to your skills directory.

## Integration

This knowledge base is **platform-agnostic** — use with:
- Your existing `dnb-production` harness (MusicGen on GTX 1650 4GB)
- Suno v5.5 (web/app)
- ACE-Step 1.5 (local, needs 8GB+ VRAM)
- varg.ai (cloud, pay-per-credit)
- Veo 3.1 / Kling / Seedance / Runway (web)
- Any other AI music/video tool

## License

Individual references retain their original licenses (MIT for all three sources).
This consolidation is MIT licensed.