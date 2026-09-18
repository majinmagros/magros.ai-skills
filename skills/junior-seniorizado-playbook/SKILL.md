---
name: junior-seniorizado-playbook
description: Vira junior contratável com IA sem virar refém dela. Gatilhos PT: vaga junior, primeiro emprego dev, portfolio junior, projeto real para entrevista, julgar output da IA, sabe dizer se a IA fez certo. Triggers EN: junior hiring readiness, junior portfolio project, interview checklist, AI-assisted junior, verify AI output.
---

# Junior Seniorizado Playbook

## Quando usar

Use quando o objetivo é **ser contratado como junior que usa IA bem**, não estudar tudo de IA.

Use para:
- montar 1 projeto real contratável
- treinar resposta de entrevista que prova autoria
- julgar se output da IA está certo ou quebrado

NÃO use para:
- trilha de estudos longa, roadmap de engenheiro de IA, curriculo/ATS → delegar para `roteiro-engenheiro-ia-2026` e `curriculo-ats-optimizer`
- exercicios toy sem dono real (todo-list, clone Netflix)

Escopo travado: saída = **checklist de entrevista + 1 projeto real no ar**. Se não gera isso, está fora de escopo.

## Os 5 movimentos

1. **IA como par, nunca piloto:** você decide escopo, IA executa trecho. Nunca cole output sem ler.
2. **1 dono real > 10 tutoriais:** loja, clinica ou restaurante de verdade, com problema, prazo e usuario.
3. **Julgar antes de entregar:** todo output de IA passa pela rubrica abaixo.
4. **Documentar decisao:** cada PR/commit explica por que, não só o que.
5. **Narrativa de entrevista:** conte problema → tentativa → erro da IA → como você corrigiu.

> Experimento Anthropic: delegar tudo para IA = −17% de compreensão. Gerar com IA + perguntar "por que" = retenção >65%. Regra desta skill: nenhum uso de IA sem etapa "por que".

## Rubrica de verificação — "sabe dizer se a IA fez tá certo?"

Para cada output da IA, responda em voz alta:

- [ ] **Roda?** teste manual ou automatizado passa sem ajuste magico?
- [ ] **Entendo linha a linha?** consegue explicar 3 trechos criticos sem olhar?
- [ ] **Edge cases?** lista 2 entradas que quebrariam e como trata.
- [ ] **Seguranca/dado?** sem chave exposta, sem SQL concatenado, sem permissao ampla.
- [ ] **Se a IA sumisse, refaco?** consegue reescrever a logica do zero em pseudocodigo?

Se falhar em 1 item: não commita. Peça a IA para explicar, não para reescrever.

## Roteiro "projeto dono-real"

1. **Ache o dono:** loja / clinica / restaurante de conhecido. 1 dor: agendamento, cardapio, estoque, fila, orcamento.
2. **Contrato de 1 pagina:** problema, usuario, MVP em 2 semanas, o que NÃO entra.
3. **Stack contratável:** 1 frontend + 1 backend + 1 banco + deploy. Nada exotico.
4. **Build auditável:** IA gera, você revisa pela rubrica, commit pequeno, README com decisoes e prints.
5. **Prova viva:** link no ar + video 2min + 1 metrica do dono ("economiza 3h/semana").
6. **Pasta entrevista:** demo, codigo, maior bug causado pela IA e como você detectou.

## Filtro de empresas-alvo

Priorize empresas onde junior com IA tem chance:

- [ ] contratam junior/pleno com frequencia (vagas abertas, programa de estagio/trainee ativo)
- [ ] usam IA no workflow (mencionam Copilot/ChatGPT/Claude nas vagas ou blog)
- [ ] time pequeno que precisa de generalista que entrega ponta a ponta
- [ ] produto com operação real (varejo, saude, logistica) onde projeto dono-real conversa

Despriorize: empresas que exigem 3 anos para vaga junior, ou que proíbem IA sem alternativa.

## Checklist hiring-readiness (definição de pronto)

- [ ] 1 projeto dono-real no ar com README + demo
- [ ] explica sem ler: arquitetura, 2 decisoes tecnicas, 1 erro da IA corrigido
- [ ] live coding: resolve bug simples explicando raciocinio, mesmo com IA ligada
- [ ] respostas prontas: "como usa IA?", "quando NÃO confia na IA?", "como testa?"
- [ ] curriculo linka projeto, não lista cursos

## Regras

- Maximo 1 projeto por vez. Profundidade > quantidade.
- Proibido output sem rubrica. Proibido "a IA fez, não sei como funciona".
- Todo dia: 1 bloco gerar + 1 bloco perguntar-porque.
- Se virar plano de estudos, pare e volte para `roteiro-engenheiro-ia-2026`.

## Related skills

- `roteiro-engenheiro-ia-2026` — trilha de estudos (esta skill NÃO cobre isso).
- `curriculo-ats-optimizer` — curriculo e LinkedIn apos projeto pronto.
