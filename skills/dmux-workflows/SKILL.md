---
name: dmux-workflows
description: "Use when running multiple agent sessions in parallel with dmux/tmux panes across harnesses. Triggers on \"dmux\", \"multi-agent\", \"parallel agents\", \"tmux panes\"."
metadata:
  origin: ECC
---

# dmux Workflows

Orchestrate parallel AI agent sessions using dmux, a tmux pane manager. Detalhes em `references/`.

## When to Activate

- Running multiple agent sessions in parallel
- Coordinating work across Claude Code, Codex, and other harnesses
- Complex tasks that benefit from divide-and-conquer parallelism
- User says "run in parallel", "split this work", "use dmux", or "multi-agent"

## Core Principles

1. **Independent tasks only** — never parallelize dependent outputs
2. **Clear boundaries** — each pane owns distinct files or concerns
3. **Merge strategically** — review pane output before merging
4. **Isolate with worktrees** when panes touch overlapping files
5. **Cap at 5-6 panes** — each pane is a full session burning tokens

## Example

```bash
dmux
# press 'n', then prompt per pane:
# Pane 1: "Create the billing schema and migrations"
# Pane 2: "Build the billing API endpoints"
# press 'm' to merge results back
```

## References

- `references/concepts-setup.md` — what is dmux, install, quick start, tools table
- `references/workflow-patterns.md` — research+implement, multi-file, test/fix, cross-harness, review
- `references/worktrees-orchestration.md` — git worktrees, ECC helper, seedPaths
- `references/signals-enrichment.md` — troubleshooting, cmux vs tmux, wait-for signals

## Checklist

- [ ] Tasks are independent with clear file/concern boundaries
- [ ] Worktrees created when file overlap is likely
- [ ] Pane count kept at 5-6 max for token control
- [ ] Output reviewed before merge; completion signal defined
