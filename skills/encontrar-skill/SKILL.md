---
name: encontrar-skill
description: Use when the user needs to find a Claude Code skill for a problem — existing solution, best option among many, or curated lists. Triggers on "encontra uma skill", "procura skill", "qual skill pra", "tem skill pra isso", "melhores skills", "app store de skills". Filters by stars, installs, recency, license; reviews before installing.
---

# Skill: Encontrar-skill — acha a skill certa (app store de skills)

Muitas vezes existe solução pronta para o problema, mas a pessoa não sabe
procurar (nem sempre os termos de busca são bons). Esta skill é a "loja de
armaduras": entende o problema, busca, confere qualidade e instala.

## 1. Processo

1. **Entender o problema**: "preciso de uma skill que faça A, B, C" ou
   "tenho esse problema e nem sei se precisa de skill".
2. **Buscar opções** nos lugares certos:
   - GitHub search (termos: "claude code skill <tema>", "claude skills", "awesome-claude-skills").
   - Marketplaces de skills (Anthropic / claude plugins).
   - Curated lists/repositórios conhecidos (ex.: "awesome claude code", coleções com 100+ skills).
3. **Conferir qualidade**: estrelas, nº de instalações, recência dos commits,
   licença, se é oficial/da Anthropic.
4. **Comparar por contexto**: para o SEU caso (ex.: skill de PDF ≠ skill de
   HTML ≠ PPTX — cada mídia exige a certa).
5. **Entregar ranking** dos melhores candidatos + recomendar 1.

## 2. Filtros de qualidade

- **Estrelas/instalações**: muitos usuários e aprovação reduz risco.
- **Recência**: skill desatualizada quebra com APIs novas.
- **Licença**: prefira MIT/aberta; evite desconhecidas.
- **Fonte**: oficial > community consagrada > repo duvidoso.
- WARNING: mais de 1/3 das skills de terceiros têm falhas de segurança. Leia TODO o
  `SKILL.md` antes de instalar; desconfie de instruções para ler/enviar arquivos.

## 3. Após escolher

- Revise a skill: pegue o `SKILL.md`, entenda como funciona (pode pedir ao
  modelo explicar em linguagem simples) e adapte ao seu contexto.
- Só instale 3–5 skills por contexto, não tudo que achar.

## 4. Regra

- Skill achada ≠ skill boa pro SEU caso: o diagnóstico (qual encaixa no seu
  contexto) vale mais que a lista.
