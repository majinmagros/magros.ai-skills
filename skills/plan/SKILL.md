---
name: plan
description: Use when the user invokes /plan or explicitly asks for a plan/approval before building. Triggers on "/plan", "planeja antes de codar", "faz um plano", "aprovação antes de mexer", "preciso de um plano". Turns a task into an approval-gated plan grounded in the actual files, then STOPS for approval before any code is written. Do not implement — only plan.
---

# Skill: /plan — Plano com aprovação

Gere um plano **decision-complete** e **ancorado nos arquivos reais** do projeto.
NÃO escreva código. Pare e peça aprovação antes de qualquer execução.

## 1. Explore antes de planejar

- Leia os arquivos relevantes (caminhos reais, não suposições).
- Veja `git log --oneline -10` e o estado atual para entender o contexto.
- Identifique as restrições reais (dependências, esquemas, API, convenções).

## 2. Estrutura do plano

Uma seção para cada item abaixo, com o conteúdo específico do projeto:

1. **Objetivo**: uma frase observável do que será alcançado.
2. **Critérios de sucesso**: como saberemos que ficou pronto.
3. **Decisões-chave**: cada decisão importante + a opção recomendada + o porquê.
4. **Plano de trabalho em ordem**: passos numerados, unitários e verificáveis.
5. **Plano de validação**: testes/checagens que provam cada passo.

## 3. Regras

- Nada de "fazer em geral": cada passo é acionável e específico do repo.
- Se houver risco de intenção divergente, use `/grilling` depois — não force no plano.
- Termine SEMPRE perguntando: "Aprova, pede mudanças ou cancela?"

## 4. Pontos de atenção

- Nomear decisões faz o plano falhar num passo, não no fim.
- Objetivo vago → exemplos de sucesso vagos → aceite vago. Seja específico.

## 5. Explicit-only

Não planeje por conta própria em tarefas simples de implementar/corrigir/refatorar.
Só rode o fluxo de plano quando o usuário pedir `/plan` ou um plano explícito.