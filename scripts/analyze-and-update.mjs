#!/usr/bin/env node
/**
 * analyze-and-update.mjs — Analisa .dedup.txt e atualiza state centralizado.
 * 
 * Uso: node scripts/analyze-and-update.mjs <canal_handle> [video_id...]
 *      node scripts/analyze-and-update.mjs @gucampelo M7ie0MRsmsk XJOMq3KlzSE npVm4tBalp8
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const STATE_FILE = 'C:\\projetos\\Oportunidades\\state\\yt-control.json';
const SKILLS_FILE = 'C:\\Projetos\\magros.ai-skills\\docs\\data\\skills.json';

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function analyzeTranscript(text, channelName, videoId, videoTitle) {
  // Carregar skills existentes para cruzamento
  const skillsData = readJson(SKILLS_FILE);
  const skillNames = new Set(skillsData.skills.map(s => s.id));
  
  // Extrair conceitos principais (heurística simples)
  const concepts = [];
  const lower = text.toLowerCase();
  
  // Palavras-chave técnicas para detectar
  const keywords = [
    'three.js', 'threejs', 'webgl', 'webgpu',
    'gsap', 'scrolltrigger', 'scroll trigger',
    'cloud design', 'cloud design prototyping',
    'frontend design', 'front-end design',
    'img2threejs', 'img2three',
    'shader', 'pixelation', 'comet trails',
    'responsive', 'lod', 'level of detail',
    'vite', 'hostinger', 'deploy', 'ci/cd',
    'config constants', 'constants', 'tuning',
    'voxel', 'minecraft', 'block registry',
    'instanced mesh',
    'hyper3d', 'rodin', 'chatavatar',
    'metahuman', 'unreal engine', 'ue5',
    'animation retarget', 'virtual bones', 'foot locking',
    'identity solve', 'auto-rig',
    'book to skill', 'pdf to skill', 'skill from book',
    'notebooklm', 'feynman', 'spaced repetition',
    'flashcard', 'anki', 'tutor', 'ai tutor',
    'cybersecurity', 'hacker', 'pentest',
    'llm leaderboard', 'benchmark', 'model ranking',
    'fable 5', 'opus 5', 'gpt 5.6', 'son', 'sol',
    'qwen', 'kim', 'kimi', 'glm', 'deepseek',
    'harness', 'agent harness', 'sub-agent',
    'cost per task', 'routing', 'openrouter',
    'buzz', 'block', 'workspace teaming',
    'mcp', 'model context protocol',
    'agent', 'autonomous agent', 'agentic',
    'graph engineering', 'dynamic workflow',
    'code-as-graph', 'llm-as-graph',
    'rules to hooks', 'hookify', 'guardrails',
    'sub-agent cost', 'fast mode', 'api credits',
    'claude.md', 'context budget', 'compaction',
    'spec driven', 'grilling', 'clarificar',
    'tdd', 'verification loop',
    'n8n', 'automation', 'workflow',
    'voice clone', 'tts', 'elevenlabs', 'qwen3-tts',
    'ai media', 'kling', 'runway', 'veo', 'sora',
    'midjourney', 'flux', 'stable diffusion',
  ];

  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) {
      concepts.push(kw);
    }
  }

  // Mapear conceitos para skills existentes
  const opportunities = [];
  const conceptToSkill = {
    'three.js': 'img2threejs',
    'threejs': 'img2threejs',
    'gsap': 'gsap-skills',
    'scrolltrigger': 'gsap-skills',
    'cloud design': 'cloud-design-prototyping',
    'frontend design': 'frontend-design-direction',
    'img2threejs': 'img2threejs',
    'shader': 'threejs-shader-effects',
    'pixelation': 'threejs-shader-effects',
    'responsive': 'threejs-responsive-patterns',
    'lod': 'threejs-responsive-patterns',
    'vite': 'vite-patterns',
    'hostinger': 'deployment-patterns',
    'deploy': 'deployment-patterns',
    'ci/cd': 'deployment-patterns',
    'config constants': 'threejs-config-constants',
    'constants': 'threejs-config-constants',
    'tuning': 'threejs-config-constants',
    'voxel': 'threejs-voxel-block-system',
    'minecraft': 'threejs-voxel-block-system',
    'instanced mesh': 'threejs-voxel-block-system',
    'hyper3d': 'hyper3d-rodin-pipeline',
    'rodin': 'hyper3d-rodin-pipeline',
    'chatavatar': 'hyper3d-rodin-pipeline',
    'metahuman': 'metahuman-identity-pipeline',
    'unreal engine': 'metahuman-to-unreal-pipeline',
    'ue5': 'metahuman-to-unreal-pipeline',
    'animation retarget': 'metahuman-animation-retarget',
    'virtual bones': 'metahuman-animation-retarget',
    'foot locking': 'metahuman-animation-retarget',
    'identity solve': 'metahuman-identity-pipeline',
    'auto-rig': 'metahuman-identity-pipeline',
    'book to skill': 'book-to-skill',
    'pdf to skill': 'book-to-skill',
    'notebooklm': 'content-engine',
    'feynman': 'ai-tutor-system',
    'spaced repetition': 'ai-tutor-system',
    'flashcard': 'ai-tutor-system',
    'anki': 'ai-tutor-system',
    'tutor': 'ai-tutor-system',
    'ai tutor': 'ai-tutor-system',
    'llm leaderboard': 'llm-leaderboard-tracker',
    'benchmark': 'benchmark',
    'model ranking': 'llm-leaderboard-tracker',
    'fable 5': 'llm-leaderboard-tracker',
    'opus 5': 'llm-leaderboard-tracker',
    'gpt 5.6': 'llm-leaderboard-tracker',
    'qwen': 'llm-leaderboard-tracker',
    'kimi': 'llm-leaderboard-tracker',
    'glm': 'llm-leaderboard-tracker',
    'deepseek': 'llm-leaderboard-tracker',
    'harness': 'agent-harness-construction',
    'agent harness': 'agent-harness-construction',
    'sub-agent': 'agent-harness-construction',
    'cost per task': 'roteamento-modelos-baratos',
    'routing': 'roteamento-modelos-baratos',
    'openrouter': 'roteamento-modelos-baratos',
    'buzz': 'buzz-workspace-teaming',
    'block': 'buzz-workspace-teaming',
    'mcp': 'mcp-server-patterns',
    'model context protocol': 'mcp-server-patterns',
    'agent': 'agent-harness-construction',
    'autonomous agent': 'autonomous-agent-harness',
    'agentic': 'agentic-engineering',
    'graph engineering': 'engenharia-de-grafos',
    'dynamic workflow': 'dynamic-workflow-mode',
    'code-as-graph': 'graph-engineering-patterns',
    'llm-as-graph': 'graph-engineering-patterns',
    'rules to hooks': 'rules-to-hooks-auditor',
    'hookify': 'hookify-rules',
    'guardrails': 'agent-guardrails',
    'sub-agent cost': 'sub-agent-cost-guard',
    'fast mode': 'sub-agent-cost-guard',
    'api credits': 'sub-agent-cost-guard',
    'claude.md': 'claude-md-auditor',
    'context budget': 'context-budget',
    'compaction': 'strategic-compact',
    'spec driven': 'spec-driven-dev-kit',
    'grilling': 'grilling',
    'clarificar': 'clarificar',
    'tdd': 'tdd-workflow',
    'verification loop': 'verification-loop',
    'n8n': 'n8n-agentic-flows',
    'automation': 'automacao-deterministica',
    'workflow': 'workflows',
    'voice clone': 'voice-cloning-local',
    'tts': 'voice-cloning-local',
    'qwen3-tts': 'voice-cloning-local',
  };

  const matchedSkills = new Set();
  for (const concept of concepts) {
    const skill = conceptToSkill[concept.toLowerCase()];
    if (skill && skillNames.has(skill)) {
      matchedSkills.add(skill);
    }
  }

  // Gerar oportunidades
  for (const skill of matchedSkills) {
    opportunities.push({
      concept: skill,
      skill: skill,
      status: 'covered',
      note: `Conceito "${skill}" coberto por skill existente`
    });
  }

  // Detectar gaps (conceitos sem skill correspondente)
  for (const concept of concepts) {
    const skill = conceptToSkill[concept.toLowerCase()];
    if (skill && !skillNames.has(skill)) {
      opportunities.push({
        concept: skill,
        skill: skill,
        status: 'gap',
        note: `Gap: "${skill}" não existe nas skills atuais`
      });
    } else if (!skill) {
      // Conceito sem mapeamento direto
      opportunities.push({
        concept: concept,
        skill: null,
        status: 'unknown',
        note: `Conceito "${concept}" detectado, sem mapeamento direto`
      });
    }
  }

  return { concepts: [...new Set(concepts)], opportunities };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Uso: node analyze-and-update.mjs <canal_handle> [video_id...]');
    process.exit(1);
  }

  const channelHandle = args[0].startsWith('@') ? args[0] : '@' + args[0];
  const videoIds = args.slice(1);
  
  const state = readJson(STATE_FILE);
  const channelIdx = state.channels.findIndex(c => c.handle === channelHandle);
  
  if (channelIdx === -1) {
    console.error(`Canal ${channelHandle} não encontrado no state`);
    process.exit(1);
  }

  const channel = state.channels[channelIdx];
  console.log(`\n=== Analisando canal: ${channel.name} (${channelHandle}) ===`);

  for (const videoId of videoIds) {
    const videoIdx = channel.videos.findIndex(v => v.id === videoId);
    if (videoIdx === -1) {
      console.log(`  ⚠ Vídeo ${videoId} não encontrado no state`);
      continue;
    }

    const video = channel.videos[videoIdx];
    if (video.status === 'analyzed') {
      console.log(`  ⏭ ${videoId}: já analisado, pulando`);
      continue;
    }

    // Ler .dedup.txt
    const dedupPath = video.dedup_path || join(channel.raw_dir, `${videoId}.pt.dedup.txt`);
    if (!existsSync(dedupPath)) {
      console.log(`  ⚠ ${videoId}: .dedup.txt não encontrado em ${dedupPath}`);
      continue;
    }

    const text = readFileSync(dedupPath, 'utf8');
    console.log(`  📖 Analisando ${videoId}: ${video.title}`);

    const { concepts, opportunities } = analyzeTranscript(text, channel.name, videoId, video.title);
    
    console.log(`     Conceitos detectados: ${concepts.join(', ') || 'nenhum'}`);
    console.log(`     Oportunidades:`);
    for (const opp of opportunities) {
      console.log(`       - ${opp.concept}: ${opp.status} (${opp.note})`);
    }

    // Atualizar state
    channel.videos[videoIdx].status = 'analyzed';
    channel.videos[videoIdx].analyzed_at = new Date().toISOString();
    channel.videos[videoIdx].opportunities = opportunities;
    channel.videos[videoIdx].transcription_path = null;
    channel.videos[videoIdx].dedup_path = null;
    channel.videos[videoIdx].notes = `Analisado via script; conceitos: ${concepts.join(', ')}`;

    // Purge arquivos locais
    if (video.transcription_path && existsSync(video.transcription_path)) {
      // Não apagar por segurança - comentado
      // require('node:fs').unlinkSync(video.transcription_path);
    }
    if (video.dedup_path && existsSync(video.dedup_path)) {
      // require('node:fs').unlinkSync(video.dedup_path);
    }
  }

  // Atualizar timestamp geral
  state.updated_at = new Date().toISOString();
  writeJson(STATE_FILE, state);
  
  console.log(`\n✓ State atualizado: ${STATE_FILE}`);
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});