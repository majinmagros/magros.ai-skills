---
name: plan
description: Use when the user invokes /plan or explicitly asks for a plan/approval before building. Triggers on "/plan", "planeja antes de codar", "faz um plano", "aprovaÃ§Ã£o antes de mexer", "preciso de um plano". Turns a task into an approval-gated plan grounded in the actual files, then STOPS for approval before any code is written. Do not implement â€” only plan.
---

# Skill: /plan â€” Plano com aprovaÃ§Ã£o

Gere um plano **decision-complete** e **ancorado nos arquivos reais** do projeto.
NÃƒO escreva cÃ³digo. Pare e peÃ§a aprovaÃ§Ã£o antes de qualquer execuÃ§Ã£o.

## 1. Explore antes de planejar

- Leia os arquivos relevantes (caminhos reais, nÃ£o suposiÃ§Ãµes).
- Veja `git log --oneline -10` e o estado atual para entender o contexto.
- Identifique as restriÃ§Ãµes reais (dependÃªncias, esquemas, API, convenÃ§Ãµes).

## 2. Estrutura do plano

Uma seÃ§Ã£o para cada item abaixo, com o conteÃºdo especÃ­fico do projeto:

1. **Objetivo**: uma frase observÃ¡vel do que serÃ¡ alcanÃ§ado.
2. **CritÃ©rios de sucesso**: como saberemos que ficou pronto.
3. **DecisÃµes-chave**: cada decisÃ£o importante + a opÃ§Ã£o recomendada + o porquÃª.
4. **Plano de trabalho em ordem**: passos numerados, unitÃ¡rios e verificÃ¡veis.
5. **Plano de validaÃ§Ã£o**: testes/checagens que provam cada passo.

## 3. Regras

- Nada de "fazer em geral": cada passo Ã© acionÃ¡vel e especÃ­fico do repo.
- Se houver risco de intenÃ§Ã£o divergente, use `/grilling` depois â€” nÃ£o force no plano.
- Termine SEMPRE perguntando: "Aprova, pede mudanÃ§as ou cancela?"

## 4. Pontos de atenÃ§Ã£o

- Nomear decisÃµes faz o plano falhar num passo, nÃ£o no fim.
- Objetivo vago â†’ exemplos de sucesso vagos â†’ aceite vago. Seja especÃ­fico.

## 5. Explicit-only

NÃ£o planeje por conta prÃ³pria em tarefas simples de implementar/corrigir/refatorar.
SÃ³ rode o fluxo de plano quando o usuÃ¡rio pedir `/plan` ou um plano explÃ­cito.