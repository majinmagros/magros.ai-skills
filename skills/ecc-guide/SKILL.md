---
name: ecc-guide
description: "Use when guide users through ECC's current agents, skills, commands, hooks, rules, install profiles, and project onboarding by reading the live repository surface before answering. Triggers on \"ecc-guide\", \"ecc guide\", \"guide\"."
metadata:
  origin: community
---

# ECC Guide

Use this skill when a user needs help understanding, navigating, installing, or choosing parts of Everything Claude Code.

## When To Use

Use this skill when the user:

- asks what ECC includes
- wants help finding a skill, command, agent, hook, rule, or install profile
- is new to the repository and needs a guided path
- asks "how do I do X with ECC?"
- asks which ECC components fit a project
- needs a lightweight explanation of how commands, skills, agents, hooks, and rules relate
- is confused by install paths, duplicate installs, reset/uninstall, or selective install options

## Core Principle

Answer from current files, not memory. ECC changes quickly, so hard-coded catalog counts, feature lists, and install instructions go stale.

When the ECC repository is available, inspect the relevant files before giving a concrete answer:

```bash
node scripts/ci/catalog.js --json
find skills -maxdepth 2 -name SKILL.md | sort
find commands -maxdepth 1 -name '*.md' | sort
find agents -maxdepth 1 -name '*.md' | sort
node scripts/install-plan.js --list-profiles
node scripts/install-plan.js --list-components --json
```

Use the smallest set of reads needed for the user's question.

## Repository Map

- `README.md`: install paths, uninstall/reset guidance, public positioning, FAQs
- `AGENTS.md`: contributor guidance and project structure
- `agent.yaml`: exported gitagent surface and command list
- `commands/`: maintained slash-command compatibility shims
- `skills/*/SKILL.md`: reusable workflows and domain playbooks
- `agents/*.md`: delegated subagent role prompts
- `rules/`: language and harness rules
- `hooks/README.md`, `hooks/hooks.json`, `scripts/hooks/`: hook behavior and safety gates
- `manifests/install-*.json`: selective install modules, components, profiles, and target support
- `docs/`: harness guides, architecture notes, translated docs, release docs

## Response Style

Lead with the answer, then give the next action. Most users do not need a full catalog dump.

Good first response shape:

1. what to use
2. why it fits
3. exact file or command to inspect
4. one next command or question

Avoid: