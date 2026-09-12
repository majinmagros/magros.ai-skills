---
name: github-ops
description: GitHub repository operations, automation, and management. Issue triage, PR management, CI/CD operations, release management, and security monitoring using the gh CLI. Use when the user wants to manage GitHub issues, PRs, CI status, releases, contributors, stale items, or any GitHub operational task beyond simple git commands.
metadata:
  origin: ECC
---

# GitHub Operations

Manage GitHub repositories with a focus on community health, CI reliability, and contributor experience.

## When to Activate

- Triaging issues (classifying, labeling, responding, deduplicating)
- Managing PRs (review status, CI checks, stale PRs, merge readiness)
- Debugging CI/CD failures
- Preparing releases and changelogs
- Monitoring Dependabot and security alerts
- Managing contributor experience on open-source projects
- User says "check GitHub", "triage issues", "review PRs", "merge", "release", "CI is broken"

## Tool Requirements

- **gh CLI** for all GitHub API operations
- Repository access configured via `gh auth login`

## Issue Triage

Classify each issue by type and priority:

**Types:** bug, feature-request, question, documentation, enhancement, duplicate, invalid, good-first-issue

**Priority:** critical (breaking/security), high (significant impact), medium (nice to have), low (cosmetic)

### Triage Workflow

1. Read the issue title, body, and comments
2. Check if it duplicates an existing issue (search by keywords)
3. Apply appropriate labels via `gh issue edit --add-label`
4. For questions: draft and post a helpful response
5. For bugs needing more info: ask for reproduction steps
6. For good first issues: add `good-first-issue` label
7. For duplicates: comment with link to original, add `duplicate` label

```bash
# Search for potential duplicates
gh issue list --search "keyword" --state all --limit 20

# Add labels
gh issue edit <number> --add-label "bug,high-priority"

# Comment on issue
gh issue comment <number> --body "Thanks for reporting. Could you share reproduction steps?"
```

## PR Management

### Review Checklist

1. Check CI status: `gh pr checks <number>`
2. Check if mergeable: `gh pr view <number> --json mergeable`
3. Check age and last activity
4. Flag PRs >5 days with no review
5. For community PRs: ensure they have tests and follow conventions
