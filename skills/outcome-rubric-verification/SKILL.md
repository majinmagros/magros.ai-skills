---
name: outcome-rubric-verification
description: Use when implementing rubric-driven agent iteration with independent verifier — clean context, hill-climbing, choose-not-to-show. Triggers on "outcome rubric", "rubric verification", "independent verifier", "hill climbing rubric", "choose not to show".
metadata:
  origin: ECC
  source_docs:
    - https://docs.anthropic.com/en/docs/managed-agents/outcomes
    - https://github.com/anthropics/managed-agents-sdk
  video_source: "hm8NzEd5io0 - How founders build on Claude Managed Agents (Claude Oficial)"
  related_skills:
    - loop-design-check
    - grill-with-docs
    - santa-method
    - verification-loop
    - gan-style-harness
---

# Skill: outcome-rubric-verification — Verificação por Rubrica com Verifier Independente

Padrão do **Managed Agents Outcomes API**: iteração dirigida por rubrica com **verifier independente em context window limpo**, hill-climbing até satisfazer a rubrica, e **choose-not-to-show** se falhar. Implementação completa em `references/implementation.md`.

## Quando usar

- Você precisa de **verificação rigorosa** de output de agent antes de mostrar ao usuário
- Quer separar **geração** de **validação** (clean context window)
- Precisa de **hill-climbing automático** contra critérios definidos
- Quer implementar **choose-not-to-show** em vez de mostrar resultado ruim
- Está construindo **briefs, relatórios, código, análises** que precisam ser corretos

## Quando NÃO usar

- Verificação determinística (lint, typecheck, testes) → use pipelines de build/test
- Validação simples de schema → use Zod/JSON Schema direto
- Agent já tem eval harness próprio → use `eval-harness`, `verification-loop`
- Precisa de adversarial review multi-agent → use `santa-method`, `gan-style-harness`

---

## Conceito Central: Dois Níveis de Feedback

| Nível | Quem | Função |
|---|---|---|
| **Execution (baixo)** | Machine/Agent | Mede "quão longe do goal literal" e grinda até zero |
| **Judgment (alto)** | **Human** (ou verifier independente) | Decide "este goal está certo? deve mudar? deve parar?" |

> **Regra de Ouro:** o verifier **nunca** compartilha contexto com o generator. Context window limpo = julgamento independente.

---

## Arquitetura do Padrão

```
GENERATOR → candidate → INDEPENDENT VERIFIER (clean context) → scores + feedback
     ↑                                                                    │
     └────────────── hill-climb até threshold ────────────────────────────┘
                          max_iterations → choose_not_to_show
```

O verifier recebe **só** candidate + rubric + ground truth (se houver). Nunca traces, prompts ou reasoning do generator. Cada critério é avaliado 0–1 com feedback específico; score final = soma ponderada. Ver `references/implementation.md` (`OutcomeRubricVerifier` + `HillClimbLoop` + exemplo de briefs).

---

## Rubric Design Principles (Do vídeo)

| Princípio | Aplicação |
|---|---|
| **Objectively verifiable** | "Did you pull correct LinkedIn?" — verificável programaticamente |
| **UX-focused** | "Scannable, readable, right order" — afeta experiência do usuário |
| **Choose-not-to-show** | Melhor não mostrar do que mostrar errado |
| **Rubric sync** | Offline evals usam as mesmas rubricas que outcomes |
| **Independent context** | Verifier nunca vê traces do generator |

---

## Integração com Skills Existentes

| Skill | Como Complementa |
|---|---|
| `loop-design-check` | Use como **feedback gate** (judgment layer) no loop design |
| `grill-with-docs` | Rubrica pode derivar de decisões documentadas no grill |
| `santa-method` | Outcome verifier = um dos reviewers; santa = dual independent |
| `verification-loop` | Outcome = verificação de *runtime*; verification-loop = *design-time* |
| `gan-style-harness` | Generator-Evaluator loop; outcome verifier = evaluator especializado |

---

## Anti-Patterns

| ❌ Errado | ✅ Correto |
|---|---|
| Verifier vê traces do generator | Verifier tem **clean context** |
| Generator faz auto-avaliação | **Verifier independente** obrigatório |
| Uma rubrica genérica para tudo | Rubricas **específicas por output type** |
| Pass/fail binário sem feedback | **Feedback específico por critério** para hill-climb |
| Mostrar resultado com score baixo | **Choose not to show** |

---

## Referências

- [Managed Agents Outcomes](https://docs.anthropic.com/en/docs/managed-agents/outcomes)
- `references/implementation.md` — `OutcomeRubricVerifier`, `HillClimbLoop`, exemplo de briefs
- Video: `hm8NzEd5io0.en.dedup.txt` — linhas 96-138, 182-231, 242-251
