---
name: agentes-proativos-duraveis
description: "Agentes duráveis e proativos: sessões que sobrevivem a falhas e troca de cliente, state JSON compartilhado, tasks com resume, tools em runtime e multiplayer agents. Use ao construir agentes long-running com checkpoints e gatilhos. Triggers PT: agente durável, agente proativo, retomar do checkpoint, multiplayer agents. Triggers EN: durable agents, proactive agents, agent state, long-running agent, checkpoint resume."
metadata:
  origin: ECC
---

# Agentes Proativos Duráveis — Sobreviver e Continuar

> Fonte: IndyDevDan `@IndyDevDan/DNDYYHsypZg` ("Pi Durable PROACTIVE Agents: Jev Triggers My ON-CALL Pi Agent", 2026-10-13).

## Quando usar

- O agente precisa continuar vivo apesar de falha, refresh do browser ou troca de cliente.
- Fechar o laptop e retomar do checkpoint depois.
- Múltiplos clientes (TUI, browser, HTTP/curl, mobile) no MESMO agente.

## Primitivos da base durável

- **Sessions persistentes** — histórico sobrevive a crash/troca de cliente; compressão de contexto em background (marcador + branch de sessão).
- **Application state** — JSON key-value compartilhado; read/update state entre agentes.
- **Tasks duráveis** — fases/passos com subagente; resume de qualquer ponto; done/interrupted; humano "next to the loop".
- **Tools em runtime** — trocáveis sem reiniciar o agente.
- **Branching de estado** — teste caminhos sem perder o tronco.
- **Hierarquia** device → workspace → agente; "multiplayer agents" = vários clientes no mesmo agente.

## Extensões (exemplo red team do vídeo)

- Jev damage control em 10 níveis: `rm -rf` só passa a ~0.99 de irreversibilidade; dangerous mode com override; avaliador bash.
- Demo: Jev classificou centenas de eventos por ~1,5¢ (13¢ no red team), fix pronto e estado preservado após refresh; bug real de null check (paywall/loyalty).
- Long-running: mate o agente e ele volta; cloud sandboxes (exe.dev) com attach.

## Regras

- Estado fora do contexto do modelo: JSON compartilhado > memória da conversa.
- Toda task longa grava checkpoint — resume de qualquer passo é requisito, não luxo.
- Proatividade só com trigger + on-call definidos (e teto de custo).
- Um agente = uma API única para todos os clientes; UI é plugável.
- "The most valuable agent is one you don't need to work on": autonomia com recuperação.

## Fase 3 — proativo

- Depois de durável, vire proativo: gatilhos (evento, schedule, Jev) disparam o agente on-call; humano supervisiona, não opera.

## Related skills

- `agent-harness-construction` — desenho do harness/action space.
- `autonomous-agent-harness` — operação autônoma contínua.
- `agentic-os` — sistema operacional de agentes.
- `sessoes-orquestradas` — continuidade de sessão entre harnesses.
