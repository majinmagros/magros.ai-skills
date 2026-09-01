#!/usr/bin/env node
/**
 * migrate-to-state.mjs — Migração read-only para estado centralizado.
 * 
 * Lê todas as fontes legadas (25 canais) e gera state/yt-control.json
 * SEM modificar arquivos originais.
 * 
 * Uso: node scripts/migrate-to-state.mjs
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const SCRIPT_DIR = 'C:\\Projetos\\magros.ai-skills\\scripts';
const BASE_DIR = 'C:\\projetos\\Oportunidades';
const CHANNELS_CONFIG = 'C:\\Projetos\\magros.ai-skills\\manifests\\canais-vigilados.json';
const LOCAL_CHANNELS_CONFIG = 'C:\\Projetos\\magros.ai-skills\\manifests\\canais-vigilados.local.json';
const STATE_DIR = join(BASE_DIR, 'state');
const STATE_FILE = join(STATE_DIR, 'yt-control.json');

function readJson(file, fallback = null) {
  if (!existsSync(file)) return fallback;
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`Erro lendo ${file}:`, e.message);
    return fallback;
  }
}

function getVttIds(rawDir) {
  if (!existsSync(rawDir)) return [];
  return readdirSync(rawDir)
    .filter(f => f.endsWith('.vtt'))
    .map(f => basename(f).replace(/\.(pt|pt-PT|en)\.vtt$/i, ''))
    .filter((v, i, a) => a.indexOf(v) === i) // unique
    .sort();
}

function getDedupPaths(channelDir) {
  if (!existsSync(channelDir)) return [];
  return readdirSync(channelDir)
    .filter(f => f.endsWith('.dedup.txt'))
    .map(f => join(channelDir, f));
}

async function main() {
  console.log('=== MIGRAÇÃO READ-ONLY PARA STATE CENTRALIZADO ===\n');

  // 1. Carregar configuração de canais
  const channelsConfig = readJson(CHANNELS_CONFIG, { canais: [] });
  const localConfig = readJson(LOCAL_CHANNELS_CONFIG, { pastas: {} });

  const channels = channelsConfig.canais || [];
  console.log(`Canais configurados: ${channels.length}`);

  // 2. Processar cada canal
  const stateChannels = [];

  for (const ch of channels) {
    const handle = ch.handle;
    const name = ch.nome || handle.replace('@', '');
    const rawDir = localConfig.pastas?.[handle];
    
    if (!rawDir || !existsSync(rawDir)) {
      console.log(`  ⚠ ${handle}: pasta raw não encontrada (${rawDir})`);
      continue;
    }

    const catalogFile = join(rawDir, 'CATALOGO.json');
    const analyzedFile = join(rawDir, 'ANALISADOS.json');
    const vttIds = getVttIds(join(rawDir, 'raw'));

    const catalogData = readJson(catalogFile, { videos: [] });
    const analyzed = new Set(readJson(analyzedFile, []));
    const catalog = catalogData.videos || [];

    // Mapear vídeos do catálogo
    const videoMap = new Map();
    for (const v of catalog) {
      videoMap.set(v.id, {
        id: v.id,
        title: v.title,
        url: `https://youtube.com/watch?v=${v.id}`,
        published_at: v.upload_date,
        matches_filtro: v.matches_filtro ?? true,
      });
    }

    // Adicionar vídeos que têm VTT mas não estão no catálogo (fallback)
    for (const id of vttIds) {
      if (!videoMap.has(id)) {
        videoMap.set(id, {
          id,
          title: `(sem catálogo) ${id}`,
          url: `https://youtube.com/watch?v=${id}`,
          published_at: null,
          matches_filtro: true,
        });
      }
    }

    // Determinar status de cada vídeo
    const videos = [];
    for (const [id, meta] of videoMap) {
      const hasVtt = vttIds.includes(id);
      const isAnalyzed = analyzed.has(id);
      
      let status;
      if (isAnalyzed) status = 'analyzed';
      else if (hasVtt) status = 'deduped'; // assumindo que dedup já foi rodado
      else status = 'pending';

      videos.push({
        ...meta,
        status,
        analyzed_at: isAnalyzed ? new Date().toISOString() : null, // placeholder
        transcription_path: hasVtt ? join(rawDir, 'raw', `${id}.pt.vtt`) : null,
        dedup_path: hasVtt ? join(rawDir, `${id}.pt.dedup.txt`) : null,
        opportunities: isAnalyzed ? [] : null, // será preenchido na análise
        notes: ''
      });
    }

    stateChannels.push({
      handle,
      name,
      raw_dir: rawDir,
      keywords: ch.keywords || [],
      tier: ch.tier || 'radar',
      videos
    });

    const analyzedCount = videos.filter(v => v.status === 'analyzed').length;
    const pendingCount = videos.filter(v => v.status !== 'analyzed' && v.status !== 'skipped').length;
    console.log(`  ✓ ${handle} (${name}): ${videos.length} vídeos, ${analyzedCount} analisados, ${pendingCount} pendentes`);
  }

  // 3. Gerar state consolidado
  const state = {
    version: 1,
    updated_at: new Date().toISOString(),
    base_dir: BASE_DIR,
    channels: stateChannels
  };

  // 4. Salvar (dry-run: mostra preview, não escreve se --dry-run)
  const isDryRun = process.argv.includes('--dry-run');
  
  if (isDryRun) {
    console.log('\n=== DRY-RUN: Preview do state (primeiros 3 canais) ===');
    console.log(JSON.stringify({
      version: state.version,
      updated_at: state.updated_at,
      channels: state.channels.slice(0, 3).map(c => ({
        handle: c.handle,
        name: c.name,
        video_count: c.videos.length,
        sample_video: c.videos[0]
      }))
    }, null, 2));
    console.log('\n... (use sem --dry-run para salvar)');
  } else {
    if (!existsSync(STATE_DIR)) {
      const fs = await import('node:fs');
      fs.mkdirSync(STATE_DIR, { recursive: true });
    }
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf8');
    console.log(`\n✓ State salvo em: ${STATE_FILE}`);
  }

  // 5. Resumo geral
  const totalVideos = stateChannels.reduce((sum, c) => sum + c.videos.length, 0);
  const totalAnalyzed = stateChannels.reduce((sum, c) => sum + c.videos.filter(v => v.status === 'analyzed').length, 0);
  const totalPending = stateChannels.reduce((sum, c) => sum + c.videos.filter(v => v.status !== 'analyzed' && v.status !== 'skipped').length, 0);
  
  console.log('\n=== RESUMO GERAL ===');
  console.log(`Canais processados: ${stateChannels.length}`);
  console.log(`Total de vídeos: ${totalVideos}`);
  console.log(`Analisados: ${totalAnalyzed}`);
  console.log(`Pendentes (deduped + pending): ${totalPending}`);
}
 
main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});