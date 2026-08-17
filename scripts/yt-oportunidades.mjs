#!/usr/bin/env node
/**
 * yt-oportunidades.mjs — Pipeline determinístico de coleta de oportunidades.
 *
 * Cataloga um canal do YouTube, compara com as transcrições locais, baixa e
 * deduplica transcrições que faltam. A ANÁLISE das transcrições (raciocínio)
 * fica com a skill `coletar-oportunidades-youtube`, não aqui.
 *
 * Uso:
 *   node scripts/yt-oportunidades.mjs catalog
 *       Canal -> CATALOGO.json na pasta de transcrições (id, título, data).
 *   node scripts/yt-oportunidades.mjs diff [--since AAAA-MM-DD]
 *       Canal vs transcrições locais -> sem_transcricao e transcritos_nao_analisados.
 *   node scripts/yt-oportunidades.mjs download <id> [<id>...]
 *       Baixa auto-subs (pt/en) do vídeo e gera <id>.<lang>.dedup.txt.
 *   node scripts/yt-oportunidades.mjs dedup [arquivo.vtt ...]
 *       Converte VTT(s) em texto plano sem timestamps. Padrão: raw/*.vtt.
 *   node scripts/yt-oportunidades.mjs mark <id> [<id>...]
 *       Marca vídeos como analisados (registro ANALISADOS.json).
 *   node scripts/yt-oportunidades.mjs analyzed
 *       Lista os vídeos marcados como analisados.
 *
 * Configuração por variáveis de ambiente:
 *   YT_CHANNEL  URL do canal (padrão: https://www.youtube.com/@maestrosdaia/videos)
 *   YT_DIR      pasta(s) das transcrições, separadas por ';'
 *               (padrão: ~/projetos/maestros-da-ia;~/projetos/enzo-sparo).
 *               Catálogo/registro de análise vão na PRIMEIRA pasta.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';

const CHANNEL = process.env.YT_CHANNEL || 'https://www.youtube.com/@maestrosdaia/videos';
const YT_DIRS = (process.env.YT_DIR || `${join(homedir(), 'projetos', 'maestros-da-ia')};${join(homedir(), 'projetos', 'enzo-sparo')}`)
  .split(';').map((p) => p.trim()).filter(Boolean);
const YT_DIR = YT_DIRS[0];
const RAW_DIR = join(YT_DIR, 'raw');
const CATALOG_FILE = join(YT_DIR, 'CATALOGO.json');
const ANALYZED_FILE = join(YT_DIR, 'ANALISADOS.json');

const RUN = () => process.argv[2];

function yt(args) {
  const r = spawnSync('yt-dlp', args, { encoding: 'utf8' });
  if (r.status !== 0) {
    process.stderr.write(`yt-dlp falhou (${r.status}): ${r.stderr || r.stdout}\n`);
    process.exit(1);
  }
  return r.stdout;
}

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function readJson(file, fallback) {
  if (!existsSync(file)) return fallback;
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  ensureDir(YT_DIR);
  writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function catalog() {
  const out = yt([
    '--flat-playlist',
    '--extractor-args', 'youtubetab:approximate_date',
    '--print', '%(id)s|%(title)s|%(upload_date)s',
    CHANNEL,
  ]);
  const videos = out.split(/\r?\n/)
    .filter((l) => l.includes('|'))
    .map((l) => {
      const [id, ...rest] = l.split('|');
      const upload_date = rest.pop() || '';
      const title = rest.join('|');
      return { id, title, upload_date };
    });
  const data = { generatedAt: new Date().toISOString(), channel: CHANNEL, videos };
  writeJson(CATALOG_FILE, data);
  console.log(`Catálogo: ${videos.length} vídeos em ${CATALOG_FILE}`);
  return data;
}

function localIds() {
  const ids = new Set();
  for (const dir of YT_DIRS) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (f.endsWith('.dedup.txt')) ids.add(basename(f).split('.')[0]);
    }
  }
  return ids;
}

function analyzedIds() {
  const list = readJson(ANALYZED_FILE, []);
  return new Set(Array.isArray(list) ? list : []);
}

function parseChannel(data, since) {
  const sinceTs = since ? Date.parse(since) : 0;
  return data.videos.filter((v) => {
    if (!since) return true;
    const d = String(v.upload_date || '');
    return d.length === 8 && Date.parse(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`) >= sinceTs;
  });
}

function diff(since) {
  const data = existsSync(CATALOG_FILE) ? readJson(CATALOG_FILE, null) : catalog();
  if (!data || !Array.isArray(data.videos)) return catalog();
  const transcribed = localIds();
  const analyzed = analyzedIds();
  const scope = parseChannel(data, since);
  const semTranscricao = scope.filter((v) => !transcribed.has(v.id));
  const semAnalise = scope.filter((v) => transcribed.has(v.id) && !analyzed.has(v.id));

  const result = {
    total: scope.length,
    sem_transcricao: semTranscricao.map((v) => ({ id: v.id, title: v.title, upload_date: v.upload_date })),
    transcritos_nao_analisados: semAnalise.map((v) => ({ id: v.id, title: v.title, upload_date: v.upload_date })),
  };
  console.log(JSON.stringify(result, null, 2));
  return result;
}

function dedupVtt(vttPath) {
  const text = readFileSync(vttPath, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/);
  const clean = [];
  let prev = '';
  for (const raw of lines) {
    const line = raw
      .replace(/<[^>]*>/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .trim();
    if (!line) continue;
    if (/^\d{1,2}:\d{2}:\d{2}/.test(line)) continue; // linha de timestamp
    if (/^(WEBVTT|Kind:|Language:)/i.test(line)) continue;
    if (/^\d+$/.test(line)) continue; // número de cue
    if (line === prev) continue; // duplicata consecutiva
    prev = line;
    clean.push(line);
  }
  const wrapped = [];
  for (const line of clean) {
    if (line.length <= 78) {
      wrapped.push(line);
      continue;
    }
    const words = line.split(' ');
    let cur = '';
    for (const w of words) {
      if ((cur + ' ' + w).trim().length > 78) {
        if (cur) wrapped.push(cur);
        cur = w;
      } else {
        cur = (cur + ' ' + w).trim();
      }
    }
    if (cur) wrapped.push(cur);
  }
  return wrapped.join('\n') + '\n';
}

function dedup(args) {
  const files = args.length > 0
    ? args.filter((f) => existsSync(f))
    : (existsSync(RAW_DIR) ? readdirSync(RAW_DIR).filter((f) => f.endsWith('.vtt')).map((f) => join(RAW_DIR, f)) : []);
  if (files.length === 0) {
    process.stderr.write('Nenhum .vtt para deduplicar (use `download` ou passe arquivos).\n');
    process.exit(1);
  }
  ensureDir(YT_DIR);
  for (const f of files) {
    const name = basename(f).replace(/\.vtt$/i, '');
    const [id, ...langParts] = name.split('.');
    const lang = langParts.join('.') || 'auto';
    const out = join(YT_DIR, `${id}.${lang}.dedup.txt`);
    writeFileSync(out, dedupVtt(f), 'utf8');
    console.log(`dedup: ${out}`);
  }
}

function download(ids) {
  if (ids.length === 0) {
    process.stderr.write('Informe ao menos um id: download <id> [<id>...]\n');
    process.exit(1);
  }
  ensureDir(RAW_DIR);
  for (const id of ids) {
    let ok = false;
    for (const langs of [['pt', 'pt-PT', 'en'], ['en'], ['pt']]) {
      for (let attempt = 0; attempt < 3 && !ok; attempt++) {
        if (attempt > 0) setTimeoutSync(5000 * attempt);
        console.log(`baixando subs de ${id} (${langs.join(',')}) tentativa ${attempt + 1}...`);
        const r = spawnSync('yt-dlp', [
          '--skip-download',
          '--write-auto-sub',
          '--write-subs',
          '--sub-langs', langs.join(','),
          '--sub-format', 'vtt',
          '--no-playlist',
          '--no-warnings',
          '-o', `${RAW_DIR.replace(/\\/g, '/')}/%(id)s.%(ext)s`,
          `https://www.youtube.com/watch?v=${id}`,
        ], { encoding: 'utf8' });
        if (r.status === 0) {
          ok = true;
          break;
        }
        process.stderr.write(`  erro (${r.status}): ${(r.stderr || r.stdout || '').split('\n')[0]}\n`);
      }
      if (ok) break;
    }
    if (!ok) process.stderr.write(`FALHOU: ${id} (rate limit persistente)\n`);
  }
  const vtts = readdirSync(RAW_DIR)
    .filter((f) => /\.vtt$/i.test(f) && ids.some((id) => f.startsWith(id + '.')))
    .map((f) => join(RAW_DIR, f));
  dedup(vtts);
}

function setTimeoutSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function mark(ids) {
  const list = new Set(readJson(ANALYZED_FILE, []));
  for (const id of ids) list.add(id);
  writeJson(ANALYZED_FILE, [...list].sort());
  console.log(`Analisados registrados: ${list.size}`);
}

function analyzed() {
  const list = readJson(ANALYZED_FILE, []);
  console.log(JSON.stringify(list, null, 2));
}

switch (RUN()) {
  case 'catalog': catalog(); break;
  case 'diff': diff(process.argv.find((a) => a === '--since') ? process.argv[process.argv.indexOf('--since') + 1] : undefined); break;
  case 'download': download(process.argv.slice(3)); break;
  case 'dedup': dedup(process.argv.slice(3)); break;
  case 'mark': mark(process.argv.slice(3)); break;
  case 'analyzed': analyzed(); break;
  default:
    console.log(`Uso: node ${basename(process.argv[1])} {catalog|diff [--since DATA]|download <id>...|dedup [vtt...]|mark <id>...|analyzed}`);
    console.log(`  YT_DIR=${YT_DIR}`);
    console.log(`  YT_CHANNEL=${CHANNEL}`);
}