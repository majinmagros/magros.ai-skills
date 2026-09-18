---
name: claude-connector-strategy
description: Use when choosing and configuring Claude connectors — Gmail/Calendar/Drive/Notion prioritization, MCP vs native, granular permissions, OAuth flow. Triggers on "claude connector strategy", "connector strategy claude", "gmail connector claude", "mcp vs nativo", "connector permissions", "oauth flow claude".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
    - https://docs.anthropic.com/en/docs/claude-code/connectors
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Claude Connector Strategy — Guia de Conectores

Guia de conectores: **priorização (Gmail/Calendar/Drive/Notion), MCP vs nativo, permissions granulares, OAuth flow**.

## Quando usar (gatilhos concretos)

- "Quais conectores configurar primeiro"
- "MCP vs nativo qual a diferença"
- "Permissions granulares para conectores"
- "OAuth flow para conectores"
- "Priorização de conectores"

## Quando NÃO usar

- Configuração de conector específico não listado
- Configuração única sem estratégia
- Conector não suportado oficialmente

## Priorização de Conectores

### Prioridade 1 (Configure First)

| Conector | Categoria | Por que Primeiro |
|----------|-----------|------------------|
| Gmail | communication | Email triage, draft responses, search |
| Google Calendar | scheduling | Schedule optimization, conflict detection |

### Prioridade 2

| Conector | Categoria | Por que Segundo |
|----------|-----------|-----------------|
| Google Drive | storage | File access, folder org, sharing |
| Notion | knowledge | Knowledge base, project docs, wiki |

### Prioridade 3

| Conector | Categoria | Por que Terceiro |
|----------|-----------|------------------|
| GitHub | development | Code access, PR reviews, issues |
| Linear | project_management | Task management, sprint planning |
| Slack | communication | Notifications, team communication |

## MCP vs Nativo

| Aspecto | MCP (Model Context Protocol) | Nativo (Built-in) |
|---------|------------------------------|-------------------|
| Setup | Config manual via JSON | UI nativa, 1-click |
| Flexibilidade | Total (custom tools) | Limitado ao suportado |
| Manutenção | Manual | Automática |
| Performance | Overhead de processo | Nativo, otimizado |
| Quando usar | Custom tools, APIs privadas | Conectores oficiais suportados |

**Regra:** Use nativo para conectores oficiais (Gmail, Calendar, Drive, Notion, GitHub, Slack, Linear, Notion). Use MCP para APIs privadas, ferramentas customizadas, legacy systems.

## Exemplo

```text
"Quais conectores primeiro?" → P1: Gmail + Calendar (nativos, 1-click, triage+agenda)
Drive/Notion P2 nativos; API interna de billing → MCP custom (sem conector oficial)
OAuth com escopo mínimo; revoga o que não usa em 30 dias
```

## Hub pronto vs MCP proprio (leva YouTube rodada 9)

Playbook: use hub pronto (estilo Composio, 1000+ integracoes, 1 install) quando o conector e commodity (Gmail/Sheets/Notion/CRM); construa MCP proprio quando ha logica de dominio, SLA ou dados sensiveis. Decisao registrada por conector; revise quando o hub mudar pricing/limites.
