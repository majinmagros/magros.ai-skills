#!/usr/bin/env node
/**
 * create-flashcards.ts — Cria flashcards no Anki via Anki-Connect + inicializa FSRS.
 * 
 * Uso: npx ts-node scripts/create-flashcards.ts <domain> <lessonId> <concepts.json>
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, homedir } from 'node:path';
import { createEmptyCard } from 'ts-fsrs';

const PROGRESS_DIR = join(homedir(), 'ai-tutors');
const ANKI_CONNECT_URL = process.env.ANKI_CONNECT_URL || 'http://localhost:8765';

interface Concept {
  id: string;
  question: string;
  answer: string;
  analogy?: string;
  tags?: string[];
}

interface FSRSState {
  [conceptId: string]: {
    due: string;
    stability: number;
    difficulty: number;
    elapsed_days: number;
    reps: number;
    state: number; // 0=New, 1=Learning, 2=Review, 3=Relearning
    last_review: string | null;
  };
}

async function ankiRequest(action: string, params: any): Promise<any> {
  const res = await fetch(ANKI_CONNECT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, version: 6, params })
  });
  const data = await res.json();
  if (data.error) throw new Error(`Anki-Connect error: ${data.error}`);
  return data.result;
}

async function ensureDeck(deckName: string): Promise<void> {
  await ankiRequest('createDeck', { deck: deckName });
}

async function addNotes(notes: any[]): Promise<number[]> {
  const result = await ankiRequest('addNotes', { notes });
  return result;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error('Uso: npx ts-node scripts/create-flashcards.ts <domain> <lessonId> <concepts.json>');
    console.error('Exemplo: npx ts-node scripts/create-flashcards.ts cybersecurity 01 concepts.json');
    process.exit(1);
  }

  const [domain, lessonId, conceptsFile] = args;
  const domainDir = join(homedir(), 'ai-tutors', domain);

  if (!existsSync(join(domainDir, 'config.json'))) {
    console.error(`❌ Domínio "${domain}" não configurado.`);
    process.exit(1);
  }

  // Ler conceitos
  const concepts: Concept[] = JSON.parse(readFileSync(conceptsFile, 'utf8'));
  if (!concepts.length) {
    console.error('❌ Nenhum conceito no arquivo.');
    process.exit(1);
  }

  // Config do domínio
  const config = JSON.parse(readFileSync(join(domainDir, 'config.json'), 'utf8'));
  const deckName = `AI-Tutor::${domain}::${lessonId}`;

  // Carregar estado FSRS existente
  const fsrsPath = join(domainDir, 'flashcards', 'fsrs-state.json');
  let fsrsState: FSRSState = {};
  if (existsSync(fsrsPath)) {
    fsrsState = JSON.parse(readFileSync(fsrsPath, 'utf8'));
  }

  // Garantir deck
  await ensureDeck(deckName);
  console.log(`📁 Deck: ${deckName}`);

  // Preparar notas para Anki
  const ankiNotes = concepts.map(concept => {
    const front = concept.question;
    const back = `${concept.answer}\n\n${concept.analogy ? `Analogia: ${concept.analogy}` : ''}`;
    const tags = ['ai-tutor', domain, lessonId, ...(concept.tags || [])];

    return {
      deckName,
      modelName: 'Basic (and reversed)',
      fields: { Front: front, Back: back },
      tags,
      options: { allowDuplicate: false, duplicateScope: 'deck' }
    };
  });

  // Enviar para Anki
  console.log(`📤 Enviando ${ankiNotes.length} flashcards para Anki...`);
  const noteIds = await addNotes(ankiNotes);
  
  const successCount = noteIds.filter(id => id !== null).length;
  console.log(`✅ ${successCount}/${ankiNotes.length} cards criados no Anki`);

  // Inicializar FSRS para cada conceito
  console.log('🧠 Inicializando FSRS...');
  for (let i = 0; i < concepts.length; i++) {
    const concept = concepts[i];
    const noteId = noteIds[i];
    
    if (noteId === null) {
      console.log(`  ⚠ ${concept.id}: falha ao criar no Anki, pulando FSRS`);
      continue;
    }

    // Verificar se já existe
    if (fsrsState[concept.id]) {
      console.log(`  ⏭ ${concept.id}: já existe no FSRS`);
      continue;
    }

    // Criar card FSRS vazio
    const card = createEmptyCard();
    fsrsState[concept.id] = {
      due: card.due.toISOString(),
      stability: card.stability,
      difficulty: card.difficulty,
      elapsed_days: card.elapsed_days,
      reps: card.reps,
      state: card.state,
      last_review: null
    };
    console.log(`  🆕 ${concept.id}: FSRS inicializado (due: ${card.due.toISOString().split('T')[0]})`);
  }

  // Salvar estado FSRS
  writeFileSync(fsrsPath, JSON.stringify(fsrsState, null, 2), 'utf8');
  console.log(`💾 Estado FSRS salvo: ${fsrsPath}`);

  // Resumo
  console.log('\n📊 Resumo:');
  console.log(`  Domínio: ${domain}`);
  console.log(`  Aula: ${lessonId}`);
  console.log(`  Conceitos: ${concepts.length}`);
  console.log(`  Cards Anki: ${successCount}`);
  console.log(`  FSRS cards: ${Object.keys(fsrsState).length}`);
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});