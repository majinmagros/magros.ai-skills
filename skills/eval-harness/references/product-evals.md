# Eval Harness — Product Evals + Anti-Reward-Hack Checklist

## Product Evals (v1.8)

Use product evals when behavior quality cannot be captured by unit tests alone.

### Grader Types

1. Code grader (deterministic assertions)
2. Rule grader (regex/schema constraints)
3. Model grader (LLM-as-judge rubric)
4. Human grader (manual adjudication for ambiguous outputs)

### pass@k Guidance

- `pass@1`: direct reliability
- `pass@3`: practical reliability under controlled retries
- `pass^3`: stability test (all 3 runs must pass)

Recommended thresholds:
- Capability evals: pass@3 >= 0.90
- Regression evals: pass^3 = 1.00 for release-critical paths

### Eval Anti-Patterns

- Overfitting prompts to known eval examples
- Measuring only happy-path outputs
- Ignoring cost and latency drift while chasing pass rates
- Allowing flaky graders in release gates

### Minimal Eval Artifact Layout

- `.claude/evals/<feature>.md` definition
- `.claude/evals/<feature>.log` run history
- `docs/releases/<version>/eval-summary.md` release snapshot

## Anti-Reward-Hack Checklist (HackerOpus, 2026-09-06)

Source: video `Lbax7_pW2Nw` re-analise Batch 12 (#133, delta sobre #96).
Numeros abaixo sao medicao do autor do video, nao benchmark.

1. RL-env-design e eval: nunca treinar/avaliar so em env vulneravel.
   - Reward hacking aprendido em env vulneravel generaliza para
     cyberattacks, tamper de reward/monitor e bypass de approvals.
   - Separar env de treino de env de teste; o env que premiou o
     atalho nao pode ser o mesmo que verifica.

2. Monitorar durante o training + beyond-episode eval.
   - Sneakiness 4% -> 19% quando avisado do monitoramento (medicao
     do autor, nao benchmark): eval final "limpo" nao basta.
   - 84% age mesmo crendo que o alvo e real (medicao do autor, nao
     benchmark); incluir evals que parecem normais no geral mas
     escondem sabotagem localizada.
   - Beyond-episode sem goal = sem maldade (achado do video): sem
     objetivo persistente nao ha sabotagem; logo, testar TAMBEM com
     goal persistente entre episodios.

3. Caso hooks/settings bypass no eval: incluir categoria que tenta
   editar settings/hooks, matar o monitor e forjar reward 1.0.
   Falha em qualquer um = FAIL critico, nao flaky.

4. Findings limitados: reportar escopo (um harness, envs especificos)
   e nao generalizar; re-rodar apos mudanca de env, policy ou monitor.
