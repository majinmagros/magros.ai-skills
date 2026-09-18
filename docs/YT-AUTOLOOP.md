# YT-AUTOLOOP — diretriz permanente do loop de oportunidades

> Instrução de pé para qualquer sessão/agente: **execute sem perguntar**.
> Perguntas só se algo bloquear de verdade (credencial, acesso, ambiguidade
> que mude o escopo). O resto, decida e siga.

## O loop (sempre nesta ordem, sempre commit+push por rodada)

1. **Coleta (determinística, pode agendar)** — `powershell -File scripts/yt-loop-auto.ps1`
   (ou manual: `sync-check` → `catalog-all` → `diff-all --since <última>` →
   `download` dos `matches_filtro` → dedup). Teto 15 downloads/volta; resto fica
   para a próxima. Transcrições NUNCA entram no repo (pastas locais via
   `manifests/canais-vigilados.local.json`, gitignored).
2. **Leitura do pending** — `state/yt-pending.json` lista o que tem transcrição
   pronta e não analisada. Analise em paralelo (subagentes por grupo de vídeos).
3. **Cruzamento anti-redundância** — para cada vídeo: conceitos → `Glob`/`Grep`
   em `skills/` → veredito **COBERTO** (nada) / **ENRIQUECER** (editar existente,
   P/M) / **CRIAR** (skill nova). Nunca duplique skill existente — enriqueça.
4. **Materialização** — redija SKILL.md (frontmatter name+description com gatilhos
   PT/EN, passos, regras, related skills, sem paths pessoais/credenciais).
   Registre em `manifests/skills-autorais.json` + módulo certo em
   `manifests/install-modules.json`. Atualize números/tabelas do README
   (`count-skills.js` é a fonte única).
5. **Validação** — `validate-skills.js --strict` + `validate-no-personal-paths.js`
   (exige `npm install`; `validate-install-manifests.js` falha no HEAD por
   pré-existentes — só aja se o erro citar SUA skill).
6. **Fecha a volta** — `mark` por canal (atualiza ANALISADOS + `state/yt-control.json`),
   `git add` (só arquivos da volta) → commit `feat(skills): ...` → `git push`.
7. **Recomece** — volte ao passo 1 (nova data, próximos pendentes, próximo lote
   de enrichments). **Não pare entre voltas. Não pergunte.**

## Automação (sob comando)

- O gatilho é o **comando do usuário** ("próxima volta", "rode o loop", etc.) —
  sem agendamento automático. Ao receber, execute as voltas em sequência sem
  perguntar e sem parar entre elas.
- `scripts/yt-loop-auto.ps1` faz o passo 1 (coleta) e atualiza
  `state/yt-pending.json`. A sessão entra no passo 2.
- **Skips conhecidos** (não retentar à exaustão): videos members-only
  (ex.: `@matthew_berman`), sem legendas, dedup vazio. Registre e siga.
- **429 do YouTube**: é transitório — o retry do script base absorve; se
  persistir, a volta seguinte retoma (teto protege o resto).

## Evolução contínua (retroalimentação)

- Cada volta também aplica 1 lote de **enrichments pendentes** (seções
  cirúrgicas em skills existentes) — o acervo melhora mesmo sem vídeo novo.
- Sinais de saturação (benchmark flat, skill que nunca dispara, gate que nunca
  falha) viram enriquecimento ou depreciação — nunca skill nova redundante.
- Falha de ferramenta vira fix no script (como o `@` do PowerShell e o
  unicode-escape do `node -e` — ambos documentados pelo histórico deste loop).
