---
name: grills
description: Stress-test a plan and its implementation with repeated and adversarial runs (edge cases, extreme inputs, concurrency, load) before the solution is executed or finalized. Use when a plan or code patch must be proven highly reliable before completion.
argument-hint: "<target: plano | codigo | ambos>"
---

# Grills

Prove reliability of a plan and/or its generated code through repeated, adversarial testing before finalizing.

## When to use

Before declaring a solution finished (or executing a plan against real state), when the cost of failure is high: error-prone code paths, concurrency, shared state, I/O, timing, user-facing flows.

## Steps

1. **Inventory the target** — take the plan and/or code being tested. List the "hot spots" where failures live:
   - Boundaries and limits (max sizes, ranges, overflow, empty/null inputs)
   - Shared state, concurrency, ordering, race conditions
   - I/O: network, filesystem, databases, retries, timeouts
   - Timing: delays, reentrancy, missed deadlines
   - Anything the plan itself flags as risky or assumes will hold
2. **Ask the plan "how would this fail?"** — for each step of the plan, state the precondition it depends on and the failure mode if that precondition is violated. If a step has no testable precondition, name that gap explicitly.
3. **Build the test battery**:
   - Repetition: run the same scenario N times (minimum 10; more for flaky-prone code) and record failures per run
   - Edge cases: empty/null, minimum/maximum, overflow, unicode, wrong types, malformed input
   - Adversarial: concurrent access, interrupted I/O, timeout injection, resource exhaustion (memory, handles, disk)
   - Load: volume scaling where applicable (N records, N requests) and confirm behavior degrades predictably, not catastrophically
4. **Execute** — run the battery. Capture per-case results: pass/fail, errors, timeouts, flakiness (same input, different results between runs).
5. **Evaluate against acceptance criteria**:
   - Zero failures across all repetitions and cases
   - No flakiness: deterministic results across runs
   - No unexpected timeouts or resource growth
   - No new failure mode surfaced by adversarial cases
6. **Report** — produce a table: case | repetitions | result | error. Classify each failure: fixable in code, design flaw in the plan, or out-of-scope (declared, not hidden).
7. **Loop until proven** — if any failure is fixable or reveals a plan flaw: fix, then re-grill the affected cases until the battery passes. Do not skip back to finalize.
8. **Gate** — only finish when the battery passes. If the environment prevents stress testing something (no harness, external dependency unavailable), say so explicitly and list what remains unproven — never claim "tested" for what wasn't run.

## Acceptance criteria format

```
Target: [plano | codigo | ambos]
Battery: [repetitions | edge | adversarial | load - which were run]
Result: PASS | FAIL
Failures found: [list]
Unproven (declared): [list]
```

## Rules

- NEVER claim reliability from a single run — repetition is the point.
- NEVER hide a failure to reach PASS; a declared limitation beats a silent risk.
- If the target is untestable as written (no way to invoke it), report that as a blocker, not a pass.