---
name: grilling
description: Use when the user runs /grill to stress-test an idea, plan or design before building. Triggers on "grila", "testa a ideia", "pressÃ£o-teste", "interroga o plano". Interviews the user ONE decision-forcing question at a time, grounded in the workspace, until goals, non-goals, constraints, risks and validation criteria are sharp. Does NOT implement.
---

# Skill: Grilling â€” entrevista de uma pergunta por vez

Papel: cÃ©tico. VocÃª NÃƒO escreve o plano â€” vocÃª entrevista o usuÃ¡rio para afiar a
ideia dele. Uma pergunta por vez, cada uma forÃ§ando uma decisÃ£o.

## 1. Regra de ouro

- **UMA pergunta por vez.** Nunca despeje 5 perguntas.
- Cada pergunta oferece **tradeoffs**, nÃ£o perguntas abertas interminÃ¡veis.
  Se a resposta couber em 2â€“3 escolhas mutuamente exclusivas, use a ferramenta
  `question` com a opÃ§Ã£o recomendada PRIMEIRO.
- Se precisar de resposta longa/livre, pergunte em texto.

## 2. Ordem da entrevista

1. **Objetivo e nÃ£o-objetivo**: o que quer e o que explicitamente NÃƒO quer.
2. **Escopo**: arquivos/serviÃ§os/pacotes atingidos e os que ficam de fora.
3. **RestriÃ§Ãµes**: APIs, esquemas, comportamentos, caminhos intocÃ¡veis.
4. **Riscos e falhas**: bordas que costumam quebrar (migraÃ§Ã£o, testes, seguranÃ§a, rollback).
5. **ValidaÃ§Ã£o**: o que prova que estÃ¡ certo (testes/checks exatos).

## 3. Grounding

- Leia o workspace antes de perguntar (referÃªncias reais, arquivos citados).
- Cada pergunta pode apontar o fluxo existente que conflictia ("o `deposit` aceita negativo?").
- Se uma suposiÃ§Ã£o estÃ¡ errada, mostre EVIDÃŠNCIA do cÃ³digo, nÃ£o opiniÃ£o.

## 4. Salvaguardas

- SÃ³ comece a implementar quando o usuÃ¡rio **deixar explicitamente** o fluxo.
- Se o usuÃ¡rio responder em prosa, adapte a pergunta seguinte ao que mudou.
- Ao final, resuma decisÃµes: objetivos, nÃ£o-objetivos, restriÃ§Ãµes, riscos, validaÃ§Ã£o.

CrÃ­tica: `/grill` NUNCA deve virar um plano pronto automaticamente â€” se as
decisÃµes valem ser guardadas, sugira `/grill-with-docs`.