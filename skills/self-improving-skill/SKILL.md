---
name: self-improving-skill
description: "Use when designing a skill that improves itself from per-use feedback logs with wrap-up reviews and promotion of learnings to rules. Triggers on \"self-improving skill\", \"feedback log\", \"skill wrap-up\", \"promote learnings\". Non-triggers: one-shot skill authoring with no learning loop (use skill-creator-methodology). Outcome: feedback log template plus wrap-up checklist plus promotion rule plus convergence tracker."
metadata:
  origin: ECC
---

# Self-Improving Skill

Pattern for skills that get better with use: every run appends a feedback
log, a wrap-up proposes one tweak at a time, and stable learnings get
promoted to rules. Expect convergence around session 10 (author measurement).

## When To Activate

- The user wants a skill that learns from its own runs.
- A skill keeps needing the same manual fix after each use.
- There is a feedback log but no process turning it into skill edits.
- Learnings live in chat history instead of rules.

## Workflow

### 1. Ship version 1 with a feedback log

- Add a log file next to the skill (for example `feedback-log.md`).
- Log per run: date | task | what worked | what failed | manual fix applied.
- No run counts as done until its log row exists.

### 2. Run the wrap-up after each session

- Ask: which single change would have removed the manual fix?
- Propose at most one tweak per session; batch changes hide causality.
- Record rejected tweaks with a reason so they are not re-proposed.

### 3. Apply the tweak to the skill

- Structural error -> edit the SKILL body, not the caller prompt.
- Deterministic step -> move it to a script, not prose.
- Keep the skill under 200 lines; push detail to references.

### 4. Track convergence

- Score each run 1-5 on: output quality, tokens used, manual fixes needed.
- Converged = 3 consecutive runs with no manual fix and stable scores.
- Typical convergence is around session 10; investigate past session 15.

### 5. Promote stable learnings to rules

- A learning seen in 3+ runs becomes a rule candidate.
- Promote via the rules pipeline; keep the skill pointing at the rule.
- Delete the log rows that the rule now covers to keep the log short.

## Anti-Patterns

- Logging without wrap-up -> archive nobody reads.
- Five tweaks per session -> unknown which one helped.
- Editing the caller prompt instead of the skill -> same bug next caller.
- Promoting a one-off into a rule -> rule bloat.
- Declaring convergence after one good run -> regression next run.
- Feedback log inside chat history -> lost on compact.

## Relations

- `continuous-learning-v2`: owns session-level instinct capture; this skill owns the per-skill feedback loop.
- `rules-distill`: owns extraction of rules from skill content; this skill feeds it promotion candidates.
- `skill-creator-methodology`: owns first-time skill authoring; this skill owns runs 2 to N.

## Sources

- Skill authoring best practices (structure, iteration, evals): https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- Feedback-log shape and "converges around session 10" from video evidence #156 are author measurement, not benchmarks - track your own convergence scores before quoting the number.
