---
name: vercel-eve-filesystem
description: Build and deploy agents with Vercel Eve (filesystem-first, open-source, Apache-2.0) - agent/ directory with instructions, tools, skills, subagents, channels, schedules, sandbox; compile manifest; durable sessions, evals-as-deploy-gate, human-in-the-loop. Use quando criar agentes Eve, scaffolding com npx eve init, ou deploy via plugin Vercel/MCP.
---

# Vercel Eve Filesystem

An agent is a directory (https://github.com/vercel/eve, docs em eve.dev/docs, guia em vercel.com/docs/eve). Eve descobre os arquivos, compila um manifest e serve o runtime - local, Vercel ou Node proprio. Producao ja vem embutida: sessoes duraveis, sandbox, aprovacoes, evals.

## Quando usar

Quando precisa criar um agente Eve do zero, adicionar capability (tool/skill/channel/schedule) como arquivo, ou levar um agente filesystem-based para producao com reliability (durable execution + sandbox + HITL). NAO use para agentes fora do Eve - isso e `agent-harness-construction` ou `agentic-os`.

## Passos

1. **Scaffold** - `npx eve@latest init <name>` (instala deps, init git, sobe dev server) ou `npm install eve@latest` em app existente. Docs completas vao em `node_modules/eve/docs` - coding agents leem local.
2. **Estrutura minima** - `agent/agent.ts` (modelo via `defineAgent`, fallback por AI Gateway) + `agent/instructions.md` (system prompt always-on). So isso ja roda.
3. **Adicione por arquivo, sem imports** - `tools/*.ts` (uma tool tipada por arquivo, filename = nome da tool, Zod no inputSchema + `execute` inline), `skills/*.md` (procedures on-demand), `subagents/*` (filho com historico proprio), `channels/*` (Slack, Discord, HTTP...), `schedules/*` (cron), `connections/*` (MCP/OpenAPI, credencial fora do prompt), `sandbox/*` (backend isolado). Nada importa nada: a compilacao conecta tudo no manifest.
4. **Rode local** - comando `eve`: converse no terminal; exercite a API HTTP (`POST /eve/v1/session`, `GET .../stream`, follow-up com `continuationToken`); typecheck do projeto.
5. **Deploy pelo plugin** - instale o plugin Vercel no coding agent (skills + MCP server inclusos): "deploy this Eve agent" faz tudo + smoke test. Slack exige app manual (guie o setup), depois `@agente` com memoria na thread e aprovacoes por botao.
6. **Primitivas de producao** - sessoes = workflows checkpointed (sobrevivem crash/redeploy, retomam exato ponto); sandbox isolado (Vercel Sandbox em prod; Docker/microsandbox local); human-in-the-loop pausa steps arriscados; evals como pasta = deploy gate (verde em tudo antes de shippar); AI Gateway com fallback; mid-deploy a sessao termina na versao antiga.
7. **Versione como codigo** - prompt/tool/skill novo e commit com diff + review + historico. Mudanca de instrucao quebra como mudanca de codigo.

## Regras

- BETA: APIs e comportamento podem mudar (beta terms Vercel) - confira eve.dev antes de congelar padrao.
- NEVER commitar segredos: em prod use OIDC/AI Gateway, nunca API key no repo.
- NEVER deploy sem evals verdes.
- Eve escala os PRIMITIVOS do agente, nao knowledge base gigante (markdown wiki com dezenas de milhares de docs e outro problema - combine com padrao tipo OKF).
- Subagente = historico fresco + tools estreitas; skill = instrucao no agente atual. Escolha errada vaza contexto ou isola demais.

## Related skills

- `agent-harness-construction` - action space e observacao em qualquer harness.
- `agentic-os` - agentes persistentes e memoria de longo prazo.
- `mcp-server-patterns` - construir o MCP server que vira `connections/*`.
- `eval-harness` - rigor de rubrica para os evals do deploy gate.
- `agent-guardrails` - aprovacoes humanas e limites de blast radius.
