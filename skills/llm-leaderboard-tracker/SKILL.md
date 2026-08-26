---
name: llm-leaderboard-tracker
description: Acompanha a posição e a qualidade de modelos de LLM ao longo do tempo, detectando novidades e mudanças de ranking. Gatilho: usuário quer saber "qual o melhor LLM agora", "o que mudou no ranking", "tem modelo novo no topo", ou precisa monitorar modelos (benchmark de qualidade, comparação de custo/qualidade) de forma recorrente. Não-gatilho: não é para rodar um modelo local (use o modelo direto); não é para escolher modelo pontual sem histórico (use roteamento-modelos-baratos). Outcome: diff entre snapshot atual e anterior (entradas novas, subidas/quedas, variação de score) + alerta quando um modelo cruza um limiar de interesse.
---

# LLM Leaderboard Tracker

Monitora rankings de LLM de forma **reprodutível e histórica** (não opinião de momento).

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

## Exemplo real validado (2026-08-26)
- Fonte: `arena.ai/leaderboard` (LMArena oficial).
- Snapshot topo: `claude-fable-5` (#1), `claude-opus-4-6-high` (#2),
  `claude-opus-4-7-high` (#3), `meta-muse-spark-1.2` (#4).
- Nota crítica aplicada: HF Open LLM Leaderboard **aposentado em 2025** →
  não usado como fonte agregada; usado LMArena + leaderboards comunitários.
- Diff real: detectaria `NOVO` / `CRUZOU-LIMIAR` ao re-snapshotar.
