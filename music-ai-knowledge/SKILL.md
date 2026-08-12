---
name: music-ai-knowledge
description: >
  Unified knowledge base for AI music production combining best references from:
  - ai-media-generator (Hao0321): prompt engineering for Suno, Veo, Kling, Seedance, etc.
  - claude-music (AgriciDaniel): ACE-Step 1.5 local generation references
  - varg-ai (vargHQ): cloud multi-modal (music, video, image, speech) references
when_to_use: >
  Use when crafting prompts for any AI music/video platform, need model selection guidance,
  sound design patterns, genre recipes, song structures, post-processing, or LoRA training.
  Load specific reference files on-demand based on task.
license: MIT
metadata:
  author: magros
  version: "1.0.0"
  sources:
    - name: ai-media-generator
      url: https://github.com/Hao0321/ai-media-generator
      license: MIT
    - name: claude-music
      url: https://github.com/AgriciDaniel/claude-music
      license: MIT
    - name: varg-ai
      url: https://github.com/vargHQ/skills
      license: MIT
compatibility: >
  Platform-agnostic reference knowledge. Works with any AI music/video tool:
  local (MusicGen, ACE-Step), cloud (Suno, varg.ai), or web (Veo, Kling, Seedance, Runway).
allowed-tools:
  - Read
  - Glob
  - Grep
---

# music-ai-knowledge — Unified AI Music Production Knowledge Base

## Overview

This skill provides a consolidated, organized reference library for AI music production.
It merges the best documentation from three major open-source skills into a single,
navigable knowledge base that you can query on-demand.

**Total: 62 reference files + 9 templates + 11 automation profiles**

## Structure

```
music-ai-knowledge/
├── references/
│   ├── ai-media-generator/     # 34 platform-specific prompt guides
│   ├── claude-music/           # 8 ACE-Step 1.5 references
│   └── varg-ai/                # 9 varg cloud references
├── templates/                  # 9 ready-to-use prompt templates
├── automation/                 # 11 browser automation profiles
├── SKILL.md                    # This file
├── README.md                   # Human-readable documentation
└── LICENSE                     # MIT license
```

## Quick Reference: Which File to Read

| Task | File |
|------|------|
| **Write Suno v5.5 prompt** | `references/ai-media-generator/suno.md` |
| **Sound design (dialogue/SFX/BGM)** | `references/ai-media-generator/sound-design.md` |
| **Pick best model for task** | `references/ai-media-generator/model-picker.md` |
| **Fix artifacts/plastic look** | `references/ai-media-generator/quality-control.md` |
| **Prompt feels empty/meaningless** | `references/ai-media-generator/concept-first-prompting.md` |
| **Build strong prompt from concept** | `references/ai-media-generator/prompt-craft-engine.md` |
| **Cinematic/DP-grade visuals** | `references/ai-media-generator/cinematic-direction.md` |
| **Commercial/brand/MV style** | `references/ai-media-generator/commercial-direction.md` |
| **VFX/physics/atmosphere** | `references/ai-media-generator/vfx-effects.md` |
| **Editing rhythm/transitions** | `references/ai-media-generator/editing-transitions.md` |
| **Camera language** | `references/ai-media-generator/camera-language.md` |
| **Community-verified tokens** | `references/ai-media-generator/community-prompt-patterns.md` |
| **Proven copy-paste prompts** | `references/ai-media-generator/proven-prompts.md` |
| **30+ style presets** | `templates/preset-packs.md` |
| **Auto-pilot one-shot workflow** | `templates/auto-pilot.md` |
| **Music video (BPM sync)** | `templates/music-video.md` |
| **Director/DP style library** | `references/ai-media-generator/director-style-library.md` |
| **ACE-Step genre recipes** | `references/claude-music/genre-recipes.md` |
| **ACE-Step music theory** | `references/claude-music/music-theory.md` |
| **ACE-Step parameters** | `references/claude-music/parameters.md` |
| **ACE-Step post-processing** | `references/claude-music/post-processing.md` |
| **ACE-Step song structures** | `references/claude-music/song-structures.md` |
| **ACE-Step LoRA training** | `references/claude-music/lora-training.md` |
| **ACE-Step prompt guide** | `references/claude-music/prompt-guide.md` |
| **Varg music model (ElevenLabs)** | `references/varg-ai/models.md` |
| **Varg prompting guide** | `references/varg-ai/prompting.md` |
| **Varg component props** | `references/varg-ai/components.md` |
| **Varg recipes** | `references/varg-ai/recipes.md` |

## Usage Pattern

```python
# 1. Identify your task
# 2. Load the corresponding reference file
# 3. Apply patterns/parameters from reference
# 4. Execute generation on your platform of choice
```

## Integration with DnB Production

Your existing `dnb-production` harness (MusicGen, GTX 1650 4GB) handles local loop generation.
This knowledge base enhances it with:

- **Better prompts** → `prompt-craft-engine.md`, `genre-recipes.md`, `preset-packs.md`
- **Song structure** → `song-structures.md`, `music-theory.md` (DnB: 174 BPM)
- **Post-processing** → `post-processing.md` (mastering, loudnorm, stems)
- **Model selection** → `model-picker.md` (MusicGen vs Suno vs ACE-Step vs Varg)
- **Sound design** → `sound-design.md` (cinematic DnB with dialogue/SFX)
- **LoRA training** → `lora-training.md` (custom DnB style on 3-10 tracks)

## Installation

### OpenCode / Claude Code
```bash
# Clone to skills directory
git clone https://github.com/magros/music-ai-knowledge.git ~/.config/opencode/skills/music-ai-knowledge
# or
git clone https://github.com/magros/music-ai-knowledge.git .opencode/skills/music-ai-knowledge
```

### Manual
Copy `music-ai-knowledge/` folder to your project's knowledge/skills directory.

## Loading References

This skill is **reference-only** — it doesn't execute code.
Load specific files on-demand:

```bash
# In your agent/tool, read the needed file:
cat references/ai-media-generator/suno.md
cat references/claude-music/genre-recipes.md
cat templates/preset-packs.md
```

## Sources & Attribution

All content sourced from three MIT-licensed projects:

| Project | Author | Repo | License |
|---------|--------|------|---------|
| ai-media-generator | Hao0321 | https://github.com/Hao0321/ai-media-generator | MIT |
| claude-music | AgriciDaniel | https://github.com/AgriciDaniel/claude-music | MIT |
| varg-ai | vargHQ | https://github.com/vargHQ/skills | MIT |

This consolidation preserves original licenses. See individual files for source attribution.

## Version History

- **1.0.0** (2026-08-12): Initial consolidation of all three sources