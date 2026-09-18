---
name: linkedin-inbox-triage
description: Triagem rápida de inbox LinkedIn em buckets com draft-first. Use quando o usuário pedir organizar mensagens do linkedin, responder networking, filtrar suporte/produto, resumo da caixa de entrada. Triggers PT: triar linkedin, inbox linkedin, responder networking, resumo de mensagens. Triggers EN: linkedin inbox triage, linkedin messages, networking replies.
---

# LinkedIn Inbox Triage

Escopo estreito: classificar, redigir minuta, responder com 1 comando. Sem automação de envio, sem CRM.

## Quando usar

- "Resume minhas mensagens do LinkedIn".
- "Filtra o que é suporte / produto / networking".
- "Me ajuda a responder rápido".
- Rotina diária/semanal de limpeza de inbox.

Não usar para: outreach em massa, sequência de vendas, scraping de leads, gestão de equipe. Isso é `grokbot-team-ops` — não colidir.

## Passos

### 1. Coletar lote
1. Trabalhe por lote (ex: últimas 20 não lidas ou últimos 7 dias). Nunca "tudo desde sempre".
2. Para cada mensagem capture: quem, data, thread resumida em 1 linha, tem pedido explícito?
3. Segredo nunca vai para o bot: se a thread contiver dado sensível (contrato, salário, CPF, estratégia interna), marque `sensível — fora do bot` e pule a redação automática.

### 2. Classificar em 4 buckets
- `suporte` — cliente com problema, bug, cobrança, prazo.
- `produto` — feedback, feature request, bug report útil.
- `networking` — parceria, convite, pedido de call, recrutador, aluno.
- `ruído` — pitch frio, spam, mensagem sem pedido. Sugira arquivar/ignorar.

Saída: tabela `quem | bucket | urgência (alta/baixa) | ação sugerida`.

### 3. Draft-first (nunca envie direto)
1. Redija minuta curta por mensagem acionável: máx 4 linhas, tom do usuário, 1 pergunta ou 1 próximo passo.
2. Suporte: reconheça + peça 1 dado faltante ou dê prazo. Não prometa fix.
3. Produto: agradeça + registre (1 linha para backlog) + sem prometer roadmap.
4. Networking: aceite/recuse em 2 frases + proposta concreta (call de 15min com data ou recusa educada).
5. Marque cada draft: `pronto / precisa-de-dado / sensível`.

### 4. Resposta com 1 comando
1. Entregue os drafts numerados + 1 comando por mensagem: `enviar / editar / arquivar / ignorar`.
2. O usuário aprova com 1 palavra por item. Só então ele cola/envia.
3. Nenhum envio automático. Nenhuma conexão/follow automático.
4. Feche o lote com: pendentes, arquivados, tempo gasto.

## Regras

- Draft-first sempre. Proibido enviar, conectar ou fazer follow sem aprovação explícita.
- Segredo nunca vai para o bot: dado sensível não é colado, resumido nem redigido. Só sinalizado.
- Escopo estreito: inbox individual. Sem sequência, sem campanha, sem CRM, sem métrica de time.
- Não colidir com `grokbot-team-ops`: aquele é operação de equipe/gestão. Este é triagem pessoal de inbox.
- Lote pequeno e frequente > mutirão mensal. Teto sugerido: 20 mensagens ou 30 min por sessão.
- Recusa educada é resposta válida. Networking não exige aceitar tudo.
- Idioma da resposta = idioma da mensagem recebida, salvo pedido contrário.

## Related skills

- `email-ops` — mesma lógica draft-first aplicada a e-mail.
- `meeting-brief-pre-read` — quando networking virar call, prepare o brief.

Fonte: vídeo T3bAOZeMaiQ (Karine Lago, 5 bots pessoais).
