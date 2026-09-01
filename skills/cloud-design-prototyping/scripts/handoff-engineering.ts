#!/usr/bin/env node
/**
 * handoff-engineering.ts — Export artifact para Cursor/Codex/Claude Code.
 * 
 * Uso: npx ts-node scripts/handoff-engineering.ts <projectName> [editor]
 * Editors: cursor, codex, claude-code, all
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from 'node:fs';
import { join, homedir } from 'node:path';

const PROJECTS_DIR = join(homedir(), 'cloud-designs');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Uso: npx ts-node scripts/handoff-engineering.ts <projectName> [cursor|codex|claude-code|all]');
    process.exit(1);
  }

  const projectName = args[0];
  const editor = args[1] || 'all';
  const projectDir = join(homedir(), 'cloud-designs', projectName);

  if (!existsSync(join(projectDir, 'artifact'))) {
    console.error(`❌ Artifact não encontrado. Rode generate-artifact primeiro.`);
    process.exit(1);
  }

  const artifactDir = join(projectDir, 'artifact');
  const handoffDir = join(projectDir, 'handoff');
  if (!existsSync(handoffDir)) mkdirSync(handoffDir, { recursive: true });

  console.log(`\n=== HANDOFF ENGINEERING — ${projectName} ===`);
  console.log(`Target: ${editor}`);

  // Copiar artifact para handoff
  const editorHandoffDir = join(handoffDir, `handoff-${editor}`);
  if (existsSync(editorHandoffDir)) {
    // Limpar se existe
    const { rmSync } = await import('node:fs');
    rmSync(editorHandoffDir, { recursive: true, force: true });
  }
  cpSync(join(projectDir, 'artifact'), editorHandoffDir, { recursive: true });

  // Copiar DESIGN.md
  cpSync(join(projectDir, 'DESIGN.md'), join(editorHandoffDir, 'DESIGN.md'));

  // Criar README de handoff
  const readme = generateHandoffReadme(projectName);
  writeFileSync(join(editorHandoffDir, 'HANDOFF_README.md'), readme, 'utf8');

  // Criar agent template para o editor
  if (editor === 'cursor' || editor === 'all') {
    await createCursorTemplate(editorHandoffDir);
  }
  if (editor === 'codex' || editor === 'all') {
    await createCodexTemplate(editorHandoffDir);
  }
  if (editor === 'claude-code' || editor === 'all') {
    await createClaudeCodeTemplate(editorHandoffDir);
  }

  console.log(`\n✅ Handoff pronto em: ${editorHandoffDir}`);
  console.log('\nPara continuar desenvolvimento:');
  if (editor === 'cursor' || editor === 'all') {
    console.log(`  Cursor: cursor ${editorHandoffDir}`);
  }
  if (editor === 'codex' || editor === 'all') {
    console.log(`  Codex: codex ${editorHandoffDir}`);
  }
  if (editor === 'claude-code' || editor === 'all') {
    console.log(`  Claude Code: cd ${editorHandoffDir} && claude`);
  }
}

function generateHandoffReadme(projectName: string): string {
  return `# ${projectName} — Engineering Handoff

## Overview
Este diretório contém o protótipo pronto para desenvolvimento.
Gerado via Cloud Design / Open Design pipeline.

## Structure
\`\`\`
handoff/
├── index.html              # Entry point
├── design-tokens.css       # CSS variables (ALL tokens)
├── styles.css              # Component styles
├── DESIGN.md               # Design system completo
├── components/             # Modular components
│   ├── Button/
│   ├── Card/
│   ├── Input/
│   └── ...
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── HANDOFF_README.md       # Este arquivo
└── package.json            # Dev dependencies
\`\`\`

## Quick Start

### Cursor
\`\`\`bash
cursor .
# ou
cursor handoff-cursor
\`\`\`

### Codex
\`\`\`bash
codex .
# ou
codex handoff-codex
\`\`\`

### Claude Code
\`\`\`bash
cd handoff-claude-code
claude
\`\`\`

## Design Tokens (CSS Variables)
Todos os tokens estão em \`design-tokens.css\`:
\`\`\`css
:root {
  --color-primary: #0066CC;
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
\`\`\`

## Component Library
Componentes em \`components/\`:
- **Button** — primary, secondary, ghost, danger | sm, md, lg
- **Card** — default, elevated, outlined
- **Input** — sm, md, lg | default, focus, error, disabled

## Dev Server
\`\`\`bash
npm install
npm run dev
# Servidor em http://localhost:3000
\`\`\`

## Design Reference
Ver \`DESIGN.md\` para:
- Brand guidelines
- Color tokens (semantic mapping)
- Typography scale
- Spacing scale
- Component specs (states, variants)
- Responsive patterns
- Accessibility checklist

## Handoff Checklist
- [ ] DESIGN.md completo
- [ ] HTML semântico + WCAG 2.2 AA
- [ ] CSS variables para TODOS tokens
- [ ] Componentes modulares (Button, Card, Input)
- [ ] Responsive testado (mobile, tablet, desktop)
- [ ] Breakpoints documentados
- [ ] States documentados (hover, focus, error, disabled)
- [ ] Assets otimizados (SVG, WebP, fonts subset)
- [ ] README com instruções

## Next Steps
1. Implementar lógica de negócio
2. Conectar APIs/backend
3. Testes (unit, integration, e2e)
4. Deploy (Vercel/Netlify/VPS)
`;

async function createCursorTemplate(dir: string) {
  const agentDir = join(dir, '.cursor');
  const { mkdirSync } = await import('node:fs');
  mkdirSync(join(agentDir, 'agents'), { recursive: true });

  const agent = `---
name: frontend-dev
description: Frontend developer for ${process.argv[2] || 'project'}. Implements UI from DESIGN.md using design tokens.
tools: ["read", "write", "edit", "bash", "web_search"]
model: sonnet
---

# Frontend Developer Agent

Você é um desenvolvedor frontend especializado em implementar UIs a partir de DESIGN.md.

## Stack
- HTML semântico + CSS variables (design-tokens.css)
- Componentes modulares em \`components/\`
- Vanilla JS ou framework leve (Alpine, Vue, React — conforme projeto)

## Workflow
1. Leia \`DESIGN.md\` — entenda tokens, componentes, padrões
2. Implemente páginas em \`index.html\` + \`styles.css\`
3. Crie componentes reutilizáveis em \`components/\`
4. Teste responsivo (mobile, tablet, desktop)
5. Valide acessibilidade (WCAG 2.2 AA)

## Regras
- USE \`design-tokens.css\` variables — NÃO hardcode valores
- Componentes em \`components/\` — reutilizáveis
- Mobile-first, progressive enhancement
- Semantic HTML + ARIA
- Performance: fonts subset, WebP, lazy load

## Comandos Úteis
- \`npm run dev\` — dev server
- \`npm run build\` — build produção
\`\`\`;

  writeFileSync(join(agentDir, 'agents', 'frontend-dev.md'), agent, 'utf8');
  console.log(`  ✅ Cursor template: .cursor/agents/frontend-dev.md`);
}

async function createCodexTemplate(dir: string) {
  const agentDir = join(dir, '.codex');
  const { mkdirSync } = await import('node:fs');
  mkdirSync(join(agentDir, 'agents'), { recursive: true });

  const agent = `---
name: frontend-dev
description: Frontend developer implementing UI from DESIGN.md using design tokens.
instructions: |
  You are a frontend developer implementing UI from DESIGN.md.
  
  Stack:
  - HTML semantic + CSS variables (design-tokens.css)
  - Modular components in components/
  - Vanilla JS or light framework
  
  Rules:
  - USE design-tokens.css variables — NO hardcoded values
  - Components in components/ — reusable
  - Mobile-first, progressive enhancement
  - Semantic HTML + ARIA
  - Performance: fonts subset, WebP, lazy load
  
  Workflow:
  1. Read DESIGN.md — understand tokens, components, patterns
  2. Implement pages in index.html + styles.css
  3. Create reusable components in components/
  4. Test responsive (mobile, tablet, desktop)
  5. Validate accessibility (WCAG 2.2 AA)
tools: ["read", "write", "edit", "bash", "web_search"]
model: gpt-5.6
---

# Frontend Developer Agent

Implements UI from DESIGN.md using design tokens.
`;

  writeFileSync(join(agentDir, 'agents', 'frontend-dev.md'), agent, 'utf8');
  console.log(`  ✅ Codex template: .codex/agents/frontend-dev.md`);
}

async function createClaudeCodeTemplate(dir: string) {
  const agentDir = join(dir, '.claude');
  const { mkdirSync } = await import('node:fs');
  mkdirSync(join(agentDir, 'agents'), { recursive: true });

  const agent = `---
name: frontend-dev
description: Frontend developer for implementing UI from DESIGN.md using design tokens.
tools: ["read", "write", "edit", "bash", "web_search"]
model: sonnet
---

# Frontend Developer Agent

Você é um desenvolvedor frontend implementando UI a partir de DESIGN.md.

## Stack
- HTML semântico + CSS variables (design-tokens.css)
- Componentes modulares em \`components/\`
- Vanilla JS ou framework leve

## Workflow
1. Leia \`DESIGN.md\` — entenda tokens, componentes, padrões
2. Implemente páginas em \`index.html\` + \`styles.css\`
3. Crie componentes reutilizáveis em \`components/\`
4. Teste responsivo (mobile, tablet, desktop)
5. Valide acessibilidade (WCAG 2.2 AA)

## Regras
- USE \`design-tokens.css\` variables — NÃO hardcode valores
- Componentes em \`components/\` — reutilizáveis
- Mobile-first, progressive enhancement
- Semantic HTML + ARIA
- Performance: fonts subset, WebP, lazy load
`;

  writeFileSync(join(agentDir, 'agents', 'frontend-dev.md'), agent, 'utf8');
  console.log(`  ✅ Claude Code template: .claude/agents/frontend-dev.md`);
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});