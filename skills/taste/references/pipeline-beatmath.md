# The Pipeline — mixing the ECC video skills

This skill is the conductor. Each ECC skill is an instrument. Do not skip layers.

```
0. TASTE (this skill)        decide genre + mood + grammar BEFORE anything renders
1. STRUCTURE (video-editing) map the song: timestamps for intro/verse/drop/bridge/outro
2. GENERATE (fal-ai-media)   make b-roll per genre prompt-presets; throw away 80%
3. CUT (video-editing/FFmpeg) beat-cut + reframe to 9:16; assemble selects on the grid
4. COMPOSE (remotion-video-creation) overlays, blooms, lyric text, beat-synced sequencing
5. MOTION (motion-* skills)  easing curves, light-leak/particle motion, transition timing
6. AUDIO (fal-ai-media)      transition risers/impacts to sell the cuts (track itself is in Ableton)
7. POLISH                    grade to the palette above, final pacing pass, export
8. DISTRIBUTE (content-engine) platform-native versions + caption/cover
```

| Step | ECC skill to load | What it does here |
|------|-------------------|-------------------|
| Structure & cut | `video-editing` | FFmpeg cut/concat/reframe, EDL, scene/silence detection |
| Generate b-roll | `fal-ai-media` | image/video models per genre preset |
| Compose & overlay | `remotion-video-creation` | beat-synced `<Sequence>`s, text, blooms, masks |
| Motion timing | `motion-foundations`, `motion-patterns`, `motion-advanced`, `motion-ui` | easing, springs, light/particle motion |
| Server-side video | `videodb` | smart reframe, indexing if footage is large |
| Distribution | `content-engine` | per-platform cuts, covers, captions |
| Voice/lyric VO | `video-editing` (ElevenLabs section) | only if a spoken layer is needed |

This skill sits **on top of** `video-editing` (the mechanics) and `remotion-video-creation`
(the renderer). Use those for *how*. Use this for *what and why*.

## Related Skills

- `video-editing` — the mechanical pipeline (FFmpeg, reframe, EDL, polish) this sits on top of
- `remotion-video-creation` — programmable beat-synced composition and rendering
- `fal-ai-media` — generate the b-roll, transition SFX, and risers
- `motion-foundations`, `motion-patterns`, `motion-advanced`, `motion-ui` — easing and motion timing
- `videodb` — server-side smart reframe and indexing for large footage
- `content-engine` — platform-native distribution, covers, captions
- `frontend-design-direction` — the same "decide a direction first" discipline, for UI

# Beat Math (lock cuts to the song)

The current track is **138 BPM, B minor**. Constants:

- `seconds_per_beat = 60 / 138 = 0.43478s`
- `frames_per_beat   = fps × 0.43478`  →  **24fps: 10.43**, **30fps: 13.04**, **60fps: 26.09**
- `1 bar (4 beats)   = 1.7391s`  →  30fps: **52.17 frames**
- `8-bar phrase      = 13.913s`  →  the loop length from the track

In Remotion, snap every `from={}` to a beat:

```ts
const FPS = 30;
const BPM = 138;
const beat = (n: number) => Math.round(n * (60 / BPM) * FPS); // beat(n) → frame
// cut on beats 0,4,8,... :  <Sequence from={beat(0)} durationInFrames={beat(4)}> ...
```

# Beat-Mapped Shot Plan (this music video)

The song arrangement (from the project's own notes) is
**Intro → Verse → Drop → Bridge → Drop → Outro (~2:05)**. Map taste to each section:

| Section | Genre/mood lean | Grammar | Shot ideas |
|---------|-----------------|---------|------------|
| **Intro** | Ethereal/divine, near-black | slow push, no cuts | ember bloom in the void; a single shaft of gold; dust rising |
| **Verse** | Dark + macro hero-on-black | hard cuts every 2 beats | key, eye, gear, water drop, petal — rhythmic macro montage |
| **Drop** | Hyperpop bloom + crystalline | speed-ramp in, cut on the one, fast | candy-pink figure, chrome, iridescent bokeh, winged ascension |
| **Bridge** | Spiritualism, weightless | one long held shot, color-pop | clouds + halo; single red accent punches once |
| **Drop 2** | as Drop, intensify | add divine-flash blooms on transients | wings open, glitter burst, light leaks maxed |
| **Outro** | Glacial folk, cold calm | slow fade to black | crystalline structure dissolving; ember dies out |
