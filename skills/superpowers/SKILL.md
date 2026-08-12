---
name: superpowers
description: Use when executing multi-step work in this project. Triggers on "tdd", "testes", "superpowers", "pequenas tarefas", "aprovação", "break the task down", "verify first". Encodes the Superpowers workflow: break work into small verifiable tasks, write verification/tests first, get user approval before proceeding to each step.
---

# Skill: Superpowers (TDD + pequenas tarefas + aprovação)

Aplicar a TODA tarefa de mais de 1 passo neste projeto (música ou código).

## 1. Quebre em tarefas pequenas

- Antes de agir, liste as tarefas com `todowrite`: cada item deve ser **pequeno,
  verificável e ter saída concreta** (arquivo criado, comando que roda, nota >= X).
- Nada de "etapas" gigantes. Se um passo não der para verificar em minutos,
  quebre de novo.

## 2. Verificação primeiro (TDD leve)

- Para código: escrever o **verificador/expectativa ANTES** da implementação
  (ex.: `verify_loop.ps1` define os critérios antes de `gen_dnb.py` gerar).
- Para áudio: o **Verificador** (`scripts\verify_loop.ps1`) define a nota mínima
  antes do Criador rodar — já é o fluxo do harness.
- Sempre rode o verificador após implementar. Só avance se ele passar
  (ou registre o desvio explicitamente).

## 3. Aprovação do usuário

- Entre cada bloco de trabalho com impacto (novo script, mudança de estrutura,
  mover/apagar arquivos, mudar prompts), **pare e peça aprovação**.
- Não execute o próximo passo sem OK do usuário.
- Resumo curto do que foi feito + o que vem a seguir, sempre.

## 4. Círculo TDD clássico (para código novo)

RED (teste falha) → GREEN (implementação mínima passa) → REFACTOR (limpa, repetindo teste).
