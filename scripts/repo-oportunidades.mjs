import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { execSync } from 'node:child_process';

const REPOS_CONFIG = 'manifests/repos-vigilados.json';

function readJson(file, fallback) {
  if (!existsSync(file)) return fallback;
  return JSON.parse(readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  if (!existsSync(dirname(file))) mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

/** Executa comando gh e retorna JSON. */
function gh(args) {
  try {
    return JSON.parse(execSync(`gh ${args.join(' ')}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }));
  } catch (e) {
    return null;
  }
}

/** Cataloga SKILL.md de um repo (só metadata/frontmatter). */
function catalogRepo(repo) {
  console.log(`[${repo}] Catalogando...`);
  const files = gh(['api', `repos/${repo}/contents/skills`, '--paginate']);
  if (!files) return [];
  
  return files.filter(f => f.type === 'dir').map(dir => {
    const skillName = dir.name;
    const content = gh(['api', `repos/${repo}/contents/skills/${skillName}/SKILL.md`]);
    if (!content) return { name: skillName, error: 'SKILL.md não encontrado' };
    
    // Extrai frontmatter basico (parser simples de chave: valor YAML)
    const raw = Buffer.from(content.content, 'base64').toString('utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const meta = { name: skillName };
    if (match) {
      for (const line of match[1].split('\n')) {
        const idx = line.indexOf(':');
        if (idx > 0) {
          const key = line.slice(0, idx).trim();
          const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
          if (key && !key.startsWith('#')) meta[key] = val;
        }
      }
    }
    return meta;
  });
}

const config = readJson(REPOS_CONFIG, { repos: [] });
const allSkills = {};

for (const repoInfo of config.repos) {
  const repo = repoInfo.repo;
  allSkills[repo] = catalogRepo(repo);
}

writeJson('docs/vigilancia/CATALOGO-REPOS.json', allSkills);
console.log('Catálogo de repos concluído.');
