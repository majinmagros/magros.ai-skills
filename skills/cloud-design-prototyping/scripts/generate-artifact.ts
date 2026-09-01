#!/usr/bin/env node
/**
 * generate-artifact.ts — Plugin + Skill + DESIGN.md → Artifact files.
 * 
 * Uso: npx ts-node scripts/generate-artifact.ts <projectName>
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, homedir } from 'node:path';

const PROJECTS_DIR = join(homedir(), 'cloud-designs');

interface DesignTokens {
  colors: Record<string, string>;
  fonts: string[];
  style: string;
  radius: string;
  source: string;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Uso: npx ts-node scripts/generate-artifact.ts <projectName>');
    process.exit(1);
  }

  const projectName = args[0];
  const projectDir = join(homedir(), 'cloud-designs', projectName);

  // Carregar brief + direction
  const brief = JSON.parse(readFileSync(join(projectDir, 'brief.json'), 'utf8'));
  const direction = JSON.parse(readFileSync(join(projectDir, 'direction.json'), 'utf8'));
  const tokens: DesignTokens = direction.designTokens;

  console.log(`\n=== GENERATE ARTIFACT — ${projectName} ===`);
  console.log(`Type: ${brief.type} | Direction: ${direction.direction}`);

  // Criar DESIGN.md canônico
  const designMd = generateDesignMd(brief, direction.designTokens);
  const designMdPath = join(projectDir, 'DESIGN.md');
  writeFileSync(designMdPath, designMd, 'utf8');
  console.log(`📄 DESIGN.md: ${designMdPath}`);

  // Gerar artifact baseado no tipo
  const artifactDir = join(projectDir, 'artifact');
  if (!existsSync(artifactDir)) mkdirSync(artifactDir, { recursive: true });

  switch (brief.type) {
    case 'landing-page':
      await generateLandingPage(artifactDir, brief, direction.designTokens);
      break;
    case 'dashboard':
      await generateDashboard(artifactDir, brief, direction.designTokens);
      break;
    case 'pitch-deck':
      await generatePitchDeck(artifactDir, brief, direction.designTokens);
      break;
    case 'social-post':
      await generateSocialPost(artifactDir, brief, direction.designTokens);
      break;
    case 'pm-spec':
      await generatePmSpec(artifactDir, brief, direction.designTokens);
      break;
    case 'okr-scorecard':
      await generateOkrScorecard(artifactDir, brief, direction.designTokens);
      break;
    default:
      await generateGeneric(artifactDir, brief, direction.designTokens);
  }

  console.log(`\n✅ Artifact gerado em: ${artifactDir}`);
  console.log('\nPróximos passos:');
  console.log('  1. npx ts-node scripts/export-artifact.ts  # Export HTML/PPTX/PDF/MP4');
  console.log('  2. npx ts-node scripts/handoff-engineering.ts  # Handoff para Cursor/Codex');
}

function generateDesignMd(brief: any, tokens: DesignTokens): string {
  return `# DESIGN.md — ${brief.projectName}

## Brand
- Logo: ${brief.brandAssets.logo || '[pending]'}
- Tagline: "${brief.tagline}"
- Voice: professional

## Colors
| Token | Hex | Usage |
|---|---|---|
| --color-primary | ${tokens.colors.primary || '#0066CC'} | CTAs, links, focus |
| --color-primary-hover | ${adjustColor(tokens.colors.primary || '#0066CC', -20)} | Hover states |
| --color-secondary | ${tokens.colors.secondary || '#00D4AA'} | Success, accents |
| --color-surface | #FFFFFF | Cards, backgrounds |
| --color-text-primary | #1A1A2E | Headings, body |
| --color-border | #E2E8F0 | Dividers, inputs |

## Typography
| Token | Font | Size | Weight |
|---|---|---|---|
| --font-heading | Inter | clamp(2.25rem, 4vw, 3.5rem) | 700 |
| --font-body | Inter | 1rem | 400 |

## Spacing
--space-base: 8px; --space-scale: 1.25;

## Radius
--radius-md: 8px; --radius-lg: 12px;

## Components
### Button
- Variants: primary, secondary, ghost, danger
- Sizes: sm, md, lg

### Card
- Variants: default, elevated, outlined
- Padding: --space-6

## Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
`;
}

function adjustColor(hex: string, percent: number): string {
  // Simple color adjustment (placeholder)
  return hex;
}

async function generateLandingPage(dir: string, brief: any, tokens: DesignTokens) {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brief.product} — ${brief.tagline}</title>
  <link rel="stylesheet" href="design-tokens.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">
    <nav class="nav container">
      <a class="logo" href="#">${brief.product}</a>
      <div class="nav-actions">
        <a class="btn btn-ghost" href="#">Entrar</a>
        <a class="btn btn-primary" href="#">Começar</a>
      </div>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">${brief.tagline}</h1>
        <p class="hero-subtitle">${brief.product} — ${brief.goal}</p>
        <div class="hero-cta">
          <a class="btn btn-primary btn-lg" href="#">Começar grátis</a>
          <a class="btn btn-secondary btn-lg" href="#">Ver demo</a>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2>Por que ${brief.product}?</h2>
        <div class="features-grid">
          <article class="card feature">
            <h3>IA Personalizada</h3>
            <p>Currículo adaptativo ao seu nível e objetivos.</p>
          </article>
          <article class="card feature">
            <h3>Multimodal</h3>
            <p>Texto, áudio, vídeo e diagramas em cada aula.</p>
          </article>
          <article class="card feature">
            <h3>Repetição Espaçada</h3>
            <p>Flashcards + FSRS para fixação de longo prazo.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="pricing">
      <div class="container">
        <h2>Planos</h2>
        <div class="pricing-grid">
          <article class="card pricing-card">
            <h3>Gratuito</h3>
            <div class="price">R$ 0</div>
            <ul>
              <li>5 aulas/mês</li>
              <li>Flashcards básicos</li>
            </ul>
            <a class="btn btn-secondary btn-block" href="#">Começar</a>
          </article>
          <article class="card pricing-card featured">
            <h3>Pro</h3>
            <div class="price">R$ 97<span>/mês</span></div>
            <ul>
              <li>Aulas ilimitadas</li>
              <li>Podcasts + diagramas</li>
              <li>FSRS avançado</li>
              <li>Multi-tutor</li>
            </ul>
            <a class="btn btn-primary btn-block" href="#">Assinar</a>
          </article>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <p>© 2026 ${brief.product}. Todos os direitos reservados.</p>
      </div>
    </footer>
  </body>
</html>`;

  // CSS Files
  const designTokensCss = `:root {
  --color-primary: #0066CC;
  --color-primary-hover: #0052A3;
  --color-secondary: #00D4AA;
  --color-surface: #FFFFFF;
  --color-text-primary: #1A1A2E;
  --color-text-secondary: #64748B;
  --color-border: #E2E8F0;
  --font-heading: clamp(2.25rem, 4vw, 3.5rem);
  --font-body: 1rem;
  --space-base: 8px;
  --radius-md: 8px;
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
}`;

  const stylesCss = `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Inter, system-ui, sans-serif; font-size: var(--font-body); color: var(--color-text-primary); line-height: 1.6; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; transition: all 0.2s; border: none; cursor: pointer; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: #0052A3; }
.btn-secondary { background: transparent; color: var(--color-primary); border: 2px solid var(--color-primary); }
.btn-secondary:hover { background: var(--color-primary); color: white; }
.btn-ghost { background: transparent; color: var(--color-text-primary); }
.btn-lg { padding: 16px 32px; font-size: 1.125rem; }
.btn-block { width: 100%; }
.card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
.header { padding: 16px 0; border-bottom: 1px solid #E2E8F0; }
.nav { display: flex; justify-content: space-between; align-items: center; }
.logo { font-weight: 700; font-size: 1.25rem; color: #1A1A2E; text-decoration: none; }
.nav-actions { display: flex; gap: 12px; }
.hero { padding: 80px 0; text-align: center; }
.hero-title { font-size: clamp(2.25rem, 4vw, 3.5rem); font-weight: 700; margin-bottom: 16px; }
.hero-subtitle { font-size: 1.25rem; color: #64748B; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto; }
.hero-cta { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.features { padding: 80px 0; }
.features h2 { text-align: center; font-size: clamp(1.75rem, 3vw, 2.5rem); margin-bottom: 48px; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.feature h3 { margin-bottom: 8px; }
.pricing { padding: 80px 0; background: #F8FAFC; }
.pricing h2 { text-align: center; font-size: clamp(1.75rem, 3vw, 2.5rem); margin-bottom: 48px; }
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 800px; margin: 0 auto; }
.pricing-card { position: relative; }
.pricing-card.featured { border: 2px solid var(--color-primary); }
.pricing-card h3 { margin-bottom: 16px; }
.price { font-size: 3rem; font-weight: 700; color: #1A1A2E; margin-bottom: 24px; }
.price span { font-size: 1rem; font-weight: 400; color: #64748B; }
.pricing-card ul { list-style: none; margin-bottom: 24px; }
.pricing-card li { padding: 8px 0; display: flex; align-items: center; gap: 8px; }
.pricing-card li::before { content: "✓"; color: #00D4AA; font-weight: bold; }
.footer { padding: 32px 0; border-top: 1px solid #E2E8F0; text-align: center; color: #64748B; }

@media (max-width: 640px) {
  .hero { padding: 48px 0; }
  .hero-cta { flex-direction: column; align-items: center; }
  .nav-actions { display: none; }
}`;

  writeFileSync(join(dir, 'index.html'), html, 'utf8');
  writeFileSync(join(dir, 'design-tokens.css'), designTokensCss, 'utf8');
  writeFileSync(join(dir, 'styles.css'), stylesCss, 'utf8');
  console.log('  📄 index.html, design-tokens.css, styles.css');
}

async function generateDashboard(dir: string, brief: any, tokens: any) {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brief.product} Dashboard</title>
  <link rel="stylesheet" href="design-tokens.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="sidebar-brand">${brief.product}</div>
      <nav class="sidebar-nav">
        <a href="#" class="active">📊 Overview</a>
        <a href="#">📈 Analytics</a>
        <a href="#">👥 Users</a>
        <a href="#">⚙️ Settings</a>
      </nav>
    </aside>
    <main class="main-content">
      <header class="topbar">
        <h1>Dashboard</h1>
        <div class="user-menu">User</div>
      </header>
      <div class="metrics-grid">
        <article class="card metric">
          <h3>Total Users</h3>
          <div class="value">12,345</div>
          <span class="trend up">+12%</span>
        </article>
        <article class="card metric">
          <h3>Revenue</h3>
          <div class="value">R$ 1.2M</div>
          <span class="trend up">+8%</span>
        </article>
        <article class="card metric">
          <h3>Conversion</h3>
          <div class="value">3.2%</div>
          <span class="trend down">-0.5%</span>
        </article>
        <article class="card metric">
          <h3>Churn</h3>
          <div class="value">2.1%</div>
          <span class="trend up">-0.3%</span>
        </article>
      </div>
      <div class="charts-grid">
        <article class="card chart">
          <h3>Revenue Over Time</h3>
          <div class="chart-placeholder">[Chart: Line]</div>
        </article>
        <article class="card chart">
          <h3>User Acquisition</h3>
          <div class="chart-placeholder">[Chart: Bar]</div>
        </article>
      </div>
    </main>
  </div>
</body>
</html>`;

  const designTokensCss = `:root {
  --color-primary: #0066CC;
  --color-surface: #FFFFFF;
  --color-surface-elevated: #F8FAFC;
  --color-text-primary: #1A1A2E;
  --color-border: #E2E8F0;
  --space-base: 8px;
  --radius-md: 8px;
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
}`;

  const stylesCss = `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Inter, system-ui, sans-serif; background: #F1F5F9; }
.dashboard { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
.sidebar { background: white; border-right: 1px solid #E2E8F0; padding: 24px; }
.sidebar-brand { font-weight: 700; font-size: 1.25rem; margin-bottom: 32px; }
.sidebar-nav a { display: block; padding: 12px 16px; border-radius: 8px; color: #64748B; text-decoration: none; margin-bottom: 4px; }
.sidebar-nav a.active { background: #EFF6FF; color: #0066CC; font-weight: 600; }
.main-content { padding: 32px; overflow-y: auto; }
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 32px; }
.metric .value { font-size: 2.5rem; font-weight: 700; margin: 8px 0; }
.trend { font-size: 0.875rem; font-weight: 600; }
.trend.up { color: #10B981; }
.trend.down { color: #EF4444; }
.charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px; }
.chart-placeholder { height: 300px; background: #F8FAFC; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94A3B8; }`;

  writeFileSync(join(dir, 'index.html'), html, 'utf8');
  writeFileSync(join(dir, 'design-tokens.css'), designTokensCss, 'utf8');
  writeFileSync(join(dir, 'styles.css'), stylesCss, 'utf8');
  console.log('  📄 index.html, design-tokens.css, styles.css');
}

async function generatePitchDeck(dir: string, brief: any, tokens: any) {
  const md = `# ${brief.product} — Pitch Deck

## Slide 1: Title
# ${brief.product}
## ${brief.tagline}
${brief.product} — ${brief.goal}

---

## Slide 2: Problem
**Dor:** ${brief.audience} lutam com...
- Ponto 1
- Ponto 2
- Ponto 3

---

## Slide 3: Solution
**${brief.product}** resolve isso através de:
- ✅ Feature 1
- ✅ Feature 2
- ✅ Feature 3

---

## Slide 4: Demo
[Screenshots do protótipo]

---

## Slide 5: Market
- **TAM:** \$X B
- **SAM:** \$Y B  
- **SOM:** \$Z M

---

## Slide 6: Business Model
- Preço: R$ XX/mês
- Modelo: Subscription
- LTV:CAC = 3:1

---

## Slide 7: Traction
- Usuários: X
- Receita: R$ Y/mês
- Crescimento: Z% MoM

---

## Slide 8: Team
- Founder: Nome (Background)
- Advisor: Nome

---

## Slide 9: Ask
- **Investimento:** R$ X
- **Equity:** Y%
- **Uso:** Produto (40%), Marketing (30%), Team (30%)

---

## Slide 10: Contact
- Email: founder@${brief.product.toLowerCase().replace(/\s+/g, '')}.com
- LinkedIn: /in/founder
- Demo: [Link do artifact]
`;

  writeFileSync(join(dir, 'pitch-deck.md'), md, 'utf8');
  console.log('  📄 pitch-deck.md');
}

async function generateSocialPost(dir: string, brief: any, tokens: any) {
  const md = `# ${brief.product} — Social Posts

## LinkedIn
**Headline:** ${brief.tagline}

**Body:**
${brief.product} acaba de lançar — ${brief.goal}.

${brief.audience}, vocês pediram e a gente entregou:
✅ Feature 1
✅ Feature 2
✅ Feature 3

🔗 Link no primeiro comentário

#${brief.product.toLowerCase().replace(/\s+/g, '')} #IA #Inovação

---

## Twitter/X
${brief.tagline} 🚀

${brief.product} agora disponível para ${brief.audience}.

${brief.goal} — finalmente resolvido.

👉 [Link]

#${brief.product.toLowerCase().replace(/\s+/g, '')}

---

## Instagram Carousel
**Slide 1:** ${brief.product} — ${brief.tagline}
**Slide 2:** O problema que ${brief.audience} enfrentam
**Slide 3:** Como ${brief.product} resolve
**Slide 4:** Feature 1 + benefício
**Slide 5:** Feature 2 + benefício
**Slide 6:** Feature 3 + benefício
**Slide 7:** Social proof / números
**Slide 8:** CTA → Link na bio
`;

  writeFileSync(join(dir, 'social-posts.md'), md, 'utf8');
  console.log('  📄 social-posts.md');
}

async function generatePmSpec(dir: string, brief: any, tokens: any) {
  const md = `# ${brief.product} — Product Spec (PM Spec)

## Overview
**Product:** ${brief.product}
**Tagline:** ${brief.tagline}
**Target:** ${brief.audience}
**Goal:** ${brief.goal}
**Type:** ${brief.type}

## Problem Statement
${brief.audience} enfrentam [problema específico]. Soluções atuais falham porque [razões].

## Solution
${brief.product} resolve isso através de [core value prop].

## User Stories
- Como [persona], eu quero [action], para que [benefit].
- Como [persona], eu quero [action], para que [benefit].

## Features (MVP)
| ID | Feature | Priority | Effort | Dependencies |
|---|---|---|---|---|
| F1 | Feature 1 | P0 | M | - |
| F2 | Feature 2 | P1 | L | F1 |
| F3 | Feature 3 | P1 | S | - |

## Success Metrics
- **Primary:** [Metric] — Target: [Value]
- **Secondary:** [Metric] — Target: [Value]

## Design References
- DESIGN.md: ./DESIGN.md
- Prototype: [Artifact link]
- Figma: ${brief.brandAssets.figmaUrl || '[pending]'}

## Constraints
${brief.constraints.map(c => `- ${c}`).join('\n')}

## Timeline
- Design: Semana 1-2
- Dev: Semana 3-6
- QA: Semana 7
- Launch: Semana 8
`;

  writeFileSync(join(dir, 'pm-spec.md'), md, 'utf8');
  console.log('  📄 pm-spec.md');
}

async function generateOkrScorecard(dir: string, brief: any, tokens: any) {
  const md = `# ${brief.product} — OKR Scorecard

## Objective
${brief.goal}

## Key Results
| KR | Metric | Target | Current | Status |
|---|---|---|---|---|
| KR1 | [Metric] | [Target] | [Current] | 🟢/🟡/🔴 |
| KR2 | [Metric] | [Target] | [Current] | 🟢/🟡/🔴 |
| KR3 | [Metric] | [Target] | [Current] | 🟢/🟡/🔴 |

## Initiatives
| Initiative | Owner | Due | KR Link | Status |
|---|---|---|---|---|
| Initiative 1 | [Owner] | [Date] | KR1 | 🟢 Planning |
| Initiative 2 | [Owner] | [Date] | KR2 | 🟡 In Progress |

## Weekly Check-in Template
**Week of [Date]:**
- KR1: [Progress] — [Blockers]
- KR2: [Progress] — [Blockers]
- KR3: [Progress] — [Blockers]

## Retrospective (Quarterly)
- What worked:
- What didn't:
- Adjustments for next quarter:
`;

  writeFileSync(join(dir, 'okr-scorecard.md'), md, 'utf8');
  console.log('  📄 okr-scorecard.md');
}

async function generateGeneric(dir: string, brief: any, tokens: any) {
  const md = `# ${brief.product} — ${brief.type}

## Overview
**Tagline:** ${brief.tagline}
**Audience:** ${brief.audience}
**Goal:** ${brief.goal}

## References
${brief.references.map(r => `- ${r}`).join('\n')}

## Constraints
${brief.constraints.map(c => `- ${c}`).join('\n')}

## Brand Assets
${JSON.stringify(brief.brandAssets, null, 2)}
`;

  writeFileSync(join(dir, `${brief.type}.md`), md, 'utf8');
  console.log(`  📄 ${brief.type}.md`);
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});