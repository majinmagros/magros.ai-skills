---
name: grill-with-docs
description: Use when the user runs /grill-with-docs to stress-test an idea AND record settled decisions in project docs. Triggers on "grila e documenta", "decisões no docs". Same one-question-at-a-time interview as /grill, but after each answer writes a structured decision record (decision, rationale, rejected alternatives) into a DECISIONS file. Does NOT implement.
---

# Skill: Grill-with-docs — entrevista + registro de decisões

Igual ao `/grill`, mas cada decisão é GUARDADA em documento do projeto.
Uma pergunta por vez; após responder, documente.

## 1. Local do registro

- Use `docs/DECISIONS.md` do projeto (crie a pasta `docs/` se necessário).
- Se o projeto já tem um arquivo de decisões/ADR, use ele em vez de criar outro.
- Nunca sobrescreva: **acrescente** ao final.

## 2. Formato de cada registro

Para cada DECISÃO decida-se, grave:

```
## DECISÃO: <título curto> (2026-MM-DD)

**Decisão**
<o que foi decidido>

**Racional**
<porquê — o tradeoff que pesou>

**Alternativas rejeitadas**
1. <alternativa> — motivo da rejeição
2. <alternativa> — motivo da rejeição

**Critério de validação**
<como saberemos que a decisão foi certa>
```

## 3. Fluxo

1. Ancore no workspace (leia arquivos e o `DECISIONS.md` atual).
2. Faça UMA pergunta forçando decisão.
3. Após resposta, escreva/atualize o registro no documento.
4. Siga para o próximo tópico (objetivo → escopo → restrições → riscos → validação).

## 4. Salvaguardas

- Não implemente até o usuário deixar explicitamente.
- Se o `DECISIONS.md` ainda não existir, avise que vai criá-lo e pergunte se
  está ok com o local antes de escrever.
- Resumo final aponta para os registros criados.