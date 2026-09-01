#!/usr/bin/env node
/**
 * design-direction.ts — Lock visual direction (5 curated ou brand extract).
 * 
 * Uso: npx ts-node scripts/design-direction.ts <projectName>
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, homedir } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const PROJECTS_DIR = join(homedir(), 'cloud-designs');

const CURATED_DIRECTIONS = [
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    description: 'Whitespace generoso, tipografia limpa, 1 cor accent, foco no conteúdo',
    tokens: { primary: '#0066CC', style: 'minimal', radius: 'md' }
  },
  {
    id: 'bold-editorial',
    name: 'Bold Editorial',
    description: 'Tipografia expressiva, contraste alto, hierarquia dramática',
    tokens: { primary: '#1A1A2E', style: 'editorial', radius: 'sm' }
  },
  {
    id: 'tech-futuristic',
    name: 'Tech Futuristic',
    description: 'Dark mode, neon accents, glassmorphism, gradientes',
    tokens: { primary: '#00D4AA', style: 'dark', radius: 'lg' }
  },
  {
    id: 'warm-human',
    name: 'Warm Human',
    description: 'Cores quentes, ilustrações, serif, acolhedor',
    tokens: { primary: '#FF6B35', style: 'warm', radius: 'full' }
  },
  {
    id: 'corporate-trust',
    name: 'Corporate Trust',
    description: 'Azul corporativo, estrutura rígida, profissional',
    tokens: { primary: '#003366', style: 'corporate', radius: 'md' }
  }
];

async function ask(question: string, defaultValue?: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout });
  const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
  const answer = await rl.question(prompt);
  rl.close();
  return answer.trim() || defaultValue || '';
}

async function askChoice(question: string, choices: string[], defaultValue?: string): Promise<string> {
  console.log(`\n${question}`);
  choices.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
  const defaultIdx = defaultValue ? choices.indexOf(defaultValue) + 1 : 1;
  const answer = await ask(`Escolha (1-${choices.length})`, String(defaultIdx));
  const idx = parseInt(answer) - 1;
  return choices[Math.max(0, Math.min(idx, choices.length - 1))];
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Uso: npx ts-node scripts/design-direction.ts <projectName>');
    process.exit(1);
  }

  const projectName = args[0];
  const projectDir = join(homedir(), 'cloud-designs', projectName);

  if (!existsSync(join(projectDir, 'brief.json'))) {
    console.error(`❌ Projeto "${projectName}" não encontrado. Rode design-brief primeiro.`);
    process.exit(1);
  }

  const brief = JSON.parse(readFileSync(join(projectDir, 'brief.json'), 'utf8'));

  console.log(`\n=== VISUAL DIRECTION — ${brief.projectName} ===`);
  console.log(`Produto: ${brief.product} (${brief.type})`);
  console.log(`Objetivo: ${brief.goal}\n`);

  // Verificar se tem brand assets
  const hasBrand = brief.brandAssets && (brief.brandAssets.figmaUrl || brief.brandAssets.screenshot || brief.brandAssets.colors?.length);

  let direction: string;
  let designTokens: any = {};

  if (hasBrand) {
    console.log('🎨 Brand assets detectados. Extrair direction da marca?');
    const useBrand = (await ask('Extrair direction da marca? (s/n)', 's')).toLowerCase() === 's';
    
    if (useBrand) {
      direction = 'brand-extract';
      console.log('\n🔄 Extraindo tokens da marca...');
      console.log('   (Em produção: chamaria API de brand extraction)');
      
      // Simular extração
      designTokens = {
        source: 'brand-extract',
        colors: brief.brandAssets.colors || { primary: '#0066CC' },
        fonts: brief.brandAssets.fonts || ['Inter'],
        style: 'brand'
      };
    } else {
      direction = await askChoice('\nEscolha uma das 5 curated directions:', 
        CURATED_DIRECTIONS.map(d => `${d.id} — ${d.name}: ${d.description}`),
        'clean-minimal'
      );
      const chosen = CURATED_DIRECTIONS.find(d => direction.startsWith(d.id)) || CURATED_DIRECTIONS[0];
      designTokens = { ...chosen.tokens, source: 'curated' };
    }
  } else {
    direction = await askChoice('\nEscolha uma das 5 curated directions:', 
      CURATED_DIRECTIONS.map(d => `${d.id} — ${d.name}: ${d.description}`),
      'clean-minimal'
    );
    const chosen = CURATED_DIRECTIONS.find(d => direction.startsWith(d.id)) || CURATED_DIRECTIONS[0];
    designTokens = { ...chosen.tokens, source: 'curated' };
  }

  // Salvar direction
  const directionData = {
    projectName: brief.projectName,
    direction,
    designTokens,
    briefRef: brief,
    createdAt: new Date().toISOString()
  };

  const directionPath = join(homedir(), 'cloud-designs', brief.projectName, 'direction.json');
  writeFileSync(directionPath, JSON.stringify(directionData, null, 2), 'utf8');

  console.log('\n✅ Direction locked!');
  console.log(`📁 ${direction}`);
  console.log(`🎨 Tokens: ${JSON.stringify(designTokens, null, 2)}`);
  console.log(`\n📄 Salvo em: ${directionPath}`);
  console.log('\nPróximo: npx ts-node scripts/generate-artifact.ts');
}

function ask(question: string, defaultValue?: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout });
  const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
  const answer = await rl.question(prompt);
  rl.close();
  return answer.trim() || defaultValue || '';
}

function askChoice(question: string, choices: string[], defaultValue?: string): Promise<string> {
  console.log(`\n${question}`);
  choices.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
  const defaultIdx = defaultValue ? choices.indexOf(defaultValue) + 1 : 1;
  const answer = ask(`Escolha (1-${choices.length})`, String(defaultIdx));
  const idx = parseInt((answer as any)) - 1;
  return choices[Math.max(0, Math.min(idx, choices.length - 1))];
}

async function main() {
  try {
    await main();
  } catch (err) {
    console.error('Erro:', err);
    process.exit(1);
  }
}

main();