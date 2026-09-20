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

// Espelha INTENTIONALLY_UNSHIPPED_SKILL_IDS de validate-install-manifests.js:21
// (manter sincronizado manualmente; aquele arquivo exige `ajv`, este roda sem deps).
const INTENTIONALLY_UNSHIPPED = new Set([
  'skill-comply', // meta-skill com .pyc + .gitignore aninhado; revisit apos packaging cleanup
  'ai-media-generator', // marcado como externo naquele arquivo; mapeado aqui mesmo assim
]);

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
    if (!mapped.has(dir) && !INTENTIONALLY_UNSHIPPED.has(dir)) {
      report(`skills/${dir} sem mapeamento em manifests/install-modules.json (skill orfa no instalador)`);
    }
  }
  for (const id of [...mapped].sort()) {
    if (!dirs.includes(id)) {
      report(`manifests/install-modules.json referencia skills/${id} sem diretorio correspondente (entrada fantasma)`);
    }
  }
  // Dependencias circulares entre modulos (A->B->C->A quebra a instalacao).
  // Desconhecidas ficam com validate-install-manifests; aqui so ciclos.
  const depGraph = new Map();
  for (const mod of manifest.modules || []) {
    depGraph.set(mod.id, (mod.dependencies || []).filter(d => typeof d === 'string'));
  }
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map([...depGraph.keys()].map(k => [k, WHITE]));
  const stack = [];
  let cycle = null;
  function dfs(node) {
    color.set(node, GRAY);
    stack.push(node);
    for (const dep of depGraph.get(node) || []) {
      if (!depGraph.has(dep)) continue;
      if (color.get(dep) === GRAY) {
        cycle = [...stack.slice(stack.indexOf(dep)), dep];
        return true;
      }
      if (color.get(dep) === WHITE && dfs(dep)) return true;
    }
    stack.pop();
    color.set(node, BLACK);
    return false;
  }
  for (const node of depGraph.keys()) {
    if (color.get(node) === WHITE && dfs(node)) break;
  }
  if (cycle) {
    report(`dependencia circular entre modulos: ${cycle.join(' -> ')}`);
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
