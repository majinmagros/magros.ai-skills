---
name: roteamento-modelos-gratuitos
description: Use when configuring or troubleshooting zero-cost AI model routing via 9router — aggregating free tiers (OpenCode free, Nvidia API, Gemini free, rotating free accounts), building combos with automatic failover on quota errors, and running agents 24/7 on a VPS without paying Anthropic/OpenAI. Triggers on "9router", "rotear modelos grátis", "usar IA de graça", "zero token", "failover de conta", "rotacionar conta gratuita", "API gratuita", "rodar agente 24/7 de graça", "CLAUDE CODE hack", "$0 in tokens". Complements roteamento-modelos-baratos (custo-por-tarefa) — this one is about routing free-tier providers with automatic failover.
metadata:
  origin: ECC
---

# Skill: roteamento-modelos-gratuitos — 9router e tiers gratuitos com failover

O 9router é um router de IA open source (25k+ estrelas) que agrega **múltiplos
provedores/contas em um único endpoint OpenAI-compatível** e faz **failover
automático** quando um provider esgota quota: se um modelo responde 429/402/
404/410, o router tenta o próximo da cadeia (combo) sem o cliente precisar
trocar de login. Com isso dá para rodar agentes (ex.: Claude Code) apontando
para APIs gratuitas (OpenCode free, Nvidia API, Gemini free-tier, contas
gratuitas rotacionando) em um VPS 24/7 gastando ~R$0 em tokens.

**Importante**: "grátis" = tier free de cada provedor, com quotas diárias e
reiniers que variam. O custo real fica no VPS (e no tempo de manutenção do
combo). Veja a tabela de erros/limites abaixo.

## Quando usar

- Você quer rodar o Claude Code (ou qualquer agente OpenAI-compatível) sem
  assinatura/créditos da Anthropic.
- Você tem várias contas/APIs gratuitas (OpenCode, Nvidia, Gemini, Groq, etc.)
  e quer um só endpoint com failover automático quando uma esgota.
- Você quer tarefas agênticas 24/7 num VPS barato (~R$50/mês) sem custo de tokens.
- Você está diagnosticando um "travamento" 429/402/404/410 em um modelo
  `9router/*` — na maioria das vezes é quota de TODOS os provedores da cadeia,
  não o router travado.

Não use para: escolher modelo barato por qualidade/custo (isso é
`roteamento-modelos-baratos`); agendar rotinas (isso é `routines`);
automatizar tarefa determinística (isso é `automacao-deterministica`).

## Conceitos-chave

- **Combo**: lista ordenada de modelos `provider/modelo` (JSON array no SQLite).
  **Ordem importa** — primeiro modelo = tentado primeiro; fallback segue a fila.
- **Fallback automático**: o router detecta falha por **status HTTP**
  (429/402/404/410 → `shouldFallback:true`). Ele NÃO detecta erros embutidos
  no corpo da resposta com HTTP 200 (ex.: qoder devolve `403 code 115` com 200
  — esse erro "invisível" não dispara fallback; mitigue deixando esse modelo
  como ÚLTIMO da cadeia).
- **Endpoint**: roda localmente/VPS, baseURL `http://127.0.0.1:20128/v1`,
  modelo sem prefixo (`my-combo`, não `9router/my-combo` — prefixo é
  interpretado como provider e falha).

## Provedores gratuitos observados (estado 2026-08-13, verifique no presente)

| Provedor | Erro típico | Reset | Nota |
|---|---|---|---|
| `gemini/*` | 429 quota free-tier (20 req/dia/modelo) | ~27s–diário | bom fallback de curto prazo |
| `groq/*` | responde 200 em requests curtos | — | 400 formato em conversas longas (tool_calls) |
| `cbai/*` (codebuddy-intl) | 429 créditos | ~1min | aguenta sessões longas (tool_calls) |
| `kr/*` (kiro) | 402 limite mensal | mensal | — |
| `ollama/*` | 404/410 modelo aposentado | — | — |
| `nvidia/*` | 404 função não encontrada | — | — |
| `qd/lite` | 403 embutido (limite de agente) | ~2026-08-27 | erro invisível, manter por último |
| OpenCode free / outras contas | variável | variável | rotacione contas para estender a quota diária |

## Passo a passo (setup + manutenção)

1. **Instale e rode** o 9router (npm global, `%APPDATA%\npm\node_modules\9router\` no Windows / `~/.npm-global/lib/node_modules/9router/` no Linux/Mac); endpoint em `http://127.0.0.1:20128/v1`.