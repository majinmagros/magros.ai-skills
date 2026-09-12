---
name: a2a-interoperability
description: Use when building systems where independent AI agents built on different frameworks or by different vendors must discover each other, delegate tasks, and share results — the Agent2Agent (A2A) protocol, the open standard for agent-to-agent interoperability. Triggers on "A2A", "Agent2Agent", "agente falando com agente", "interoperabilidade de agentes", "delegar tarefa pra outro agente", "A2A vs MCP", "protocolo entre agentes". Clarifies when to use A2A vs MCP vs native sub-agents, and how to expose an agent as an A2A service (Agent Card, Tasks, JSON-RPC, streaming).
metadata:
  origin: ECC
---

# Skill: a2a-interoperability — conectando agentes entre si (protocolo A2A)

Agentes vivem hoje em silos: cada framework (LangGraph, CrewAI, ADK, Semantic
Kernel, soluções próprias) fala a própria língua. O protocolo **Agent2Agent
(A2A)** é o padrão aberto para comunicação entre agentes opacos, sem trocar
memória interna, tools ou lógica proprietária.

## Quando usar

- Você precisa que agentes independentes colaborem entre si (descobrir,
  delegar subtarefa, coordenar ação, trocar resultado).
- Um agente que você construiu precisa ser chamado por outro agente de fora
  (ou chamar um agente de outra empresa/framework).
- Está decidindo a arquitetura de comunicação: A2A vs MCP vs sub-agent nativo.

Não use para: agente conversando com ferramentas/dados (isso é **MCP**);
agente chamando os próprios sub-agents ou tools internas (use os primitivos
nativos do framework); mensagens humanas estilo Slack/Discord.

## A2A vs MCP (a distinção que vale ouro)

| Camada | Protocolo | Problema que resolve |
|---|---|---|
| **Agente → ferramenta** (vertical) | MCP | Equipar UM agente com as tools/APIs/dados que ele precisa |
| **Agente → agente** (horizontal) | A2A | Dois agentes opacos se descobrem, delegam e devolvem resultado |

São complementares: um agente pode usar MCP para as próprias tools e A2A para
falar com outro agente. MCP não substitui A2A e vice-versa.

## O que A2A NÃO é

- Não é um kit de desenvolvimento de agentes (não substitui LangGraph/CrewAI/ADK).
- Não é protocolo de sub-agent nem de tool-call interno.
- Não é substituição do MCP.
- Não é app de mensageria interativa.

## Modelo mental (core concepts)

- **Agente opaco**: expõe capacidade e aceita Tasks, sem abrir memória/tools.
- **Agent Card**: o "cardápio" do agente — quem ele é, o que faz, como chamá-lo
  (ponto de descoberta, similar a `.well-known`).
- **Task**: unidade de trabalho delegada (estados: submitted → working →
  input-required → completed → failed).
- **Message / Artifact / Part**: o que o agente recebe e devolve (texto, arquivos,
  dados estruturados).
- **Transporte**: JSON-RPC 2.0; streaming/operações assíncronas via Server-Sent
  Events (SSE) para Tasks longas e multi-turno.

## Passo a passo para expor/consumir A2A

1. **Decida se A2A é o certo** — dois agentes independentes precisando
   colaborar. Se é agente↔tool, use MCP. Se é sub-agente interno, use o
   framework nativo.
2. **Escolha o SDK** oficial (Python, JavaScript, Java, C#/.NET, Go, Rust —
   repos `a2aproject/a2a-*`).
3. **Implemente o Agent Card** do seu agente (identidade + capacidades +
   endpoint de Task). Ele é o que permite descoberta.
4. **Exponha o endpoint de Task** (JSON-RPC 2.0 + SSE para streaming).