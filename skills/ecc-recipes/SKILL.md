---
name: ecc-recipes
description: "Use when map a described workflow to the right ECC command-GROUP with run-order and stop condition, and browse all command-group recipe families. Adds a family-grouping + run-order + when-to-stop layer on top of the flat command catalog. Advisory only. TRIGGER when the user sa... Triggers on \"ecc-recipes\", \"ecc recipes\", \"recipes\"."
argument-hint: <workflow description | empty=list all>
origin: community
author: KyawZinLatt
version: "1.0.0"
---

# ECC Recipes

One entry point for "which group of ECC slash-commands runs my workflow, in what
order, and when do I stop." Also browses every command-group recipe family.

Fills the gap between two existing skills:

- `ecc-guide` — lists commands and where to read docs, but as a flat catalog.
- `prompt-optimizer` — matches a task to components, but outputs a single prompt,
  not a multi-command group with run-order and stop condition.

This skill adds: **family grouping + run-order + stop condition.**

## When to Activate

- "Which command group do I run for <workflow>?"
- "What's the command sequence to build an MVP / fix a defect / refactor?"
- "Show me all ECC command-group recipes" (catalog mode)
- "How many workflow pipelines does ECC have?"
- User invokes `/ecc-recipes` with or without a description.

### Do Not Use When

- User wants the task done now — route to the actual command, don't describe it.
- User wants deep docs for ONE command — use `ecc-guide`.
- User wants a draft prompt rewritten — use `prompt-optimizer`.

## Core Principle

**Answer from current files, not memory.** The command set changes; never
hardcode counts or member lists. Read the live `commands/` directory each run,
then classify into families.

### Live reads

Resolve the commands directory (first that exists), then list names:

```bash
for D in \
  "$HOME"/.claude/plugins/marketplaces/ecc/commands \
  "$HOME"/.claude/plugins/cache/ecc/ecc/*/commands \
  ./commands \
  ./.claude/commands \
  "$HOME"/.claude/commands; do
  [ -d "$D" ] && CMD_DIR="$D" && break
done
[ -z "${CMD_DIR:-}" ] && { echo "No ECC commands directory found."; return 1; }
find "$CMD_DIR" -maxdepth 1 -name '*.md' -exec basename {} .md \; | sort
```

Optionally read `manifests/install-*.json` if present for richer grouping. Use
the smallest set of reads needed.

## Family Classification (by prefix)

Group command names by leading prefix; map known singletons by hand. Families are