import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const require = createRequire(join(homedir(), 'AppData/Roaming/npm/node_modules/9router/'));
const Database = require('better-sqlite3');
const db = new Database(join(homedir(), '.local/share/opencode/opencode.db'), { readonly: true });

const args = process.argv.slice(2);
const sessionId = args[0];
const outDir = join(homedir(), 'projetos', 'retomadas');
mkdirSync(outDir, { recursive: true });

function parse(s) { try { return JSON.parse(s); } catch { return {}; } }

function listSessions() {
  return db.prepare(`
    SELECT id, title, time_updated,
      (SELECT COUNT(*) FROM part p WHERE p.session_id = s.id) AS parts
    FROM session s ORDER BY time_updated DESC LIMIT 15
  `).all();
}

function exportSession(id) {
  const s = db.prepare('SELECT id, title, time_created, time_updated FROM session WHERE id = ?').get(id);
  if (!s) throw new Error('Sessao nao encontrada: ' + id);
  const parts = db.prepare(`
    SELECT p.id, p.time_created, p.data
    FROM part p WHERE p.session_id = ? ORDER BY p.time_created ASC, p.id ASC
  `).all(id);

  const title = (s.title || ('sessao-' + id.slice(-8))).replace(/[\\/:*?"<>|]/g, '_');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const out = join(outDir, `retomada_${stamp}_${title}.md`);

  const lines = [];
  lines.push(`# RETOMADA DE SESSAO - ${s.title || title}`);
  lines.push('');
  lines.push(`> Session: ${id}`);
  lines.push(`> Criada: ${new Date(s.time_created).toISOString()}`);
  lines.push(`> Exportado: ${new Date().toISOString()}`);
  lines.push('');

  for (const p of parts) {
    const d = parse(p.data);
    const ts = new Date(p.time_created).toISOString();
    if (d.type === 'text' && d.text) {
      lines.push(`---`);
      lines.push(`> ${ts}`);
      lines.push('');
      lines.push(d.text);
      lines.push('');
    } else if (d.type === 'reasoning' && d.text) {
      lines.push(`<details><summary>raciocinio (${ts})</summary>`);
      lines.push('');
      lines.push(d.text);
      lines.push('');
      lines.push('</details>');
      lines.push('');
    } else if (d.type === 'tool') {
      const st = d.state || {};
      const input = st.input ? JSON.stringify(st.input) : '';
      const output = st.output ? String(st.output) : '';
      lines.push(`- [tool] ${d.tool}${d.title ? ' (' + d.title + ')' : ''} ${ts}`);
      if (output) lines.push('  ```\n  ' + output.split('\n').slice(0, 25).join('\n  ') + '\n  ```');
      lines.push('');
    }
  }

  writeFileSync(out, lines.join('\n'), 'utf8');
  return { out, count: parts.length, title: s.title };
}

try {
  if (sessionId === 'list' || !sessionId) {
    for (const s of listSessions()) {
      console.log(`${s.id} | ${s.title || '(sem titulo)'} | ${s.parts} parts | ${new Date(s.time_updated).toISOString()}`);
    }
  } else {
    const r = exportSession(sessionId);
    console.log(`EXPORTADO ${r.count} partes para:`);
    console.log(`  ${r.out}`);
  }
} catch (e) {
  console.error('ERRO: ' + e.message);
  process.exit(1);
}