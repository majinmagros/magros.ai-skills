---
name: codex-subscription-offload
description: Export a deterministic automation built inside an AI subscription (Astra/Codex) to external code + scheduler without eating usage limits. Use quando a automação canibaliza a subscription, para exportar para trigger.dev/scheduler externo, migrar .env, hosted proof test. Triggers PT: tirar automação da subscription, exportar para trigger, offload subscription, usage limit estourado. Triggers EN: subscription offload, export automation to scheduler, trigger.dev export, usage limit automation.
---

# Codex Subscription Offload

Automação determinística construída na subscription canibaliza o usage limit. Exporte como código para scheduler externo — sem reescrever, sem vazar segredo.

## Quando usar

- Automação roda TODO DIA dentro do Astra/Codex e come a cota.
- Precisa de schedule confiável (6h úteis), webhook ou execução programática.
- NÃO usar para: rotina 100% Claude nativa → `routines`; decisão script-vs-IA → `automacao-deterministica`; fluxo visual → `n8n-agentic-flows`.

## Passos

1. **Planeje na subscription, construa fora** — use o agente para desenhar o fluxo (steps, triggers, formato de saída), mas o build final é código (ex.: TypeScript) em repo privado GitHub. Não hospede lógica no loop agêntico.
2. **Valide local (TDD + custo medido)** — rode local com teste de ponta a ponta (ex.: DM de teste), meça custo/run (ex.: $0.25 teto, $0.0133 real). Sem medida, sem migração.
3. **Garanta idempotência** — flag `delivered` (ou hash do payload): mesmo conteúdo 12:01 vs 12:33 = skip. Teste a duplicata de propósito.
4. **Conecte os CLIs** — auth GitHub CLI + scheduler CLI (ex.: trigger.dev) via browser; confirme org/projeto certo antes do sync. Org errada = deploy no vazio.
5. **Migre o `.env` à mão** — segredos nunca entram no repo: copie para as env vars do scheduler manualmente. Confira item por item; `.env` no `.gitignore`.
6. **Hosted proof test** — rode 1 execução de prova no scheduler com o schedule DESLIGADO; inspecione payload/output do run. Só ligue o schedule após prova verde.
7. **Ligue e opere** — 3 triggers: `scheduled` (cron, ex.: dias úteis 6h), `webhook` (form→ação, placeholder sem IA = 100% determinístico), `SDK` (só quando precisar de escala/programático — API credits > subscription).

## Armadilhas observadas

- **Free-plan delay** — plano grátis pode atrasar schedule em até ~1h. Se pontualidade importa, pague ou aceite o atraso declarado.
- **Flag `enabled=false`** — schedule criado desligado parece "não funciona". Cheque o flag antes de debugar.
- **Dedupe que parece falha** — skip por idempotência não é erro; logue `skipped-duplicate` explícito.
- **Só saia da subscription se precisar** — escala, horário exato ou execução programática. Sem isso, subscription é mais barata que API credits.

## Debug

- Todo run gera: payload de entrada, output, custo, duração. Run falhou? Leia o output do run antes de mexer no código.
- Edge cases mínimos: spam/retry (ex.: 1000 req/s), validação de input (ex.: email), override manual para prova.

## Regras

- NUNCA commite `.env` ou segredo no repo da automação.
- NUNCA ligue schedule sem hosted proof test verde.
- NUNCA hospede no loop agêntico o que é determinístico em 90% dos casos.
- Webhook sem IA (placeholder→ação) é o default; IA só no step de research/draft isolado.

## Related skills

- `routines` — rotinas 100% Claude nativas (não exportar).
- `automacao-deterministica` — decisão script-vs-IA + checklist verify/cost/idempotency.
- `n8n-agentic-flows` — alternativa visual ao code-export.
