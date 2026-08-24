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
2. **Cadastre provedores** no SQLite (`providerConnections`): teste a chave na
   API real do provedor primeiro (deve responder 200), insira a conexão com
   `data` = `{"apiKey":"...","testStatus":"active",...}`, e faça backup do banco
   antes (`data.sqlite.bak-<data>-<provedor>`).
3. **Monte o combo** (`combos`, coluna `models`): modelos que funcionam no
   TOPO; modelos com erro invisível (ex.: `qd/lite`) por ÚLTIMO; aposentados
   removidos. Ordem atual de referência (2026-08-13): `cbai/glm-5.2 ->
   cbai/kimi-k2.6 -> cbai/minimax-m3 -> groq/llama-3.3-70b-versatile ->
   gemini-3.5-flash-lite -> gemini-3.1-flash-lite-preview -> gemini-3.6-flash
   -> gemini-3-flash-preview`.
4. **Aponte seu agente** para o endpoint: baseURL + modelo `my-combo` (sem
   prefixo) — o opencode/Claude Code envia o combo direto.
5. **Sem restart**: o router relê o banco por request (verificado) — alterar o
   combo no SQLite vale imediatamente.
6. **Diagnóstico de travamento**: (1) router vivo? porta escutando + request a
   `/v1/models`; (2) o erro é repassado do provedor (429=quota, 402=limite
   mensal, 404/410=modelo retirado, 403=assinatura); (3) teste o combo com um
   chat pequeno (`stream:false`, max_tokens baixo) e veja qual modelo responde.
   Se TODOS falharem, atualize o combo pondo no topo um modelo que responda 200.
7. **Runbook completo**: `~/.config/opencode/9router-runbook.md` (este ambiente
   já usa 9router; siga-o antes de qualquer outra hipótese em erro 429).

## Boas práticas

- **Backup do SQLite antes de cada mudança de combo**.
- **Rotacione contas gratuitas** para esticar a quota diária agregada.
- **Comece o combo pelo provider que aguenta a sua sessão** (sessões longas do
  opencode com tool_calls quebram em alguns providers — teste o loop antes de depender).
- **Custo real = VPS + manutenção**: o tier free some/degrada; monitore o
  reset de cada provider e reordene o combo conforme mudar.
- **Não é SLAs**: providers gratuitos podem sumir da noite pro dia; tenha um
  plano B pago (OpenRouter/DeepSeek, ver `roteamento-modelos-baratos`) para o que importa.

## Nota: tiers gratuitos via OpenRouter (stealth) — 2026-08-23

**Ox Alpha Free** na OpenRouter (`stealth/ox-alpha`, Free/Free, 1M ctx — https://openrouter.ai/stealth/ox-alpha) é um exemplo de tier free temporário via agregador pago. Diferença vs 9router:

| Agregador | Quem paga? | Failover | Risco retenção | Quando usar |
|---|---|---|---|---|
| **9router** | VPS + seu tempo (tiers free nativos: Gemini 20 req/dia, Groq, Nvidia, etc.) | automático 429/402/404/410 | baixo (sua conta) | 24/7 barato, controle total do combo |
| **OpenRouter stealth** | OpenRouter (crédito deles) | manual (trocar `ANTHROPIC_MODEL`) | **alto** — provider anônimo, `openrouter.ai/terms/stealth` permite retenção | teste rápido de modelo stealth, não para dados sensíveis |

Ox Alpha expira em ~1 semana (janela free). Se precisar de free duradouro, prefira 9router com rotação de contas. Se precisar de stealth pontual, use OpenRouter com as 3 env vars (`roteamento-modelos-baratos`).

## Aviso: canal Inteligência Mil Grau — muitos vídeos são members-only

Canal `@inteligenciamilgrau` tem trilha "Inteligência Avançada" exclusiva para membros (nível Aprendiz de IA). IDs como `XaMN61G9cNo`, `jMOYjCCEc2s`, `LqWqm0Kl4Ko`, `Q4B_DVGU_Po` retornam `Join this channel to get access to members-only content` e nunca terão legenda pública. No `diff` eles permanecem em `sem_transcricao` para sempre — filtre-os (pule) no `download`; não é 429 transitório. Pipeline deste repo já pula `XaMN61G9cNo` e detecta `members-only` no log `download.log`.

## Skills relacionadas

- `roteamento-modelos-baratos` — custo-por-tarefa, OpenRouter, executor barato + verificador forte (complemento pago) — ver seção "Modelos recentes validados (2026-08-23)" com Qwen/GLM/Grok/Ox Alpha.
- `routines` — agendar sessões autônomas na nuvem (o "24/7" do uso do VPS).
- `automacao-deterministica` — o que deve ser script em vez de agente (não queima tokens).
- `cost-tracking` / `cost-aware-llm-pipeline` — medir o que o roteamento poupa.
- `agent-guardrails` — proteger o agente que você vai rodar 24/7.

### Enriquecimento 2026-08-24 — FCC (Free Claude Code) como proxy multi-provider

Fonte `eVdXom5XDo0` (AI Code King); validado no repo oficial github.com/Alishahryar1/free-claude-code (~48k estrelas, MIT, conferido 24/08/2026).

Proxy local Python que intercepta as chamadas Anthropic Messages de vários coding agents e roteia para providers gratuitos/pagos/locais:

- **49 providers ToS-friendly** (NVIDIA NIM, OpenRouter free tier, Gemini AI Studio, Groq, Cerebras, GitHub Models, DeepSeek direto, Ollama/LM Studio/llama.cpp locais...) — claim de 1.3B+ tokens grátis/mês; remove integrações que violam termos.
- **Roteamento por tier**: `MODEL_OPUS` / `MODEL_SONNET` / `MODEL_HAIKU` / `MODEL` (fallback) apontam cada classe para um provider diferente — ex.: Opus→Kimi no NIM, Sonnet→OpenRouter free, Haiku→GLM local.
- **9 agentes suportados**: Claude Code, Codex, Pi, OpenCode, Cline, Hermes, DeepSeek Harness, Grok Build, Muse Code — wrappers `fcc-claude`/`fcc-codex`/`fcc-pi` injetam env/porta/token automaticamente (porta default 8082, Admin UI em `/admin`, hot-reload).
- **Extras**: fallback chain por modelo, bots Discord/Telegram p/ sessão remota, transcrição de voz via Whisper local ou NIM (`--voice-local`/`--voice-nim`).

Comparado ao 9router (padrão principal desta skill): FCC é mais amplo (multi-agente + tier routing nativo + voz); 9router continua melhor p/ combos com failover automático entre contas. Ambos podem coexistir — FCC expõe endpoint OpenAI-compatible que o 9router pode consumir.

⚠️ "Grátis" depende dos free tiers de terceiros: confira quotas atuais na página de cada provider antes de apostar produção (regra permanente desta skill).
