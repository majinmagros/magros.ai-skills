---
name: claude-connector-strategy
description: >-
  Guia de conectores: priorização (Gmail/Calendar/Drive/Notion), MCP vs nativo, permissions granulares, OAuth flow. Baseado no vídeo da Luciana Papini "Me de 34 minutos e eu te darei 10 000 horas de conhecimento do Claude".
  Use quando: "claude connector strategy", "connector strategy claude", "gmail connector claude", "calendar connector claude", "mcp vs nativo", "connector permissions", "oauth flow claude". Non-triggers: conector específico não listado, configuração única.
  Outcome: Guia de conectores: priorização (Gmail/Calendar/Drive/Notion), MCP vs nativo, permissions granulares, OAuth flow.
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

## Permissions Granulares

| Conector | Read | Write | Delete | Admin |
|----------|------|-------|--------|-------|
| Gmail | allow | ask | deny | deny |
| Google Calendar | allow | ask | deny | deny |
| Google Drive | allow | ask | deny | deny |
| Notion | allow | ask | deny | deny |
| GitHub | allow | ask | deny | deny |
| Linear | allow | ask | deny | deny |
| Slack | allow | ask | deny | deny |

**Legenda:** allow = permitir sempre, ask = pedir confirmação, deny = bloquear

## OAuth Flow

```
User Action
    │
    ▼
Claude Requests Permission
    │
    ▼
OAuth Consent Screen (Google/Notion/GitHub)
    │
    ▼
User Grants Permission
    │
    ▼
Token Stored Securely (encrypted)
    │
    ▼
Connector Available in Session
```

**Token Storage:** Criptografado, armazenado localmente, não sincronizado.

## Decision Matrix: MCP vs Native

```
NEED CUSTOM TOOLS / PRIVATE APIs?
    │
    ├── YES → Use MCP (custom server)
    │
    └── NO → USE NATIVE CONNECTOR
              │
              ├── Official connector exists? → USE NATIVE
              │
              └── NO → Check MCP registry / Build custom
```

---

## Setup Checklist

- [ ] Gmail (read + compose, ask send)
- [ ] Google Calendar (read + write, ask modify)
- [ ] Google Drive (read + write, ask delete)
- [ ] Notion (read + write, ask delete)
- [ ] GitHub (read + write PRs, ask delete)
- [ ] Linear (read + write, ask delete)
- [ ] Slack (read + post, ask admin)

---

## Referências Oficiais

- [Claude Code Connectors](https://docs.anthropic.com/en/docs/claude-code/connectors)
- [MCP Specification](https://modelcontextprotocol.io)
- [OAuth 2.0 Spec](https://oauth.net/2/)

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```