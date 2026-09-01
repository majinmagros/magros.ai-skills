#!/usr/bin/env node
/**
 * export-artifact.ts — Export artifact to HTML/PPTX/PDF/MP4.
 * 
 * Uso: npx ts-node scripts/export-artifact.ts <projectName> [format]
 * Formatos: html, pptx, pdf, mp4, all
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from 'node:fs';
import { join, homedir } from 'node:path';

const PROJECTS_DIR = join(homedir(), 'cloud-designs');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Uso: npx ts-node scripts/export-artifact.ts <projectName> [html|pptx|pdf|mp4|all]');
    process.exit(1);
  }

  const projectName = args[0];
  const format = args[1] || 'all';
  const projectDir = join(homedir(), 'cloud-designs', projectName);

  if (!existsSync(join(projectDir, 'artifact'))) {
    console.error(`❌ Artifact não encontrado. Rode generate-artifact primeiro.`);
    process.exit(1);
  }

  const artifactDir = join(projectDir, 'artifact');
  const exportsDir = join(projectDir, 'exports');
  if (!existsSync(exportsDir)) mkdirSync(exportsDir, { recursive: true });

  console.log(`\n=== EXPORT ARTIFACT — ${projectName} ===`);
  console.log(`Format: ${format}`);

  const formats = format === 'all' ? ['html', 'pptx', 'pdf', 'mp4'] : [format];

  for (const fmt of formats) {
    await exportFormat(fmt, artifactDir, exportsDir, projectName);
  }

  console.log(`\n✅ Export concluído em: ${exportsDir}`);
}

async function exportFormat(fmt: string, artifactDir: string, exportsDir: string, projectName: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outDir = join(exportsDir, `${projectName}-${fmt}-${timestamp}`);

  switch (fmt) {
    case 'html':
      await exportHtml(artifactDir, outDir);
      break;
    case 'pptx':
      await exportPptx(artifactDir, outDir, projectName);
      break;
    case 'pdf':
      await exportPdf(artifactDir, outDir, projectName);
      break;
    case 'mp4':
      await exportMp4(artifactDir, outDir, projectName);
      break;
    default:
      console.log(`  ⚠ Formato desconhecido: ${fmt}`);
  }
}

async function exportHtml(artifactDir: string, outDir: string) {
  mkdirSync(outDir, { recursive: true });
  
  // Copiar artifact para export
  cpSync(artifactDir, outDir, { recursive: true });
  
  // Criar package.json para dev server
  const packageJson = {
    name: "cloud-design-export",
    version: "1.0.0",
    scripts: {
      dev: "npx serve .",
      build: "echo 'Static export — no build needed'",
      preview: "npx serve . -p 3000"
    },
    devDependencies: {
      serve: "^14.2.0"
    }
  };
  
  writeFileSync(join(outDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');
  
  // README
  const readme = `# ${outDir.split('/').pop()}

## HTML/CSS Export — Engineering Handoff

### Quick Start
\`\`\`bash
npm install
npm run dev
# ou
npx serve .
\`\`\`

### Structure
- \`index.html\` — Entry point
- \`design-tokens.css\` — CSS variables (colors, spacing, typography)
- \`styles.css\` — Component styles
- \`DESIGN.md\` — Design system documentation
- \`components/\` — Modular components

### Deploy
- Netlify: \`netlify deploy --dir .\`
- Vercel: \`vercel --prod\`
- GitHub Pages: Push to \`gh-pages\` branch
`;
  
  writeFileSync(join(outDir, 'README.md'), readme, 'utf8');
  console.log(`  ✅ HTML: ${outDir}`);
}

async function exportPptx(artifactDir: string, outDir: string, projectName: string) {
  mkdirSync(outDir, { recursive: true });
  
  // Check for pitch-deck.md
  const pitchDeckPath = join(artifactDir, '..', 'pitch-deck.md');
  let content = '';
  
  if (existsSync(pitchDeckPath)) {
    content = readFileSync(pitchDeckPath, 'utf8');
  } else {
    content = `# ${projectName} — Pitch Deck

## Slide 1: Title
# ${projectName}
## Tagline

---

## Slide 2: Problem

---

## Slide 3: Solution

---

## Slide 4: Demo

---

## Slide 5: Market

---

## Slide 6: Business Model

---

## Slide 7: Traction

---

## Slide 8: Team

---

## Slide 9: Ask

---

## Slide 10: Contact
`;
  }
  
  const pptxPath = join(outDir, `${projectName}-pitch-deck.md`);
  writeFileSync(join(outDir, `${projectName}-pitch-deck.md`), content, 'utf8');
  
  // Instructions for PPTX generation
  const instructions = `# PPTX Generation Instructions

## Option 1: Marp CLI (Markdown → PPTX)
\`\`\`bash
npm install -g @marp-team/marp-cli
marp ${projectName}-pitch-deck.md --pptx --output ${projectName}-pitch-deck.pptx
\`\`\`

## Option 2: Pandoc
\`\`\`bash
pandoc ${projectName}-pitch-deck.md -o ${projectName}-pitch-deck.pptx
\`\`\`

## Option 3: Manual (PowerPoint/Google Slides)
1. Abra este .md no VS Code com extensão Marp
2. Export → PowerPoint
3. Ajuste design tokens (cores, fontes) conforme DESIGN.md

## Design Tokens para aplicar:
- Cores: --color-primary, --color-secondary, etc.
- Fontes: Inter (heading), Inter (body)
- Espaçamento: base 8px, scale 1.25
`;
  
  writeFileSync(join(outDir, 'PPTX_INSTRUCTIONS.md'), instructions, 'utf8');
  console.log(`  ✅ PPTX: ${outDir} (source + instructions)`);
}

async function exportPdf(artifactDir: string, outDir: string, projectName: string) {
  mkdirSync(outDir, { recursive: true });
  
  const specMd = `# ${projectName} — Design Spec (PDF Export)

## Design System
Ver DESIGN.md completo no artifact.

## Tokens Summary
- **Primary:** #0066CC
- **Secondary:** #00D4AA  
- **Surface:** #FFFFFF
- **Text:** #1A1A2E
- **Font:** Inter
- **Spacing:** 8px base, 1.25 scale
- **Radius:** 8px (md), 12px (lg)

## Components
### Button
- Primary: #0066CC / white
- Secondary: transparent / #0066CC border
- Ghost: transparent
- Danger: #EF4444

### Card
- Default: white, border #E2E8F0, shadow-sm
- Elevated: white, shadow-md

### Input
- Default: border #E2E8F0
- Focus: ring #0066CC
- Error: border #EF4444

## Breakpoints
- Mobile: < 640px
- Tablet: 640-1024px
- Desktop: > 1024px

## Accessibility (WCAG 2.2 AA)
- ✅ Color contrast 4.5:1
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ Alt texts
- ✅ Keyboard navigation

## Assets
- Fonts: Inter (subset: latin)
- Icons: SVG (inline)
- Images: WebP + fallback

## Handoff Checklist
- [ ] DESIGN.md completo
- [ ] HTML semântico + acessível
- [ ] CSS variables para todos tokens
- [ ] Componentes modulares
- [ ] Responsive testado
- [ ] Breakpoints documentados
- [ ] States documentados
- [ ] Assets otimizados
`;

  writeFileSync(join(outDir, `${projectName}-spec.md`), specMd, 'utf8');
  
  const instructions = `# PDF Generation Instructions

## Option 1: Pandoc (Markdown → PDF)
\`\`\`bash
pandoc ${projectName}-spec.md -o ${projectName}-spec.pdf \\
  --pdf-engine=weasyprint \\
  --css=design-tokens.css
\`\`\`

## Option 2: WeasyPrint (HTML → PDF)
\`\`\`bash
pip install weasyprint
weasyprint index.html ${projectName}-spec.pdf
\`\`\`

## Option 3: Playwright (Headless Chrome)
\`\`\`bash
npm install playwright
npx playwright install
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://${process.cwd()}/index.html', { waitUntil: 'networkidle' });
  await page.pdf({ path: '${projectName}-spec.pdf', format: 'A4', printBackground: true });
  await browser.close();
})();
\`\`\`

## Option 4: Manual (Browser)
1. Abra index.html no Chrome/Edge
2. Ctrl+P → Save as PDF
3. Options: Background graphics ON, Margins: None
`;

  writeFileSync(join(outDir, 'PDF_INSTRUCTIONS.md'), instructions, 'utf8');
  console.log(`  ✅ PDF: ${outDir} (source + instructions)`);
}

async function exportMp4(artifactDir: string, outDir: string, projectName: string) {
  mkdirSync(outDir, { recursive: true });
  
  const script = `# ${projectName} — Walkthrough Script (MP4)

## Settings
- Duration: 45s
- Resolution: 1920x1080
- FPS: 30
- Transitions: Smooth scroll

## Timeline
| Time | Scene | Action | Notes |
|---|---|---|---|
| 0:00-0:05 | Title | Fade in: ${projectName} | Logo + tagline |
| 0:05-0:15 | Hero | Scroll reveal | Headline + CTA |
| 0:15-0:30 | Features | Hover/tap demo | 3 cards |
| 0:30-0:45 | Mobile | Responsive toggle | Mobile ↔ Desktop |
| 0:45-0:55 | Components | Button states | Hover, focus, disabled |
| 0:55-1:00 | Design Tokens | Palette + typography | Visual |
| 1:00-1:05 | Closing | CTA + contact | Fade out |

## Generation Options

### Option 1: Playwright (Recommended)
\`\`\`bash
npm install playwright
npx playwright install
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Record video
  const context = await browser.newContext({
    recordVideo: { dir: './videos', size: { width: 1920, height: 1080 } }
  });
  const page = await context.newPage();
  
  // Navigate and interact per script
  await page.goto('file://${process.cwd()}/../artifact/index.html');
  
  // ... implement script actions
  
  await context.close();
  await browser.close();
})();
\`\`\`

### Option 2: Remotion (React → Video)
\`\`\`bash
npx create-remotion@latest walkthrough
cd walkthrough
npm run build
\`\`\`

### Option 3: Screen Recording (Manual)
1. OBS Studio / Windows Game Bar / macOS Screenshot
2. Record browser com artifact aberto
3. Edit no DaVinci Resolve / CapCut / Descript

### Option 4: Remotion + Artifact (Advanced)
- Import artifact HTML as Remotion component
- Animate via Remotion timeline
- Render via \`npx remotion render\`
`;

  writeFileSync(join(outDir, 'WALKTHROUGH_SCRIPT.md'), script, 'utf8');
  console.log(`  ✅ MP4: ${outDir} (script + instructions)`);
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});