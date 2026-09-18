---
name: swarm-readiness-gate
description: Go/no-go checklist BEFORE running an agent swarm (sandbox, DoD + bail-out, per-thread budget, referee/canonical, mailbox/locks). Use when the user says "rodar swarm", "subir enxame de agentes", "multi-agente em paralelo", "vale a pena swarm?", or in EN "run a swarm", "spawn agent swarm", "swarm readiness", "swarm go/no-go", "swarm guardrails check".
---

# Swarm Readiness Gate

Checklist go/no-go ANTES de operar um swarm. Se qualquer item falhar,
não opera: corrige primeiro. Grounding: IndyDevDan, "Are Agent Swarms
USEFUL?" (S2sjyokoxeE) — swarm = sistema autônomo coordenando-se de forma
não especificada via mailbox/thread; custo de boot de coordenação existe;
sem DoD + bail-out, budget, locks e sandbox, o swarm queima tokens e deadlocka.

## Quando usar / When to use

- Antes de spawnar 3+ agentes cooperando sem delegação clássica.
- Quando alguém propõe "jogar um swarm no problema".
- Como gate de PR/pipeline que dispara multi-agente autônomo.

## Checklist (todos precisam ser PASS)

1. **Sandbox OK?** — Swarm roda isolado (VM/container/sandbox efêmera),
   com rede cortada ou allowlist, sem credenciais reais. Sandbox é a última
   linha de defesa: se tudo falhar, ela contém. FAIL = roda na máquina real.
2. **DoD + bail-out em todo prompt?** — Cada prompt de swarm declara
   Definition of Done verificável + condição de desistência ("se X, pare e
   reporte"). Agente sem saída vira loop infinito pago. FAIL = tarefa
   impossível sem critério de parada (o erro do incidente Astra).
3. **Budget por thread/swarm?** — Teto de tokens/calls/custo por swarm E por
   thread, visível aos agentes (`check budget`). Ex.: 10 agentes / teto $X.
   FAIL = sem teto ou sem medição ("if you can't measure it...").
4. **Referee + canônico definidos?** — Existe 1 arquivo/artefato canônico e
   um papel referee/verificador adversarial que assina o resultado
   (canonical + sign-off + verificação independente). FAIL = N agentes
   escrevendo o mesmo arquivo sem dono.
5. **Mailbox + locks?** — Threads/mensagens por agente (inbox, post, list
   team) + lock/claim de arquivo (`claim file` → trabalha → `release`).
   Escrita direta concorrente = corrupção. FAIL = sem lock ou sem mailbox.
6. **Observabilidade + kill-switch?** — Trace completo por agente, timeline
   de mensagens, detector de stall (agente parado = removido), `done`
   explícito com motivo + arquivo de saída, e botão de kill do swarm.
   FAIL = sem trace ou sem como matar thread morta.
7. **Coordenação > overhead?** — Justifique: por que não 1 agente ou
   delegação clássica? Swarm tem custo de boot (mensagens iniciais, claims
   sobrepostos). FAIL = tarefa trivial ("gerar 1 asset simples") onde o
   overhead supera o ganho.

## Veredito

```text
Gate: GO | NO-GO
[1] Sandbox: PASS/FAIL — <evidência>
[2] DoD+bail-out: PASS/FAIL — <evidência>
[3] Budget: PASS/FAIL — <evidência>
[4] Referee/canônico: PASS/FAIL — <evidência>
[5] Mailbox/locks: PASS/FAIL — <evidência>
[6] Observabilidade/kill: PASS/FAIL — <evidência>
[7] Coordenação justificada: PASS/FAIL — <evidência>
Bloqueadores: [lista — vazio se GO]
```

## Regras

- UM FAIL = NO-GO. Não opere "só para ver"; swarm sem gate queima budget e deadlocka.
- NUNCA pule sandbox por pressa: vibe-coder + swarm = falha catastrófica.
- Comunicação baixa prevê resultado baixo: se threads esvaziam, aborte cedo.
- Registre custo real (tokens, calls, $) ao final para calibrar o próximo gate.

## Related skills

- `agent-swarm-ops` — a operação do swarm após o GO.
- `agent-guardrails` — harness engineering contínuo (DoD, budget, locks) durante o run.
