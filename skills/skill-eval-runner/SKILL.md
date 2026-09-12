---
name: skill-eval-runner
description: "Use when deciding if a skill earns its tokens via paired A/B evals with and without the skill, scored by an independent rubric with cost and time deltas. Triggers on \"skill eval\", \"skill A/B\", \"skills 2.0 eval\", \"keep or drop skill\", \"description eval\". Non-triggers: obedience-only checks (use skill-comply), agent tool benchmarking (use agent-eval). Outcome: a keep/drop verdict per skill and model with quality delta, token/time cost, and an HTML report."
metadata:
  origin: ECC
---

# Skill Eval Runner

Run paired A/B evals that decide if a skill stays or goes. One arm runs
with the skill loaded, the other without it, on the same prompts, judged
by an independent rubric. Quality delta decides; token and time deltas
price the win.

This skill measures output quality, not obedience. If you only need to
check whether the agent followed the skill text, use a compliance check
instead (see Relations).

## When To Activate

- The user asks if a skill works, if it is worth its tokens, or if its
  description triggers auto-invoke correctly.
- A new or edited skill needs proof before it ships (description change,
  new workflow step, new references or scripts).
- A team debates keep vs drop for a skill on a specific model (cheap
  model that may need it vs strong model that may not).
- A previous eval was vibe-based ("felt better") and needs numbers.

## Core Concepts

- **Paired arms**: same prompt set, same model, same seed policy. Only
  the skill changes (loaded vs unloaded). No paired arms = no verdict.
- **Prompts from the description**: derive test prompts from the trigger
  phrases in the skill description, plus 2-3 near-miss prompts that
  should NOT trigger it.
- **Parallel subagents**: run both arms as isolated parallel subagents
  with no shared context, one task per agent, fixed output schema.
- **Independent judge**: a separate reviewer scores blind outputs
  against the rubric. The builder never grades its own output.
- **Full trace**: every prompt, arm, output, score, token count, and
  duration is logged. No trace = no eval.

## Workflow

### 1. Freeze the candidate

- Pin the skill version under test (name + git ref or file hash).
- Record model id, date, and eval purpose in one header block.
- Do not edit the skill mid-run. Edits invalidate the run.

### 2. Build the prompt set

- Take 3-5 prompts straight from the description triggers.
- Add 2-3 near-miss prompts that must NOT invoke the skill.
- Keep each prompt self-contained with its own done criteria.
- Cap at 8 prompts so the run stays cheap and repeatable.

### 3. Define the rubric

- Use 4-6 criteria max, each 0-2 points (0 = miss, 1 = partial,
  2 = solid). Suggested axes: correctness, completeness, format
  compliance, no-extra-fluff, done-criteria met.
- Write one observable check per criterion ("output includes X",
  "output avoids Y"). No vibe criteria ("feels clean").
- Freeze the rubric before running. Changing it after seeing