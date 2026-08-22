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
    
    # 4. Se score > threshold + margin → AUTO-RETRAIN
    if score > executor.best_score * 1.02:  # 2% melhor
        new_version = retrainer.train(
            data=collect_feedback(),
            base_model=executor.model,
            eval_fn=evaluator.score
        )
        # A/B test antes de deploy
        if ab_test(new_version, executor.version) > 0:
            executor.deploy(new_version)
            ledger.log(deploy=new_version)
    
    # 5. Sleep até próximo ciclo (cron)
    sleep_until(next_cron)
```

## 4. Integrações Obrigatórias (Fontes de Feedback)

| Sistema | O que extrai | Como |
|---|---|---|
| **Notion CRM** | Pipeline, leads, scores | API + webhook |
| **Slack** | Demos, conversão, qualitative | Bot + canal dedicado |
| **GitHub** | PRs, tests, CI, reviews | Actions + API |
| **YouTube Analytics** | CTR, retention, engagement | Data API v3 |
| **Broker (Interactive Brokers, Binance, etc.)** | P&L, positions, fills | REST/WebSocket |
| **PostgreSQL / ClickHouse** | Logs estruturados, métricas | SQL direto |

## 5. Estrutura de Versionamento (Ledger Obrigatório)

```json
{
  "autobot_id": "sales_v3",
  "version": "3.7.2",
  "timestamp": "2026-08-22T04:00:00Z",
  "executor": {"model": "gpt-4o-mini", "prompt_hash": "sha256:..."},
  "evaluator": {"model": "claude-3.5-sonnet", "prompt_hash": "sha256:..."},
  "score": 87.3,
  "previous_best": 85.1,
  "improvement": 2.2,
  "deployed": true,
  "ab_test": {"control": "3.7.1", "treatment": "3.7.2", "p_value": 0.03}
}
```

## 5. Guardrails (Não Negociáveis)

1. **Separation of Concerns:** Executor ≠ Avaliador (diferentes prompts, modelos, ou instâncias)
2. **Human-in-the-loop para deploy crítico:** Score > threshold + A/B pass → notifica humano antes de deploy em produção (trading, saúde, financeiro)
3. **Rollback automático:** Se score cai > 5% pós-deploy → rollback automático em < 5 min
4. **Budget guard:** Max $/dia por autobot (token + compute); para se excede
5. **Audit trail:** Todo ciclo logado em ledger imutável (append-only, Git ou ClickHouse)

## 6. Integração com Skills ECC

| Skill | Relação |
|---|---|
| `score-loop` | O loop gerador-avaliador com cutoff score |
| `loop-design-check` | Valida se loop não entra em modo falho |
| `agent-guardrails` | Protege avaliador de jailbreak/prompt injection |
| `context-ledger` | Ledger de versões/scores (source/who/kind/excerpt/reference) |
| `routines` | Cron 4AM diário, agendamento |
| `cost-aware-llm-pipeline` | Budget tokens por ciclo |
| `agent-guardrails` | Protege executor/avaliador de prompt injection |
| `unified-memory` | Compartilha ledger entre instâncias |

## 7. Exemplo de Uso (Hermes/Claude)

```
"Crie um autobot para vendas: executor usa GPT-4o-mini para qualificar leads 
no Notion CRM, avaliador usa Claude-3.5-Sonnet para pontuar 0-100 baseado 
em conversão real no Slack, retrainer re-treina semanal com dados de 
conversão, deploy se A/B test p<0.05. Cron 4AM. Integra Notion+Slack."
```

## 8. Referências

- Vídeo origem: `yRkvxxRpkiw` — @airevolutionx_pt (2026-08-22) — Abacos 4 autobots (vendas, código, YouTube, trading)
- Abacos: empresa de autobots em produção (4 bots: vendas, código, YouTube, broker)
- Ciclo: Executor → Avaliador Independente → Retrain → A/B → Deploy
- Princípio: "IA esquece, agente aprende" — separar execução de avaliação
- Source: `yRkvxxRpkiw` — @airevolutionx_pt (2026-08-22) 24:23