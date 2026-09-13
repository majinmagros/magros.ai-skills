---
name: llm-leaderboard-tracker
description: Acompanha a posição e a qualidade de modelos de LLM ao longo do tempo, detectando novidades e mudanças de ranking. Gatilho: usuário quer saber "qual o melhor LLM agora", "o que mudou no ranking", "tem modelo novo no topo", ou precisa monitorar modelos (benchmark de qualidade, comparação de custo/qualidade) de forma recorrente. Não-gatilho: não é para rodar um modelo local (use o modelo direto); não é para escolher modelo pontual sem histórico (use roteamento-modelos-baratos). Outcome: diff entre snapshot atual e anterior (entradas novas, subidas/quedas, variação de score) + alerta quando um modelo cruza um limiar de interesse.
---

# LLM Leaderboard Tracker

Monitora rankings de LLM de forma **reprodutível e histórica** (não opinião de momento).

## Quando usar

- "qual o melhor LLM agora?", "o que mudou no ranking?", "tem modelo novo no topo?"
- Monitorar qualidade/custo dos modelos de forma recorrente (snapshot + diff)
- Alertar quando modelo cruza limiar (top-N, score X)
- Não use para: rodar modelo local; escolha pontual sem histórico (isso é roteamento-modelos-baratos)

> ✅ **VERIFICADO (2026-08-26):** fontes oficiais confirmadas nesta sessão.

## Pipeline

### 1. Definir fontes de ranking (verificadas)
- **LMArena** — preferência humana em pareado. Oficial: `arena.ai/leaderboard`;
  espelho Hugging Face: `lmarena-ai/arena-leaderboard`.
- **Hugging Face Open LLM Leaderboard** — ⚠️ **aposentado/arquivado em 2025**
  (não usar como fonte agregada). Use no lugar: leaderboards comunitários via
  OpenEvals (`find-a-leaderboard`) e leaderboards por tarefa (código, matemática, etc.).
- Leaderboards específicos por tarefa (código, math, vision) conforme o interesse.
Princípio: **use API oficial quando existir**; scraping só como fallback, com seletor versionado.

### 2. Snapshot
- Para cada fonte, capture (modelo, score, rank, data) em JSON.
- Arquivo de estado: `state/leaderboard-<fonte>.json` (crie se não existir).
- Use script determinístico (Node/Python) — não confie em leitura manual.

### 3. Diff
- Carregue snapshot anterior; calcule:
  - `NOVO`: modelo ausente antes.
  - `SUBIU` / `DESCEU`: variação de rank/score além de tolerância.
  - `CRUZOU-LIMIAR`: entrou no top-N ou passou de score X definido pelo usuário.

### 4. Relatório + alerta
- Tabela de movers; destaque `NOVO` e `CRUZOU-LIMIAR`.
- Salve novo snapshot como atual.
- Opcional: emitir alerta (mensagem/resumo) quando houver `NOVO` ou mudança relevante.

## Regras
- Sempre salvar snapshot antes de sobrescrever — o diff é o valor da skill.
- Scores de fontes diferentes não são comparáveis diretamente; reporte por fonte.
- Se a fonte muda de metodologia, anote a data da mudança no estado.

## Estado sugerido
```
state/leaderboard-lmarena.json  -> [{model, score, rank, ts}]
state/leaderboard-hf.json       -> [{model, score, rank, ts}]
```

## Watchlist Batch 16 (2026-09-13, #45 #47 #49)

Nomes citados nos vídeos, a confirmar nos snapshots: "Astra" (OpenAI),
"Fable 5.1" / "Mythos 5.1" (Anthropic), "GPT 5.6 Sol" / "Terra",
"Images 2.5 Flair" / "Sunburst" (imagem). Todos ainda rumor ou medição
de autor — só entram no ranking com fonte oficial.

### Watchlist Batch 17a (#51): GLM-5.2 (open weights, tier A), MiniMax-M3
(tier B, melhor custo), Qwen local (tier leve). Rumor/medicao de autor —
so entra no ranking com fonte oficial.

### Watchlist Batch 17g (#74 #82): DeepSeek V4 Flash 0731 (72.5% King
Bench), stealth OX Alpha ($0/$0 OpenRouter). Medicao de autor — fonte
oficial antes do ranking.

### Watchlist Batch 17h (#92-109, AI Revolution roundups — tudo rumor ou
medicao de autor ate confirmacao oficial)
- OpenAI: GPT-6 Astra/Soul/Terra/Luna (hierarquia vazada); GPT 5.6
  familia lancada (Sol + conjectura math, Terra, Luna); Astra = classe
  Fable p/ enterprise.
- Anthropic: Opus 5 lancado 24/jul (oficial); Fable 5 superado por
  metade do preco (alegacao do canal).
- China open: Kimi K3 2.8T pesos abertos (HF, servido por providers US;
  demanda pausou assinaturas); MiniMax 2.7T a caminho; DeepSeek V4.1
  Flash 763B; Qwen (destilacao atribuida, ver #53).
- Outros: Thinking Machines Inklings MoE 975B/41B ativos (open);
  Grok 4.5 (SpaceX IA); Orca world model; Gemini 4.0 (checkpoint
  vazado); SeaDream 5.0 Pro (ByteDance).

## Exemplo real validado (2026-08-26)
- Fonte: `arena.ai/leaderboard` (LMArena oficial).
- Snapshot topo: `claude-fable-5` (#1), `claude-opus-4-6-high` (#2),
  `claude-opus-4-7-high` (#3), `meta-muse-spark-1.2` (#4).
- Nota crítica aplicada: HF Open LLM Leaderboard **aposentado em 2025** →
  não usado como fonte agregada; usado LMArena + leaderboards comunitários.
- Diff real: detectaria `NOVO` / `CRUZOU-LIMIAR` ao re-snapshotar.
