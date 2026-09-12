# Intent-Driven Development — Enrichment: executable review contract

Source `mG7ZC63xS-k` (Full Cycle, 2026-08-24). Upgrade for Full Acceptance Briefs: write the
criteria so that **any agent can verify them item-by-item with zero project
context** — reviewer ≠ implementer, and the reviewer must never have to ask "how
do I run this?". Four sections to add when risk justifies it:

1. **Runtime contract** — exact stack and services required (Node version, Postgres,
   Next.js, writable dir, real browser via Playwright CLI) so any agent can boot the environment.
2. **State fixtures** — named seed data the tests depend on (user Alice = admin,
   user Bob = UI test account, sample MP4 + thumbnail files), created before verification starts.
3. **Quality gates** — runnable scripts that fail loudly (linter, dependency check,
   architecture/fitness-function rules e.g. "controller must not import repository",
   circular-dependency check, code-slop detector). Gates are objective; no LLM judgment needed.
4. **Test surfaces** — enumerate what must be covered per surface (HTTP API surface:
   list endpoints; UI surface: flows). Each acceptance criterion maps to the gate/surface
   item that proves it.

Why it matters: a review against this contract cannot return "looks great, ready
for production" — every item is either provably green or red. Pairs with the
Creator/Verifier separation in `orch-pipeline` and waves of parallel features.
