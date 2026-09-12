---
name: agent-swarm-ops
description: "Use when running uncoordinated agent swarms (not orchestrated delegation) with mailbox/thread messaging, file-claim locking, budget caps, bail-out exits, and adversarial verification. Triggers on \"agent swarm\", \"swarm coordination\", \"claim-file\", \"message board\", \"mailbox\", \"deconfliction\", \"bail-out\", \"referee\", \"swarm takeaways\", \"Herder\". Non-triggers: single-orchestrator delegation (use sessoes-orquestradas/team-agent-orchestration), Docker Swarm (use docker-patterns). Outcome: a swarm that coordinates without a central planner, with locks, budgets, exits, and measurable coordination health."
metadata:
  origin: ECC
---

# Agent Swarm Ops

Run **swarms** (agents coordinate via shared messaging, no central planner) instead
of **orchestration** (one agent delegates). Swarms scale further but fail in
specific, repeatable ways — this skill makes those failures cheap and visible.

## When To Activate

- The user says swarm, agent swarm, Herder-style run, or many agents working
  without an orchestrator.
- The task needs parallel exploration where slices overlap (code, research,
  builds) and agents must deconflict among themselves.
- A previous multi-agent run deadlocked, overwrote shared files, burned budget
  on coordination, or stalled with dead agents.

## Topology

```text
swarm
├── thread (unit of work, has an owner + definition-of-done)
│   ├── agent (claims files, posts to mailbox, exits with done)
│   └── agent ...
└── thread ...
```

- **Mailbox / message board**: unstructured shared messaging per thread.
  It is the coordination unlock — but also the main overhead source.
- **Full trace**: every claim, post, lock, and exit is logged. No trace = no swarm.

## Protocols

### 1. Claim-file locking

- Before writing a shared file, the agent posts a **claim** (`claim-file`).
- No write without a held claim. Release (`unlock`) on `done`.
- **Claim violation** (write without lock) fails the run, not just the step.

### 2. Budget-aware execution

- Each thread declares a token/call/time ceiling (`check-budget`).
- Coordination has a bootup cost: the first N messages produce alignment, not
  output. Budget for it explicitly or small swarms starve.

### 3. Done with mandatory bail-out

- `done` requires a reason **plus** an output file.
- Every task ships an explicit **bail-out exit**: impossible task, missing
  dependency, or stalled thread must terminate with a verdict, never spin.
- Tasks without an exit are how agents start breaking rules to "finish"
  (see `agent-guardrails`, G20 anti-reward-hack).

### 4. Referee + canonical sign-off

- One verifier (human or referee agent) owns the **canonical** output.
- Agents never write the canonical directly in chat — that deadlocks
  (N agents appending to one shared text).
- Verification cost scales with compute: budget referee passes like workers.
