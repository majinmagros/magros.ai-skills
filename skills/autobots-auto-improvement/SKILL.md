---
name: autobots-auto-improvement
description: Use quando precisar criar agentes que se auto-melhoram continuamente (autobots) — avaliador independente, auto-retrain, ciclo de melhoria autônomo, integração CRM/Slack/GitHub/broker. Triggers em "autobots", "auto-melhoria IA", "auto-retrain", "avaliador independente", "Abacos", "ciclo melhoria autônomo", "IA que aprende sozinha", "auto-improvement loop".
metadata:
  origin: ECC
---

# Skill: Autobots — Agentes que se Auto-Melhoram (Auto-Improvement Loop)

> Baseado no vídeo `yRkvxxRpkiw` (AI Revolution em Português) — Abacos: 4 autobots rodando em produção (vendas Notion→Slack, código GitHub, YouTube, broker). Agente executa trabalho, avaliador independente avalia, auto-retrain baseado em conversão. "IA esquece, agente aprende."

## 1. Quando usar

- Precisa de agente que melhora sozinho sem intervenção humana
- Quer separar **execução** de **avaliação** (evita autoconfiança/viés)
- Precisa de auto-retrain baseado em métricas reais (conversão, performance, erro)
- Quer integrar CRM (Notion), Slack, GitHub, broker, YouTube como fontes de feedback
- "IA esquece, agente aprende" — ciclo contínuo de melhoria autônoma

## 2. Arquitetura do Autobot (Divisão Obrigatória)

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTOBOSS (Orquestrador)                  │
│  - Agenda (cron 4AM)                                        │
│  - Roteia: Executor → Avaliador → Retrain → Deploy          │
│  - Guarda estado global (ledger de versões)                 │
└─────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   EXECUTOR    │    │  AVALIADOR    │    │   RETRAINER   │
│  (Worker)     │    │  (Judge)      │    │  (Trainer)    │
│  - Executa    │    │  - Métrica    │    │  - Novo model │
│    tarefa     │    │    objetiva   │    │    versionado │
│  - Output     │    │  - 0-100      │    │  - A/B test   │
│    bruto      │    │  - Sem viés   │    │  - Deploy se  │
└───────────────┘    └───────────────┘    │    melhor     │
                                            └───────────────┘
```

**Regra de Ouro:** Executor e Avaliador são **modelos/separados/instâncias diferentes**. Avaliar próprio trabalho gera autoconfiança → viés → estagnação.

## 2.1 4 Autobots de Referência (Abacos)

| Autobot | Domínio | Fonte Feedback | Métrica | Frequência |
|---|---|---|---|---|
| **Sales** | Pipeline Notion CRM | Slack (demos) | Lead score 0-100, conversão | 4AM diário (3 runs) |
| **Code** | Repo GitHub | Testes, CI, code review | Pass rate, latency, bugs | Push/PR |
| **Content** | Canal YouTube | Analytics, comentários | CTR, retention, engagement | Diário |
| **Trading** | Corretora (broker API) | P&L, Sharpe, drawdown | ROI, risk-adjusted | Tick/horário |

## 3. Ciclo de Melhoria (Loop Obrigatório)

```python
# Pseudocódigo do ciclo
while True:
    # 1. EXECUTOR executa tarefa
    output = executor.run(task, context)
    
    # 2. AVALIADOR independente avalia
    score = evaluator.score(output, ground_truth_or_metric)
    
    # 3. REGISTRA no ledger (versão, score, diff)
    ledger.log(version=executor.version, score=score, output=output)
    