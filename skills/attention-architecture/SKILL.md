---
name: attention-architecture
description: Supervise N agents with 1 brain during-run. Use when coordinating 3+ parallel agents, reviewer is overloaded, routine approvals bury exceptions. TRIGGER when: attention bottleneck, exception inbox, batch approvals, escalation path, N:1 review ratio. Gatilhos PT: arquitetura de atenção, inbox de exceções, revisar N agentes, gargalo de supervisão, escalação para humano.
---

# Attention Architecture

## Quando usar

- 3+ agentes rodando em paralelo e 1 humano/lead como revisor.
- Revisor afogado em log de rotina e perdendo falha crítica.
- Decisões similares pedindo aprovação uma a uma.
- Precisa definir quando puxar humano vs. deixar agente seguir.
- NÃO é pré-run. Pré-run é `swarm-readiness-gate`. Este skill é DURANTE-run.

## Passos

1. **Padronize o formato de evidência.** Exija de todo agente o mesmo envelope: `decisão | evidência (links/arquivos) | confiança | risco | alternativa descartada`. Sem envelope, sem review.
2. **Separe rotina de exceção.** Crie inbox de exceções: só sobe para humano o que for baixa confiança, alto risco, ou fora do padrão. Rotina vai para log, não para fila humana.
3. **Faça batching de decisões similares.** Agrupe por tipo (ex: 12 migrações de schema, 8 textos de UI). Aprove/rejeite o lote com uma regra, não 12 vezes.
4. **Automatize os checks chatos.** Lints, diff de schema, comparação visual, teste determinístico. Humano só julga o que máquina não julga bem.
5. **Defina escalation path explícito.** Documente: condição de trigger → quem é puxado → SLA → o que o agente faz enquanto espera (para, segue em dry-run, desfaz).
6. **Meça N:1.** Acompanhe `N agentes ativos vs 1 revisor` + tempo médio por exceção + exceções perdidas. Se o revisor virou gargalo, reduza N ou endureça o filtro, nunca "revise mais rápido".

## Regras

- Nunca revise raw log. Só revise envelope de evidência padronizado.
- Exceção primeiro, rotina nunca interrompe exceção.
- Sem escalation path escrito, o agente NÃO roda autônomo.
- Batch sem critério explícito é proibido — vira aprovação cega.
- Métrica N:1 sempre visível. Atenção é recurso finito, trate como orçamento.
- Humano puxado tarde é falha do filtro, não do humano. Ajuste o filtro.

## Related skills

- `swarm-readiness-gate` — pré-run, este é durante-run.
- `agent-swarm-ops` — operação do swarm após o GO.
- `agent-guardrails` — harness engineering contínuo durante o run.
