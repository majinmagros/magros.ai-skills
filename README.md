# magros.ai-skills

Biblioteca pessoal de skills de IA para agentes de código (Claude Code, OpenCode, Codex, etc.).

Este repositório é uma **base do bundle ECC** ([Everything Claude Code](https://github.com/affaan-m/ECC), MIT) com um conjunto de **skills autorais** adicionadas por cima.

## Conteúdo

- **288 `SKILL.md`** no total.
- **284** herdadas do upstream ECC (inventário do bundle, idiomas, e documentação de cada uma ficam no upstream).
- **4 autorais** (em português ou originais):

| Skill | O que faz |
|-------|-----------|
| `doctor` | Auditoria e enxugamento de "peso morto" em instruções/contexto de projetos, agentes e skills — remove conteúdo que modelos modernos não precisam mais, com fases read-only → diagnóstico → aprovação → rollback. |
| `engenharia-de-grafos` | Práticas de engenharia de grafos para agentes de IA. |
| `grills` | Stress-test adversarial de planos e implementações (casos extremos, concorrência, carga) antes de finalizar. |
| `score-loop` | Loop gerador-avaliador com nota mínima: gera em alto padrão, avalia contra rubrica, e refaz até atingir o corte. |

## Estrutura

```
skills/          # todas as skills (284 ECC + 4 autorais)
  doctor/        # autoral
  engenharia-de-grafos/  # autoral
  grills/        # autoral
  score-loop/    # autoral
scripts/         # ferramentas, incl. sync do upstream
.github/         # (workflows ECC removidos — não aplicáveis a repo de skills)
```

## Manutenção / atualização das skills

A parte ECC do bundle vem do upstream `affaan-m/ECC` (MIT). Para atualizar as skills herdadas:

```bash
# Adiciona o upstream (uma vez)
git remote add upstream https://github.com/affaan-m/ECC.git

# Sincroniza (fetch + merge) — veja scripts/sync-upstream.sh
./scripts/sync-upstream.sh
```

O script `sync-upstream.sh` faz `fetch` + `merge` do branch principal do upstream para o seu `master`. Conflitos (ex.: se você editou uma skill que também mudou lá em cima) precisam ser resolvidos manualmente — o git vai apontá-los. As suas **4 skills autorais não são tocadas** pelo merge, pois não existem no upstream.

Recomendação: rode o sync após novas releases do ECC, e rode a skill `doctor` periodicamente para remover peso morto acumulado.

## Licença

- Conteúdo herdado do ECC: **MIT** (ver `LICENSE` — mantido do upstream `affaan-m/ECC`).
- Skills autorais (`doctor`, `engenharia-de-grafos`, `grills`, `score-loop`): MIT, salvo indicação em contrário.
