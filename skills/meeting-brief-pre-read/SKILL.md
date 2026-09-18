---
name: meeting-brief-pre-read
description: Build a 60-second scannable before/during/after meeting brief. Use when preparing a pre-read, running the meeting, sending follow-up, uncertain attendee identity. TRIGGER when: meeting brief, pre-read 60s, who why action, choose not to show, meeting UX rubric. Gatilhos PT: brief de reunião, pré-leitura de 60 segundos, quem porquê ação, escolher não mostrar, rubrica de reunião.
---

# Meeting Brief Pre-Read

## Quando usar

- Antes, durante ou depois de reunião com agente/assistente.
- Precisa de resumo escaneável em 60 segundos.
- Identidade de participante incerta ou contexto sensível.
- NÃO é pós-reunião extrativo — isso é `meeting-task-listener`. Este é o BRIEF.

## Passos

1. **Monte o template who → why → action.** Cabeçalho fixo: `quem (papel, não só nome) | porquê (objetivo em 1 linha) | ação esperada`. Todo resto é anexo.
2. **Escreva para 60 segundos.** 5–8 bullets, 1 tela, sem scroll. Decisão e dono primeiro, contexto depois. Se precisa de 5 min para entender, reescreva.
3. **Separe before/during/after.** Before: objetivo + pré-leitura + pergunta a decidir. During: pauta + tempo por item + dono. After: decisões + donos + prazos.
4. **Aplique choose-not-to-show.** Identidade incerta, dado sensível ou destinatário errado? Não mostre — omita, anonimize ou peça confirmação. Mostrar na dúvida é falha.
5. **Passe a rubrica UX.** Clareza (ação óbvia?) → escaneabilidade (60s?) → prudência (nada exposto indevidamente?) → completude (dono + prazo em cada ação?). Nota baixa volta para revisão.
6. **Entregue no canal certo.** Pre-read antes, guia de 1 tela durante, follow-up com ações depois. Nunca um documento gigante para os três momentos.

## Regras

- Sem dono + prazo, não é ação — é desejo. Reescreva.
- 60 segundos ou reescreva. Sem exceção para pre-read.
- Identidade incerta = não mostrar. Sem gambiarra.
- Não duplique `meeting-task-listener`. Aqui é brief; extração de tasks pós-reunião vive lá.
- Rubrica UX reprovada bloqueia envio.

## Related skills

- `meeting-task-listener` — extração pós-reunião, não brief.
- `outcome-rubric-verification` — verificação com rubrica independente.
