---
name: approval-rejection-board
description: "Use when training an agent to your taste via batch approve/reject cycles on a visual board (AR-board). Triggers on \"AR board\", \"approval rejection board\", \"aprovacao em lote\", \"approve reject board\", \"treinar agente com aprovacao\", \"10 variacoes\". Non-triggers: single chat approval tokens (use approval-loop-morning-digest), single-artifact browser review (use plan-canvas), per-skill feedback logs (use self-improving-skill). Outcome: batch candidates reviewed with A/R + reasons, session picks up approved IDs on 'terminei', implements, and re-boards until 90%+ approvable."
metadata:
  origin: ECC
version: "1.0.0"
---

# Approval-Rejection Board (AR-board)

Train agents to your quality criteria and taste with batch approve/reject
cycles instead of per-step supervision or fire-and-forget prompts. You
generate N candidates, review them on a board (A = approve, R = reject,
plus the reason), say "terminei", and the session picks up exactly what
was approved — no retyping IDs. Repeat until 90%+ of a board is approvable;
only then send the agent on a long unattended run.

**Core principle:** the most useful training is not the most ambitious
one — it is the one inside your daily workflow. Ten focused A/R decisions
beat a 50-page technical report you will never read.

## When To Activate

- The user wants 10 variations of something to pick from (hero sections,
  features, agent-arch improvements, themes, templates, carousels).
- The user says AR board, approval board, approve/reject, aprovar em lote,
  "quero escolher", or wants to train an agent to their taste.
- A refinement loop needs hundreds of micro-decisions (e.g. 500 visual
  templates) and reading full reports per change is too slow.
- The agent must learn *why* something was approved/rejected, not just what.

Do NOT use for: one-shot chat approvals ("approved A1") → `approval-loop-morning-digest`;
reviewing a single plan artifact in the browser → `plan-canvas`;
improving the skill itself from run logs → `self-improving-skill`.

## Workflow (checklist — order matters)

- [ ] 1. Generate a board of N candidates (default N = 10). Each candidate
  has a stable numeric id (1..N) and is meaningfully different from the
  others (layout, palette, approach — never 10 near-copies).
- [ ] 2. Open the board where the human can A/R fast. Any renderer works
  (HTML file, canvas, chat list); requirement: one keypress/click per
  verdict (A = approve, R = reject) plus an optional reason per item.
- [ ] 3. Human reviews: A/R every item, writing the reason when the *why*
  matters for training ("rejeitei porque parece site tech, não loja de
  instrumentos"). Reasons are the training signal — IDs alone are not.
- [ ] 4. Human says the close token (`terminei`). The session reads the
  board state file (see contract) and repeats back the approved IDs.
  Never ask the human to retype IDs.
- [ ] 5. Implement exactly the approved set (or generate the next stage:
  next fold, roteiro from approved themes, features for the app). No
  silent substitution of rejected items.
- [ ] 6. Re-board: generate the next batch (next fold, next 10, next
  variations of winners) and repeat. Track approval rate per cycle;
  converged = 90%+ approved in one board.

## Board-state contract (low freedom — follow exactly)

- State lives in a session-readable file next to the board, e.g.
  `board-state.json`: `{ approved: [1, 5], rejected: [2, 3, 4, 6, 7, 8, 9, 10], comments: { "2": "parece site tech" } }`.
- The board server (if any) auto-kills after 20 minutes idle so forgotten
  boards never linger; re-opening restores from the state file.
- Close token is `terminei` (PT) / `done` (EN). On close, the session MUST
  echo `aprovados: <ids>` before implementing. No echo = no implement.
- Silence is never approval. Unreviewed items count as rejected.

## Training loop (why this beats the alternatives)

- Fire-and-forget (prompt → sleep → miracle): burns tokens for days and
  you never learn what the agent is doing.
- Per-step approval (approve every 20s of work): saves tokens but costs
  all your time.
- AR-board: one focused 10-minute A/R session trains the agent, then it
  runs 8–10h unattended (see `gauntlet-loop`) producing aligned output
  you actually understand — because you taught it decision by decision.

## Self-validation before implement

- Draft → check against approved IDs + comments: every implemented item
  is in `approved`, every rejected item is absent, every comment with a
  constraint is honored. List any violation with the item id, fix, repeat.
- If the draft fails for a reason outside this guide, propose it as a new
  board rule at the end of the run.

## Anti-Patterns

- 10 near-identical candidates → human learns nothing; force variation.
- A/R without reasons on taste tasks → agent copies IDs, never learns criteria.
- Asking the human to retype approved IDs → breaks the contract; read the file.
- Skipping the echo (`aprovados: ...`) → silent substitution risk.
- Sending on the long run before 90% convergence → aligned-looking slop.
- Board without auto-kill → dozen zombie servers; always set the timer.

## Relations

- `approval-loop-morning-digest`: owns chat token approvals + digest; this
  skill owns batch visual A/R training. Use that for scheduled ops, this
  for taste training.
- `plan-canvas`: owns single-artifact point-and-approve review; this skill
  owns multi-candidate batch training. A board item can open in a canvas.
- `self-improving-skill`: owns per-skill feedback→edit loop; this skill
  feeds it promotion candidates (a reason repeated 3+ boards becomes a rule).
- `gauntlet-loop` / `score-loop`: own long unattended execution with a
  cutoff; run them only after AR-board convergence.

## Exemplo

```text
Humano: "quero 10 microtemplates de hero pra loja de instrumentos"
Agente: gera board 1..10 (state file criado) → humano: A1 A5, R resto + motivos
Humano: "terminei"
Agente: "aprovados: 1, 5" → implementa dobra 1 dos vencedores → abre board 2 (10 variações da próxima dobra)
Ciclo 3: 9/10 aprovados = convergiu → "rode 8h sozinho" (gauntlet-loop)
```
