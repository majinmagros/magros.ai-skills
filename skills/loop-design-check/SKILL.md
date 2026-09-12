---
name: loop-design-check
description: "Design a goal-oriented agent loop, and review it for the ways loops go wrong — spinning and burning tokens, Goodhart-gaming the verifier, or running a wrong answer to completion. Two actions: (1) WRITE a loop — gate whether to build it, define a machine-decidable goal, pick the loop type, pick a skeleton; (2) REVIEW a loop — run it past five failure modes plus decidability, boundaries, fallback, judge independence, and keep-judgment-with-the-human red lines. Use when designing an autonomous agent loop, or when you already have one and worry it will spin, cheat, or run a wrong answer to the end. Complements the mechanism-layer loop skills (autonomous-loops, continuous-agent-loop) by covering the judgment layer they don't. 中文触发：写 loop、设计 loop、做一个 loop、检查 loop 对不对、loop 体检、loop 会不会跑飞、可判定目标、五个崩法、plan build judge。English triggers: design an agent loop, write a loop, check a loop, loop review, prevent a runaway loop, goal-oriented loop, decidable goal, plan/build/judge."
metadata:
  origin: ECC
---

# Loop Design + Review

> **Premise.** An LLM is a feed-forward system: prompt in → tokens out, with no built-in "steer toward the goal" across turns. To make it *behave* like a goal-oriented system, you wrap a feedback loop around it. This skill helps you **write** that loop correctly and **review** it so it won't run away.

## When to use / not

**Use it when:**
- You want to hand a repeating task to an agent that runs over and over (write→test, test→fix, fix→verify…).
- You already have a loop and worry it spins, cheats, or runs a wrong answer to completion.

**Don't use it for:**
- A one-off task → just do it; don't wrap a loop around it.
- A plain timer / poll → use `/loop`; no design needed.
- *How to wire the loop architecture* (pipelines → DAGs, long-run recovery) → that's the mechanism layer; see `autonomous-loops` / `continuous-agent-loop`. **This skill only covers "is the goal right, and will it run away" — it does not re-explain mechanism.**

## Red-line premise: two levels of feedback

| Level | Who owns it | What it does |
|---|---|---|
| **Execution** (low) | machine / agent | Measures "how far from the literal goal" and grinds it to zero. The machine is strong here. |
| **Judgment** (high) | **human** | Decides "is this goal itself right, should it change, should it stop." The machine can't step outside its own loop to question the goal. |

> A thermostat can feed back "how far from 26°C," but when you have a fever and want 28°C it can't judge whether 26 is the *right* target — it just grinds toward 26. **"What to set today" is always the human's call.**
> Handing judgment / sign-off / the last switch to the machine = removing the high-level feedback = it sprints, fast and hard, toward a goal no one questioned → wrong output.

---

## Action 1 — Write a loop (5 steps)

### Step 0 · Subtract first: should you even build it? (4-condition gate, any miss = veto)

① the task repeats weekly or more　② verification can be automated　③ the token budget can take it　④ the agent has tools that actually *run and see the result*

Miss any one → **don't build a loop**; do it by hand or another way.
> What stops most people isn't "can I write a loop," it's "does my repo deserve one." A repo that deserves a loop has a reconciliation baseline (golden sample / upstream total) + tests + a lint guard. **A repo that doesn't deserve a loop will only have its errors amplified by one.**

### Step 1 · Define a *machine-decidable* goal (the hard part — the loop lives or dies here)

The whole loop rides on the comparator's "is it done yet?" **The comparator can only work if your exit condition can be judged yes/no by a machine.**

- Bad: Vague ("make it good," "write it sharper") → the comparator can't judge → either it never passes (stuck retrying) or it guesses (passes/blocks at random).
- Good: Decidable ("all 96 unit tests green AND a change-list is produced," "module-02 fields filled, pytest passes, business logic untouched") → one check settles it; the loop converges cleanly.

**Five-point goal framework:**
1. **Done-criterion is machine-verifiable.**
2. **Boundary conditions defined alongside the done-criterion** ("what it must NOT do") — anti-Goodhart; missing boundaries = a license to cheat.
3. **Has a failure fallback** — retry cap N + escalate to a human when exceeded.
4. **Goal is layered.**
5. **Prefer reconciliation over assertion for the done-criterion** — anchor to external fact (golden sample / upstream total / financial tie-out / platform back-office numbers) before your own assertions. "All tests pass" can be gamed (loosen asserts, fake mocks, swallow exceptions); "diff vs the reference < 0.01" can't.

> **Self-check:** read the goal to someone who doesn't know the domain — can they run one command and tell whether it's done? If not, it isn't decidable enough. Go back.

### Step 2 · Pick the loop type

| Your task | Loop type (cybernetic) | How it stops |
|---|---|---|
| Has a clear "done" test (write to done / a batch of images processed) | **servo** (`/goal`-style closed-loop) | stops on reaching the goal |
| No endpoint, must keep maintaining a state (inventory alert / scheduled health check) | **regulator** (`/loop`-style thermostat) | never stops; acts only on change (dead-band suppresses noise) |