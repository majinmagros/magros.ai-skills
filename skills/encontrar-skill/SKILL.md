---
name: encontrar-skill
description: Use when the user needs to find a Claude Code skill for a problem â€” existing solution, best option among many, or curated lists. Triggers on "encontra uma skill", "procura skill", "qual skill pra", "tem skill pra isso", "melhores skills", "app store de skills". Filters by stars, installs, recency, license; reviews before installing.
---

# Skill: Encontrar-skill â€” acha a skill certa (app store de skills)

Muitas vezes existe soluÃ§Ã£o pronta para o problema, mas a pessoa nÃ£o sabe
procurar (nem sempre os termos de busca sÃ£o bons). Esta skill Ã© a "loja de
armaduras": entende o problema, busca, confere qualidade e instala.

## 1. Processo

1. **Entender o problema**: "preciso de uma skill que faÃ§a A, B, C" ou
   "tenho esse problema e nem sei se precisa de skill".
2. **Buscar opÃ§Ãµes** nos lugares certos:
   - GitHub search (termos: "claude code skill <tema>", "claude skills", "awesome-claude-skills").
   - Marketplaces de skills (Anthropic / claude plugins).
   - Curated lists/repositÃ³rios conhecidos (ex.: "awesome claude code", coleÃ§Ãµes com 100+ skills).
3. **Conferir qualidade**: estrelas, nÂº de instalaÃ§Ãµes, recÃªncia dos commits,
   licenÃ§a, se Ã© oficial/da Anthropic.
4. **Comparar por contexto**: para o SEU caso (ex.: skill de PDF â‰  skill de
   HTML â‰  PPTX â€” cada mÃ­dia exige a certa).
5. **Entregar ranking** dos melhores candidatos + recomendar 1.

## 2. Filtros de qualidade

- **Estrelas/instalaÃ§Ãµes**: muitos usuÃ¡rios e aprovaÃ§Ã£o reduz risco.
- **RecÃªncia**: skill desatualizada quebra com APIs novas.
- **LicenÃ§a**: prefira MIT/aberta; evite desconhecidas.
- **Fonte**: oficial > community consagrada > repo duvidoso.
- âš ï¸ Mais de 1/3 das skills de terceiros tÃªm falhas de seguranÃ§a. Leia TODO o
  `SKILL.md` antes de instalar; desconfie de instruÃ§Ãµes para ler/enviar arquivos.

## 3. ApÃ³s escolher

- Revise a skill: pegue o `SKILL.md`, entenda como funciona (pode pedir ao
  modelo explicar em linguagem simples) e adapte ao seu contexto.
- SÃ³ instale 3â€“5 skills por contexto, nÃ£o tudo que achar.

## 4. Regra

- Skill achada â‰  skill boa pro SEU caso: o diagnÃ³stico (qual encaixa no seu
  contexto) vale mais que a lista.
