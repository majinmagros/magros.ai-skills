# Branching Strategies and Commit Messages

## GitHub Flow (Simple, Recommended for Most)

Best for continuous deployment and small-to-medium teams.

```
main (protected, always deployable)
  │
  ├── feature/user-auth      → PR → merge to main
  ├── feature/payment-flow   → PR → merge to main
  └── fix/login-bug          → PR → merge to main
```

**Rules:**
- `main` is always deployable
- Create feature branches from `main`
- Open Pull Request when ready for review
- After approval and CI passes, merge to `main`
- Deploy immediately after merge

## Trunk-Based Development (High-Velocity Teams)

Best for teams with strong CI/CD and feature flags.

```
main (trunk)
  │
  ├── short-lived feature (1-2 days max)
  ├── short-lived feature
  └── short-lived feature
```

**Rules:**
- Everyone commits to `main` or very short-lived branches
- Feature flags hide incomplete work
- CI must pass before merge
- Deploy multiple times per day

## GitFlow (Complex, Release-Cycle Driven)

Best for scheduled releases and enterprise projects.

```
main (production releases)
  │
  └── develop (integration branch)
        │
        ├── feature/user-auth
        ├── feature/payment
        │
        ├── release/1.0.0    → merge to main and develop
        │
        └── hotfix/critical  → merge to main and develop
```

**Rules:**
- `main` contains production-ready code only
- `develop` is the integration branch
- Feature branches from `develop`, merge back to `develop`
- Release branches from `develop`, merge to `main` and `develop`
- Hotfix branches from `main`, merge to both `main` and `develop`

## When to Use Which

| Strategy | Team Size | Release Cadence | Best For |
|----------|-----------|-----------------|----------|
| GitHub Flow | Any | Continuous | SaaS, web apps, startups |
| Trunk-Based | 5+ experienced | Multiple/day | High-velocity teams, feature flags |
| GitFlow | 10+ | Scheduled | Enterprise, regulated industries |

## Commit Messages

## Conventional Commits Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

## Types

| Type | Use For | Example |
|------|---------|---------|
| `feat` | New feature | `feat(auth): add OAuth2 login` |
| `fix` | Bug fix | `fix(api): handle null response in user endpoint` |
| `docs` | Documentation | `docs(readme): update installation instructions` |
| `style` | Formatting, no code change | `style: fix indentation in login component` |
| `refactor` | Code refactoring | `refactor(db): extract connection pool to module` |
| `test` | Adding/updating tests | `test(auth): add unit tests for token validation` |
| `chore` | Maintenance tasks | `chore(deps): update dependencies` |
| `perf` | Performance improvement | `perf(query): add index to users table` |
| `ci` | CI/CD changes | `ci: add PostgreSQL service to test workflow` |
| `revert` | Revert previous commit | `revert: revert "feat(auth): add OAuth2 login"` |

## Good vs Bad Examples

```
# BAD: Vague, no context
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "WIP"

# GOOD: Clear, specific, explains why
git commit -m "fix(api): retry requests on 503 Service Unavailable

The external API occasionally returns 503 errors during peak hours.
Added exponential backoff retry logic with max 3 attempts.

Closes #123"
```

## Commit Message Template

Create `.gitmessage` in repo root:

```
# <type>(<scope>): <subject>
# # Types: feat, fix, docs, style, refactor, test, chore, perf, ci, revert
# Scope: api, ui, db, auth, etc.
# Subject: imperative mood, no period, max 50 chars
#
# [optional body] - explain why, not what
# [optional footer] - Breaking changes, closes #issue
```

Enable with: `git config commit.template .gitmessage`
