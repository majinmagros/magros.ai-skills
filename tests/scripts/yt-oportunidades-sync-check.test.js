/**
 * Tests for the `sync-check` command of scripts/yt-oportunidades.mjs
 * (pre-collection GitHub sync gate for multi-PC collection).
 *
 * Strategy: real git fixture repos (local bare repo as `origin`, so no
 * network). The script under test operates on YT_REPO_ROOT, never on the
 * real checkout.
 */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, execSync } = require('child_process');

const SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'yt-oportunidades.mjs');

function sh(cmd, cwd, env) {
  execSync(cmd, { cwd, env: { ...process.env, ...(env || {}) }, stdio: 'pipe', timeout: 30000 });
}

function makeRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yt-sync-'));
  sh('git init', dir);
  sh('git config user.email "test@example.com"', dir);
  sh('git config user.name "Test"', dir);
  sh('git config commit.gpgsign false', dir);
  fs.writeFileSync(path.join(dir, 'file.txt'), 'v1\n');
  sh('git add .', dir);
  sh('git commit -m "init"', dir);
  sh('git branch -M master', dir);
  return dir;
}

function makeBare() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yt-sync-remote-'));
  sh('git init --bare', dir);
  return dir;
}

function cleanup(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
}

function run(args, repoRoot, extraEnv) {
  try {
    const stdout = execFileSync('node', [SCRIPT, ...args], {
      cwd: repoRoot,
      env: { ...process.env, YT_REPO_ROOT: repoRoot, ...(extraEnv || {}) },
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 60000,
    });
    return { code: 0, stdout, stderr: '' };
  } catch (error) {
    return {
      code: error.status == null ? 1 : error.status,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    };
  }
}

/** Repo ligado a um origin bare, com push inicial (em dia). */
function makeInSyncPair() {
  const remote = makeBare();
  const repo = makeRepo();
  sh(`git remote add origin "${remote}"`, repo);
  sh('git push -u origin master', repo);
  return { remote, repo };
}

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

function runTests() {
  console.log('\n=== Testing yt-oportunidades.mjs sync-check ===\n');

  let passed = 0;
  let failed = 0;
  const dirs = [];
  const track = (...ds) => { dirs.push(...ds); };

  if (test('em dia: exit 0 + EM DIA', () => {
    const { remote, repo } = makeInSyncPair();
    track(remote, repo);
    const r = run(['sync-check'], repo);
    assert.strictEqual(r.code, 0, `stdout: ${r.stdout} stderr: ${r.stderr}`);
    assert.ok(r.stdout.includes('EM DIA'), r.stdout);
  })) passed++; else failed++;

  if (test('--json: exit 0 + JSON válido com chaves esperadas', () => {
    const { remote, repo } = makeInSyncPair();
    track(remote, repo);
    const r = run(['sync-check', '--json'], repo);
    assert.strictEqual(r.code, 0, `stdout: ${r.stdout} stderr: ${r.stderr}`);
    const obj = JSON.parse(r.stdout);
    for (const k of ['ok', 'branch', 'localSha', 'remoteSha', 'behind', 'ahead', 'dirty']) {
      assert.ok(k in obj, `chave ausente: ${k}`);
    }
    assert.strictEqual(obj.ok, true);
    assert.strictEqual(obj.behind, 0);
    assert.strictEqual(obj.ahead, 0);
  })) passed++; else failed++;

  if (test('atrás do remoto: exit 1 + hint de pull', () => {
    const { remote, repo } = makeInSyncPair();
    track(remote, repo);
    const other = fs.mkdtempSync(path.join(os.tmpdir(), 'yt-sync-other-'));
    track(other);
    sh(`git clone "${remote}" .`, other);
    sh('git config user.email "test@example.com"', other);
    sh('git config user.name "Test"', other);
    fs.writeFileSync(path.join(other, 'other.txt'), 'do outro pc\n');
    sh('git add .', other);
    sh('git commit -m "coleta do outro pc"', other);
    sh('git push origin master', other);
    const r = run(['sync-check'], repo);
    assert.strictEqual(r.code, 1, `stdout: ${r.stdout} stderr: ${r.stderr}`);
    assert.ok(r.stdout.includes('ATRÁS') || r.stdout.includes('pull --rebase'), r.stdout);
    const rj = run(['sync-check', '--json'], repo);
    assert.strictEqual(JSON.parse(rj.stdout).behind, 1);
  })) passed++; else failed++;

  if (test('worktree suja: exit 1 + hint de commit/stash', () => {
    const { remote, repo } = makeInSyncPair();
    track(remote, repo);
    fs.appendFileSync(path.join(repo, 'file.txt'), 'modificação local\n');
    const r = run(['sync-check'], repo);
    assert.strictEqual(r.code, 1, `stdout: ${r.stdout} stderr: ${r.stderr}`);
    assert.ok(r.stdout.includes('modificado') || r.stdout.includes('commit/stash'), r.stdout);
  })) passed++; else failed++;

  if (test('commits sem push: exit 1 + hint de push', () => {
    const { remote, repo } = makeInSyncPair();
    track(remote, repo);
    fs.writeFileSync(path.join(repo, 'mine.txt'), 'meu commit\n');
    sh('git add .', repo);
    sh('git commit -m "coleta local sem push"', repo);
    const r = run(['sync-check', '--json'], repo);
    assert.strictEqual(r.code, 1, `stdout: ${r.stdout} stderr: ${r.stderr}`);
    const obj = JSON.parse(r.stdout);
    assert.strictEqual(obj.ahead, 1);
    assert.ok(r.stdout.includes('PUSH') || r.stdout.includes('push'), r.stdout);
  })) passed++; else failed++;

  if (test('--allow-stale libera repo atrás com exit 0', () => {
    const { remote, repo } = makeInSyncPair();
    track(remote, repo);
    const other = fs.mkdtempSync(path.join(os.tmpdir(), 'yt-sync-other-'));
    track(other);
    sh(`git clone "${remote}" .`, other);
    sh('git config user.email "test@example.com"', other);
    sh('git config user.name "Test"', other);
    fs.writeFileSync(path.join(other, 'other.txt'), 'x\n');
    sh('git add .', other);
    sh('git commit -m "outro pc"', other);
    sh('git push origin master', other);
    const r = run(['sync-check', '--allow-stale'], repo);
    assert.strictEqual(r.code, 0, `stdout: ${r.stdout} stderr: ${r.stderr}`);
  })) passed++; else failed++;

  if (test('remoto inacessível: exit 2 (e 0 com --allow-stale)', () => {
    const repo = makeRepo();
    track(repo);
    sh('git remote add origin "/caminho/que/nao/existe/remote.git"', repo);
    const r = run(['sync-check', '--no-fetch'], repo);
    assert.strictEqual(r.code, 2, `stdout: ${r.stdout} stderr: ${r.stderr}`);
    assert.ok(r.stdout.includes('INVERIFIC'), r.stdout);
    const r2 = run(['sync-check', '--no-fetch', '--allow-stale'], repo);
    assert.strictEqual(r2.code, 0, `stdout: ${r2.stdout}`);
  })) passed++; else failed++;

  if (test('fora de repo git: exit 2', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yt-sync-norepo-'));
    track(dir);
    const r = run(['sync-check', '--no-fetch'], dir);
    assert.strictEqual(r.code, 2, `stdout: ${r.stdout} stderr: ${r.stderr}`);
  })) passed++; else failed++;

  if (test('mark atualiza state/yt-control.json no repo (sem transcrição)', () => {
    const { remote, repo } = makeInSyncPair();
    track(remote, repo);
    const ytDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yt-sync-transcricoes-'));
    track(ytDir);
    const r = run(['mark', 'abc123'], repo, { YT_DIR: ytDir });
    assert.strictEqual(r.code, 0, `stdout: ${r.stdout} stderr: ${r.stderr}`);
    const stateFile = path.join(repo, 'state', 'yt-control.json');
    assert.ok(fs.existsSync(stateFile), 'state/yt-control.json não foi criado');
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    assert.ok(state.canais && state.canais.default, JSON.stringify(state));
    assert.strictEqual(state.canais.default.analisados, 1);
    assert.strictEqual(state.canais.default.ultimoVideoId, 'abc123');
    // Nada de transcrição dentro do repo
    const hasDedup = JSON.stringify(state).includes('.dedup');
    assert.strictEqual(hasDedup, false);
  })) passed++; else failed++;

  for (const d of dirs) {
    try { cleanup(d); } catch { /* best-effort */ }
  }

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
