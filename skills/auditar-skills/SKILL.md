---
name: auditar-skills
description: Use when auditing or cleaning up the skill collection — scoring clarity, validating frontmatter, ranking, deduplicating. Triggers on "audita as skills", "dá nota pras skills", "revisa skills", "scorecard de skills", "quais skills estão ruins". Produces a markdown scorecard ranking skills worst to best with one high-value fix per skill.
---

# Skill: Auditar-skills — scorecard de clareza e saúde do repositório de skills

Dá nota 0–100 por clareza/qualidade para cada skill instalada e aponta o que
corrigir primeiro. Baseado na auditoria de skills via workflow paralelo.

## 1. Locais a varrer

- **Global do usuário**: `~/.config/opencode/skills/` (ou `~\.config\opencode\skills\`).
- **Do projeto**: `.claude/skills/` (ou `.opencode/skills/`).
- Varredura: um arquivo `SKILL.md` por skill.

## 2. Critérios de nota (0–100)

| Critério | O que avaliar |
|---|---|
| **Frontmatter válido** | Tem `name` e `description`? Formatado corretamente? |
| **Frases gatilho** | A description diz QUANDO usar com palavras concretas (não genérico)? |
| **Clareza do corpo** | Instruções sem ambiguidade, passo a passo executável? |
| **Foco** | Skill pequena e especializada vs monólito que tenta fazer tudo? |
| **Overlap** | Duplica outra skill existente? (deduplicar/justificar) |
| **Correção de maior valor** | Qual a ÚNICA mudança que mais melhora essa skill? |

## 3. Processo

1. Liste todas as skills (global + projeto), com pasta de origem.
2. Leia cada `SKILL.md` e pontue os critérios acima.
3. Rankeie da **pior para a melhor**.
4. Marque cada skill como `global` ou `projeto` e aponte padrões repetidos
   no conjunto (ex.: "todas as descriptions faltam gatilho de quando usar").
5. Entregue um **scorecard em Markdown** (`auditoria-skills.md`) com:
   ranking, nota por critério, a correção de maior valor por skill e os padrões.

## 4. Ação recomendada

- Corrigir primeiro a skill mais fraca (maior ganho por esforço).
- Skills órfãs/duplicadas: propor remoção ou fusão.
- Revisar descriptions de todas após a primeira leva — descrição é o gatilho
  de ativação; descrição fraca = skill que nunca dispara.

## 5. Regra

- Nota é meio, não fim: o objetivo é 1 correção acionável por skill,
  não inflar scorecard.
