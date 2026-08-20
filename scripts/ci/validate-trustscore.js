#!/usr/bin/env node
/**
 * validate-trustscore.js — TrustScore leve interno (inspirado em padrão corporativo)
 * Security 40% / Quality 60%, blockBelow 70, faixas 90/75/60/40/0
 * Penalidades: critico -20, alto -10, medio -3, baixo -1
 * Fonte unica: este arquivo (nao depende de docs externos)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '../..');
const SKILLS_DIR = path.join(ROOT, 'skills');

const BLOCK_BELOW = 70;
const WEIGHTS = { security: 0.4, quality: 0.6 };

function scanSecurity(content, file) {
  const findings = [];
  const lower = content.toLowerCase();
  // secret patterns
  if (/(sk_live|sk_test|ghp_[a-z0-9]{30,}|aws_?secret|api_key\s*=\s*["'][^"']{10,})/i.test(content)) {
    findings.push({ level: 'critico', msg: 'possivel secret hardcoded', file });
  }
  if (/process\.env\.(AWS|SECRET|TOKEN|KEY)/.test(content) && /hardcoded/.test(lower)) {
    findings.push({ level: 'alto', msg: 'env + hardcoded pattern', file });
  }
  // prompt injection
  if (/ignore (previous|above) instructions|system prompt|jailbreak/i.test(content)) {
    findings.push({ level: 'alto', msg: 'frase de prompt injection', file });
  }
  // exfiltracao
  if (/fetch\s*\(\s*["']https?:\/\/(?!api\.github|raw\.githubusercontent|platform\.claude)/i.test(content)) {
    findings.push({ level: 'medio', msg: 'fetch externo sem allowlist', file });
  }
  // eval / exec perigoso
  if (/\beval\s*\(|\bexec\s*\(.*\$\{/.test(content)) {
    findings.push({ level: 'medio', msg: 'eval/exec dinamico', file });
  }
  // supply chain: package.json sem lock?
  // (checado fora)
  return findings;
}

function scanQuality(content, file, frontmatter) {
  const findings = [];
  const lines = content.split('\n').length;
  if (lines > 200) findings.push({ level: 'medio', msg: `SKILL.md >200 linhas (${lines})`, file });
  const desc = frontmatter.description || '';
  if (desc.length > 1024) findings.push({ level: 'medio', msg: `description >1024 chars (${desc.length})`, file });
  if (!desc.includes('Use when') && !desc.includes('Use quando')) {
    findings.push({ level: 'baixo', msg: 'description sem gatilho Use when/quando', file });
  }
  if (!frontmatter.name || !/^[a-z0-9-]+$/.test(frontmatter.name)) {
    findings.push({ level: 'alto', msg: 'name invalido ou ausente', file });
  }
  return findings;
}

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx > -1) fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
  }
  return fm;
}

function scoreFromFindings(findings) {
  let secPenalty = 0, qualPenalty = 0;
  const penalties = { critico: 20, alto: 10, medio: 3, baixo: 1 };
  for (const f of findings) {
    const p = penalties[f.level] || 1;
    // heuristic: security vs quality by msg
    if (['critico','alto'].includes(f.level) && /secret|injection|fetch|eval/.test(f.msg)) secPenalty += p;
    else if (f.msg.includes('description') || f.msg.includes('SKILL.md') || f.msg.includes('name')) qualPenalty += p;
    else secPenalty += p * 0.5, qualPenalty += p * 0.5;
  }
  const secScore = Math.max(0, 100 - secPenalty);
  const qualScore = Math.max(0, 100 - qualPenalty);
  const total = Math.round(secScore * WEIGHTS.security + qualScore * WEIGHTS.quality);
  return { secScore, qualScore, total, findings };
}

function main() {
  const dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
  let blocked = 0;
  const results = [];
  for (const name of dirs) {
    const p = path.join(SKILLS_DIR, name, 'SKILL.md');
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, 'utf8');
    const fm = parseFrontmatter(content);
    const sec = scanSecurity(content, p);
    const qual = scanQuality(content, p, fm);
    const all = [...sec, ...qual];
    const { secScore, qualScore, total, findings } = scoreFromFindings(all);
    const faixa = total >= 90 ? 'A' : total >= 75 ? 'B' : total >= 60 ? 'C' : total >= 40 ? 'D' : 'E';
    results.push({ name, total, secScore, qualScore, faixa, findings });
    if (total < BLOCK_BELOW || findings.some(f => f.level === 'critico')) blocked++;
  }
  // sort worst first
  results.sort((a, b) => a.total - b.total);
  console.log(JSON.stringify({ blockBelow: BLOCK_BELOW, weights: WEIGHTS, totalSkills: results.length, blocked, results: results.slice(0, 20) }, null, 2));
  if (process.argv.includes('--strict') && blocked > 0) {
    console.error(`\nBLOCKED: ${blocked} skills abaixo de ${BLOCK_BELOW} ou com critico (faixa E/D)`);
    process.exit(1);
  }
  if (blocked > 0) console.log(`\nAviso: ${blocked} skills bloqueadas (nao falha sem --strict)`);
  else console.log('\nTrustScore OK: nenhuma skill bloqueada');
}

main();
