# Export Formats Reference

## Open Design Export Formats

### 1. HTML/CSS (Engineering Handoff)
**Uso:** Handoff para Cursor/Codex/Claude Code — continua como código real

```bash
open-design export --format html --output ./handoff
```

**Output Structure:**
```
handoff/
├── index.html              # Entry point semântico
├── styles.css              # Componentes + layout
├── design-tokens.css       # :root { --color-primary: ... }
├── DESIGN.md               # Design system vivo
├── components/
│   ├── Button/
│   │   ├── Button.html
│   │   ├── Button.css
│   │   └── Button.js       # Interações (opcional)
│   ├── Card/
│   ├── Input/
│   └── ...
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── preview.html            # Standalone preview
└── package.json            # Para dev server (opcional)
```

**index.html Example:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page - Máquina de Conteúdo</title>
  <link rel="stylesheet" href="design-tokens.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">...</header>
  <main class="main">
    <section class="hero">...</section>
    <section class="features">...</section>
    <section class="pricing">...</section>
  </main>
  <footer class="footer">...</footer>
  <script src="app.js"></script>
</body>
</html>
```

**design-tokens.css (Canonical):**
```css
:root {
  --color-primary: #0066CC;
  --color-primary-hover: #0052A3;
  --color-secondary: #00D4AA;
  --color-surface: #FFFFFF;
  --color-text-primary: #1A1A2E;
  --font-heading: clamp(2.25rem, 4vw, 3.5rem);
  --font-body: 1rem;
  --space-base: 8px;
  --radius-md: 8px;
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
}
```

---

### 2. PPTX (Pitch Deck / Apresentação)
**Uso:** Stakeholders, marketing, vendas

```bash
open-design export --format pptx --output ./pitch.pptx
```

**Slide Structure (pitch-deck plugin):**
| Slide | Content |
|---|---|
| 1 | Title: Produto + Tagline |
| 2 | Problem: Dor do cliente |
| 3 | Solution: Produto + Valor |
| 4 | Demo: Screenshots do protótipo |
| 5 | Market: TAM/SAM/SOM |
| 6 | Business Model: Preço, receita |
| 7 | Traction: Métricas, depoimentos |
| 8 | Team: Fundadores, advisors |
| 9 | Ask: Investimento, uso dos recursos |
| 10 | Contact: QR code, links |

**Features:**
- Design tokens aplicados (cores, fontes)
- Imagens do canvas exportadas
- Speaker notes auto-gerados
- Aspect ratio 16:9 (padrão) ou 4:3

---

### 3. PDF (Documentação / Specs)
**Uso:** Handoff docs, specs técnicas, contratos

```bash
open-design export --format pdf --output ./spec.pdf
```

**Content Options:**
| Tipo | Conteúdo |
|---|---|
| `spec` | DESIGN.md completo + screenshots |
| `handoff` | Anotações para engenharia (tokens, componentes, breakpoints) |
| `qa` | Checklist visual + accessibility |
| `brand` | Brand guidelines (logo, cores, tipografia, uso) |

**Features:**
- Design tokens como tabelas
- Screenshots do canvas (mobile + desktop)
- Component specs (Button, Card, Input)
- Accessibility checklist (WCAG 2.2 AA)
- QR code para preview online (se hospedado)

---

### 4. MP4 (Walkthrough Animado)
**Uso:** Demo para stakeholders, onboarding, marketing

```bash
open-design export --format mp4 --output ./walkthrough.mp4
```

**Walkthrough Script (Auto-gerado):**
```
[0:00-0:10] Title screen: Projeto + Tagline
[0:10-0:30] Hero section: Scroll reveal
[0:30-1:00] Features: Hover/tap interactions
[1:00-1:30] Mobile view: Responsive demo
[1:30-2:00] Components: Button states, Card hover
[2:00-2:10] Design tokens: Color palette, Typography
[2:10-2:20] Closing: CTA + Contact
```

**Settings:**
| Config | Default | Options |
|---|---|---|
| Duration | 30-60s | 15-120s |
| Resolution | 1920x1080 | 1280x720, 3840x2160 |
| FPS | 30 | 24, 60 |
| Transitions | Smooth scroll | Cut, fade, slide |
| Audio | None | TTS narration, background music |
| Watermark | Project name | Custom logo, none |

---

## Cloud Design (Anthropic) — Export

### Artifact Link (Native)
```bash
# No Cloud Desktop /design canvas:
# 1. Clique "Share" ou "Copy artifact link"
# 2. URL: https://claude.ai/artifact/abc123...
# 3. Abre no browser — preview interativo completo
```

### Limitations
| Feature | Cloud Design | Open Design |
|---|---|---|
| HTML/CSS export | ❌ (apenas link) | ✅ |
| PPTX export | ❌ | ✅ |
| PDF export | ❌ | ✅ |
| MP4 export | ❌ | ✅ |
| Design tokens export | ❌ | ✅ (DESIGN.md) |
| Local preview | ❌ (cloud only) | ✅ (localhost) |
| Self-host | ❌ | ✅ |

---

## Handoff para Engenharia (Best Practices)

### Cursor/Codex/Claude Code
```bash
# 1. Export Open Design
open-design export --format html --output ./handoff

# 2. Abrir no editor
cursor ./handoff
# ou
codex ./handoff

# 3. Continuar desenvolvimento
# - Componentes já estruturados
# - Design tokens em CSS variables
# - DESIGN.md como referência
```

### Checklist de Handoff
- [ ] DESIGN.md completo (tokens, componentes, padrões)
- [ ] HTML semântico + acessível (WCAG 2.2 AA)
- [ ] CSS variables para todos os tokens
- [ ] Componentes modulares (Button, Card, Input)
- [ ] Responsive testado (mobile, tablet, desktop)
- [ ] Breakpoints documentados
- [ ] States documentados (hover, focus, error, disabled)
- [ ] Assets otimizados (SVG, WebP, fonts subset)
- [ ] README com instruções de dev
- [ ] Package.json com scripts (dev, build, preview)

---

## Referências

- Open Design Export: https://github.com/nexu-io/open-design/blob/main/README.md
- Cloud Design Video: Gustavo Campelo "O comando /design do Cloud Code" (M7ie0MRsmsk)
- Anthropic Artifacts: `platform.claude.com/docs/en/api/admin/analytics/artifacts`