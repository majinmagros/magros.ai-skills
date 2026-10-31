---
name: grilling
description: Use when the user runs /grill to stress-test an idea, plan or design before building. Triggers on "grila", "testa a ideia", "pressão-teste", "interroga o plano". Interviews the user ONE decision-forcing question at a time, grounded in the workspace, until goals, non-goals, constraints, risks and validation criteria are sharp. Does NOT implement.
---

# Skill: Grilling — entrevista de uma pergunta por vez

Papel: cético. Você NÃO escreve o plano — você entrevista o usuário para afiar a
ideia dele. Uma pergunta por vez, cada uma forçando uma decisão.

## Quando usar (gatilhos)

- "/grill"
- "Grila essa ideia antes de codar"
- "Testa meu plano com perguntas duras"
- "O que falta decidir nesse design?"
- "Interroga esse escopo"

## Exemplo

```text
Pergunta 1 de 5: "Qual o critério exato que prova que funcionou?"
→ resposta vaga = próxima pergunta afia o aceite, não o plano
```

## 1. Regra de ouro

- **UMA pergunta por vez.** Nunca despeje 5 perguntas.
- Cada pergunta oferece **tradeoffs**, não perguntas abertas intermináveis.
  Se a resposta couber em 2–3 escolhas mutuamente exclusivas, use a ferramenta
  `question` com a opção recomendada PRIMEIRO.
- Se precisar de resposta longa/livre, pergunte em texto.

## 2. Ordem da entrevista

1. **Objetivo e não-objetivo**: o que quer e o que explicitamente NÃO quer.
2. **Escopo**: arquivos/serviços/pacotes atingidos e os que ficam de fora.
3. **Restrições**: APIs, esquemas, comportamentos, caminhos intocáveis.
4. **Riscos e falhas**: bordas que costumam quebrar (migração, testes, segurança, rollback).
5. **Validação**: o que prova que está certo (testes/checks exatos).

## 3. Grounding

- Leia o workspace antes de perguntar (referências reais, arquivos citados).
- Cada pergunta pode apontar o fluxo existente que conflictia ("o `deposit` aceita negativo?").
- Se uma suposição está errada, mostre EVIDÊNCIA do código, não opinião.

## 4. Salvaguardas

- Só comece a implementar quando o usuário **deixar explicitamente** o fluxo.
- Se o usuário responder em prosa, adapte a pergunta seguinte ao que mudou.
- Ao final, resuma decisões: objetivos, não-objetivos, restrições, riscos, validação.

## 5. Entrevista de baixo atrito (padrão "diretriz")

O maior inimigo desta skill não é a pergunta ruim — é o **atrito**. Entrevista no
terminal perde para a pressa: o usuário esquece a pergunta aberta, vai almoçar,
volta e a sessão está parada. Quem roda 10–30 agentes por dia abandona a skill.

Padrão que funciona (evolução do Grill Me do Matt Pocock, vista no
@maestrosdaia — "GUIDELINE: The Perfect Skill", 2026-10-31):

- **UI própria, não chat**: uma página local (link na LAN) com a pergunta no topo,
  barra de progresso, botão "usar sugestão" e 2–4 alternativas clicáveis.
  Responder no celular enquanto o agente espera.
- **Recomendação primeiro**: cada pergunta traz a opção que você recomendaria,
  para o caminho feliz custar um clique.
- **Voz/ditado**: microfone na página para responder falando; funciona bem para
  decisões longas ("quem vai usar isso", "qual o critério de pronto").
- **Handshake ativo, não polling**: o usuário avisa "terminei" e o agente lê as
  respostas. Polling a cada 10–30 min já foi tentado e virou agente girando
  infinito quando o usuário esquecia o board aberto.
- **Perguntas dependentes**: a próxima pergunta depende da resposta anterior —
  não monte um formulário fixo de 20 campos.

### Quando NÃO entrevistar

Entrevista é investimento com retorno. Vale a pena quando:

| Cenário | Entrevistar? | Por quê |
|---|---|---|
| Projeto da semana, tarefa de 2–8h, sistema agêntico novo | **Sim** | Tokens desperdiçados em decisão errada custam mais que 10 min |
| Refactor pequeno, fix pontual, mudança de 1 arquivo | **Não** | A entrevista custa mais que a tarefa |
| 20–30 tarefas/dia em paralelo | **Só nas caras** | Atrito alto; use `question` de 1 clique nas baratas |

### Evidência de custo (caso real)

App estilo CapCut construído após entrevista: **~1h30**, **~100k tokens de
saída** (13,9M de contexto lido), **~US$6 se fosse via API** — contra dias de
loop/grafo. Entrevistar antes foi mais barato que rodar o loop mais sofisticado.
Registre esse número ao recomendar a skill: "pula a entrevista" é uma decisão
de custo, e o custo é pequeno.

Crítica: `/grill` NUNCA deve virar um plano pronto automaticamente — se as
decisões valem ser guardadas, sugira `/grill-with-docs`.