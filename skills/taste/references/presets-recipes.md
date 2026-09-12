# fal.ai Prompt Presets (per mood)

Use with `fal-ai-media`. Each preset is the genre rendered to the project palette. Append
`9:16, vertical, cinematic, film grain, volumetric light, no text, no watermark` to all.

- **Divine void:** "a single molten-gold ember bloom rising in an infinite near-black void,
  deep shadow, one warm light source, weightless dust particles, holy, high contrast"
- **Macro hero:** "extreme macro of an antique brass key / a human eye / interlocking gears,
  centered on pure black negative space, razor-sharp detail, single rim light"
- **Crystalline bloom:** "iridescent violet-cyan-magenta crystalline bokeh, glittering light
  refraction, dreamy lens flares, heavenly glow, soft focus, hyperpop angelcore"
- **Candy-cyber portrait:** "candy-pink-haired figure, glossy chrome accents, bright blue sky,
  Y2K hyperpop, clean gloss, saturated, kawaii-cyber"
- **Winged ascension:** "a winged figure ascending into clouds, halo of light, bone-white and
  gold, volumetric god-rays, ethereal, religious iconography, soft"
- **Cold outro:** "pale crystalline ice structure slowly dissolving, glacial folk, cold blue
  and bone white, minimal, calm, fading to black"

Generate 6–10 per preset, keep 2–3. For motion, animate stills with an image-to-video model
or generate short clips directly; keep camera moves slow per the Motion rules.

# FFmpeg Recipes (cut + reframe)

```bash
# Reframe any landscape/raw clip to 9:16 (center crop)
ffmpeg -i in.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" v.mp4

# Beat-cut a clip to exactly N beats at 138 BPM (e.g. 2 beats = 0.8696s)
ffmpeg -i in.mp4 -t 0.8696 -c copy beat2.mp4

# Concatenate beat-selects into the verse montage
for f in selects/*.mp4; do echo "file '$f'"; done > concat.txt
ffmpeg -f concat -safe 0 -i concat.txt -c copy verse.mp4

# Strip UI chrome / status bar from a screen-recorded reference (crop top+bottom)
ffmpeg -i reel.mp4 -vf "crop=iw:ih-300:0:150" clean.mp4
```

# Remotion Composition Skeleton (beat-synced)

```tsx
import { AbsoluteFill, Sequence, Video, Img, useCurrentFrame, interpolate } from "remotion";

const FPS = 30, BPM = 138;
const beat = (n: number) => Math.round(n * (60 / BPM) * FPS);

const Bloom: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 3, 12], [0, 1, 0], { extrapolateRight: "clamp" }); // divine flash on a transient
  return <AbsoluteFill style={{ background: "radial-gradient(#fff,#ffb24d)", opacity: o, mixBlendMode: "screen" }} />;
};

export const AngelcoreMV: React.FC = () => (
  <AbsoluteFill style={{ background: "#05060a" }}>
    {/* Verse: macro hero-on-black, hard cut every 2 beats */}
    <Sequence from={beat(0)} durationInFrames={beat(2)}><Video src="/selects/key.mp4" /></Sequence>
    <Sequence from={beat(2)} durationInFrames={beat(2)}><Video src="/selects/eye.mp4" /></Sequence>
    <Sequence from={beat(4)} durationInFrames={beat(2)}><Video src="/selects/gear.mp4" /></Sequence>
    {/* Drop: crystalline bloom + flash on the one */}
    <Sequence from={beat(8)} durationInFrames={beat(16)}><Video src="/selects/crystalline.mp4" /></Sequence>
    <Sequence from={beat(8)} durationInFrames={beat(1)}><Bloom /></Sequence>
  </AbsoluteFill>
);
```

Render: `npx remotion render src/index.ts AngelcoreMV out.mp4`. See `remotion-video-creation`
for project setup, audio track binding, and render flags.
