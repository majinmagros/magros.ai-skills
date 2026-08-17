---
name: score-loop
description: Run a demanding task through a generator-evaluator loop with a cutoff grade — the agent builds at high performance standard, an evaluator tests and grades the result against a predefined weighted rubric, and if the score is below the threshold the work is redone and re-graded until it passes or the iteration budget is exhausted. Use when a task must reach a minimum quality score (e.g. 85/100) before it is considered finished. Also covers warm-start: persist the winning strategy ("sabão vencedor") so the next run of the same task-signature starts from the winner instead of retesting soaps that already failed. Triggers on "sabão vencedor", "reusar a estratégia que funcionou", "warm start", "não repetir os que falharam", "começar da última iteração vencedora", "loop com memória".
argument-hint: "<task> --nota-corte <0-100> --max-iteracoes <N>"
---

# Score Loop

Proof-by-grading: build, grade, iterate until a minimum score is met.

## When to use

When the result must be proven reliable before finalizing — demanding coding tasks, refactors, migrations, or any delivery where "good enough" is decided by a numeric grade against predefined criteria.

## Steps

0. **Warm-start (recuperar vencedor)** — antes de iterar, derive a assinatura da
   tarefa (ex.: tipo + escopo + critério principal) e procure um registro
   vencedor em `.ecc/vencedores.json`. Se existir, comece a rodada **na
   estratégia vencedora** (prompt/parâmetros registrados) com pequena
   perturbação em volta — não re-teste os sabões que falharam. Se não existir,
   siga do zero.
1. **Define the contract** — before writing anything, state:
   - Task (the deliverable)
   - Cutoff score (default **85** of 100; adjustable via argument)
   - Weighted rubric (default): Funcionalidade 0.4 · Confiabilidade 0.3 · Manutenibilidade 0.2 · Clareza 0.1
   - Iteration budget (default 5)
2. **Challenging prompt** — approach the task at maximum performance standard: demand the best possible solution, and explicitly list what would count as "not acceptable" (broken edge cases, unhandled errors, hidden assumptions, untested paths).
3. **Build** — implement the deliverable against the contract.
4. **Evaluate** — switch explicitly to the evaluator role (never grade in the same breath as building): test the result for real — run tests, execute code paths, probe edge cases — and score each rubric criterion 0-100. Final grade = weighted sum. If a separate agent or subagent is available, delegate evaluation to it for independence.
5. **Gate** — compare final grade to cutoff:
   - `grade >= cutoff` → finish with the report and **register the winner** (step 7)
   - `grade < cutoff` → write specific per-criterion feedback (what exactly missed points), then return to step 3 and rebuild addressing every point
6. **Plateau guard** — if the iteration budget is exhausted or the grade stagnates (delta < 2 points across 2 consecutive iterations), stop and report the blocker: NEVER auto-approve below the cutoff.

## Warm-start ("sabão vencedor")

A analogia: uma máquina de lavar que testa vários sabões até a mancha sair. No
4º loop o sabão X funcionou — semana que vem, use direto o X, sem re-testar os
que falharam.

### Registro vencedor (schema `.ecc/vencedores.json`)

```json
{
  "task-signature": "gerar-thumbnails-variantes",
  "strategy": {
    "prompt": "...",        // a estratégia reprodutível (prompt/parâmetros/abordagem)
    "params": { ... }       // ex.: model, temperature, nota-corte, top_k
  },
  "score": 92,
  "iteracoes": 4,
  "timestamp": "2026-08-17T12:00:00Z"
}
```

- Path padrão: `.ecc/vencedores.json` no workspace; configurável via env
  `WARM_START_FILE`.
- Assinatura da tarefa deve ser estável entre rodadas (mesmo tipo + escopo),
  senão o warm-start não encontra o vencedor.
- **Só persiste em PASS verificado** (grau >= corte com verificador
  independente). NUNCA persista best-effort.
- Rodada nova que supera o vencedor registrado → **substitui**.
- Revalidar periodicamente: estratégia vencedora pode degradar se o modelo ou o
  problema mudar. Se o warm-start parar de passar, reverta ao loop do zero.

### Regras do warm-start

- Skip: não repita estratégias que já falharam para a mesma assinatura.
- Comece na vencedora + perturbação (não clone cego: varie um parâmetro).
- Nunca trate o vencedor como verdade permanente — é o melhor conhecido até agora.

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
- NEVER persist a winner on best-effort (below cutoff) — register only verified PASS.
- NEVER warm-start from a stale winner blindly; revalidate and fall back to scratch if it degrades.

## Related skills

- Schema de cache de resultado (inspiração para `.ecc/vencedores.json`): `content-hash-cache-pattern`.
- Aprendizado pós-fato / padrões reutilizáveis: `growth-log`, `continuous-learning-v2`.
- Verificação paralela de candidatos (grafo) com iteração por nota: `engenharia-de-grafos`, `graph-engineering` (DnB).
- Supervisor loop com nota 0-100 e roteamento de modelo: `sessoes-orquestradas`.