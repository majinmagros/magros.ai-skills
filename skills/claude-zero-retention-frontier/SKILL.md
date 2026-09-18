---
name: claude-zero-retention-frontier
description: Decisão e transição para Zero Data Retention e Frontier Safeguards. Gatilhos PT: zero retention, ZDR Claude, frontier safeguards, BYOK monitoramento, log no cloud do cliente, transicao faseada ZDR. Triggers EN: Claude zero data retention, enterprise frontier safeguards, customer-held monitoring store, BYOK audit, phased ZDR transition.
---

# Claude Zero Retention Frontier

## Quando usar

Use quando o cliente diz: "não posso deixar prompt/output retido no provider".

Use para:
- decidir entre ZDR, retenção padrão de 30 dias e Enterprise Frontier Safeguards (EFS)
- desenhar plano faseado: ZDR interino até EFS
- definir custódia: chaves, audit e revisão no cloud do cliente

NÃO use para:
- ACL de RAG, permissão de documento, isolamento de índice → `rag-corporativo-seguro`
- regulação macro, AI Act, política pública → `ai-governance-monitor`
- admin de rotina → `claude-admin-model-governance`

## Conceito EFS em 5 linhas

- **Store no cliente:** logs de monitoramento em S3/Blob/GCS do cliente, sob chaves, políticas e audit próprios.
- **Scan sem leitura do provider:** safeguards automatizados analisam janela rolante; humano do provider não inspeciona conteúdo.
- **Alerta direto:** flag vai ao time cleared do cliente, que revisa e responde.
- **Custo separado:** EFS sem cobrança do controle; storage/leituras ficam no cloud do cliente.
- **Disponibilidade faseada:** nem todo modelo/canal tem EFS de imediato; há exceção ZDR temporária para casos elegíveis.

## Matriz de decisão: ZDR vs retenção padrão

| Cenário | Exigir |
|---|---|
| Dado não pode sair do tenant (segredo, PHI, contrato) | ZDR ou EFS; sem Covered sem exceção |
| Covered Model essencial + dado sensível | EFS; ZDR interino se elegível |
| Protótipo interno sem dado sensível | Retenção padrão 30 dias aceitável |
| Multi-cloud (Bedrock/GCP/Foundry) | Seguir regra do canal; cada canal tem revisor próprio |
| Sem time cleared para revisar alerta | Não adote EFS ainda; fique em modelo não-Covered com ZDR |

Regra: se não há EFS disponível no canal + sem exceção formal, Covered = retenção de 30 dias. Sem atalho.

## Plano de transição faseada

1. **Fase 0 — conter:** isole 1 workspace sandbox com retenção só onde Covered é necessário; resto em ZDR.
2. **Fase 1 — ZDR interino:** solicite exceção temporária se elegível (ex. uso interno); documente validade e condição de revogação por misuse.
3. **Fase 2 — preparar EFS:** provisione bucket, BYOK, audit, defina quem recebe alerta e runbook de resposta.
4. **Fase 3 — migrar:** ative EFS por canal (API, Claude Code, Bedrock/GCP/Foundry); valide que flag chega ao seu time.
5. **Fase 4 — auditar:** revise acessos, teste alerta simulado, expire exceção interina.

## Checklist

- [ ] Elegibilidade EFS confirmada por modelo e canal?
- [ ] Chaves/audit do store sob controle do cliente?
- [ ] Responsáveis cleared definidos e com acesso ao store?
- [ ] Runbook: receber flag → conter → investigar → descartar/escalar?
- [ ] Data-limite da exceção ZDR interina registrada?

## Regras

- Não venda EFS como disponível em todo canal — confirme fase/rollout.
- Não misture: custódia do log (esta skill) ≠ permissão de RAG (`rag-corporativo-seguro`).
- Exceção interina pode ser revogada por misuse; não desenhe arquitetura dependente dela.
- Mudança de retenção vale para novos requests; não é retroativa.

## Related skills

- `rag-corporativo-seguro` — ACL e isolamento de RAG (não duplicado aqui).
- `claude-admin-model-governance` — controles de admin e workspace.
- `ai-governance-monitor` — regulação macro e monitoramento contínuo.
