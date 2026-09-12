---
name: inherit-legacy-style
description: Legacy-project style inheritance skill. Use when the user types /inherit-legacy-style, or when onboarding an AI coding agent onto a hand-written legacy project and you need to prevent "style drift" (the model imposing its pretrained mainstream idioms onto the project). Language- and framework-agnostic — it aligns meta-architecture only, not syntax. Once run, it becomes a behavioral constraint on all subsequent coding tasks. Do NOT use for pure research or one-off questions unrelated to code-style alignment.
metadata:
  origin: community
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, AskUserQuestion
---

# Inherit Legacy Style

Prevents AI code style drift in legacy projects by scanning the codebase for implicit conventions across 4 meta-architecture dimensions, resolving conflicts with the user one at a time, and crystallizing the consensus into an enforceable `.ai-style-rules.md`. Fully language- and framework-agnostic.

## When to Activate

- User types `/inherit-legacy-style`
- User mentions onboarding AI onto a hand-written legacy project
- User is worried about AI-generated code "drifting" from existing project conventions
- User wants to extract and codify their project's implicit coding rules

## When to Use

Use this skill when you need to preserve legacy project style and prevent AI-generated style drift. See **When to Activate** above for trigger conditions.

## Prerequisites

- Git (recommended; non-Git projects fall back to file timestamps for incremental mode)
- Read/Write access to the project root (generates `.ai-style-rules.md` and optionally `CLAUDE.md`)

## Workflow

### Step 0 — Auto-Detect Mode

Silently check for `.ai-style-rules.md` at the project root:

| File exists? | Mode |
|---|---|
| No | **Branch A — First-time Full-Scan** |
| Yes | **Branch B — Incremental Sniff** |

Announce the mode in one line and proceed — never ask the user to pick.

### Branch A — First-time Full-Scan

**1. Measure scale, pick a scanning tier**

```bash
git ls-files | grep -cE '\.(js|ts|jsx|tsx|vue|py|go|rs|java|kt|rb|php|cs|swift|c|cpp|h)$'
```

| Tier | Source files | Strategy |
|---|---|---|
| Small | ≲ 50 | Full close-read every source |
| Medium | 50–500 | Infra layer = full read; business layer = sample 2–3 per dimension |
| Large | ≳ 500 | Strict sampling + budget cap; `--stat` summary first, then targeted reads |

**2. Scan along 4 dimensions**

1. **File Anatomy** — in-file declaration order (imports → types → main logic → helpers → export)
2. **State & Control Flow** — naming conventions for async state, pagination, flags
3. **Infrastructure** — where cross-cutting utils live (interceptors, formatters, middleware)
4. **Error Handling** — try/catch vs global interceptor vs Result return; null-check habits

**3. Apply signal-threshold noise reduction**

Before interrupting the user, evaluate signal strength: