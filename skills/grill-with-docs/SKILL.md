---
name: grill-with-docs
description: Use when the user runs /grill-with-docs to stress-test an idea AND record settled decisions in project docs. Triggers on "grila e documenta", "decisÃµes no docs". Same one-question-at-a-time interview as /grill, but after each answer writes a structured decision record (decision, rationale, rejected alternatives) into a DECISIONS file. Does NOT implement.
---

# Skill: Grill-with-docs â€” entrevista + registro de decisÃµes

Igual ao `/grill`, mas cada decisÃ£o Ã© GUARDADA em documento do projeto.
Uma pergunta por vez; apÃ³s responder, documente.

## 1. Local do registro

- Use `docs/DECISIONS.md` do projeto (crie a pasta `docs/` se necessÃ¡rio).
- Se o projeto jÃ¡ tem um arquivo de decisÃµes/ADR, use ele em vez de criar outro.
- Nunca sobrescreva: **acrescente** ao final.

## 2. Formato de cada registro

Para cada DECISÃƒO decida-se, grave:

```
## DECISÃƒO: <tÃ­tulo curto> (2026-MM-DD)

**DecisÃ£o**
<o que foi decidido>

**Racional**
<porquÃª â€” o tradeoff que pesou>

**Alternativas rejeitadas**
1. <alternativa> â€” motivo da rejeiÃ§Ã£o
2. <alternativa> â€” motivo da rejeiÃ§Ã£o

**CritÃ©rio de validaÃ§Ã£o**
<como saberemos que a decisÃ£o foi certa>
```

## 3. Fluxo

1. Ancore no workspace (leia arquivos e o `DECISIONS.md` atual).
2. FaÃ§a UMA pergunta forÃ§ando decisÃ£o.
3. ApÃ³s resposta, escreva/atualize o registro no documento.
4. Siga para o prÃ³ximo tÃ³pico (objetivo â†’ escopo â†’ restriÃ§Ãµes â†’ riscos â†’ validaÃ§Ã£o).

## 4. Salvaguardas

- NÃ£o implemente atÃ© o usuÃ¡rio deixar explicitamente.
- Se o `DECISIONS.md` ainda nÃ£o existir, avise que vai criÃ¡-lo e pergunte se
  estÃ¡ ok com o local antes de escrever.
- Resumo final aponta para os registros criados.