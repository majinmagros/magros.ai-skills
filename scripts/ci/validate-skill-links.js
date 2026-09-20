#!/usr/bin/env node
/**
 * validate-skill-links.js — verifica que toda skill citada em secoes
 * `## Related skills` de SKILL.md existe como diretorio em skills/.
 *
 * So valida tokens `entre backticks` sem `/`, `.`, `:` ou espaco (formato
 * das listas Related skills). Referencias a docs/commands/scripts sao
 * ignoradas pelo filtro e ficam fora de escopo.
 *
 * WARN por padrao (nao quebra o build com refs quebradas pre-existentes);
 * passe --strict para promover a ERROR (exit 1).
 * Uso: node scripts/ci/validate-skill-links.js [--strict]
 */

const fs = require('fs');
const path = require('path');

const STRICT = process.argv.includes('--strict');
const ROOT = path.join(__dirname, '..', '..');
const SKILLS_DIR = path.join(ROOT, 'skills');

const SECTION_RE = /^#{1,4}\s+Related skills\s*$/i;
const HEADING_RE = /^#{1,4}\s+\S/;
const TOKEN_RE = /`([^`]+)`/g;
const SKILL_SHAPE_RE = /^[a-z0-9][a-z0-9-]{2,}$/;

function relatedRefs(content) {
  const refs = [];
  const lines = content.split(/\r?\n/);
  let inSection = false;
  lines.forEach((line, idx) => {
    if (SECTION_RE.test(line.trim())) {
      inSection = true;
      return;
    }
    if (inSection && HEADING_RE.test(line.trim())) {
      inSection = false;
      return;
    }
    if (!inSection) return;
    TOKEN_RE.lastIndex = 0;
    let m;
    while ((m = TOKEN_RE.exec(line)) !== null) {
      const token = m[1].trim();
      if (SKILL_SHAPE_RE.test(token)) {
        refs.push({ token, line: idx + 1 });
      }
    }
  });
  return refs;
}

function main() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.log('No curated skills directory (skills/), skipping');
    process.exit(0);
  }
  const dirs = new Set(
    fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter(e => e.isDirectory() && !e.name.startsWith('.'))
      .map(e => e.name)
  );
  let findings = 0;
  for (const dir of [...dirs].sort()) {
    const file = path.join(SKILLS_DIR, dir, 'SKILL.md');
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
    for (const { token, line } of relatedRefs(content)) {
      if (token === dir) continue;
      if (!dirs.has(token)) {
        const msg = `skills/${dir}/SKILL.md:${line} cita '${token}' em Related skills sem diretorio correspondente`;
        if (STRICT) console.error(`ERROR: ${msg}`);
        else console.warn(`WARN: ${msg}`);
        findings++;
      }
    }
  }
  if (findings > 0 && STRICT) process.exit(1);
  if (findings > 0) {
    console.log(`WARN: ${findings} referencia(s) quebrada(s) em Related skills (rode com --strict para falhar)`);
    process.exit(0);
  }
  console.log(`OK: todas as referencias Related skills resolvem para skills/ (${dirs.size} skills verificadas)`);
}

main();
