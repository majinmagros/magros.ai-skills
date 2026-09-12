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