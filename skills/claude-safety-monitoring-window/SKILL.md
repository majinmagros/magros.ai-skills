---
name: claude-safety-monitoring-window
description: Política e checklist da janela rolante de monitoramento Claude. Gatilhos PT: retencao de dados Claude, janela de monitoramento 30 dias, misuse multi-sessao, multi-conta, revisao de seguranca. Triggers EN: Claude data retention policy, rolling monitoring window, multi-session misuse detection, covered models review.
---

# Claude Safety Monitoring Window

> Skill de política/checklist. Sem código. Sem implementação de guarda.

## Quando usar

Use quando precisa responder: "o que o provider guarda, por quanto tempo, e como detecta abuso que uma sessão isolada não mostra?"

Use para:
- explicar janela rolante de monitoramento de Covered Models
- avaliar risco de retenção padrão vs necessidade do negócio
- montar checklist de transparência para cliente/auditoria

NÃO use para:
- controles de insider, exfiltração ou ferramenta outbound → `agent-misbehavior-controls`
- governança de modelos/admin console → `claude-admin-model-governance`
- implementar scanner, log pipeline ou red-team técnico

## Conceito central

- **Janela rolante:** prompts + outputs de Covered Models retidos por ~30 dias para safety, depois deletados, salvo flag de investigação ou obrigação legal.
- **Por que reter:** conectar padrões entre requests, sessões e contas — jailbreak repetido, credencial roubada, espionagem, extorsão de dados.
- **Acesso controlado:** sem leitura por padrão; revisão humana só após flag automático, por grupo pequeno aprovado, com trilha imutável.
- **Não é treino:** retido não vira treino de modelo sem permissão expressa.

## Checklist de política

- [ ] Quais modelos são Covered e exigem retenção?
- [ ] Onde retido: Anthropic, Bedrock, GCP, Foundry? Quem é o revisor em cada canal?
- [ ] Quais workspaces têm retenção ligada? Quais mantêm ZDR?
- [ ] Processo para flag → quem é avisado, em quanto tempo, com que evidência?
- [ ] Tratamento de exceção: investigação ativa, hold legal, deleção antecipada.
- [ ] Registro de acessos a retidos disponível para auditoria?

## Passos de avaliação

1. **Mapear superfície:** liste workspaces/contas que tocam Covered Models.
2. **Classificar dado:** o que passa pela janela (PII, segredo, PHI)? Se inaceitável, não use Covered sem EFS/ZDR.
3. **Confirmar canal:** cada integração (API direta, Bedrock, GCP, Foundry, Claude Code) tem regra própria de retenção.
4. **Documentar aceite:** quem aprovou retenção, por que, e plano de saída para Zero Retention.
5. **Revisar trimestral:** lista de Covered mudou? Exceção temporária ainda vale?

## Regras

- Nunca prometa "nada é guardado" ao usar Covered Model sem exceção formal.
- Nunca confunda monitoramento do provider com DLP interno — são camadas distintas.
- Multi-sessão/multi-conta só o provider enxerga; seu controle interno não substitui.
- Sem código aqui: se pedir implementação, redirecione para skill de engenharia.

## Related skills

- `agent-misbehavior-controls` — insider, tool misuse e exfiltração (não duplicado aqui).
- `claude-admin-model-governance` — governança e controles de admin console.
