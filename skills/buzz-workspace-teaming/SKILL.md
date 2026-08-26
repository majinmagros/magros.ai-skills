---
name: buzz-workspace-teaming
description: Use when implementing Block Buzz workspace — humans and AI agents as teammates with shared workspace, identity system, starter agents, per-agent model routing, and free-tier AP usage (Kimi K3 via free APIs). Triggers on "Buzz", "Block Buzz", "workspace teammates", "human-agent teaming", "Kimi K3 free", "starter agents".
metadata:
  origin: ECC
---

# Buzz Workspace Teaming (Block)

Based on **Block Buzz** (video `yd9XNumOkjg` 2026-07-30 + prior `kC8NMSS5Nac` jcode context, ai-code-king): open-source workspace where humans and AI agents work as teammates with shared workspace, identity system, and per-agent model routing (ex: Kimi K3 as main coding model via free APIs).

> Fonte: `yd9XNumOkjg.en.dedup.txt` (ai-code-king/RELATORIO.md 2026-08-26) — validado contra `github.com/block/buzz` (Block).

## Quando usar

- Equipe híbrida humanos + múltiplos agentes no mesmo workspace (não um agente isolado)
- Cada agente com identidade + modelo diferente (ex: Kimi K3 para code, Claude para review)
- Quer rodar stack grátis via free APIs (Kimi, GLM) sem pagar $200/m plano
- Precisa de starter agents + setup compartilhado

## Quando NÃO usar

- Um agente solo (use `claude -p` ou `agent-harness-construction`)
- Precisa de orquestração barata mestre/escravo (use `claude-devfleet` / `dmux-workflows`)
- Workspace já é `google-workspace-ops` puro humano

## Setup

```bash
git clone https://github.com/block/buzz
cd buzz && npm i && npm run dev  # dashboard em http://localhost:3000

# 1. Crie identidades
buzz identity create --name "coder" --model kimi-k3 --provider moonshot --api-key $MOONSHOT_KEY
buzz identity create --name "reviewer" --model claude-sonnet-4 --provider anthropic

# 2. Starter agents
buzz agent init --template team  # cria 3 agents base ligados às identidades

# 3. Per-agent routing + free APIs
buzz config set agent.coder.model kimi-k3
buzz config set agent.coder.provider moonshot  # free tier
buzz config set agent.reviewer.model claude-sonnet-4
```

### Free tier pattern (do vídeo)

```js
// buzz.config.json
{
  "agents": {
    "coder": { "model": "kimi-k3", "provider": "moonshot", "apiKey": "free-tier" },
    "helper": { "model": "glm-4.5-flash", "provider": "zai", "apiKey": "free" }
  }
}
```

## Operação

- **Workspace compartilhado**: todos agentes veem mesmo fs + chat + tasks (diferente de worktrees isoladas)
- **Identidade**: cada mensagem tem `agent_id` + `human_id` (auditoria)
- **Starter agents**: templates `team`, `solo`, `review` — copie e customize

## Relação com skills existentes

- `agentic-os` → OS para agentes; **Buzz é workspace concreto (Block)**
- `team-agent-orchestration` / `claude-devfleet` → orquestra worktrees; **Buzz é teammates no mesmo workspace**
- `unified-memory` → memória compartilhada; Buzz já tem shared workspace + identity
- `roteamento-modelos-baratos` / `roteamento-modelos-gratuitos` → use para escolher modelo por agente em Buzz

## Validação

- Repo: https://github.com/block/buzz (estrela Block, MIT)
- Docs: `buzz --help` + `docs/` no repo
- Modelos: Kimi K3 via Moonshot free API, GLM via Z.ai free tier — confirmar quotas na página oficial do provider antes

## Erros comuns

- **Um modelo para todos agentes** → perca da vantagem; route cada agente para modelo ideal
- **Confundir com 9router/Tracer** → Buzz é workspace compartilhado, não roteador de API nem orquestrador worktree
- **Não setar identidade** → sem `identity`, perde auditoria conversa→código (use DeltaDB junto se precisa)
