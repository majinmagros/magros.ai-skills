---
name: superpowers
description: Use when executing multi-step work in this project. Triggers on "tdd", "testes", "superpowers", "pequenas tarefas", "aprovaÃ§Ã£o", "break the task down", "verify first". Encodes the Superpowers workflow: break work into small verifiable tasks, write verification/tests first, get user approval before proceeding to each step.
---

# Skill: Superpowers (TDD + pequenas tarefas + aprovaÃ§Ã£o)

Aplicar a TODA tarefa de mais de 1 passo neste projeto (mÃºsica ou cÃ³digo).

## 1. Quebre em tarefas pequenas

- Antes de agir, liste as tarefas com `todowrite`: cada item deve ser **pequeno,
  verificÃ¡vel e ter saÃ­da concreta** (arquivo criado, comando que roda, nota >= X).
- Nada de "etapas" gigantes. Se um passo nÃ£o der para verificar em minutos,
  quebre de novo.

## 2. VerificaÃ§Ã£o primeiro (TDD leve)

- Para cÃ³digo: escrever o **verificador/expectativa ANTES** da implementaÃ§Ã£o
  (ex.: `verify_loop.ps1` define os critÃ©rios antes de `gen_dnb.py` gerar).
- Para Ã¡udio: o **Verificador** (`scripts\verify_loop.ps1`) define a nota mÃ­nima
  antes do Criador rodar â€” jÃ¡ Ã© o fluxo do harness.
- Sempre rode o verificador apÃ³s implementar. SÃ³ avance se ele passar
  (ou registre o desvio explicitamente).

## 3. AprovaÃ§Ã£o do usuÃ¡rio

- Entre cada bloco de trabalho com impacto (novo script, mudanÃ§a de estrutura,
  mover/apagar arquivos, mudar prompts), **pare e peÃ§a aprovaÃ§Ã£o**.
- NÃ£o execute o prÃ³ximo passo sem OK do usuÃ¡rio.
- Resumo curto do que foi feito + o que vem a seguir, sempre.

## 4. CÃ­rculo TDD clÃ¡ssico (para cÃ³digo novo)

RED (teste falha) â†’ GREEN (implementaÃ§Ã£o mÃ­nima passa) â†’ REFACTOR (limpa, repetindo teste).
