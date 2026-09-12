---
name: agent-self-evaluation
description: "Use when use after completing any non-trivial task. The agent self-rates its output on 5 axes — accuracy, completeness, clarity, actionability, conciseness — with concrete evidence per criterion. Produces a structured 1-5 scorecard with specific improvem... Triggers on \"agent-self-evaluation\", \"agent self evaluation\", \"evaluation\"."
origin: ECC
---

# Agent Self-Evaluation

After completing a complex task, the agent pauses to rate its own output against a structured 5-axis rubric. This is NOT a pass/fail gate — it's a deliberate reflection step that catches omissions, flags overconfidence, and surface areas for improvement before the user has to.

## When to Activate

- After writing code that spans 3+ files or 50+ lines
- After completing a multi-step workflow (implement → test → review)
- After a debugging session that involved 3+ attempts
- After producing a design document, architecture decision, or written analysis
- When the user asks "how good was that?" or "rate yourself"
- At the end of any session Stop hook (if configured — see `references/hook-integration.md`)

## Core Concepts

### The 5 Evaluation Axes

| Axis | Question | What it catches |
|---|---|---|
| **Accuracy** | Are the facts, claims, and outputs correct? | Hallucinations, wrong API names, incorrect syntax, false statements |
| **Completeness** | Did it cover everything the user asked for? | Missed edge cases, unhandled error paths, forgotten requirements, skipped subtasks |
| **Clarity** | Is the explanation understandable and well-structured? | Confusing explanations, jargon without definition, missing context, rambling |
| **Actionability** | Can the user act on the output immediately? | Vague suggestions, missing steps, "you should X" without showing how, no verification path |
| **Conciseness** | Did it use the minimum words/tokens needed? | Redundancy, over-explanation, repeating the user's question verbatim, filler content |

### Scoring Scale

```
5 — Exceptional: no reasonable improvement possible
4 — Good: minor nits only, no substantive gaps
3 — Adequate: meets the request but has a notable weakness on at least one axis
2 — Weak: has a clear gap that affects usability or correctness
1 — Poor: fundamentally misses the request or contains significant errors
```

### The Evidence Rule

Every score below 5 MUST cite specific evidence. A score of 3 cannot just say "could be better" — it must say exactly what is missing or wrong. The mantra: **"Show the gap, don't just name it."**

## Workflow

### Step 1: Collect the Raw Material

Gather what you'll evaluate:

```
- The original user request (read back from conversation)
- Your final response/output (the deliverable)
- Any tool outputs that verify correctness (test results, exit codes, lint output)
- Any user feedback received during the task (corrections, "try again", "that's not right")
```

### Step 2: Score Each Axis Independently

Work through the 5 axes one at a time. For each:

1. Read the axis question
2. Find evidence (or lack of evidence) in the output
3. Assign a score 1-5