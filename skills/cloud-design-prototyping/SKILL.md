---
name: cloud-design-prototyping
description: Use when prototyping UIs with AI — Cloud Design (/design command) or Open Design local-first alternative. Covers canvas workflow: 3 style options → interactive edit (manual + prompt) → mobile/desktop preview → artifact sharing → export (HTML/CSS, PPTX, PDF, MP4). Design system via DESIGN.md (Figma/screenshot → tokens). Triggers on "cloud design", "protótipo ia", "design com ia", "/design command", "canvas interativo", "artifact sharing", "open design", "design system tokens", "figma to design.md".
metadata:
  origin: ECC
  module: framework-language
  cost: medium
  stability: beta
  defaultInstall: false
---

# Skill: cloud-design-prototyping — AI Prototyping com Cloud Design / Open Design

Baseado no vídeo do Gustavo Campelo "O comando /design do Cloud Code" + Open Design (nexu-io/open-design, open-source alternative).

## Validação Oficial

| Claim | Status | Fonte |
|---|---|---|
| Cloud Design `/design` command: canvas artboards, interactive edit | ✅ Video Gustavo Campelo (M7ie0MRsmsk) + docs oficiais Week 34 (research preview, CLI+Desktop, Pro/Max/Team/Enterprise, built on artifacts, v2.1.233+) | https://code.claude.com/docs/en/whats-new/2026-w34 + transcrição analisada; re-validado via AI Code King `6m1vJqdsanQ` (2026-09-06) |
| Artifact sharing (shareable links) | ✅ Video + Anthropic Artifacts API | `platform.claude.com/docs/en/api/admin/analytics/artifacts` |
| Mobile/desktop preview | ✅ Video demonstration | Transcrição |
| Open Design: local-first, BYOK, 5 directions, DESIGN.md | ✅ GitHub nexu-io/open-design | Context7 `/nexu-io/open-design` |
| Export: HTML/CSS, PPTX, PDF, MP4 | ✅ Open Design README | Handoff workflow |
| DESIGN.md from Figma/screenshot | ✅ Open Design brand extraction | Brand extraction pipeline |

---

## Quando usar

- "Quero prototipar um site/app com IA"
- "Use o comando /design do Cloud Code"
- "Canvas interativo com 3 opções de estilo"
- "Editar manualmente + prompts no mesmo canvas"
- "Preview mobile/desktop no mesmo fluxo"
- "Compartilhar protótipo via link (artifact sharing)"
- "Exportar para HTML/CSS, PPTX, PDF, MP4"
- "Criar DESIGN.md a partir de Figma/screenshot"
- "Design system tokens (cores, tipografia, spacing)"
- "Handoff para Cursor/Codex/Claude Code"

---

## Pipeline (5 etapas — Open Design workflow)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 1. BRIEF    │───▶│ 2. DIRECTION│───▶│ 3. DESIGN   │───▶│ 4. ARTIFACT │───▶│ 5. HANDOFF  │
│ PM submete  │    │ Lock visual │    │ Skill +     │    │ HTML/CSS    │    │ Engenharia  │
│ brief       │    │ (5 opts ou  │    │ DESIGN.md   │    │ real        │    │ Cursor/     │
│             │    │ brand extract)│   │ bound       │    │ preview     │    │ Codex/Code  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                    │
                                              ┌─────────────────────┘
                                              ▼
                                    ┌─────────────────┐
                                    │   MEMORY        │
                                    │ screenshots,    │
                                    │ fonts, palettes,│
                                    │ artifacts →     │
                                    │ defaults next   │
                                    └─────────────────┘
```

---

## Etapa 1: BRIEF — Input do PM/Designer

**Input:** Brief em linguagem natural ou template

```markdown
# Brief Example
**Tipo:** Landing page / Dashboard / Pitch deck / Social post / PM spec
**Produto:** Máquina de Conteúdo (agente de produção de conteúdo)
**Público:** Empreendedores brasileiros, R$ 97/mês
**Objetivo:** Conversão para assinatura
**Referências:** [URLs screenshots/Figma]
**Constraints:** Mobile-first, acessibilidade, brand Maestros da IA
```

**Templates Built-in (Open Design):**
- Landing page
- Pitch deck  
- Dashboard
- Social post
- PM spec
- OKR scorecard

---

## Etapa 2: DIRECTION — Lock Visual Direction

**Duas opções:**

### A. 5 Curated Directions (sem brand)
```
1. Clean Minimal      → whitespace, tipografia limpa, 1 cor accent
2. Bold Editorial     → tipografia expressiva, contraste alto
3. Tech Futuristic    → dark mode, neon accents, glassmorphism
4. Warm Human         → cores quentes, ilustrações, serif
5. Corporate Trust    → azul corporativo, estrutura rígida
```

### B. Brand Extraction (com brand)
```bash
# Input: screenshot/URL Figma
# Output: DESIGN.md + tokens
{
  "colors": { "primary": "#0066CC", "secondary": "#00D4AA", ... },
  "typography": { "heading": "Inter", "body": "Inter", "scale": 1.25 },
  "spacing": { "base": 8, "scale": [0, 4, 8, 16, 24, 32, 48, 64] },
  "radius": { "sm": 4, "md": 8, "lg": 16, "full": 9999 },
  "shadows": { "sm": "0 1px 2px", "md": "0 4px 6px", "lg": "0 10px 15px" },
  "components": { "button": {...}, "card": {...}, "input": {...} }
}
```

---

## Etapa 3: DESIGN — Skill + DESIGN.md Bound

**Arquitetura:**
```
Plugin (tipo) + Skill (funcional) + DESIGN.md (tokens) → Agent escreve arquivos canônicos
```

**Tipos de Plugin (Open Design):**
| Plugin | Deliverable |
|---|---|
| `landing-page` | Hero, features, pricing, testimonials, footer |
| `pitch-deck` | Slides: problem, solution, market, traction, ask |
| `dashboard` | Sidebar, header, cards, charts, tables |
| `social-post` | Instagram/LinkedIn/Twitter templates |
| `pm-spec` | PRD estruturado |
| `okr-scorecard` | Objectives + Key Results tracking |

**Arquivos Gerados:**
- `index.html` / `page.tsx` — markup semântico, tokens via CSS variables
- `styles.css` / `design-tokens.css` — `:root { --color-primary: ... }`
- `DESIGN.md` — documentação viva do design system
- `components/` — componentes reutilizáveis (Button, Card, Input, etc.)

---

## Etapa 4: ARTIFACT — Preview + Interactive Edit

**Canvas Cloud Design (/design command):**
- 3 opções de estilo apresentadas
- Escolha uma → gera página completa
- **Edição dual:**
  - Manual: clique no texto → edite direto no canvas
  - Prompt: "mude o hero para fundo escuro, aumente o CTA"
- **Preview dual:** Mobile (375px) ↔ Desktop (1440px) toggle
- **Artifact sharing:** Link compartilhável (Anthropic Artifacts API)

**Open Design (local-first):**
- Preview segue filesystem (file watcher)
- Edição via prompts no terminal ou canvas web
- BYOK (Bring Your Own Key) — use sua API key
- Loopback-only, SSRF guard

---

## Etapa 5: HANDOFF — Export & Engineering

**Formatos de Export:**
| Formato | Uso |
|---|---|
| HTML/CSS (pasta) | Handoff para Cursor/Codex/Claude Code — continua como código |
| PPTX | Pitch decks para marketing/stakeholders |
| PDF | Specs, handoff docs, imprimir |
| MP4 | Walkthrough animado do protótipo |

**Handoff para Engenharia:**
```bash
# Open Design CLI
open-design export --format html --output ./handoff
# → ./handoff/index.html, styles.css, components/, DESIGN.md

# Dropar no Cursor/Codex/Claude Code
cursor ./handoff
# Continuar desenvolvendo como código real
```

---

## DESIGN.md — Design System Vivo

**Estrutura:**
```markdown
# DESIGN.md — [Projeto] Design System

## Brand
- Logo: [SVG/URL]
- Tagline: "..."
- Voice: [professional | friendly | bold | technical]

## Tokens
### Colors
| Token | Hex | Uso |
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

---

## Memory — Acúmulo Inteligente

Open Design aprende com uso:
- Screenshots confirmados → defaults visuais
- Fontes usadas → tipografia default
- Paletas confirmadas → cores default
- Artefatos aprovados → templates default
- Menos retrabalho, menos drift entre sessões

---

## Referências

- `references/cloud-design-features.md` — `/design` command details
- `references/open-design-api.md` — CLI, plugins, BYOK
- `references/design-md-spec.md` — DESIGN.md schema completo
- `references/artifact-sharing.md` — Anthropic Artifacts API
- `references/export-formats.md` — HTML/PPTX/PDF/MP4 specs

---

## Scripts

- `scripts/design-brief.ts` — Wizard para capturar brief
- `scripts/design-direction.ts` — Lock direction (5 opts ou brand extract)
- `scripts/generate-artifact.ts` — Plugin + skill + DESIGN.md → artifact
- `scripts/export-artifact.ts` — HTML/PPTX/PDF/MP4 export
- `scripts/extract-design-md.ts` — Figma/screenshot → DESIGN.md tokens
- `scripts/handoff-engineering.ts` — Export para Cursor/Codex