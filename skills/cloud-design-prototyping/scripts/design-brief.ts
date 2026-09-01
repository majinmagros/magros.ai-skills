#!/usr/bin/env node
/**
 * design-brief.ts — Wizard para capturar brief de design.
 * 
 * Uso: npx ts-node scripts/design-brief.ts
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, homedir } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const PROGRESS_DIR = join(homedir(), 'cloud-designs');

interface DesignBrief {
  projectName: string;
  type: 'landing-page' | 'pitch-deck' | 'dashboard' | 'social-post' | 'pm-spec' | 'okr-scorecard' | 'custom';
  product: string;
  tagline: string;
  audience: string;
  goal: string;
  references: string[];
  constraints: string[];
  brandAssets: {
    logo?: string;
    figmaUrl?: string;
    screenshot?: string;
    colors?: string[];
    fonts?: string[];
  };
  createdAt: string;
}

const PROJECT_TYPES = [
  'landing-page',
  'pitch-deck', 
  'dashboard',
  'social-post',
  'pm-spec',
  'okr-scorecard',
  'custom'
] as const;

async function ask(question: string, defaultValue?: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout });
  const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
  const answer = await rl.question(prompt);
  rl.close();
  return answer.trim() || defaultValue || '';
}

async function askMulti(question: string): Promise<string[]> {
  console.log(`${question} (linha vazia para finalizar):`);
  const items: string[] = [];
  while (true) {
    const item = await ask(`  ${items.length + 1}.`);
    if (!item) break;
    items.push(item);
  }
  return items;
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
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║         CLOUD DESIGN BRIEF WIZARD             ║');
  console.log('║     Captura de Brief para Protótipo IA        ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  // 1. Nome do projeto
  const projectName = await ask('Nome do projeto', 'meu-prototipo');

  // 2. Tipo
  const type = await askChoice(
    'Tipo de entregável:',
    PROJECT_TYPES,
    'landing-page'
  ) as DesignBrief['type'];

  // 3. Produto
  const product = await ask('Nome do produto/serviço', 'Máquina de Conteúdo');

  // 4. Tagline
  const tagline = await ask('Tagline (uma frase)', 'Sua universidade de IA pessoal');

  // 5. Público
  const audience = await ask('Público-alvo', 'Empreendedores brasileiros');

  // 6. Objetivo
  const goal = await ask('Objetivo principal (conversão, engajamento, educar...)', 'Conversão para assinatura R$ 97/mês');

  // 6. Referências
  console.log('\nReferências visuais (URLs Figma, sites, screenshots):');
  const references = await askMulti('  URL/descrição');

  // 7. Constraints
  console.log('\nConstraints (mobile-first, acessibilidade, brand guidelines...):');
  const constraints = await askMulti('  Constraint');

  // 8. Brand Assets
  console.log('\nAssets de marca (opcional):');
  const logo = await ask('  Logo (URL/path)', '');
  const figmaUrl = await ask('  Figma URL', '');
  const screenshot = await ask('  Screenshot (URL/path)', '');
  const colors = await askMulti('  Cores da marca (hex, vazio para pular)');
  const fonts = await askMulti('  Fontes da marca (vazio para pular)');

  // 9. Criar brief
  const brief: DesignBrief = {
    projectName,
    type,
    product,
    tagline,
    audience,
    goal,
    references,
    constraints,
    brandAssets: {
      logo: logo || undefined,
      figmaUrl: figmaUrl || undefined,
      screenshot: screenshot || undefined,
      colors: colors.length ? colors : undefined,
      fonts: fonts.length ? fonts : undefined
    },
    createdAt: new Date().toISOString()
  };

  // 10. Salvar
  const projectDir = join(homedir(), 'cloud-designs', projectName);
  if (!existsSync(projectDir)) {
    mkdirSync(projectDir, { recursive: true });
    mkdirSync(join(projectDir, 'exports'), { recursive: true });
  }

  const briefPath = join(projectDir, 'brief.json');
  writeFileSync(briefPath, JSON.stringify(brief, null, 2), 'utf8');

  console.log('\n✅ Brief salvo!');
  console.log(`📁 Projeto: ${projectDir}`);
  console.log(`📄 Brief: ${briefPath}`);
  console.log('\nPróximos passos:');
  console.log('  1. npx ts-node scripts/design-direction.ts   # Lock visual direction');
  console.log('  2. npx ts-node scripts/generate-artifact.ts  # Gerar artifact');
  console.log('  3. npx ts-node scripts/export-artifact.ts    # Export HTML/PPTX/PDF/MP4');
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});