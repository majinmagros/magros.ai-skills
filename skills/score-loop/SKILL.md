---
name: score-loop
description: Run a demanding task through a generator-evaluator loop with a cutoff grade — the agent builds at high performance standard, an evaluator tests and grades the result against a predefined weighted rubric, and if the score is below the threshold the work is redone and re-graded until it passes or the iteration budget is exhausted. Use when a task must reach a minimum quality score (e.g. 85/100) before it is considered finished.
argument-hint: "<task> --nota-corte <0-100> --max-iteracoes <N>"
---

# Score Loop

Proof-by-grading: build, grade, iterate until a minimum score is met.

## When to use

When the result must be proven reliable before finalizing — demanding coding tasks, refactors, migrations, or any delivery where "good enough" is decided by a numeric grade against predefined criteria.

## Steps

1. **Define the contract** — before writing anything, state:
   - Task (the deliverable)
   - Cutoff score (default **85** of 100; adjustable via argument)
   - Weighted rubric (default): Funcionalidade 0.4 · Confiabilidade 0.3 · Manutenibilidade 0.2 · Clareza 0.1
   - Iteration budget (default 5)
2. **Challenging prompt** — approach the task at maximum performance standard: demand the best possible solution, and explicitly list what would count as "not acceptable" (broken edge cases, unhandled errors, hidden assumptions, untested paths).
3. **Build** — implement the deliverable against the contract.
4. **Evaluate** — switch explicitly to the evaluator role (never grade in the same breath as building): test the result for real — run tests, execute code paths, probe edge cases — and score each rubric criterion 0-100. Final grade = weighted sum. If a separate agent or subagent is available, delegate evaluation to it for independence.
5. **Gate** — compare final grade to cutoff:
   - `grade >= cutoff` → finish with the report
   - `grade < cutoff` → write specific per-criterion feedback (what exactly missed points), then return to step 3 and rebuild addressing every point
6. **Plateau guard** — if the iteration budget is exhausted or the grade stagnates (delta < 2 points across 2 consecutive iterations), stop and report the blocker: NEVER auto-approve below the cutoff.

## Report format

```
Task: [deliverable]
Rubric: [criteria + weights]
Cutoff: [grade] | Final grade: [grade] | Iterations: [N]
Iteration history: [grade per iteration → feedback summary]
Verdict: PASS | BLOCKED
Unproven (declared): [what was not tested]
```

## Rules

- NEVER grade without testing — execution evidence, not intention.
- NEVER let the same mental pass build and grade; role-switch explicitly, or delegate.
- NEVER hide a failure to reach the cutoff; a declared limitation beats a silent risk.
- Feedback must be per-criterion and actionable — the next build must know exactly what to fix.
- If the environment cannot test something, list it in "Unproven" and treat it as a grade risk, not a pass.