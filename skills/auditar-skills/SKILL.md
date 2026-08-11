---
name: auditar-skills
description: Use when auditing or cleaning up the skill collection â€” scoring clarity, validating frontmatter, ranking, deduplicating. Triggers on "audita as skills", "dÃ¡ nota pras skills", "revisa skills", "scorecard de skills", "quais skills estÃ£o ruins". Produces a markdown scorecard ranking skills worst to best with one high-value fix per skill.
---

# Skill: Auditar-skills â€” scorecard de clareza e saÃºde do repositÃ³rio de skills

DÃ¡ nota 0â€“100 por clareza/qualidade para cada skill instalada e aponta o que
corrigir primeiro. Baseado na auditoria de skills via workflow paralelo.

## 1. Locais a varrer

- **Global do usuÃ¡rio**: `~/.config/opencode/skills/` (ou `~\.config\opencode\skills\`).
- **Do projeto**: `.claude/skills/` (ou `.opencode/skills/`).
- Varredura: um arquivo `SKILL.md` por skill.

## 2. CritÃ©rios de nota (0â€“100)

| CritÃ©rio | O que avaliar |
|---|---|
| **Frontmatter vÃ¡lido** | Tem `name` e `description`? Formatado corretamente? |
| **Frases gatilho** | A description diz QUANDO usar com palavras concretas (nÃ£o genÃ©rico)? |
| **Clareza do corpo** | InstruÃ§Ãµes sem ambiguidade, passo a passo executÃ¡vel? |
| **Foco** | Skill pequena e especializada vs monÃ³lito que tenta fazer tudo? |
| **Overlap** | Duplica outra skill existente? (deduplicar/justificar) |
| **CorreÃ§Ã£o de maior valor** | Qual a ÃšNICA mudanÃ§a que mais melhora essa skill? |

## 3. Processo

1. Liste todas as skills (global + projeto), com pasta de origem.
2. Leia cada `SKILL.md` e pontue os critÃ©rios acima.
3. Rankeie da **pior para a melhor**.
4. Marque cada skill como `global` ou `projeto` e aponte padrÃµes repetidos
   no conjunto (ex.: "todas as descriptions faltam gatilho de quando usar").
5. Entregue um **scorecard em Markdown** (`auditoria-skills.md`) com:
   ranking, nota por critÃ©rio, a correÃ§Ã£o de maior valor por skill e os padrÃµes.

## 4. AÃ§Ã£o recomendada

- Corrigir primeiro a skill mais fraca (maior ganho por esforÃ§o).
- Skills Ã³rfÃ£s/duplicadas: propor remoÃ§Ã£o ou fusÃ£o.
- Revisar descriptions de todas apÃ³s a primeira leva â€” descriÃ§Ã£o Ã© o gatilho
  de ativaÃ§Ã£o; descriÃ§Ã£o fraca = skill que nunca dispara.

## 5. Regra

- Nota Ã© meio, nÃ£o fim: o objetivo Ã© 1 correÃ§Ã£o acionÃ¡vel por skill,
  nÃ£o inflar scorecard.
