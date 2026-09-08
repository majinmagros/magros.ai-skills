---
name: rule-drift-auditor
description: "Use when rules in CLAUDE.md or AGENTS.md may no longer match what the code does, after refactors, failed compacts, or coordinator-heavy runs. Triggers on \"rule drift\", \"rules vs code\", \"stale rules\", \"handoff doc\", \"fresh restart\", \"delegator vs coordinator\". Non-triggers: size-only audit (use claude-md-auditor), rules to hooks migration (use rules-to-hooks-auditor). Outcome: a drift report with stale rules, handoff doc, and a delegator fix plan."
metadata:
  origin: ECC
---

# Rule Drift Auditor

Audit the gap between written rules and real code. Rules rot: refactors
land, compacts drop context, writers approve their own work, and
coordinators invent process nobody follows. This skill diffs
CLAUDE.md and AGENTS.md against the repo, then fixes the run before
the next session inherits the rot.

This skill measures drift, not size. If you only need line counts and
trim suggestions, use a size audit instead (see Relations).

## When To Activate

- The user suspects rules are stale, ignored, or contradict the code.
- After a big refactor, a failed compact, or a long session where
  "the agent stopped following the rules".
- A run used a coordinator where a simple delegator would do, or a
  model was swapped mid-task and behavior changed.
- A writer approved its own output, or iterations kept going past
  the point of improvement.

## Core Concepts

- **Drift**: a rule that claims X while the code does Y, or a rule
  nobody can point to in the repo. Drift is binary per rule: holds
  or does not hold. No partial credit without evidence.
- **Contaminated conversation**: a long or compacted session where
  context is lossy. Never swap models mid-task to fix it; write a
  handoff doc and restart fresh instead.
- **Simple delegator vs coordinator**: a delegator splits work, sets
  done criteria, and merges. A coordinator narrates, re-plans, and
  re-approves. Coordinators are unreliable; prefer the delegator.
- **Fresh reviewer**: drift verdicts come from a reviewer with no
  stake in the rules or the code. The writer never approves.
- **Full trace**: every rule checked, every evidence hit (file and
  line), and every verdict kept. No trace = no audit.

## Workflow

### 1. Collect the rules

- Read CLAUDE.md and AGENTS.md plus any nested rule files they import.
- Number each rule (R1, R2, ...) with its source file and line.
- Mark load-bearing rules (security, deploy, data handling) first;
  they get evidence before style rules do.

### 2. Diff each rule against the code

- For each rule, search the repo for the behavior it mandates or
  forbids (grep for commands, configs, patterns, call sites).
- Verdict per rule: HOLDS (evidence found), STALE (code moved on),
  CONTRADICTED (code does the opposite), ORPHAN (no referent left).
- Record file and line per evidence hit. A verdict without a
  pointer is an opinion, not a finding.

### 3. Score drift and cut or fix

- Drift rate = STALE + CONTRADICTED + ORPHAN over total rules.
- Fix order: CONTRADICTED first, then STALE load-bearing, then
  ORPHAN cleanup. Never bulk-delete without reading callers.
- Rules under ~200 lines total stay readable; length is a signal,
  not the verdict. A short file can still be fully drifted.
- Propose per rule: KEEP (with evidence), REWRITE (new wording +
  new pointer), or DROP (with reason).

### 4. Run the handover protocol on contaminated sessions

- Detect contamination: post-compact confusion, ~10% detail
  retention symptoms, repeated rule violations, or a mid-task
  model swap already attempted.
- Do NOT swap models mid-task. Freeze the session instead.
- Write a handoff doc: goal, done criteria, current state,
  open threads, pointers to evidence, and what NOT to retry.
- Fresh-restart: new session reads the handoff doc, re-verifies
  pointers, then continues. The old session is read-only history.

### 5. Replace coordinators with simple delegators

- Flag coordinator symptoms: status narration, re-planning loops,
  writer-approves-own-work, 10-20 iteration runs with degrading
  output (over-iteration usually makes things worse, not better).
- Rewrite as delegator: split into <=5 parallel tasks, one done
  criterion each, merge with a fresh reviewer at the end.
- Cap iterations explicitly (for example: 3 passes, then reviewer
  decides ship vs rewrite). No open-ended "keep improving".

### 6. Verify with a fresh reviewer and ship the report

- A fresh reviewer re-checks a sample of verdicts against the
  pointers, blind to who wrote the rules.
- Ship one drift report: rule table (R-id, verdict, evidence),
  drift rate, handoff doc link, delegator fix plan.
- Log remaining work as new tasks (append-only): rule id,
  proposed wording, owner, evidence pointer.

## Anti-Patterns

- Measuring length instead of drift -> short but wrong stays wrong.
- Swapping models mid-task -> inherits contamination; restart fresh.
- Writer approves own work -> rubber stamp; require fresh reviewer.
- Coordinator for a splittable task -> narration over output.
- Over-iterating past the cap -> polish that degrades the result.
- Compact as a fix for rot -> compact drops detail; audit first.

## Relations

- `rules-to-hooks-auditor`: migrates load-bearing rules into hooks;
  run this drift audit first so only true rules get migrated.
- `claude-md-auditor`: size and structure audit (lines, trims,
  path-scoped rules); this skill checks truth vs code, not size.
- `santa-method`: fresh adversarial reviewer; reuse for step 6.
- `score-loop`: iteration budget with a graded bar; reuse for the
  iteration cap in step 5.
- `retomar-sessao`: session recovery and handoff docs; pair with step 4
  when a session is lost or contaminated.

## Sources

- Video ColeMedin `UbylWXukvR8` (11 fixes: rule drift, anti-compact,
  rules to hooks, no mid-task model swap, anti-coordinator, fresh
  reviewer, anti-over-iteration, validation as system):
  https://www.youtube.com/watch?v=UbylWXukvR8
- Claims in that video (1 in 4 repos stale, ~10% compact retention,
  iteration degradation) are medicao do autor, nao benchmark --
  do not quote them as facts; measure your own repo.
- Skill size guidance (keep skills small and focused):
  https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
