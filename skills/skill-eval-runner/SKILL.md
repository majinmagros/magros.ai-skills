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
  outputs voids the comparison.

### 4. Run paired arms in parallel

- Launch arm A (skill loaded) and arm B (skill unloaded) as
  parallel subagents with identical prompts and output schema.
- Isolate contexts: no shared files, no cross-talk, same model.
- Capture per case: output text, pass/fail per criterion, tokens
  in/out, wall-clock seconds.

### 5. Score blind and price the delta

- The judge scores outputs without knowing which arm produced
  which output.
- Compute per skill: mean quality delta (A minus B), token delta,
  time delta, and win rate across prompts.
- Example shape (illustrative only, not a target): quality
  92% vs 83% with +17s and +8k tokens on the winning arm.

### 6. Benchmark per model and decide keep or drop

- Repeat steps 4-5 on each model that matters (at least one
  cheap and one strong model).
- Keep/drop rule:
  - Strong model solves alone (near-ceiling with and without)
    -> skill is unnecessary on that model; drop or narrow it.
  - Cheap model gains a lot with the skill -> skill justifies
    its cost; keep and note the model scope.
  - No quality delta anywhere -> drop or rewrite the skill.
- Record the verdict per model, not one global verdict.

### 7. Ship the HTML dashboard and learnings

- Write one HTML report per run: prompt table, per-arm scores,
  deltas, tokens, time, verdict, and links to raw traces.
- Append one line per run to a learnings log: what changed in
  the description or rubric and whether the delta moved.
- If the verdict is rewrite, change the description first
  (triggers are the usual failure), then re-run.

## Anti-Patterns

- Grading your own output -> builder bias hides real deltas.
- Editing prompts, rubric, or skill mid-run -> invalid comparison.
- Testing only prompts that trigger -> misses false-positive cost.
- One model only -> keep/drop does not transfer across models.
- Reporting quality without tokens and time -> hides the price.
- Confusing obedience with quality -> that is compliance, not eval.

## Relations

- `skill-comply`: obedience checking (did the agent follow the text).
  This skill measures quality delta (did the output get better).
- `criar-skill`: section 7 defines evals and per-model benchmark
  policy; this skill is the executable runner for that policy.
- `agent-eval`: head-to-head agent and harness comparison; reuse its
  isolation and metrics discipline for skill arms.
- `cost-aware-llm-pipeline`: token budgets, per-task cost tracking,
  and routing cheap vs strong models for step 6.

## Sources

- Video ratosdeia `jZKu-9-NN6Y` (Skills 2.0 eval: prompts from the
  description, parallel subagents with/without skill, HTML dashboard):
  https://www.youtube.com/watch?v=jZKu-9-NN6Y
- All run numbers shown in that video (including shapes like 92% vs
  83%, +17s, +8k tokens) are medicao do autor, nao benchmark --
  do not quote them as facts; measure your own runs.
- Skill eval policy (evals before shipping, per-model keep/drop):
  https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
