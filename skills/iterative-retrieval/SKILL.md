---
name: iterative-retrieval
description: "Use when subagents need progressively refined codebase context via dispatch-evaluate-refine loop. Triggers on \"iterative-retrieval\", \"iterative retrieval\", \"retrieval\"."
metadata:
  origin: ECC
---

# Iterative Retrieval Pattern

Fix the subagent context problem: broad search, score relevance, refine, max 3 cycles. Detalhes em `references/`.

## When to Activate

- Spawning subagents that need codebase context they cannot predict upfront
- Building multi-agent workflows where context is progressively refined
- Encountering "context too large" or "missing context" failures in agent tasks
- Designing RAG-like retrieval pipelines for code exploration
- Optimizing token usage in agent orchestration

## Core Principles

1. **Dispatch broad** — keywords + patterns, never over-specified upfront
2. **Evaluate 0-1** — high ≥0.8, medium 0.5-0.7, low <0.5, none <0.2 excluded
3. **Refine from evidence** — adopt codebase terms, exclude proven-irrelevant paths
4. **Loop max 3** — stop at good enough (3 files ≥0.7 beats 10 mediocre)
5. **Track gaps explicitly** — missing-context list drives the next cycle

## Example

```markdown
When retrieving context for this task:
1. Start with broad keyword search
2. Evaluate each file's relevance (0-1 scale)
3. Identify what context is still missing
4. Refine search criteria and repeat (max 3 cycles)
5. Return files with relevance >= 0.7
```

## References

- `references/loop-phases.md` — problem, 4-phase loop diagram, dispatch/evaluate/refine code
- `references/examples.md` — bug-fix and feature-implementation cycles with scores
- `references/integration-practices.md` — agent prompt snippet, best practices, related

## Checklist

- [ ] Initial query broad (patterns + keywords + excludes, no over-spec)
- [ ] Every file scored 0-1 with reason and missing-context noted
- [ ] Refinement adopts discovered terms; irrelevant paths excluded
- [ ] Stopped at ≤3 cycles with ≥0.7 files; gaps recorded if insufficient
