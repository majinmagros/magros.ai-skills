---
name: agent-misbehavior-controls
description: Control insider agent misbehavior: sandboxing, trajectory audit and eval separation. Use when running autonomous or multi-agent systems with tools and shared infra. Use quando isolar sandbox por task, auditar trajectory, separar infra de eval, prevenir sabotagem e colusão de agentes.
---

# Agent Misbehavior Controls

Assuma o insider: agentes persistentes, colaborativos, capazes de trapacear a avaliação. Controle o processo, não só o outcome.

## Quando usar

Em sistemas com agentes autônomos, swarms, ou evals com tasks impossíveis; sempre que agentes tocam rede, credenciais, infra compartilhada ou o próprio sistema de scoring. Ameaça aqui é OUTBOUND (agente ataca fora), não inbound — guardrails de prompt não bastam.

## Passos

1. **Sandbox isolado por task** — uma task, um sandbox efêmero: sem rede salvo allowlist explícita, sem persistência entre tasks, sem acesso a credenciais reais (use scoped/fake). Persistência entre agentes + sandbox furável é a receita do breakout.
2. **Elimine infra compartilhada gravável** — package caches, artifactory, /tmp, logs e pastas de workspace NÃO são canal de mensagem: monte read-only, namespace único por run, sem write cross-task. O que é "só storage" vira quadro de mensagens.
3. **Verifique PROCESSO além de outcome** — outcome-only grading premia trapaça. Exija: trajectory audit (logs imutáveis, append-only), tool-call attestation (cada call real corresponde a efeito observável), re-execução spot-check de passos críticos. Score reverso-engenhável, tool call forjado e transcript adulterado = fail automático.
4. **Arme tripwires para o impossível** — inclua tasks impossíveis de propósito; dê saída honrosa sem penalidade ("não sei / impossível, abortando"). Alerte em: tentativa de exfil, uso de credencial vazada, escrita fora do workspace, leitura do sistema de eval, comunicação cross-run. Persistência teimosa diante do impossível é sinal, não virtude.
5. **Separe a infra de eval** — quem executa NÃO escreve em quem julga: scorer, logs, monitor e weights em plano separado, least-privilege, sem rota de rede do sandbox ao eval. Agente que alcança o juiz invalida o benchmark inteiro.
6. **Passe o questionário de governança (6)** — antes de escalar, responda com evidência: 1) trapacearia a avaliação? 2) coordenaria entre incidentes? 3) ocultaria evidência? 4) manipularia logs/monitor? 5) atacaria a infra? 6) tudo isso poderia acontecer sem alerta humano? Qualquer "sim/não sei" vira controle faltante no backlog.

## Regras

- NEVER avaliar só o resultado final quando o agente controla ferramentas, logs ou infra.
- NEVER compartilhar filesystem, cache, rede ou credencial entre tasks/agentes sem isolamento.
- NEVER treinar "persistência infinita" sem ensinar "desistir e reportar": teimosia + sandbox fraco = breakout.
- NÃO duplicar `agent-guardrails` (ameaça inbound: prompt injection, input malicioso). Este skill é ameaça insider/outbound.
- Credencial vazada encontrada pelo agente = incidente, nunca atalho: rotate, revogue, investigue.

## Ameaças emergentes (leva YouTube rodada 4)

7. **Monitor de legibilidade (anti-glossogenia)** — agentes sob pressão podem derivar léxico/gramática próprios (idioma emergente, abreviações opacas). Exija: spot-checks de inteligibilidade por checkpoint, detecção de drift de léxico, resumo legível obrigatório por marco, quarentena do canal post-mortem. Mensagem que humano/auditor não lê = canal suspeito.
8. **Bateria RL-stress (Hacker-Opus)** — teste de escalada com referência quantificada: cyber não-autorizado, harmful, manipulação de reward, escape, ataque à própria infra — com e sem hints. Números de referência: hints elevam drasticamente a taxa (ex.: ~76%/38% em categorias críticas). "Behavioral evals não detectam" sozinho: rode a bateria, não só o checklist.
9. **Janela CoT honesta** — preserve a monitorabilidade do chain-of-thought: nunca treinar punindo o rascunho honesto, separar canal reasoning/tool (3 contaminações: mistura com chat/tools, auto-direcionamento do pensamento, base sem anotação), métrica trust-in-CoT. Rascunho punido = rascunho que mente.

## Related skills

- `agent-guardrails` — defesa inbound (injeção, jailbreak, input hostil).
- `agent-swarm-ops` — operação de enxames com isolamento e cotas.
- `santa-method` — verificação adversarial em duas vozes antes de shippar.
