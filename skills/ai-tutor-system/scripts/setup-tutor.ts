#!/usr/bin/env node
/**
 * setup-tutor.ts — Wizard interativo para configurar novo tutor IA.
 * 
 * Uso: npx ts-node scripts/setup-tutor.ts
 *      ou: node scripts/setup-tutor.js (após build)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, homedir } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const PROGRESS_DIR = join(homedir(), 'ai-tutors');

interface StudentProfile {
  domain: string;
  goal: string;
  level: 'zero' | 'basic' | 'intermediate' | 'advanced';
  dailyMinutes: number;
  harness: 'cloud-code' | 'codex' | 'antigravity' | 'openrouter';
  model: string;
  ttsModel: string;
  notebooklmEnabled: boolean;
  qwenTtsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

const DOMAINS = [
  'cybersecurity', 'programming', 'python', 'javascript', 'typescript',
  'german', 'english', 'spanish', 'french', 'portuguese',
  'math', 'physics', 'chemistry', 'biology',
  'history', 'philosophy', 'economics',
  'custom'
];

const HARNESSES = ['cloud-code', 'codex', 'antigravity', 'openrouter'] as const;
const LEVELS = ['zero', 'basic', 'intermediate', 'advanced'] as const;

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

async function askNumber(question: string, min: number, max: number, defaultValue: number): Promise<number> {
  while (true) {
    const answer = await ask(question, String(defaultValue));
    const num = parseInt(answer);
    if (!isNaN(num) && num >= min && num <= max) return num;
    console.log(`  → Digite um número entre ${min} e ${max}`);
  }
}

async function main() {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║         AI TUTOR SETUP WIZARD                 ║');
  console.log('║     Configuração de Tutor IA Personalizado    ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  // 1. Domínio
  const domain = await askChoice(
    'Qual domínio você quer aprender?',
    DOMAINS,
    'cybersecurity'
  );

  // 2. Objetivo
  const goal = await ask(
    'Qual seu objetivo? (ex: fundamentos amplos, certificação X, projeto Y)',
    'fundamentos amplos'
  );

  // 3. Nível
  const level = await askChoice(
    'Seu nível atual?',
    LEVELS,
    'zero'
  ) as StudentProfile['level'];

  // 4. Tempo diário
  const dailyMinutes = await askNumber(
    'Quantos minutos por dia?',
    15, 480, 60
  );

  // 5. Harness
  const harness = await askChoice(
    'Qual harness/ferramenta você usa?',
    HARNESSES,
    'cloud-code'
  ) as StudentProfile['harness'];

  // 6. Modelo principal
  const modelDefaults: Record<string, string> = {
    'cloud-code': 'sonnet',
    'codex': 'gpt-5.6',
    'antigravity': 'sonnet',
    'openrouter': 'anthropic/claude-3.5-sonnet'
  };
  const model = await ask(
    'Modelo principal',
    modelDefaults[harness]
  );

  // 7. NotebookLM
  const notebooklmEnabled = (await ask('Habilitar NotebookLM para podcasts/diagramas? (s/n)', 's')).toLowerCase() === 's';

  // 8. Qwen3-TTS
  const qwenTtsEnabled = (await ask('Habilitar Qwen3-TTS para voice clone? (s/n)', 'n')).toLowerCase() === 's';
  const ttsModel = qwenTtsEnabled ? 'qwen3-tts' : 'none';

  // 9. Criar perfil
  const now = new Date().toISOString();
  const profile: StudentProfile = {
    domain,
    goal,
    level,
    dailyMinutes,
    harness,
    model,
    ttsModel,
    notebooklmEnabled,
    qwenTtsEnabled,
    createdAt: now,
    updatedAt: now
  };

  // 10. Salvar
  const domainDir = join(PROGRESS_DIR, domain);
  if (!existsSync(domainDir)) {
    mkdirSync(domainDir, { recursive: true });
    mkdirSync(join(domainDir, 'lessons'), { recursive: true });
    mkdirSync(join(domainDir, 'flashcards'), { recursive: true });
  }

  const configPath = join(domainDir, 'config.json');
  writeFileSync(configPath, JSON.stringify(profile, null, 2), 'utf8');

  // 11. Criar agent template para o harness
  await createAgentTemplate(domain, harness, profile);

  console.log('\n✅ Configuração salva!');
  console.log(`📁 Diretório: ${domainDir}`);
  console.log(`📄 Config: ${configPath}`);
  console.log('\nPróximos passos:');
  console.log('  1. npx ai-tutor curriculum   # Gerar roadmap');
  console.log('  2. npx ai-tutor next         # Próxima aula');
  console.log('  3. npx ai-tutor review       # Revisão agendada');
}

async function createAgentTemplate(domain: string, harness: string, profile: StudentProfile) {
  const templates: Record<string, string> = {
    'cloud-code': `.claude/agents/tutor.md`,
    'codex': `.codex/agents/tutor.md`,
    'antigravity': `.antigravity/agents/tutor.yaml`,
  };

  const templatePath = templates[harness];
  if (!templatePath) return;

  const fullPath = join(process.cwd(), templatePath);
  if (existsSync(fullPath)) {
    console.log(`  ⚠ ${templatePath} já existe, pulando`);
    return;
  }

  let content = '';
  if (harness === 'cloud-code' || harness === 'codex') {
    content = `---
name: tutor
description: AI Tutor para ${domain}. Use quando quiser aprender, praticar com Feynman, ou revisar com spaced repetition.
tools: ["read", "write", "edit", "bash", "web_search"]
model: ${profile.model}
---

# AI Tutor - ${domain}

Você é um tutor IA especializado em ${domain}. Objetivo do aluno: ${profile.goal}.
Nível: ${profile.level} | Tempo/dia: ${profile.dailyMinutes}min | Harness: ${profile.harness}

## Pipeline (6 etapas)
1. **Assessment** → Entender conhecimento prévio
2. **Curriculum** → Roadmap adaptativo (JSON)
3. **Lessons** → Texto + NotebookLM podcast + diagramas
4. **Feynman** → Aluno explica, você valida (similarity > 0.85)
5. **Flashcards** → Anki-Connect + FSRS init
6. **Tracking** → Dashboard + revisões agendadas

## Regras
- NUNCA assuma conhecimento não ensinado
- Concreto antes de abstrato
- Feynman validation obrigatório antes de flashcards
- FSRS para repetição espaçada
- NotebookLM para podcasts quando disponível
`;
  } else if (harness === 'antigravity') {
    content = `name: tutor
description: AI Tutor para ${domain}
model: ${profile.model}
tools:
  - read
  - write
  - edit
  - bash
  - web_search
system_prompt: |
  You are an expert tutor for ${domain}. 
  Student: level=${profile.level}, goal=${profile.goal}, daily_minutes=${profile.dailyMinutes}.
  
  Pipeline:
  1. Assess → 2. Curriculum → 3. Lessons → 4. Feynman → 5. Flashcards (FSRS) → 6. Tracking
  
  Rules:
  - Concrete before abstract
  - Feynman validation required before flashcards
  - FSRS for spaced repetition
  - NotebookLM for podcasts when available
`;
  }

  // Salvar template (criar diretório se necessário)
  const templateDir = join(process.cwd(), templatePath.split('/')[0]);
  if (!existsSync(templateDir)) {
    mkdirSync(templateDir, { recursive: true });
  }
  writeFileSync(fullPath, content, 'utf8');
  console.log(`  ✅ Template criado: ${templatePath}`);
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});