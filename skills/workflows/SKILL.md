---
name: workflows
description: Use when orchestrating large parallel work or deciding between chat/skill/subagent/agent-team/workflow. Triggers on "workflow", "dynamic workflows", "agentes em paralelo", "força-tarefa", "dezenas de agentes", "escada de recursos", "/workflows", "/goal", "/loop". Keeps token costs predictable: scope, worker model, monitoring.
---

# Skill: Workflows — trabalho gigante em paralelo (dynamic workflows)

Decide QUANDO usar cada degrau da "escada de recursos" e roda workflows sem
surpresa na conta de tokens.

## 1. A escada (suba só até onde o problema existe)

| Degrau | O que é | Quando usar |
|---|---|---|
| **Chat direto** | 1 tarefa, 1 resposta | A maioria dos casos |
| **Skill** | Receita reaproveitável ("o como") | Tarefa que se repete igual |
| **Subagente** | Paralelo sem poluir a conversa; responde só ao central | Pesquisas paralelas independentes |
| **Agent team** | Equipe que DEBATE entre si (caro) | Resultado precisa de discussão |
| **Workflow** | Dezenas/centenas de agentes, script salvo e reexecutável | Trabalho gigante em paralelo ("o quantos") |

Pergunta-chave: os agentes precisam conversar entre si? Subagentes/workflows
NÃO conversam (cada um em janela própria). Agent team sim.

## 2. Profundidade vs largura

- `/go`: **profundidade** — loop até ATINGIR CRITÉRIO (um modelo pequeno
  verifica a conclusão). "Continue refinando até passar de 9/10 no checklist."
- `/loop`: repete por **tempo** (ex.: checar deploy a cada 5 min).
- **Workflow**: **largura** — muitos agentes lado a lado, costurados no fim
  ("cavar poço" vs "arar o campo").
- `/deep research` é um workflow (agentes cruzam fontes, votam, só sobra fato checado).

## 3. Custo (onde 99% se ferra)

- Cada agente do workflow = uma chamada completa (janela própria, contexto do zero).
  Workflow de 50 agentes ≈ abrir 50 conversas de uma vez.
- **Escopo fechado**: "otimize só as imagens das 12 páginas de produto", não
  "melhore meu site". Pedido vago = explosão de tokens.
- **Modelo**: Haiku nos agentes trabalhadores; Opus só na síntese final.
- **Monitore**: `/workflows` mostra fases, agentes e tokens; interrompa se estourar.
- Erros comuns: usar workflow pra tudo, escopo aberto, não acompanhar.

## 4. Processo

1. Pergunte se a tarefa se quebra em pedaços independentes. Se não → não é workflow.
2. Feche o escopo e o entregável antes de disparar.
3. Rode: Haiku nos workers + Opus na síntese; salve o script no `.claude/` do
   projeto se a equipe for reutilizar.
4. Acompanhe com `/workflows`; entregue o resultado costurado com as fontes/agentes usados.

## 5. Regra

- Recurso novo ≠ obrigatório. Renomear 1 variável = chat; renomear em 300 arquivos = workflow.
