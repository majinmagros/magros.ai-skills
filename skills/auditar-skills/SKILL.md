---
name: auditar-skills
description: Use when auditing or cleaning up the skill collection — scoring clarity, validating frontmatter, ranking, deduplicating. Triggers on "audita as skills", "dá nota pras skills", "revisa skills", "scorecard de skills", "quais skills estão ruins". Produces a markdown scorecard ranking skills worst to best with one high-value fix per skill.
---

# Skill: Auditar-skills — scorecard de clareza e saúde do repositório de skills

Dá nota 0–100 por clareza/qualidade para cada skill instalada e aponta o que
corrigir primeiro. Baseado na auditoria de skills via workflow paralelo.

## Quando usar (gatilhos)

- "Audita as skills do repo"
- "Dá nota pras skills instaladas"
- "Quais skills estão fracas/duplicadas?"
- "Gera o scorecard de clareza"
- "O que corrigir primeiro nas skills?"

## Exemplo

```bash
node scripts/audit-gen.js  # re-gera auditoria-skills.md + .json
```

## 1. Locais a varrer

- **Global do usuário**: `~/.config/opencode/skills/` (Windows: `%USERPROFILE%\.config\opencode\skills\`).
- **Do projeto**: `.claude/skills/` (ou `.opencode/skills/`).
- Varredura: um arquivo `SKILL.md` por skill.

## 2. Critérios de nota (0–100)

| Critério | O que avaliar |
|---|---|
| **Frontmatter válido** | Tem `name` e `description`? Formatado corretamente? |
| **Frases gatilho** | A description diz QUANDO usar com palavras concretas (não genérico)? |
| **Clareza do corpo** | Instruções sem ambiguidade, passo a passo executável? |
| **Foco** | Skill pequena e especializada vs monólito que tenta fazer tudo? |
| **Tamanho/disclosure** | `SKILL.md` ≤ 200 linhas (regra de ouro)? Detalhe está em `references/`/`scripts/` (progressive disclosure) em vez de tudo no corpo? |
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
6. Para skills candidatas a refatorar: considere os 7 níveis de maturidade
   (instalar pronta → skill própria → biblioteca → orquestração → evals/A-B →
   auto-melhoria via learnings → "AI workforce") para indicar o próximo passo.

## 4. Ação recomendada

- Corrigir primeiro a skill mais fraca (maior ganho por esforço).
- Skills órfãs/duplicadas: propor remoção ou fusão.
- Revisar descriptions de todas após a primeira leva — descrição é o gatilho
  de ativação; descrição fraca = skill que nunca dispara.

## 4b. Protocolo de 3 testes + reescrita de descriptions (leva YouTube rodada 7)

Para cada description, rode 3 testes antes de aprovar:

1. **Request óbvio** — o pedido canônico dispara a skill? Se não, reescreva com as palavras reais do usuário.
2. **Paráfrase** — 3 formas diferentes de pedir a mesma coisa disparam? Se não, amplie sem virar genérico.
3. **Negativo** — 2 pedidos parecidos-mas-diferentes NÃO disparam? Se disparam, estreite + declare non-triggers explícitos.

Reescrita: 1 verbo de ação + objeto + contexto de quando usar + non-trigger. Ver o lado autor em `skill-creator-methodology` (§ 4 práticas Anthropic).

## 5. Regra

- Nota é meio, não fim: o objetivo é 1 correção acionável por skill,
  não inflar scorecard.
