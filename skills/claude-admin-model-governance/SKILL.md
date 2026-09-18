---
name: claude-admin-model-governance
description: Playbook de governanca de modelos Claude por role, entitlements e effort caps. Use para definir defaults, controlar custo-por-tarefa e padronizar modelo+effort+cache. Triggers PT: qual modelo usar, governanca de modelos, controlar custo Claude, effort cap. Triggers EN: which Claude model, model governance, model defaults, control AI cost.
---

# Claude Admin Model Governance

## Quando usar

- Definir qual modelo cada time/role usa por padrao.
- Controlar custo sem bloquear produtividade: entitlements + effort caps + cache.
- Padronizar decisao de modelo como config revisavel, não escolha ad hoc.

## Quando NAO usar

- Não roteia tarefa individual em runtime — isso é `claude-model-router`.
- Não faz observabilidade financeira detalhada — isso é `cost-tracking`.
- Não é guia de prompt barato — isso é `roteamento-modelos-baratos`.

## Defaults por role

1. **Open-ended / ambiguo / design:** default modelo de fronteira criativa. Justificativa: exploracao supera custo.
2. **Rotina / execucao bem especificada:** default Opus ou Sonnet conforme criticidade. Sonnet para volume, Opus para decisao cara.
3. **Triagem / classificacao / extracao:** sempre o modelo barato valido; escalar só com gatilho.

## Pipeline

1. **Inventariar roles e tarefas:** listar `role | top-5 tarefas | sensibilidade | volume`.
2. **Fixar defaults:** tabela `role | default | fallback | quando escalar`.
3. **Definir entitlements:** quem pode usar fronteira sem aprovacao, quem precisa de aprovacao, quotas por time.
4. **Definir effort caps:** effort maximo por categoria; acima do cap exige decompor tarefa ou aprovacao.
5. **Definir custo-por-tarefa:** `custo = modelo + effort + cache`. Exigir cache em fluxos repetitivos e prompts estaveis.
6. **Publicar e revisar:** config versionada + revisao mensal: top tarefas caras, taxa de escalacao, estouro de cap.

## Regras

- Só config, sem codigo: output é tabela + politica, não script.
- Nenhum default é permanente: todo default tem dono e data de revisao.
- Effort alto em modelo caro é excecao, não rotina.
- Sem cache em prompt repetido é desperdicio — corrigir config antes de trocar modelo.

## Output

- Matriz `role→default/fallback`, tabela de entitlements, effort caps e formula de custo-por-tarefa.
- Done = politica publicada, versionada e com dono de revisao.

## Related skills

- `claude-model-router` — roteamento por tarefa em runtime.
- `cost-tracking` — observabilidade de gasto.
- `roteamento-modelos-baratos` — guia de economia por tarefa.

## Clausulas de uso de dados (leva YouTube rodada 10)

Sem treino em dados enterprise sem permissao expressa. Acesso humano a retidos: raro, aprovado, log tamper-proof. Checklist de due diligence por workspace: modelos Covered? canal com regra propria? aceite documentado + plano de saida para ZDR? Ver claude-safety-monitoring-window e claude-zero-retention-frontier.
