---
name: claude-model-router
description: Use when routing Claude models by task — Sonet daily, Opus/Fable complex, mid-task swap, per-task cost tracking. Triggers on "claude model router", "roteamento modelos claude", "sonet vs opus", "swap model mid task", "cost tracking per task", "model routing strategy".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
    - https://docs.anthropic.com/en/docs/claude-code/settings
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Claude Model Router — Roteamento por Task

**Sonet** (diário, ≤$0.50/task) · **Opus** (complexo, ≤$5) · **Fable** (reasoning, ≤$10) + swap mid-task + cost tracking. Regras, router e tracker em `references/routing.md`.

## Quando usar (gatilhos concretos)

- "Roteamento de modelos no Claude Code"
- "Quando usar Sonet vs Opus vs Fable"
- "Swap de modelo mid-task"
- "Cost tracking por task"
- "Model routing strategy Claude"

## Quando NÃO usar

- Roteamento geral de LLMs → use `roteamento-modelos-baratos`
- Cost tracking geral → use `cost-aware-llm-pipeline`
- Model routing para outros provedores → use `roteamento-modelos-baratos`

## Regras (resumo)

- Upgrade → Opus se complexidade ≥8/10; downgrade → Sonet se ≤3/10 ou custo >3x esperado; considere Fable se contexto >100k
- `should_swap_model()` + `estimate_cost()` (70/30 in/out) + `record_task()` com budget + `get_session_report()` → `references/routing.md`
- CLI: `claude-model-router swap --to opus-5 --reason "..."` · `status` (modelo, custo, budget)

## Validação Contra Fonte

| Claim | Fonte | Status |
|---|---|---|
| Sonet diário / Opus-Fable complexo / swap economiza | Luciana Papini video | ✅ |
| Cost tracking per task | Anthropic Docs | ✅ |

## Enriquecimento 2026-09-06 — Opus 5 + rate limits (AI Code King `6m1vJqdsanQ`, docs oficiais)

- **Opus 5**: `claude-opus-5`, contexto **1M default e máximo**, 128K output, thinking on — [what's new](https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5). Preço API **$5/$25** por MTok.
- **Correção**: os **$10/$50** citados no vídeo são do **Fast mode / era Opus 4.8** (Week 30 digest), não do Opus 5 base. Não orçar Opus 5 a $10/$50.
- **Rate limits (14/set)**: boost temporário de 50% expira 13/set; aumento permanente de 25% sobre o baseline = **-17% vs o que você tem hoje** (admitido pela Anthropic). Limites 5h dobrados (maio) permanecem. Auto-mode classifier calls não contam mais no uso; auto-continue no reset reduz babysitting.
- Regra de roteamento: Opus 5 1M não dispensa curadoria — 1M cheio de ruído perde para 200K limpo (retrieval MRCR v2 cai com volume).

## Enriquecimento 2026-09-13 (Batch 16, #49) — Fable 5.1 na prática

- Teste prático (Campelo `5tSGf1DYKe0`): 1 prompt gera landing Awwwards
  (Three.js + partículas + scroll morph). Esforço máximo = multi-agente
  e "gasta fácil" muitos tokens — não é default para toda task.
- Claim do vídeo (2x mais rápido com metade dos tokens no esforço máximo)
  é medição do autor: valide na sua task antes de orçar por ele.
- Regra: esforço máximo só quando a task exige; no resto, o esforço
  padrão entrega igual por menos tokens.

## Enriquecimento rodada 5 — matriz effort + cache (Claude oficial)

- **Comece em medium, suba se preciso** — esforço default medium; só escale
  para high/max quando a task prova que precisa (qualidade insuficiente ou
  horizonte longo). Esforço máximo de saída não é default.
- **Regra do cache** — em threads agênticas longas, leituras repetidas do
  contexto podem custar ~10% via cache. Prompts estáveis + fluxo repetitivo
  = exija cache; sem cache, troque o fluxo antes de trocar o modelo.
- **Modelo mais inteligente pode custar menos por tarefa** — Fable/Opus que
  resolve em 1 passada sai mais barato que Sonnet em 5 tentativas. Compare
  custo-por-tarefa-concluída, nunca preço-por-token.
- **Subagents sempre baratos** — workers delegados rodam no modelo barato
  por padrão; só o architect/orchestrador principal usa o modelo forte.

## Enriquecimento 2026-09-26 — Opus 5.5 + GPT-6 Sol/Luna (captura semanal 19-26/09)

- **Opus 5.5**: `claude-opus-5-5`, **$4/$20** por MTok (era $5/$25 no Opus 5),
  cache read **$0.20** (era $0.50, -60% na linha que mais pesa em agentes),
  ~20% menos tokens por task → ~40% economia real vs Opus 5. Fable 5.1 e
  GPT-6 Astra cobram $10/$50 (2,5x). Default effort **medium** (Opus 5 era
  high) — medium entrega igual por fração do custo; máximo raramente compensa.
- **Benchmarks (esforço máximo)**: Terminal-Bench 66.4% vs Fable 5.1 55.8% vs
  Astra 57.9%; Frontier Code 54.4% vs 53.3% vs 50.3%; GDP 1846 vs 1735 vs 1542;
  OSWorld 81.5% vs 80.7%. Perde só em business workflows (40% vs 41.4%) e
  pesquisa científica agêntica (58.7% vs 64%).
- **GPT-6 Sol**: **$2/$10** (metade do Opus 5.5) — em 10 use cases reais
  (Nate Herk `eF3yeJuifoQ`) Sol corre em paralelo e mais rápido; regra:
  "$100 em Sol vs $100 em Opus, qual entrega mais qualidade por dólar?"
- **Operacional**: fast mode chega mais rápido mas custa mais por token;
  safety redireciona cyber p/ modelo antigo e bio p/ programa de verificação;
  limit reset sob demanda (Pro/Team/Enterprise). CLI: `swap --to opus-5-5`.
- Regra nova: Opus 5.5 medium-first; worker barato continua (Sol/Jev);
  architect no forte. Comparar sempre custo-por-tarefa-concluída.

Fontes: Maestros `XsRt-kwqtVA` + `SisHKjjECPM` (transcritos locais),
N. Herk `eF3yeJuifoQ`, A. Osmani (claude.dev 22/09), C. Medin Jev 22/09.

## Referências Oficiais

- [Luciana Papini Video](https://www.youtube.com/watch?v=Bezlzmti6_U)
- [Anthropic Model Docs](https://docs.anthropic.com/en/docs/claude-code/settings)
- [What's new in Claude Opus 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5)
- [Claude Code Week 30 — fast mode Opus 4.8 $10/$50](https://code.claude.com/docs/en/whats-new)

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...