#!/usr/bin/env node
/**
 * yt-oportunidades.mjs — Pipeline determinístico de coleta de oportunidades.
 *
 * Cataloga canais do YouTube, compara com as transcrições locais, baixa e
 * deduplica transcrições que faltam. A ANÁLISE das transcrições (raciocínio)
 * fica com a skill `coletar-oportunidades-youtube`, não aqui.
 *
 * Uso:
 *   node scripts/yt-oportunidades.mjs sync-check [--json] [--allow-stale] [--no-fetch] [--branch NOME]
 *       Compara o repo local com o GitHub (fetch + HEAD vs origin) e BLOQUEIA
 *       (exit 1) se estiver atrás, com worktree suja ou com commits sem push.
 *       Rode SEMPRE antes de catalog/diff quando houver 2+ PCs coletando.
 *       --allow-stale libera (exit 0) assumindo o risco; --json imprime só JSON.
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
// Raiz do repo (sobrescrevível via YT_REPO_ROOT só para testes com fixtures git).
const REPO_ROOT = process.env.YT_REPO_ROOT || join(SCRIPT_DIR, '..');
// Estado compartilhado entre PCs (só ids/datas — NUNCA transcrições).
const CONTROL_STATE_FILE = join(REPO_ROOT, 'state', 'yt-control.json');
// Arquivos cuja última mudança commitada indica "última coleta publicada".
const COLETA_TRACKED_FILES = [
  'docs/maestros/OPORTUNIDADES.md',
  'manifests/canais-vigilados.json',
  'scripts/yt-oportunidades.mjs',
  'state/yt-control.json',
];
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

/** Roda git sempre na raiz do repo. Nunca joga exceção. */
function git(args, { timeout = 30000 } = {}) {
  try {
    // GIT_CEILING_DIRECTORIES impede o git de "subir" para um repo pai quando
    // REPO_ROOT não é um repo (evita operar no repo errado em silêncio).
    // (git pode ecoar o próprio argumento no stdout em caso de erro — por
    // isso os chamadores só usam `stdout` quando `status === 0`.)
    const r = spawnSync('git', args, {
      encoding: 'utf8',
      cwd: REPO_ROOT,
      timeout,
      env: { ...process.env, GIT_CEILING_DIRECTORIES: REPO_ROOT },
    });
    return {
      status: typeof r.status === 'number' ? r.status : 1,
      stdout: (r.stdout || '').trim(),
      stderr: (r.stderr || '').trim(),
      error: r.error ? String((r.error && r.error.message) || r.error) : null,
    };
  } catch (e) {
    return { status: 1, stdout: '', stderr: '', error: String((e && e.message) || e) };
  }
}

/** stdout de um git só vale quando o exit é 0. */
function gitOut(args, opts) {
  const r = git(args, opts);
  return r.status === 0 ? r.stdout : null;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

/** Branch atual (ou --branch X / YT_GIT_BRANCH). Fallback: master. */
function repoBranch() {
  const i = process.argv.indexOf('--branch');
  if (i !== -1 && process.argv[i + 1] && !String(process.argv[i + 1]).startsWith('--')) {
    return String(process.argv[i + 1]);
  }
  if (process.env.YT_GIT_BRANCH) return process.env.YT_GIT_BRANCH;
  const r = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  if (r.status === 0 && r.stdout && r.stdout !== 'HEAD') return r.stdout;
  return 'master';
}

/**
 * sync-check — trava pré-coleta para uso em 2+ PCs.
 * Exit 0 = em dia (pode coletar). Exit 1 = BLOQUEADO (atrás/sujo/sem push).
 * Exit 2 = remoto inverificável (offline/erro), salvo --allow-stale (exit 0).
 */
function syncCheck() {
  const asJson = hasFlag('--json');
  const allowStale = hasFlag('--allow-stale');
  const noFetch = hasFlag('--no-fetch');
  const branch = repoBranch();
  const remoteRef = `origin/${branch}`;
  const out = (obj) => {
    if (asJson) {
      console.log(JSON.stringify(obj, null, 2));
    } else {
      console.log(`[sync-check] branch: ${obj.branch}`);
      console.log(`[sync-check] local:  ${obj.localSha || '(sem commit?)'}`);
      console.log(`[sync-check] remoto: ${obj.remoteSha || '(inverificável)'} (${remoteRef}${obj.fetched ? ', fetch agora' : ', sem fetch'})`);
      console.log(`[sync-check] atrás: ${obj.behind} | à frente (sem push): ${obj.ahead} | worktree suja: ${obj.dirty ? `SIM (${obj.dirtyFiles.length} arquivo(s))` : 'não'}`);
      if (obj.lastColetaCommit && obj.lastColetaCommit.sha) {
        console.log(`[sync-check] última coleta publicada: ${obj.lastColetaCommit.sha.slice(0, 7)} (${obj.lastColetaCommit.date}) ${obj.lastColetaCommit.subject}`);
      } else {
        console.log('[sync-check] última coleta publicada: (nenhum commit nos arquivos de coleta)');
      }
      if (obj.controlState) {
        console.log(`[sync-check] state/yt-control.json: ${obj.controlState.canais} canal(is), última coleta ${obj.controlState.ultimaColeta || '?'}`);
      } else {
        console.log('[sync-check] state/yt-control.json: ausente — rode `mark` + commit + push após a próxima coleta');
      }
      if (obj.dirty) {
        for (const f of obj.dirtyFiles.slice(0, 10)) console.log(`[sync-check]   sujo: ${f}`);
      }
      console.log(`[sync-check] ${obj.message}`);
    }
  };

  const top = git(['rev-parse', '--show-toplevel']);
  if (top.status !== 0) {
    const obj = { ok: false, exit: 2, branch, message: 'BLOQUEADO: fora de um repo git — verifique YT_REPO_ROOT.' };
    out(obj);
    process.exit(allowStale ? 0 : 2);
  }

  const localSha = gitOut(['rev-parse', 'HEAD']);
  const statusOut = gitOut(['status', '--porcelain']);
  const dirtyFiles = (statusOut == null ? null : statusOut.split(/\r?\n/).map((l) => l.trim()).filter(Boolean));
  if (dirtyFiles == null) {
    const obj = { ok: false, exit: 2, branch, message: 'INVERIFICÁVEL: não foi possível ler a worktree (repo corrompido?).' };
    out(obj);
    process.exit(allowStale ? 0 : 2);
  }
  const dirty = dirtyFiles.length > 0;

  // Tenta trazer o remoto; se falhar, tenta ao menos ler o SHA via ls-remote
  // (leitura pura, sem tocar nas refs locais).
  let fetched = false;
  let remoteSha = gitOut(['rev-parse', remoteRef]);
  if (!noFetch) {
    const f = git(['fetch', 'origin', branch, '--quiet'], { timeout: 60000 });
    if (f.status === 0) {
      fetched = true;
      remoteSha = gitOut(['rev-parse', remoteRef]);
    }
  }
  if (!remoteSha) {
    const lr = git(['ls-remote', 'origin', branch], { timeout: 60000 });
    const m = (lr.stdout.split(/\r?\n/)[0] || '').split(/\s+/)[0];
    if (lr.status === 0 && /^[0-9a-f]{4,40}$/.test(m || '')) remoteSha = m;
  }

  if (!remoteSha) {
    const obj = {
      ok: false, exit: 2, branch, localSha, remoteSha: null, fetched,
      behind: 0, ahead: 0, dirty, dirtyFiles,
      lastColetaCommit: lastColetaCommit(), controlState: controlSummary(),
      message: 'INVERIFICÁVEL: sem acesso ao remoto (offline?). Re-rode com rede ou use --allow-stale assumindo o risco de duplicar coleta.',
    };
    out(obj);
    process.exit(allowStale ? 0 : 2);
  }

  const behindOut = remoteSha ? gitOut(['rev-list', '--count', `HEAD..${remoteSha}`]) : null;
  const aheadOut = remoteSha ? gitOut(['rev-list', '--count', `${remoteSha}..HEAD`]) : null;
  const behind = behindOut == null ? 0 : Number(behindOut);
  const ahead = aheadOut == null ? 0 : Number(aheadOut);
  const sameCommit = !!localSha && localSha === remoteSha;

  const problems = [];
  if (!sameCommit && behind > 0) problems.push(`repo ${behind} commit(s) ATRÁS do GitHub — rode: git pull --rebase`);
  if (dirty) problems.push(`worktree com ${dirtyFiles.length} arquivo(s) modificado(s) — commit/stash ANTES do pull`);
  if (ahead > 0) problems.push(`${ahead} commit(s) local(is) SEM PUSH — rode: git push (o outro PC não vê esses commits)`);

  const obj = {
    ok: problems.length === 0, exit: 0, branch,
    localSha, remoteSha, fetched, behind, ahead, dirty, dirtyFiles,
    lastColetaCommit: lastColetaCommit(), controlState: controlSummary(),
    message: problems.length === 0
      ? 'EM DIA — pode coletar.'
      : `BLOQUEADO: ${problems.join(' | ')}`,
  };
  if (problems.length > 0) obj.exit = 1;
  out(obj);
  if (obj.exit !== 0 && allowStale) {
    if (!asJson) console.log('[sync-check] --allow-stale: liberado com aviso (risco de coleta duplicada).');
    process.exit(0);
  }
  process.exit(obj.exit);
}

/** Último commit que tocou os arquivos de coleta (o que o outro PC publicou). */
function lastColetaCommit() {
  const r = git(['log', '-1', '--format=%H|%ci|%s', '--', ...COLETA_TRACKED_FILES]);
  if (r.status !== 0 || !r.stdout) return null;
  const [sha, date, ...subject] = r.stdout.split('|');
  if (!sha) return null;
  return { sha, date: (date || '').slice(0, 10), subject: subject.join('|') };
}

/** Resumo do state/yt-control.json (fonte da verdade por canal). */
function controlSummary() {
  const state = readJson(CONTROL_STATE_FILE, null);
  if (!state || typeof state !== 'object' || !state.canais) return null;
  const keys = Object.keys(state.canais);
  let ultima = null;
  for (const k of keys) {
    const d = state.canais[k] && state.canais[k].ultimaColeta;
    if (d && (!ultima || d > ultima)) ultima = d;
  }
  return { canais: keys.length, ultimaColeta: ultima };
}

/** Atualiza o state compartilhado (repo) a cada `mark` — commit + push à parte. */
function updateControlState(ctx, ids) {
  const analyzed = readJson(ctx.analyzedFile, []);
  const last = readJson(ctx.lastColetaFile, null);
  const state = readJson(CONTROL_STATE_FILE, null) || {};
  if (!state || typeof state !== 'object' || Array.isArray(state)) return;
  if (!state.canais || typeof state.canais !== 'object') state.canais = {};
  if (!state._meta) {
    state._meta = { nota: 'Fonte da verdade compartilhada entre PCs (só ids/datas — nunca transcrições). Commit + push após cada coleta.' };
  }
  const key = ctx.label || 'default';
  state.canais[key] = {
    ultimaColeta: (last && last.ultimaColeta) || todayStr(),
    analisados: Array.isArray(analyzed) ? analyzed.length : 0,
    ultimoVideoId: ids.length > 0 ? ids[ids.length - 1] : (state.canais[key] && state.canais[key].ultimoVideoId) || null,
    atualizadoEm: new Date().toISOString(),
  };
  writeJson(CONTROL_STATE_FILE, state);
  console.log(`[${ctx.label}] Estado compartilhado atualizado: state/yt-control.json (faça commit + push para o outro PC enxergar)`);
}

function mark(ctx, ids) {
  const list = new Set(readJson(ctx.analyzedFile, []));
  for (const id of ids) list.add(id);
  writeJson(ctx.analyzedFile, [...list].sort());
  updateLastColeta(ctx);
  updateControlState(ctx, ids);
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
  const handle = String(process.argv[i + 1] || '').replace(/^@/, '').toLowerCase();
  const ctx = allChannelCtxs().find((c) => c.label.replace(/^@/, '').toLowerCase() === handle || c.nome.toLowerCase().includes(handle));
  if (!ctx) {
    process.stderr.write(`Canal não encontrado na config: ${handle}\n`);
    process.exit(1);
  }
  return ctx;
}

/** Args posicionais após o comando, removendo --canal <handle>, --branch <nome> e outras flags. */
function posArgs() {
  const rest = process.argv.slice(3);
  for (const flag of ['--canal', '--branch']) {
    const i = rest.indexOf(flag);
    if (i !== -1) rest.splice(i, 2);
  }
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
  case 'sync-check': syncCheck(); break;
  case 'catalog': catalog(targetCtx()); break;
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
    console.log(`Uso: node ${basename(process.argv[1])} {sync-check [--json|--allow-stale|--no-fetch|--branch NOME]|catalog|catalog-all|diff [--since DATA|--since-last]|diff-all [--since DATA|--since-last]|download [--canal HANDLE] <id>...|dedup [--canal HANDLE] [vtt...]|mark [--canal HANDLE] <id>...|analyzed [--canal HANDLE]|last [--canal HANDLE]}`);
    console.log(`  YT_DIR=${defaultCtx().dir}`);
    console.log(`  YT_CHANNEL=${defaultCtx().channel}`);
}