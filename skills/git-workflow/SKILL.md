---
name: git-workflow
description: "Use when git workflow patterns including branching strategies, commit conventions, merge vs rebase, conflict resolution, and collaborative development best practices for teams of all sizes. Only for Git — not for other VCS. Triggers on \"git-workflow\", \"git workflow\", \"workflow\"."
metadata:
  origin: ECC
---

# Git Workflow Patterns

Best practices for Git version control, branching strategies, and collaborative development.

## When to Activate

- Setting up Git workflow for a new project
- Deciding on branching strategy (GitFlow, trunk-based, GitHub flow)
- Writing commit messages and PR descriptions
- Resolving merge conflicts
- Managing releases and version tags
- Onboarding new team members to Git practices

## When NOT to Use

- Other VCS (Mercurial, SVN, Perforce)
- CI/CD pipeline definitions (use `deployment-patterns`)
- GitOps/K8s delivery (use `git-workflow` concepts via `kubernetes-patterns`)

## Contents

| Topic | Reference |
|---|---|
| Branching, conventional commits | `references/branching-commits.md` |
| Merge vs rebase, PR workflow | `references/merge-pr.md` |
| Conflicts, naming, stash | `references/conflicts-branches.md` |
| Releases, config, aliases | `references/release-config.md` |
| Daily workflows, hooks, anti-patterns | `references/workflows-hooks.md` |

## Example

```bash
git checkout -b feat/user-auth
git commit -m "feat(auth): add login rate limiting"
git push -u origin feat/user-auth
```

## Quick Reference

| Task | Command |
|------|---------|
| Create branch | `git checkout -b feature/name` |
| Switch branch | `git checkout branch-name` |
| Delete branch | `git branch -d branch-name` |
| Merge branch | `git merge branch-name` |
| Rebase branch | `git rebase main` |
| View history | `git log --oneline --graph` |
| View changes | `git diff` |
| Stage changes | `git add .` or `git add -p` |
| Commit | `git commit -m "message"` |
| Push | `git push origin branch-name` |
| Pull | `git pull origin branch-name` |
| Stash | `git stash push -m "message"` |
| Undo last commit | `git reset --soft HEAD~1` |
| Revert commit | `git revert HEAD` |

## Referências

- `references/branching-commits.md` — GitHub Flow, trunk-based, GitFlow, commits
- `references/merge-pr.md` — merge vs rebase, PRs, review
- `references/conflicts-branches.md` — conflitos, naming, stash
- `references/release-config.md` — semver, tags, changelog, aliases
- `references/workflows-hooks.md` — dia a dia, hooks, anti-patterns
