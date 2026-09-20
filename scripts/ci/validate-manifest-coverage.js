#!/usr/bin/env node
/**
 * validate-manifest-coverage.js — garante que toda skill em skills/ esteja
 * mapeada em manifests/install-modules.json (módulo do instalador).
 *
 * Checa nos dois sentidos:
 *   1. Cada subdiretório de skills/ aparece em modules[].paths como `skills/<id>`.
 *      (Skill órfã = instalador por módulos não a contempla.)
 *   2. Cada path `skills/<id>` do manifesto tem diretório correspondente.
 *      (Entrada fantasma = módulo instalando o que não existe.)
 *
 * Sem dependências (roda em qualquer estação, com ou sem npm ci).
 * Achados são WARN por padrão (não quebra o build com backlog pré-existente);
 * passe --strict para promover a ERROR (exit 1). Espelhar em CI só quando o
 * backlog de órfãs estiver zerado.
 * Uso: node scripts/ci/validate-manifest-coverage.js [--strict]
 */

const fs = require('fs');
const path = require('path');

const STRICT = process.argv.includes('--strict');

const ROOT = path.join(__dirname, '..', '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const MANIFEST = path.join(ROOT, 'manifests', 'install-modules.json');

function main() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.log('No curated skills directory (skills/), skipping');
    process.exit(0);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8').replace(/^\uFEFF/, ''));
  const mapped = new Set();
  for (const mod of manifest.modules || []) {
    for (const p of mod.paths || []) {
      const m = String(p).match(/^skills\/([^/]+)$/);
      if (m) mapped.add(m[1]);
    }
  }
  const dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .map(e => e.name);

  let errors = 0;
  const report = msg => {
    if (STRICT) {
      console.error(`ERROR: ${msg}`);
      errors++;
    } else {
      console.warn(`WARN: ${msg}`);
      errors++;
    }
  };
  for (const dir of dirs) {
    if (!mapped.has(dir)) {
      report(`skills/${dir} sem mapeamento em manifests/install-modules.json (skill orfa no instalador)`);
    }
  }
  for (const id of [...mapped].sort()) {
    if (!dirs.includes(id)) {
      report(`manifests/install-modules.json referencia skills/${id} sem diretorio correspondente (entrada fantasma)`);
    }
  }
  if (errors > 0 && STRICT) {
    process.exit(1);
  }
  if (errors > 0) {
    console.log(`WARN: ${errors} pendência(s) de cobertura (rode com --strict para falhar)`);
    process.exit(0);
  }
  console.log(`OK: ${dirs.length} skills mapeadas em manifests/install-modules.json, 0 orfas, 0 fantasmas`);
}

main();
