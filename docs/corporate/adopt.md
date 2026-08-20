# Guia de Adoção Corporativa — magros.ai-skills como Referência

> Este guia explica como adotar `magros.ai-skills` em times que precisam de **governança, auditabilidade e custo previsível**, mantendo a base open-source.

## Por que referência

- **344 SKILL.md validados** (`node scripts/ci/count-skills.js` fonte única, 295 herdadas + 49 autorais), `validate-skills --strict` + `validate-no-personal-paths` em CI.
- **TrustScore interno** `scripts/ci/validate-trustscore.js` (Security 40 / Quality 60, gate 70, faixas 90/75/60/40/0, penalidades crítico -20/alto -10/médio -3/baixo -1) — sem depender de serviço externo.
- **Processo vivo**: coleta semanal YouTube (`scripts/yt-oportunidades.mjs catalog-all/diff-all --since-last`) já prova atualização; `OPORTUNIDADES-2026-08-20.md` local documenta `collect→enrich→validate` sem gerar redundância (cruzamento prévio com 344).
- **Sem lock-in de registry**: skills são Markdown + `SKILL.md` ≤200 linhas, `description` <1024 com `[o que faz] + [Use quando] + [NÃO use]` — portáveis para qualquer harness (Claude, Codex, Cursor, OpenCode).

## O que usar em corporativo

1. **Scope squad** — comece com `triagem-bug`, `checklist-requisitos`, `doctor`, `score-loop` (processo) em `domain: seu-time` (ex.: mensageria). Não instale 344 de uma vez — 3–5 por contexto.
2. **Governança leve** — `.skill-lock.json` local (versão por skill, hash SHA-256 em `docs/data/skills.json`) + `CODEOWNERS` por `manifests/install-modules.json` + audit log via `git`.
3. **Segurança** — `vibe-security-scanner` (ZAP/GitLeaks/Bandit/Grype) + `safety-guard` (bloqueia `reset/drop` sem `--dry-run`) antes de qualquer `agent` tocar `prod`.

## Passos de adoção (3 dias)

1. **Dia 1 — Inventário**: `node scripts/ci/count-skills.js` → confirme 344; `validate-trustscore.js` sem `--strict` (advisory, 7 falsos-positivos em exemplos `sk_live` são esperados) ; `validate-no-personal-paths`.
2. **Dia 2 — Piloto squad**: instale `triagem-bug` + `doctor` em 1 repo, rode `doctor` em cópia, meça `context-budget` (ex.: 37k para "Hi" → corte 90% com progressive disclosure).
3. **Dia 3 — Promoção**: gere `docs/data/skills-registry.json` (hashes) e publique release com `manifests/install-modules.json` versionado.

## O que não fazer

- Não copiar `C:\projetos\full-cycle` ou `C:\Users\...` paths para docs/skills (bloqueado por `validate-no-personal-paths`).
- Não commitar `*.vtt/*.dedup.txt` (transcrições ficam em `C:\projetos\Oportunidades` local).
- Não usar `*` em `description` — descrição fraca é principal causa de skill nunca disparar (ativação média 20%).

## Próximos marcos

- Automatizar `validate-trustscore --strict` no CI (gate 70) após limpar 7 falsos-positivos de exemplos.
- Publicar `skills-registry.json` com SHA-256 e `CODEOWNERS` automático (roadmap).
