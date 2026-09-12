---
name: team-builder
description: "Use when interactive agent picker for composing and dispatching parallel teams. Triggers on \"team-builder\", \"team builder\", \"builder\"."
metadata:
  origin: community
---

# Team Builder

Interactive menu for browsing and composing agent teams on demand. Works with flat or domain-subdirectory agent collections.

## When to Use

- You have multiple agent personas (markdown files) and want to pick which ones to use for a task
- You want to compose an ad-hoc team from different domains (e.g., Security + SEO + Architecture)
- You want to browse what agents are available before deciding

## Prerequisites

Agent files must be markdown files containing a persona prompt (identity, rules, workflow, deliverables). The first `# Heading` is used as the agent name and the first paragraph as the description.

Both flat and subdirectory layouts are supported:

**Subdirectory layout** — domain is inferred from the folder name:

```
agents/
├── engineering/
│   ├── security-engineer.md
│   └── software-architect.md
├── marketing/
│   └── seo-specialist.md
└── sales/
    └── discovery-coach.md
```

**Flat layout** — domain inferred from shared filename prefixes. A prefix counts as a domain when 2+ files share it. Files with unique prefixes go to "General". Note: the algorithm splits at the first `-`, so multi-word domains (e.g., `product-management`) should use the subdirectory layout instead:

```
agents/
├── engineering-security-engineer.md
├── engineering-software-architect.md
├── marketing-seo-specialist.md
├── marketing-content-strategist.md
├── sales-discovery-coach.md
└── sales-outbound-strategist.md
```

## Configuration

Agents are discovered via two methods, merged and deduplicated by agent name:

1. **`claude agents` command** (primary) — run `claude agents` to get all agents known to the CLI, including user agents, plugin agents (e.g. `ecc:architect`), and built-in agents. This automatically covers ECC marketplace installs without any path configuration.
2. **File glob** (fallback, for reading agent content) — agent markdown files are read from:
   - `./agents/**/*.md` + `./agents/*.md` — project-local agents
   - `~/.claude/agents/**/*.md` + `~/.claude/agents/*.md` — global user agents

Earlier sources take precedence when names collide: user agents > plugin agents > built-in agents. A custom path can be used instead if the user specifies one.

## How It Works

### Step 1: Discover Available Agents

Run `claude agents` to get the full agent list. Parse each line:
- **Plugin agents** are prefixed with `plugin-name:` (e.g., `ecc:security-reviewer`). Use the part after `:` as the agent name and the plugin name as the domain.