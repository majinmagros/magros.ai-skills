---
name: gemini-notebook-video
description: Produce automated YouTube videos (Audio/Video Overviews) using Google's Gemini Notebook (formerly NotebookLM). Covers topic mining, notebook setup, source curation, steering prompts, visual styles, quota management, and export pipeline. Triggers: "gemini notebook video", "notebooklm video", "automated youtube video", "audio overview", "video overview".
---

# Gemini Notebook Video Production

End-to-end workflow: topic → curated sources → notebook → Audio/Video Overview → export → YouTube packaging.

## When to Use

After you have a niche/topic and want to produce a faceless, AI-generated educational video using Gemini Notebook's Studio panel. Works for long-form (Explainer), Short (60s vertical), and Audio Overview (podcast).

## Prerequisites

- Google account with access to notebook.google.com (Gemini Notebook)
- Topic defined + 3–5 high-quality source URLs (YouTube, PDFs, articles)
- Optional: brand visual style prompt, steering prompt, narration language

## Workflow

### 1. Topic Mining (Evidence-Based)
Do NOT ask an LLM "what's viral". Instead:
- Pull real view counts from competitor channels (`yt-dlp --flat-playlist --print "%(view_count)s|%(id)s|%(title)s" <channel_url>`)
- Calculate outliers: views ÷ channel average
- Pick 3–5 specific videos/documents as sources
- Save source list with view counts as evidence

### 2. Notebook Setup
1. Open `https://notebook.google.com`
2. Create new notebook → name: `niche-topic-YYYYMMDD`
3. Add sources (max 50 on free tier, 300 on Pro):
   - Paste YouTube URLs directly (auto-transcribes)
   - Upload PDFs / paste text / Google Docs
4. Verify each source shows green check (processed)

### 3. Steering Prompt (Focus)
In Studio → Video Overview → Customize → Steering Prompt, paste a focused brief. Template:
```
Foque em [TEMA CENTRAL]. Público: [INICIANTE/INTERMEDIÁRIO/ESPECIALISTA].
Estrutura obrigatória: (1) Gancho com problema real, (2) 3 pontos práticos com exemplos das fontes, (3) Erro comum, (4) Próximo passo acionável.
Tom: [CONVERSACIONAL / TÉCNICO / DOCUMENTÁRIO]. Sem introdução genérica "hoje vamos falar".
Idioma: Português do Brasil.
```

### 4. Format & Visual Style
| Format | Best For | Language Support | Length |
|--------|----------|------------------|--------|
| Explainer | Long-form horizontal (16:9) | 80+ langs | 5–15 min |
| Short | Vertical Shorts/Reels/TikTok | English mainly* | ~60s fixed |
| Cinematic | Animated story | English only | 1–3 min |

\*Short is rolling out to other languages gradually.

**Custom Visual Style** (Studio → Video Overview → Visual Style → Custom). Paste one:
- **Cyber-Minimalist:** `Minimalist dark-mode tech aesthetic, pitch black background, clean thin typography, subtle cybernetic grid lines, glowing cyan and electric green vector accents for data connections, sleek corporate technology documentary style, 4k resolution.`
- **Sci-Fi Lab:** `Advanced scientific sci-fi documentary style, deep navy blue and titanium gray color palette with industrial orange highlights, translucent holographic HUD interfaces, wireframe physics simulations, clean academic tech aesthetic.`
- **Neural Matrix:** `Immersive neural network visualization, floating data particles, deep violet, magenta and electric blue neon gradients, abstract latent space representations, high-tech futurism, sleek generative AI aesthetics.`

### 5. Audio Overview (Podcast)
Studio → Audio Overview → Customize:
- Format: Deep Dive (default) or Custom
- Language: Portuguese (80+ supported)
- Length: Shorter / Default / Longer (English only for Longer)
- Custom prompt: same steering prompt logic above

### 6. Generate & Monitor
- Click **Generate** → runs in background (can take 5–30+ min)
- Close browser safely; processing continues server-side
- Check Studio panel later for player + download button
- If quota exhausted: use **Generate Later** (queues for next 5h refresh)

### 7. Export & Package
1. Download video/audio from player (Share → Download)
2. Run `youtube-packaging` skill: 3 titles + 3 thumbs + description + timestamps + link page
3. Publish manually (gate) until zero corrections for N episodes

## Quota Management (Free Tier = Standard)

| Resource | Free Limit |
|----------|------------|
| Notebooks | 100 per user |
| Sources/Notebook | 50 |
| AI Budget | Unified compute budget, refreshes every 5h, weekly cap |
| Video Overview | Heavy consumer → ~2–3/day practical |
| Audio Overview | Lighter → ~5–8/day practical |

**Tips:**
- Keep sources ≤5 per notebook (better synthesis, less compute)
- Generate Audio first (cheaper), then Video if Audio passes review
- Use "Generate Later" when budget low
- Upgrade to AI Pro (4× budget) for daily production

## Copyright & Monetization Guardrails

- **Source ≠ Content:** Using a video as *research source* is fair use; re-uploading its content is not.
- **YouTube "Reused Content" Policy:** 100% AI-generated from others' sources risks demonetization.
- **Add Your Layer:** Curate, opine, compare, add personal case study, contradict sources. That layer = monetizable originality.

## Related Skills

- `youtube-packaging` — 3×3 titles/thumbs, description, link page
- `video-cut-pipeline` — if you need to edit raw footage instead
- `content-engine` — repurpose into posts, carousels, shorts
- `analise-concorrentes` — topic mining with Ads Library + view data