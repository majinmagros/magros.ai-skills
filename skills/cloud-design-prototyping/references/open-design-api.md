# Open Design API Reference (Validado via Context7)

## Library: nexu-io/open-design (`/nexu-io/open-design`)

### Installation
```bash
# Via npm (quando publicado)
npm install -g @nexu/open-design

# Ou via source
git clone https://github.com/nexu-io/open-design
cd open-design && npm install && npm run build
```

### CLI Usage
```bash
# Start design session
open-design start

# New project from brief
open-design new --brief "Landing page para produto SaaS"

# Export artifact
open-design export --format html --output ./handoff

# Export multiple formats
open-design export --format pptx,pdf,mp4 --output ./exports

# Brand extraction
open-design brand --input ./figma-screenshot.png --output ./DESIGN.md

# List plugins
open-design plugins list
```

### Workflow 5-Step (Brief → Artifact)

```bash
# 1. Brief
open-design new --brief "Dashboard analytics para e-commerce"

# 2. Direction (escolha interativa)
# → 5 curated directions OU brand extraction

# 3. Design (agent gera arquivos)
# Plugin: dashboard
# Skill: dashboard-analytics
# DESIGN.md bound

# 4. Artifact (preview + edit)
open-design preview  # localhost:3000 canvas

# 5. Handoff
open-design export --format html,pptx --output ./handoff
```

### Plugins Built-in

| Plugin | Deliverable | Skills Compatíveis |
|---|---|---|
| `landing-page` | Hero, features, pricing, testimonials, footer | `frontend-design`, `copywriting` |
| `pitch-deck` | Slides: problem, solution, market, traction, ask | `presentation-design` |
| `dashboard` | Sidebar, header, cards, charts, tables | `dashboard-design`, `data-viz` |
| `social-post` | Instagram/LinkedIn/Twitter templates | `social-design` |
| `pm-spec` | PRD estruturado | `product-spec` |
| `okr-scorecard` | Objectives + Key Results tracking | `okr-tracking` |

### Brand Extraction Pipeline

```bash
# Input: Figma URL, screenshot, ou URL site
open-design brand --input https://figma.com/file/... --output ./DESIGN.md

# Output: DESIGN.md com tokens extraídos
```

**Extração Automática:**
- Cores (primária, secundária, neutras, semânticas)
- Tipografia (heading, body, scale, weights)
- Espaçamento (base, scale)
- Border radius
- Sombras
- Componentes (Button, Card, Input, etc.)

### DESIGN.md Schema (Canonical)

```markdown
# DESIGN.md — [Project] Design System

## Brand
- Logo: [SVG/URL]
- Tagline: "..."
- Voice: [professional | friendly | bold | technical]

## Tokens
### Colors
| Token | Hex | Usage |
|---|---|---|
| --color-primary | #0066CC | CTAs, links, focus |
| --color-secondary | #00D4AA | Success, accents |
| --color-surface | #FFFFFF | Cards, backgrounds |
| --color-text | #1A1A2E | Body text |

### Typography
| Token | Font | Size | Weight | Line-height |
|---|---|---|---|---|
| --font-heading | Inter | clamp(2rem, 5vw, 4rem) | 700 | 1.1 |
| --font-body | Inter | 1rem | 400 | 1.6 |

### Spacing
--space-base: 8px; --space-scale: 0 4 8 16 24 32 48 64;

### Radius
--radius-sm: 4px; --radius-md: 8px; --radius-lg: 16px; --radius-full: 9999px;

### Shadows
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

## Components
### Button
- Variants: primary, secondary, ghost, danger
- Sizes: sm, md, lg
- States: default, hover, focus, disabled, loading

### Card
- Variants: default, elevated, outlined
- Padding: --space-6

### Form Input
- States: default, focus, error, disabled
- Sizes: sm, md, lg

## Patterns
### Layout
- Container: max-width 1200px, padding --space-6
- Grid: 12-col, gap --space-6
- Section: padding-y --space-16

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px
```

### Export Formats

```bash
# HTML/CSS (para engenharia)
open-design export --format html --output ./handoff

# PPTX (pitch deck)
open-design export --format pptx --output ./pitch.pptx

# PDF (specs, docs)
open-design export --format pdf --output ./spec.pdf

# MP4 (walkthrough animado)
open-design export --format mp4 --output ./walkthrough.mp4
```

### Security Model

- **Local-first:** Dados no filesystem (`~/.open-design/`)
- **Loopback-only:** Canvas preview em `localhost:3000` (SSRF guard)
- **BYOK:** Bring Your Own Key — suas API keys
- **Open Design Cloud:** Opcional, pay-per-artifact

### Memory System

```json
// ~/.open-design/memory.json
{
  "screenshots": ["screenshot-1.png", "screenshot-2.png"],
  "fonts": ["Inter", "JetBrains Mono"],
  "palettes": [{"primary": "#0066CC", "secondary": "#00D4AA"}],
  "artifacts": ["landing-page-v1", "dashboard-v2"],
  "defaults": {
    "font": "Inter",
    "palette": "blue-teal",
    "direction": "clean-minimal"
  }
}
```

**Acumulação Inteligente:**
- Screenshots aprovados → defaults visuais
- Fontes usadas → tipografia default
- Paletas confirmadas → cores default
- Artefatos aprovados → templates default

---

## Referências Oficiais

- GitHub: https://github.com/nexu-io/open-design
- Context7 ID: `/nexu-io/open-design`
- Benchmark Score: 74.82
- Source Reputation: High
- README: Workflow completo + security model + cost model