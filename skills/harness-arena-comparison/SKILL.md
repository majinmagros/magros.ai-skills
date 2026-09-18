---
name: harness-arena-comparison
description: Compare AI agent harnesses third-party on the same task and model via Harness Arena. Use when choosing between harnesses or validating a harness change. Use quando comparar harnesses (Claude Code, Codex CLI, OpenCode...), ler battle-log/leaderboard, submeter benchmark próprio.
---

# Harness Arena Comparison

Compare harnesses (instruções + ferramentas + ambiente), não modelos: mesma task, mesmo modelo, workspaces separados.

## Quando usar

Quando precisa escolher ou trocar de harness, validar uma mudança de setup, ou julgar outputs anonimizados. NÃO use para avaliar modelo em si — isso é `agent-eval` first-party.

## Passos

1. **Recon no battle-log** — filtre por status (queued, in progress, awaiting judgment), categoria e outcome. Para avaliar sem criar nada, abra um round `awaiting judgment`.
2. **Confira o setup da comparação** — mesma task e mesma configuração de modelo para todos os harnesses? Anote colunas por harness, linhas de modelo, scores e deliverables.
3. **Avalie por rubrica, às cegas** — leia task + rubrica, inspecione outputs anonimizados, pontue TODOS de 1-10 antes da revelação. Checklist por output:
   - Requisito pedido foi atendido?
   - Nada unrelated foi quebrado (ex. removeu overlay mas zoom/rotação seguem ok)?
   - Houve regressão funcional?
   - Polish sem cumprir requisito perde para simples que cumpre.
4. **Leia o leaderboard com cautela** — alterne para sua categoria (code, research, operations...). Olhe rating + win rate + votes/wins/losses + mediana de tempo juntos. Regras: 1 voto = ruído; velocidade ≠ qualidade; diferença pequena com poucos votos não é sinal.
5. **Submeta seu benchmark próprio** — comece mínimo: 1 task × 2 harnesses. Escolha tasks do seu trabalho real, leia cada task + arquivos de referência, escolha modelo (confira opções free e o contador tasks×harnesses), submit.
6. **Acompanhe e julgue** — siga o progresso, avalie cada task concluída sem esperar o dataset inteiro. Promova um harness só com votos suficientes e sem regressão.

## Regras

- NEVER comparar harnesses com modelos ou tasks diferentes entre si.
- NEVER tratar liderança com 1 voto como vitória.
- NEVER escolher por tempo mediano sozinho.
- NÃO duplicar `agent-eval`: arena é third-party (harness), eval CLI é first-party (modelo/agente próprio).
- Declare viés: quem patrocina a arena pode competir nela.

## Related skills

- `agent-eval` — eval first-party do seu agente/modelo.
- `plan-duel` — duelo entre dois planos antes de implementar.
- `eval-harness` — rigor de avaliação e rubricas.

## Roteamento por step (leva YouTube rodada 9)

Apos comparar na arena, roteie por step: ideacao/plano que rebate e questiona (owl) vs executor cirurgico que obedece + verification loops (rottweiler). Steps ambiguos vao para owl; steps especificados vao para rottweiler + verifier. Registre a heuristica usada por task para calibrar.
