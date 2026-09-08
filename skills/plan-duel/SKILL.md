---
name: plan-duel
description: "Use when running an adversarial plan duel between two models in up to 5 rounds with a blind judge and anti-loop guards. Triggers on \"plan duel\", \"model duel\", \"blind judge\", \"claude vs codex\". Non-triggers: single-plan review without a duel (use santa-method). Outcome: duel protocol plus round log plus blind verdict plus anti-loop guard."
metadata:
  origin: ECC
---

# Plan Duel

Settle "which plan wins" by dueling two models (for example Claude vs Codex)
for at most 5 rounds, judged blind. Includes a jealousy-driven anti-loop
guard so the duel converges instead of escalating forever.

## When To Activate

- Two models disagree on architecture or plan and the user wants a winner.
- The user asks for Claude vs Codex on the same task.
- A plan needs adversarial pressure before approval.
- Previous duels looped without a verdict.

## Workflow

### 1. Freeze the duel contract

- Same brief, same constraints, same acceptance criteria for both sides.
- Max 5 rounds; round format: plan -> critique -> rebuttal.
- Name the blind judge up front (model or human) and its rubric.
- Stop early on agreement or on judge verdict; no extra rounds.

### 2. Run rounds 1-2: independent plans

- Both sides plan without seeing each other (no cross-contamination).
- Each plan states: approach, risks, cost estimate, test strategy.
- Judge scores both blind (model names hidden) on the rubric.

### 3. Run rounds 3-4: critique and rebuttal

- Each side critiques the anonymized rival plan, then rebuts its own critique.
- New evidence allowed; new scope is not (scope change = forfeit round).
- Judge re-scores; if one side leads twice in a row, duel ends early.

### 4. Round 5 (only if tied): judge picks with reasons

- Judge returns: winner, score per criterion, deciding reason.
- Loser plan archived with the reason it lost (future context).
- Winner plan moves to implementation; duel artifacts stay in the log.

### 5. Enforce the anti-loop guard

- Jealousy-driven escalation (each side adding scope to outshine) = stop signal.
- Cap: 5 rounds hard max, 1 judge call per round, no rematches same day.
- Spin signals: repeated claims, scope creep, judge score oscillation.

## Anti-Patterns

- Open-ended rounds -> duel never ends.
- Judge sees model names -> brand bias replaces plan quality.
- Rival plans share context mid-duel -> two copies of the same plan.
- Scope added to win -> winner is the most bloated plan.
- Rematch until favorite wins -> verdict shopping.
- No rubric -> judge decides on vibes.

## Relations

- `grills`: owns adversarial questioning of one plan; this skill duels two plans against each other.
- `santa-method`: owns dual-reviewer pass gates; this skill adds rounds plus a blind verdict.
- `council`: owns multi-voice deliberation; this skill narrows it to a two-model contest.
- `agent-eval`: owns costed benchmark suites; this skill is lighter (no harness, judge-scored).

## Sources

- Eval and rubric guidance (judge criteria, A/B comparison): https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- Duel format (up to 5 rounds), blind judge, and jealousy-driven guard from video evidence #161 (id RX6tRSGpd_8) are author measurement, not benchmarks - calibrate round count and rubric weights on your own tasks before standardizing.
