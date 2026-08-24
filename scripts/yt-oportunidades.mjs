#!/usr/bin/env node
/**
 * yt-oportunidades.mjs — Pipeline determinístico de coleta de oportunidades.
 *
 * Cataloga canais do YouTube, compara com as transcrições locais, baixa e
 * deduplica transcrições que faltam. A ANÁLISE das transcrições (raciocínio)
 * fica com a skill `coletar-oportunidades-youtube`, não aqui.
 *
 * Uso:
 *   node scripts/yt-oportunidades.mjs catalog
 *       Canal -> CATALOGO.json na pasta de transcrições (id, título, data).
 *   node scripts/yt-oportunidades.mjs catalog-all
 *       Cataloga TODOS os canais de manifests/canais-vigilados.json.
 *   node scripts/yt-oportunidades.mjs diff [--since AAAA-MM-DD | --since-last]
 *       Canal vs transcrições locais -> sem_transcricao e transcritos_nao_analisados.
 *       --since-last usa a data gravada em ULTIMA-COLETA.json (só o que é novo).
 *   node scripts/yt-oportunidades.mjs diff-all [--since AAAA-MM-DD | --since-last]
 *       Igual a diff, mas para todos os canais da config.
 *   node scripts/yt-oportunidades.mjs last [--canal HANDLE]
 *       Mostra a data da última coleta registrada (ULTIMA-COLETA.json).
 *   node scripts/yt-oportunidades.mjs download <id> [<id>...]
 *       Baixa auto-subs (pt/en) do vídeo e gera <id>.<lang>.dedup.txt.
 *   node scripts/yt-oportunidades.mjs dedup [arquivo.vtt ...]
 *       Converte VTT(s) em texto plano sem timestamps. Padrão: raw/*.vtt.
 *   node scripts/yt-oportunidades.mjs mark <id> [<id>...]
 *       Marca vídeos como analisados (registro ANALISADOS.json).
 *   node scripts/yt-oportunidades.mjs analyzed
 *       Lista os vídeos marcados como analisados.
 *
 * Configuração por variáveis de ambiente (modo canal único, compatível):
 *   YT_CHANNEL  URL do canal (padrão: https://www.youtube.com/@maestrosdaia/videos)
 *   YT_DIR      pasta(s) das transcrições, separadas por ';'
 *               (padrão: ~/projetos/maestros-da-ia;~/projetos/enzo-sparo).
 *               Catálogo/registro de análise vão na PRIMEIRA pasta.
 *
 * Modo multi-canal (catalog-all/diff-all):
 *   Lê manifests/canais-vigilados.json: [{ handle, nome, pasta, idiomas, keywords }]
 *   Cada canal tem sua própria pasta de transcrições (catalogo/analisados locais).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const CHANNELS_CONFIG = join(SCRIPT_DIR, '..', 'manifests', 'canais-vigilados.json');
// Caminhos locais das transcricoes ficam FORA do repo publico (gitignored).
const LOCAL_CHANNELS_CONFIG = join(SCRIPT_DIR, '..', 'manifests', 'canais-vigilados.local.json');

const DEFAULT_CHANNEL = 'https://www.youtube.com/@maestrosdaia/videos';
const DEFAULT_DIRS = `${join(homedir(), 'projetos', 'maestros-da-ia')};${join(homedir(), 'projetos', 'enzo-sparo')}`;

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
  ensureDir(dirname(file));
  writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

/** Contexto de um canal: dirs, channel, arquivos de estado. */
function ctxFor({ channel = DEFAULT_CHANNEL, dirs = null, label = 'default' } = {}) {
  const dirList = dirs || (process.env.YT_DIR || DEFAULT_DIRS).split(';').map((p) => p.trim()).filter(Boolean);
  const dir = dirList[0];
  return {
    label,
    channel,
    dirs: dirList,
    dir,
    rawDir: join(dir, 'raw'),
    catalogFile: join(dir, 'CATALOGO.json'),
    analyzedFile: join(dir, 'ANALISADOS.json'),
    lastColetaFile: join(dir, 'ULTIMA-COLETA.json'),
  };
}

function defaultCtx() {
  return ctxFor({
    channel: process.env.YT_CHANNEL || DEFAULT_CHANNEL,
    dirs: (process.env.YT_DIR || DEFAULT_DIRS).split(';').map((p) => p.trim()).filter(Boolean),
  });
}

/** Lê manifests/canais-vigilados.json e devolve ctxs por canal.
 *  Falha ALTO se a pasta de algum canal estiver ausente ou não for absoluta —
 *  paths relativos resolvem contra o cwd e espalham catálogos/transcrições
 *  pela raiz do projeto (bug real de 2026-08-20). */
function allChannelCtxs() {
  const cfg = readJson(CHANNELS_CONFIG, null);
  if (!cfg || !Array.isArray(cfg.canais) || cfg.canais.length === 0) {
    process.stderr.write(`Config multi-canal ausente/inválida: ${CHANNELS_CONFIG}\n`);
    process.exit(1);
  }
  const local = readJson(LOCAL_CHANNELS_CONFIG, null);
  const pastas = (local && local.pastas) || {};
  const problemas = [];
  const ctxs = [];
  for (const c of cfg.canais) {
    const pasta = c.pasta || pastas[c.handle];
    if (!pasta) {
      problemas.push(`${c.handle}: sem pasta (defina em manifests/canais-vigilados.local.json)`);
      continue;
    }
    if (!isAbsolute(pasta)) {
      problemas.push(`${c.handle}: pasta "${pasta}" não é caminho absoluto`);
      continue;
    }
    ctxs.push({
      ...ctxFor({ channel: `https://www.youtube.com/${c.handle}/videos`, dirs: [pasta], label: c.handle }),
      nome: c.nome,
      keywords: c.keywords || [],
    });
  }
  if (problemas.length > 0) {
    process.stderr.write(
      `Config de canais inválida (${problemas.length} problema(s)) — corrija antes de coletar:\n` +
        problemas.map((p) => `  - ${p}`).join('\n') +
        '\n',
    );
    process.exit(1);
  }
  return ctxs;
}

function catalog(ctx) {
  const out = yt([
    '--flat-playlist',
    '--extractor-args', 'youtubetab:approximate_date',
    '--print', '%(id)s|%(title)s|%(upload_date)s',
    ctx.channel,
  ]);
  const videos = out.split(/\r?\n/)
    .filter((l) => l.includes('|'))
    .map((l) => {
      const [id, ...rest] = l.split('|');
      const upload_date = rest.pop() || '';
      const title = rest.join('|');
      return { id, title, upload_date };
    });
  const data = { generatedAt: new Date().toISOString(), channel: ctx.channel, videos };
  writeJson(ctx.catalogFile, data);
  console.log(`[${ctx.label}] Catálogo: ${videos.length} vídeos em ${ctx.catalogFile}`);
  return data;
}

function localIds(ctx) {
  const ids = new Set();
  for (const dir of ctx.dirs) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (f.endsWith('.dedup.txt')) ids.add(basename(f).split('.')[0]);
    }
  }
  return ids;
}

function analyzedIds(ctx) {
  const list = readJson(ctx.analyzedFile, []);
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

function diff(ctx, since, keywords = []) {
  const data = existsSync(ctx.catalogFile) ? readJson(ctx.catalogFile, null) : catalog(ctx);
  if (!data || !Array.isArray(data.videos)) return catalog(ctx);
  const transcribed = localIds(ctx);
  const analyzed = analyzedIds(ctx);
  const scope = parseChannel(data, since);
  const kw = keywords.filter((k) => k).map((k) => k.toLowerCase());
  const semTranscricao = scope.filter((v) => !transcribed.has(v.id)).map((v) => ({
    id: v.id,
    title: v.title,
    upload_date: v.upload_date,
    matches_filtro: kw.length === 0 || kw.some((k) => v.title.toLowerCase().includes(k)),
  }));
  const semAnalise = scope.filter((v) => transcribed.has(v.id) && !analyzed.has(v.id)).map((v) => ({
    id: v.id,
    title: v.title,
    upload_date: v.upload_date,
  }));

  const result = {
    canal: ctx.label,
    total: scope.length,
    sem_transcricao: semTranscricao,
    transcritos_nao_analisados: semAnalise,
  };
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

function dedup(ctx, args) {
  const files = args.length > 0
    ? args.filter((f) => existsSync(f))
    : (existsSync(ctx.rawDir) ? readdirSync(ctx.rawDir).filter((f) => f.endsWith('.vtt')).map((f) => join(ctx.rawDir, f)) : []);
  if (files.length === 0) {
    process.stderr.write(`[${ctx.label}] Nenhum .vtt para deduplicar (use \`download\` ou passe arquivos).\n`);
    process.exit(1);
  }
  ensureDir(ctx.dir);
  for (const f of files) {
    const name = basename(f).replace(/\.vtt$/i, '');
    const [id, ...langParts] = name.split('.');
    const lang = langParts.join('.') || 'auto';
    const out = join(ctx.dir, `${id}.${lang}.dedup.txt`);
    writeFileSync(out, dedupVtt(f), 'utf8');
    console.log(`[${ctx.label}] dedup: ${out}`);
  }
}

function download(ctx, ids) {
  if (ids.length === 0) {
    process.stderr.write('Informe ao menos um id: download <id> [<id>...]\n');
    process.exit(1);
  }
  ensureDir(ctx.rawDir);
  for (const id of ids) {
    let ok = false;
    for (const langs of [['pt', 'pt-PT', 'en'], ['en'], ['pt']]) {
      for (let attempt = 0; attempt < 3 && !ok; attempt++) {
        if (attempt > 0) setTimeoutSync(5000 * attempt);
        console.log(`[${ctx.label}] baixando subs de ${id} (${langs.join(',')}) tentativa ${attempt + 1}...`);
        const r = spawnSync('yt-dlp', [
          '--skip-download',
          '--write-auto-sub',
          '--write-subs',
          '--sub-langs', langs.join(','),
          '--sub-format', 'vtt',
          '--no-playlist',
          '--no-warnings',
          '-o', `${ctx.rawDir.replace(/\\/g, '/')}/%(id)s.%(ext)s`,
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
    if (!ok) process.stderr.write(`[${ctx.label}] FALHOU: ${id} (rate limit persistente)\n`);
  }
  const vtts = readdirSync(ctx.rawDir)
    .filter((f) => /\.vtt$/i.test(f) && ids.some((id) => f.startsWith(id + '.')))
    .map((f) => join(ctx.rawDir, f));
  dedup(ctx, vtts);
}

function setTimeoutSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function mark(ctx, ids) {
  const list = new Set(readJson(ctx.analyzedFile, []));
  for (const id of ids) list.add(id);
  writeJson(ctx.analyzedFile, [...list].sort());
  updateLastColeta(ctx);
  console.log(`[${ctx.label}] Analisados registrados: ${list.size}`);
}

function updateLastColeta(ctx) {
  const data = existsSync(ctx.catalogFile) ? readJson(ctx.catalogFile, null) : null;
  const analyzed = new Set(readJson(ctx.analyzedFile, []));
  let maxDate = '';
  if (data && Array.isArray(data.videos)) {
    for (const v of data.videos) {
      if (analyzed.has(v.id) && v.upload_date > maxDate) maxDate = v.upload_date;
    }
  }
  const date = maxDate.length === 8 ? `${maxDate.slice(0, 4)}-${maxDate.slice(4, 6)}-${maxDate.slice(6, 8)}` : todayStr();
  writeJson(ctx.lastColetaFile, { ultimaColeta: date, atualizadoEm: new Date().toISOString() });
  console.log(`[${ctx.label}] Última coleta registrada: ${date}`);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function readLastColeta(ctx) {
  const data = readJson(ctx.lastColetaFile, null);
  if (data && data.ultimaColeta) return data.ultimaColeta;
  return null;
}

function lastColeta(ctx) {
  const date = readLastColeta(ctx);
  console.log(`[${ctx.label}] ${date || '(nunca coletado — use --since para a primeira coleta)'}`);
}

function analyzed(ctx) {
  const list = readJson(ctx.analyzedFile, []);
  console.log(`[${ctx.label}] ${JSON.stringify(list, null, 2)}`);
}

function sinceArg(ctx) {
  if (process.argv.includes('--since-last')) {
    return readLastColeta(ctx) || undefined;
  }
  return process.argv.includes('--since')
    ? process.argv[process.argv.indexOf('--since') + 1]
    : undefined;
}

/** Resolve o canal-alvo de --canal <handle> (senão o canal padrão/env). */
function targetCtx() {
  const i = process.argv.indexOf('--canal');
  if (i === -1) return defaultCtx();
  const handle = String(process.argv[i + 1] || '').replace(/^@/, '');
  const ctx = allChannelCtxs().find((c) => c.label.replace(/^@/, '') === handle);
  if (!ctx) {
    process.stderr.write(`Canal não encontrado na config: ${handle}\n`);
    process.exit(1);
  }
  return ctx;
}

/** Args posicionais após o comando, removendo --canal <handle> e outras flags. */
function posArgs() {
  const rest = process.argv.slice(3);
  const i = rest.indexOf('--canal');
  if (i !== -1) rest.splice(i, 2);
  return rest.filter((a) => !a.startsWith('--'));
}

function runPerChannel(fn) {
  const ctxs = allChannelCtxs();
  const results = [];
  for (const ctx of ctxs) {
    try {
      results.push(fn(ctx));
    } catch (e) {
      process.stderr.write(`[${ctx.label}] erro: ${e.message}\n`);
    }
  }
  return results;
}

switch (RUN()) {
  case 'catalog': catalog(defaultCtx()); break;
  case 'catalog-all': runPerChannel((ctx) => catalog(ctx)); break;
  case 'diff': {
    const ctx = defaultCtx();
    console.log(JSON.stringify(diff(ctx, sinceArg(ctx)), null, 2));
    break;
  }
  case 'diff-all': {
    const results = runPerChannel((ctx) => diff(ctx, sinceArg(ctx), ctx.keywords));
    console.log(JSON.stringify(results, null, 2));
    break;
  }
  case 'download': download(targetCtx(), posArgs()); break;
  case 'dedup': dedup(targetCtx(), posArgs()); break;
  case 'mark': mark(targetCtx(), posArgs()); break;
  case 'analyzed': analyzed(targetCtx()); break;
  case 'last': lastColeta(targetCtx()); break;
  default:
    console.log(`Uso: node ${basename(process.argv[1])} {catalog|catalog-all|diff [--since DATA|--since-last]|diff-all [--since DATA|--since-last]|download [--canal HANDLE] <id>...|dedup [--canal HANDLE] [vtt...]|mark [--canal HANDLE] <id>...|analyzed [--canal HANDLE]|last [--canal HANDLE]}`);
    console.log(`  YT_DIR=${defaultCtx().dir}`);
    console.log(`  YT_CHANNEL=${defaultCtx().channel}`);
}