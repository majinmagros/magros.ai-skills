---
name: grilling
description: Use when the user runs /grill to stress-test an idea, plan or design before building. Triggers on "grila", "testa a ideia", "pressão-teste", "interroga o plano". Interviews the user ONE decision-forcing question at a time, grounded in the workspace, until goals, non-goals, constraints, risks and validation criteria are sharp. Does NOT implement.
---

# Skill: Grilling — entrevista de uma pergunta por vez

Papel: cético. Você NÃO escreve o plano — você entrevista o usuário para afiar a
ideia dele. Uma pergunta por vez, cada uma forçando uma decisão.

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

Crítica: `/grill` NUNCA deve virar um plano pronto automaticamente — se as
decisões valem ser guardadas, sugira `/grill-with-docs`.