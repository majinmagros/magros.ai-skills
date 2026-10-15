---
name: roteamento-modelos-gratuitos
description: Use when configuring or troubleshooting zero-cost AI model routing with opencode — using free-tier models (sufixo `-free` do OpenCode Zen, Nvidia API, Gemini free, contas gratuitas rotacionando), trocando de modelo quando a quota esgota, e rodando agentes 24/7 num VPS sem pagar Anthropic/OpenAI. Triggers on "rotear modelos grátis", "usar IA de graça", "zero token", "modelo -free", "OpenCode Zen", "rotacionar conta gratuita", "API gratuita", "rodar agente 24/7 de graça", "trocar modelo quando esgota", "$0 in tokens". Complements roteamento-modelos-baratos (custo-por-tarefa) — this one is about routing free-tier providers via opencode.
metadata:
  origin: ECC
---

# Skill: roteamento-modelos-gratuitos — modelos free no opencode com rotação

O opencode reúne **provedores e modelos de custo zero** via OpenCode Zen e APIs
gratuitas (Nvidia API, Gemini free-tier, contas gratuitas rotacionando) em um
único CLI. Com isso dá para rodar agentes 24/7 num VPS gastando ~R$0 em tokens.
Sem um router com failover automático, a rotação é **manual via `/models`**:
quando um modelo `-free` esgota a quota do dia, você troca para o próximo da
sua lista (ou aponta para um agregador local, seção CLI Proxy API).

**Importante**: "grátis" = tier free de cada provedor, com quotas diárias e
resets que variam. O custo real fica no VPS (e no tempo de manutenção da
rotação). Veja a tabela de erros/limites abaixo.

## Quando usar

- Você quer rodar o opencode (ou qualquer agente OpenAI-compatível) sem
  assinatura/créditos da Anthropic.
- Você tem várias contas/APIs gratuitas (OpenCode, Nvidia, Gemini, Groq, etc.)
  e quer trocar de modelo quando uma esgota.
- Você quer tarefas agênticas 24/7 num VPS barato (~R$50/mês) sem custo de tokens.
- Você está diagnosticando um "travamento" 429/402/404/410 em um modelo
  `-free`/provider — na maioria das vezes é quota esgotada, não bug.

Não use para: escolher modelo barato por qualidade/custo (isso é
`roteamento-modelos-baratos`); agendar rotinas (isso é `routines`);
automatizar tarefa determinística (isso é `automacao-deterministica`).

## Conceitos-chave

- **Modelo `-free`**: sufixo de custo zero no OpenCode Zen (ex.:
  `opencode/deepseek-v4.1-flash-free`). Liste com `/models` no CLI.
- **Rotação manual (fallback operacional)**: o opencode NÃO faz failover
  automático entre modelos; quando a quota esgota (429/limite diário), troque
  via `/models`. Para automação, use um agregador local (CLI Proxy API abaixo).
- **Rotação de contas**: `/connect` autentica provedores/contas (OpenCode Zen);
  conta gratuita adicional = quota diária adicional.
- **Erro invisível**: provedores podem devolver HTTP 200 com erro no corpo
  (ex.: qoder devolve `403 code 115` com 200) — não dispara troca automática;
  trate na mão deixando esse modelo por último na sua fila.

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

Nota Batch 16 (#48): Nvidia oferece API gratuita com 80+ modelos via
endpoint OpenAI-compatível — boa para experimentos sem custo de tokens.
Como todo free tier, confirme quota e modelos atuais no presente antes
de colocar na frente da fila.

## Passo a passo (setup + manutenção)

1. **Instale e autentique** o opencode (`npm install -g opencode-ai`) e rode `/connect` para entrar no OpenCode Zen — guia completo no `GUIA-OPENCODE.md`.
2. **Escolha o modelo free**: `/models` (ou `opencode models`) e selecione um modelo `-free` (ex.: `opencode/deepseek-v4.1-flash-free`).
3. **Quando a quota esgotar** (429/limite diário): troque via `/models` para outro `-free`; contas adicionais via `/connect` estendem a quota diária.
4. **Para roteamento automático**: aponte o opencode para um agregador local com load balancing (CLI Proxy API abaixo).

## OX Alpha free via OpenRouter (Batch 17g, #82)

Modelo stealth $0/$0 roteavel no Claude Code CLI via OpenRouter
(ANTHROPIC_BASE_URL + token; o desktop app forca first-party e nao
serve). Free = rate limits diarios; valide qualidade no seu loop antes
de operar — gratis que nao entrega e caro.

## CLI Proxy API (Batch 17f, #78)

Agregador local open source: expoe contas (Anti-Gravity/Gemini/Claude
free, Codex, Grok, Kimi, Gemini CLI) como endpoint unico OpenAI/Gemini/
Claude-compativel, com multi-account load balancing. Caso de uso: tirar
modelos presos em IDEs (ex: Opus 4.6 e Gemini 3.1 Pro do Anti-Gravity)
e usar no Claude Code/OpenCode/Cline via baseURL. Valide os termos de
cada provedor antes de usar.

## Exemplo

```text
429 no modelo -free -> não é travamento: quota do dia esgotou
Fix: troque para outro -free via /models (ex.: opencode/deepseek-v4.1-flash-free)
Agente 24/7 no VPS: modelo -free + contas via /connect rotacionando; custo = VPS
```
