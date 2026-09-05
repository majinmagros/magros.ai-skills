# Release Management and Git Configuration

## Semantic Versioning

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes
MINOR: New features, backward compatible
PATCH: Bug fixes, backward compatible

Examples:
1.0.0 → 1.0.1 (patch: bug fix)
1.0.1 → 1.1.0 (minor: new feature)
1.1.0 → 2.0.0 (major: breaking change)
```

## Creating Releases

```bash
# Create annotated tag
git tag -a v1.2.0 -m "Release v1.2.0

Features:
- Add user authentication
- Implement password reset

Fixes:
- Resolve login redirect issue

Breaking Changes:
- None"

# Push tag to remote
git push origin v1.2.0

# List tags
git tag -l

# Delete tag
git tag -d v1.2.0
git push origin --delete v1.2.0
```

## Changelog Generation

```bash
# Generate changelog from commits
git log v1.1.0..v1.2.0 --oneline --no-merges

# Or use conventional-changelog
npx conventional-changelog -i CHANGELOG.md -s
```

## Git Configuration

## Essential Configs

```bash
# User identity
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Default branch name
git config --global init.defaultBranch main

# Pull behavior (rebase instead of merge)
git config --global pull.rebase true

# Push behavior (push current branch only)
git config --global push.default current

# Auto-correct typos
git config --global help.autocorrect 1

# Better diff algorithm
git config --global diff.algorithm histogram

# Color output
git config --global color.ui auto
```

## Useful Aliases

```bash
# Add to ~/.gitconfig
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --oneline --graph --all
    amend = commit --amend --no-edit
    wip = commit -m "WIP"
    undo = reset --soft HEAD~1
    contributors = shortlog -sn
```

## Gitignore Patterns

```gitignore
# Dependencies
node_modules/
vendor/

# Build outputs
dist/
build/
*.o
*.exe

# Environment files
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Test coverage
coverage/

# Cache
.cache/
*.tsbuildinfo
```
