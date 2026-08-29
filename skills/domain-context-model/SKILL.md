---
name: domain-context-model
description: Use when establishing or maintaining a shared domain vocabulary, glossary, and CONTEXT.md file for a project to align agent and human terminology, prevent verbosity, and reduce token consumption. Triggers on "context.md", "shared language", "domain model", "glossário de domínio", "vocabulário compartilhado".
metadata:
  origin: Matt Pocock / ECC
---

# Domain Context Model (CONTEXT.md)

Establish a shared vocabulary between humans and AI agents to make communication concise and codebase naming consistent.

## Core Concepts
- **CONTEXT.md**: A lightweight project root file defining domain terms, jargon mappings, and architectural boundaries.
- **Concision**: Replacing long operational explanations with precise domain terms (e.g., "materialization cascade" instead of a paragraph explaining file creation).
- **Consistency**: Ensuring file names, variables, and functions match the defined domain model.

## Implementation Steps
1. Create or update `CONTEXT.md` at the root of the repository.
2. Define core domain entities, states, and operations.
3. Reference `CONTEXT.md` in agent instructions (`AGENTS.md` / `CLAUDE.md`).
