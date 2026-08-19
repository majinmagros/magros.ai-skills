#!/usr/bin/env node
/**
 * Fonte unica de verdade dos numeros do repo.
 *
 * Le manifests/skills-autorais.json (lista curada das skills autorais),
 * conta os SKILL.md de fato presentes em skills/ e imprime os numeros
 * usados no README / GUIA-COMPLETO / OPORTUNIDADES-REPOS.
 *
 * Falha (exit 1) se alguma skill listada no manifest nao tiver SKILL.md.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../..');
const AUTORAIS_MANIFEST = path.join(ROOT, 'manifests/skills-autorais.json');
const SKILLS_DIR = path.join(ROOT, 'skills');

function readAuthorial() {
  const raw = fs.readFileSync(AUTORAIS_MANIFEST, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data.skills)) {
    throw new Error('manifests/skills-autorais.json deve ter um array "skills"');
  }
  return data.skills;
}

function listSkillDirs() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .filter(d => fs.existsSync(path.join(SKILLS_DIR, d.name, 'SKILL.md')))
    .map(d => d.name);
}

function main() {
  const authorial = readAuthorial();
  const present = listSkillDirs();

  const missing = authorial.filter(name => !present.includes(name));
  if (missing.length > 0) {
    console.error('ERROR: skills autorais do manifest sem SKILL.md em skills/:');
    for (const name of missing) console.error(`  - ${name}`);
    process.exit(1);
  }

  const authorialSet = new Set(authorial);
  const autoralPresent = present.filter(name => authorialSet.has(name));
  const herdadas = present.filter(name => !authorialSet.has(name));

  console.log(JSON.stringify({
    total_skills: present.length,
    autorais: autoralPresent.length,
    herdadas_ecc: herdadas.length,
  }, null, 2));
}

main();