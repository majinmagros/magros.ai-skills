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

/** Busca recursivamente arquivos SKILL.md em um repo. */
async function findSkills(repo) {
  console.log(`[${repo}] Buscando recursivamente...`);
  const tree = gh(['api', `repos/${repo}/git/trees/master?recursive=1`]);
  if (!tree || !tree.tree) return [];
  
  const skillFiles = tree.tree.filter(f => f.path.endsWith('SKILL.md'));
  const skills = [];

  for (const file of skillFiles) {
    const content = gh(['api', `repos/${repo}/contents/${file.path}`]);
    if (!content) continue;

    const raw = Buffer.from(content.content, 'base64').toString('utf8');
    const skillName = file.path.split('/').slice(-2, -1)[0];
    
    // Parse frontmatter
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const meta = { name: skillName, path: file.path };
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
    skills.push(meta);
  }
  return skills;
}

const config = readJson(REPOS_CONFIG, { repos: [] });
const allSkills = {};

for (const repoInfo of config.repos) {
  const repo = repoInfo.repo;
  allSkills[repo] = await findSkills(repo);
}

writeJson('docs/vigilancia/CATALOGO-REPOS.json', allSkills);
console.log('Catálogo de repos concluído.');
