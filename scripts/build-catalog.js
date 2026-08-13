#!/usr/bin/env node
/**
 * build-catalog.js — gera docs/data/skills.json a partir do repo.
 * Lê: cada skills/<id>/SKILL.md (frontmatter + corpo), manifests/install-modules.json (módulo/custo).
 * Marca autorais pela lista canônica do README (frontmatter não identifica ECC de forma confiável).
 * Uso: node scripts/build-catalog.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const MANIFEST = path.join(ROOT, 'manifests', 'install-modules.json');
const OUT_DIR = path.join(ROOT, 'docs', 'data');
const OUT_FILE = path.join(OUT_DIR, 'skills.json');

const AUTORAIS = new Set([
  'analise-concorrentes','anti-hallucination','auditar-skills','auditoria-artefatos',
  'automacao-deterministica','baixar-musica','checklist-requisitos','clareza','clarificar',
  'constituicao-projeto','convergencia','conversa','coordenacao','criar-campanha-visual',
  'criar-skill','criatividade','dnb-production','doctor','encontrar-skill','engenharia-de-grafos',
  'gauntlet-loop','goal','graph-engineering','graphify','grill-with-docs','grilling','grills',
  'humanizar-texto','pesquisa-social','plan','prompt-builder','routines','score-loop',
  'superpowers','taste','triagem-bug','triagem-ideias','workflows'
]);

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!m) return { fm: {}, body: content };
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/\s+#.*$/, '').trim();
  }
  return { fm, body: content.slice(m[0].length).trim() };
}

function slugify(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const modById = new Map(manifest.modules.map(m => [m.id, m]));
  const skillToModule = {};
  for (const mod of manifest.modules) {
    for (const p of mod.paths) {
      const m = p.match(/^skills\/([^/]+)$/);
      if (m) skillToModule[m[1]] = mod;
    }
  }

  const skills = [];
  for (const dir of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory() || dir.name.startsWith('.')) continue;
    const skillMd = path.join(SKILLS_DIR, dir.name, 'SKILL.md');
    if (!fs.existsSync(skillMd)) continue;
    const content = fs.readFileSync(skillMd, 'utf8');
    const { fm, body } = parseFrontmatter(content);
    const mod = skillToModule[dir.name];
    const isAutoral = AUTORAIS.has(dir.name);
    skills.push({
      id: dir.name,
      name: fm.name || dir.name,
      description: fm.description || '',
      origin: isAutoral ? 'autoral' : (fm.metadata === 'ECC' || mod ? 'ecc' : 'ecc'),
      module: mod ? mod.id : null,
      cost: mod ? mod.cost : null,
      stability: mod ? mod.stability : null,
      defaultInstall: mod ? mod.defaultInstall : null,
      body,
      github: `https://github.com/majinmagros/magros.ai-skills/tree/master/skills/${dir.name}`
    });
  }

  skills.sort((a, b) => a.id.localeCompare(b.id));
  const out = {
    generatedAt: new Date().toISOString(),
    repo: 'majinmagros/magros.ai-skills',
    counts: {
      total: skills.length,
      autorais: skills.filter(s => s.origin === 'autoral').length,
      ecc: skills.filter(s => s.origin === 'ecc').length,
      modules: new Set(skills.map(s => s.module).filter(Boolean)).size
    },
    skills
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), 'utf8');
  console.log(`OK: ${out.counts.total} skills (${out.counts.autorais} autorais, ${out.counts.ecc} ECC) -> ${path.relative(ROOT, OUT_FILE)}`);
}

main();
