---
name: fable-5-prompt-workflow
description: "Use when prompting, configuring, or routing tasks for Claude Fable 5.2 — determining effort levels, managing reasoning overhead, stripping over-prescriptive instructions, and optimizing agent output. Triggers on \"Fable 5.2\", \"fable-5 prompt workflow\", \"prompting Fable 5\", \"effort caps Claude\"."
metadata:
  origin: ECC
---

# Fable 5.2 Prompt & Effort Workflow

Optimized workflows and prompt structuring principles for working with Fable 5.2 models and newer reasoning engines.

## When to Activate

- Writing or modernizing prompts specifically for Fable 5.2 / Opus 5 class models
- Adjusting effort levels and token budgets for complex reasoning tasks
- Removing over-prescriptive guidance that hinders newer reasoning models
- Debugging model behavior on multi-step agent loops

## Core Principles

1. **Goal-Over-Steps**: Focus prompts on the definition of done and intent rather than prescribing rigid step-by-step instructions (reasoning models perform better when given autonomy over the path).
2. **Effort Calibration**: Match task complexity with appropriate effort caps to balance cost and output quality.
3. **Strip Slop & Rituals**: Remove obsolete preamble, markdown rituals, or redundant constraint phrases that modern models handle natively.

## Best Practices

- Define clear acceptance criteria and verification gates.
- Let the model reason freely within bounded constraints.
- Test prompt changes across multiple model tiers (Haiku, Sonnet, Fable) before committing.
