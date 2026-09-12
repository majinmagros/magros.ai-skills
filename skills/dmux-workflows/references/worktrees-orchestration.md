# Worktrees and ECC Orchestration

## Best Practices

1. **Independent tasks only.** Don't parallelize tasks that depend on each other's output.
2. **Clear boundaries.** Each pane should work on distinct files or concerns.
3. **Merge strategically.** Review pane output before merging to avoid conflicts.
4. **Use git worktrees.** For file-conflict-prone work, use separate worktrees per pane.
5. **Resource awareness.** Each pane uses API tokens — keep total panes under 5-6.

## Git Worktree Integration

For tasks that touch overlapping files:

```bash
# Create worktrees for isolation
git worktree add -b feat/auth ../feature-auth HEAD
git worktree add -b feat/billing ../feature-billing HEAD

# Run agents in separate worktrees
# Pane 1: cd ../feature-auth && claude
# Pane 2: cd ../feature-billing && claude

# Merge branches when done
git merge feat/auth
git merge feat/billing
```

## ECC Helper

ECC includes a helper for external tmux-pane orchestration with separate git worktrees:

```bash
node scripts/orchestrate-worktrees.js plan.json --execute
```

Example `plan.json`:

```json
{
  "sessionName": "skill-audit",
  "baseRef": "HEAD",
  "launcherCommand": "codex exec --cwd {worktree_path} --task-file {task_file}",
  "workers": [
    { "name": "docs-a", "task": "Fix skills 1-4 and write handoff notes." },
    { "name": "docs-b", "task": "Fix skills 5-8 and write handoff notes." }
  ]
}
```

The helper:

- Creates one branch-backed git worktree per worker
- Optionally overlays selected `seedPaths` from the main checkout into each worker worktree
- Writes per-worker `task.md`, `handoff.md`, and `status.md` files under `.orchestration/<session>/`
- Starts a tmux session with one pane per worker
- Launches each worker command in its own pane
- Leaves the main pane free for the orchestrator

Use `seedPaths` when workers need access to dirty or untracked local files that are not yet part of `HEAD`, such as local orchestration scripts, draft plans, or docs:

```json
{
  "sessionName": "workflow-e2e",
  "seedPaths": [
    "scripts/orchestrate-worktrees.js",
    "scripts/lib/tmux-worktree-orchestrator.js",
    ".claude/plan/workflow-e2e-test.json"
  ],
  "launcherCommand": "bash {repo_root}/scripts/orchestrate-codex-worker.sh {task_file} {handoff_file} {status_file}",
  "workers": [
    { "name": "seed-check", "task": "Verify seeded files are present before starting work." }
  ]
}
```
