# Auditoria de Skills — Scorecard de Clareza e Saude (v2)

> Gerado em 2026-09-05 | Projeto: magros.ai-skills | Total: 416 pastas em skills/ | v1 era 2026-09-02 com 409 pastas | **Correções aplicadas em 2026-09-05: dashboard + 4 Quando Ativar + 13 descriptions exclusivas + fatiamento de 2 monolitos (ver Correções aplicadas)**

## Resumo Executivo

- **Media geral:** 88.2/100 (boa — v1 83.9 → 87.8 rodada 1 → 88.2 lote 2)
- **Pastas sem SKILL.md:** 0 (ok)
- **Description sem gatilho quando usar:** 0 / 416 (0%). **Descoberta resolvida.**
- **Description com literal block `|:** 0 (ok)
- **Name != pasta:** 0 (ok)
- **SKILL.md >200 linhas:** 160 (38.5%) — era 168. -8 fatiamentos.
- **SKILL.md >500 linhas:** 39 (9.4%) — era 47. -8.
- **Com progressive disclosure (mencao references/scripts no corpo):** 81 / 416 (19.5%). Pastas fisicas `references/`+`scripts/`: 41 / 416 (9.9%, +8 neste turno).
- **Distribuicao por faixa:** 40-59:0 | 60-79:108 | 80-99:165 | 100:143 (soma 416)
- **Evolucao vs v1:** faixa fraca 40-59 colapsou 29→0; nota 100 subiu 101→143 (+42); >500 caiu 47→39.
- **Conclusao:** fatiamento em ritmo (8 monolitos → 100 pts). Restam 39 mega-monolitos; clusters template com exclusividade. Proximo: lote 3 (kotlin-testing, python-testing, golang-testing?) e gigantes manuais.

## Evolucao desde v1 (o que mudou)

| Item | v1 (02/09, 409) | v2 (05/09, 416) | Delta |
|---|---|---|---|
| Media | 83.9 | 88.2 | +4.3 (+0.4 lote 2) |
| Sem gatilho | 46 | 0 | -46 (dashboard corrigida) |
| Name mismatch | 6 | 0 | -6 |
| Nota 100 | 101 | 143 | +42 (+6 lote 2) |
| Faixa 40-59 | 29 | 0 | -29 |
| >200 linhas | 168 | 160 | -8 fatiamentos |
| >500 linhas | 47 | 39 | -8 |
| Piores exemplos | `universal-portability` 39, 8 skills com 45 | pior agora e 51 (`skill-execution-dashboard`) | cauda critica eliminada |
| Ex-fracas que subiram | — | `universal-portability` 39→79, `claude-md-auditor` 45→70, `graph-engineering-patterns` 45→70, `threejs-voxel-block-system` 45→70, `frontend-a11y` 53→73, `prompt-optimizer` 53→73 | gatilho adicionado, mas tamanho trava em ~70 |

> Leitura: os commits `3194eb7` (183 descriptions), `90699e7` (+6), `0e10b9f` (literal blocks, pastas vazias, name mismatch) e batch 2-4 de skills novas explicam quase todo o ganho. As 5 skills novas em PT (`clareza`, `coordenacao`, `conversa`, `criatividade`, `curriculo-ats-optimizer`) ja nasceram no padrao bom `Use quando ... Triggers em ...` — manter esse template.

## Padroes Repetidos (encontrados no conjunto)

| Padrao | Evidencia | Impacto | Acao sistemica |
|---|---|---|---|
| Monolitos >200 linhas | 168 skills (40.4%) | Custo tokens alto, sem disclosure | Fatiar e mover para references/ |
| Mega-monolitos >500 linhas | 47 skills (11.3%) | Impossivel manter | Quebrar em 2-4 skills focadas |
| Sem progressive disclosure fisico | 383 sem pasta references/scripts | Tudo no SKILL.md | Criar references/ (so 33 tem) |
| Unica skill sem frontmatter/gatilho | `skill-execution-dashboard` (51 pts, 14 linhas) | Nunca auto-ativa, quebra tooling | Adicionar frontmatter (quick win) |
| Descriptions longas >300 chars | ~40+ skills (ex: docker-patterns, flutter-dart-code-review, universal-portability) | Ruido no roteamento | Enxugar para 1-2 frases + Use when + Triggers |
| Clusters duplicados | threejs(7), security(11), testing(12), homelab(5), claude(11), workflows(8), agent*(24), orch*(9), skill*(13) | Overlap e confusao roteamento | Diferenciar com secao Quando NAO usar cruzada |
| Templates por stack quase identicos | verification (Jaccard 0.52-0.77), patterns (0.57-0.68), tdd, django/laravel-security (0.65) | Descricoes indistinguiveis, risco de trigger errado | Manter por stack mas reescrever descriptions com condicao exclusiva + delegacao para skill base |
| Name != pasta / literal block | 0 | — | Monitorar em CI (regrediu a zero, manter) |

## Ranking Pior -> Melhor (Top 30 Piores - acao prioritaria)

| # | Score | Linhas | Skill | Maior Correcao | Motivos |
|---|---|---|---|---|---|
| 1 | **70** | 1290 | `threejs-voxel-block-system` | Fatiar em 2-3 skills focadas + mover codigo para references/ | desc longa; >500 linhas; sem disclosure |
| 2 | **70** | 949 | `laravel-security` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 3 | **70** | 889 | `windows-desktop-e2e` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 4 | **70** | 856 | `threejs-responsive-patterns` | Fatiar em 2-3 skills focadas + mover codigo para references/ | desc longa; >500 linhas; sem disclosure |
| 5 | **70** | 826 | `kotlin-testing` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 6 | **70** | 821 | `generating-python-installer` | Fatiar em 2-3 skills focadas + mover codigo para references/ | desc longa; >500 linhas; sem disclosure |
| 7 | **70** | 818 | `graph-engineering-patterns` | Fatiar em 2-3 skills focadas + mover codigo para references/ | desc longa; >500 linhas; sem disclosure |
| 8 | **70** | 818 | `python-testing` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 9 | **70** | 813 | `quarkus-tdd` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 10 | **70** | 804 | `threejs-config-constants` | Fatiar em 2-3 skills focadas + mover codigo para references/ | desc longa; >500 linhas; sem disclosure |
| 11 | **70** | 770 | `data-scraper-agent` | Fatiar em 2-3 skills focadas + mover codigo para references/ | desc longa; >500 linhas; sem disclosure |
| 12 | **70** | 757 | `kubernetes-patterns` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 13 | **70** | 736 | `django-patterns` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 14 | **70** | 731 | `django-tdd` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 15 | **70** | 725 | `cpp-coding-standards` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 16 | **70** | 724 | `quarkus-patterns` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 17 | **70** | 722 | `golang-testing` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 18 | **70** | 721 | `kotlin-exposed-patterns` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 19 | **70** | 717 | `git-workflow` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 20 | **70** | 691 | `kotlin-ktor-patterns` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 21 | **70** | 690 | `claude-md-auditor` | Fatiar em 2-3 skills focadas + mover codigo para references/ | desc longa; >500 linhas; sem disclosure |
| 22 | **70** | 676 | `laravel-tdd` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 23 | **70** | 661 | `metahuman-identity-pipeline` | Fatiar em 2-3 skills focadas + mover codigo para references/ | desc longa; >500 linhas; sem disclosure |
| 24 | **70** | 658 | `frontend-patterns` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 25 | **70** | 645 | `django-security` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas; sem disclosure |
| 26 | **70** | 624 | `hyperledger-fabric-generator` | Fatiar em 2-3 skills focadas + mover codigo para references/ | desc longa; >500 linhas |
| 27 | **70** | 614 | `autonomous-loops` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas |
| 28 | **70** | 606 | `threejs-deploy-pipeline` | Fatiar em 2-3 skills focadas + mover codigo para references/ | desc longa; >500 linhas |
| 29 | **70** | 597 | `motion-advanced` | Fatiar em 2-3 skills focadas + mover codigo para references/ | desc longa; >500 linhas; sem disclosure |
| 30 | **70** | 584 | `tdd-workflow` | Fatiar em 2-3 skills focadas + mover codigo para references/ | >500 linhas |

> Correcao de maior valor = a unica mudanca que mais aumenta score/impacto. Lote 2 removeu do Top 30: `python-patterns`, `kotlin-patterns`, `golang-patterns` (fatiados p/ 100), `perl-patterns`, `perl-security` (fatiados p/ 100).

## Amostra do Top 15 Melhores (referencia de qualidade)

Todas com 100 pts (137 no total). Use como template:

| # | Score | Linhas | Skill | Por que e boa |
|---|---|---|---|---|
| 1 | 100 | 38 | `impeccable-design` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 2 | 100 | 40 | `skill-execution-dashboard` | corrigida nesta rodada (51→100): frontmatter + gatilhos + Quando usar/NAO usar + exemplo |
| 3 | 100 | 43 | `autopilot-content-factory` | idem (skill nova ja nasce no padrao) |
| 3 | 100 | 43 | `vox-style-video` | idem |
| 4 | 100 | 44 | `orch-change-feature` | idem |
| 5 | 100 | 44 | `orch-fix-defect` | idem |
| 6 | 100 | 45 | `claude-video` | idem |
| 7 | 100 | 45 | `orch-refine-code` | idem |
| 8 | 100 | 46 | `orch-add-feature` | idem |
| 9 | 100 | 50 | `orch-build-mvp` | idem |
| 10 | 100 | 53 | `grills` | idem |
| 11 | 100 | 59 | `nextjs-turbopack` | idem |
| 12 | 100 | 60 | `skill-comply` | idem |
| 13 | 100 | 71 | `mcp-server-patterns` | idem |
| 14 | 100 | 74 | `capricho` | idem |
| 15 | 100 | 78 | `buzz-workspace-teaming` | idem |

Outras 100pts (amostra): `perl-patterns`, `perl-security`, `golang-patterns`, `python-patterns`, `kotlin-patterns` (fatiados no lote 2), `rust-patterns` (84 linhas), `rust-testing` (118), `laravel-verification` (181), `mailtrap-email-integration`, `unlazy`, `repo-scan`, `safety-guard`, `zed-deltadb-versioning` ... ver `auditoria-skills.json` completo (ordenado pior→melhor; melhores no fim).

## Clusters de Overlap — Analise de Deduplicacao (atualizada)

- **Three.js (7)**: `img2threejs`, `threejs-config-constants`, `threejs-deploy-pipeline`, `threejs-responsive-patterns`, `threejs-scene-composer`, `threejs-shader-effects`, `threejs-voxel-block-system`
  - *Diagnostico:* Sub-dominios legitimos, mas 5 com >600 linhas e sem disclosure. *Acao:* manter separadas, reduzir cada para <=250 linhas + cross-ref Quando NAO usar.
- **Security (11)**: `defi-amm-security`, `django-security`, `laravel-security`, `llm-trading-agent-security`, `perl-security`, `quarkus-security`, `security-bounty-hunter`, `security-review`, `security-scan`, `springboot-security`, `vibe-security-scanner`
  - *Diagnostico:* `security-review` (geral) vs `vibe-security-scanner` (SaaS automatizado) vs language-specific. `django-security`↔`laravel-security` com Jaccard 0.65 (descriptions quase identicas). *Acao:* reescrever descriptions com condicao exclusiva: "Use security-review para checklist manual; use vibe-security-scanner para SaaS com scanners; use *-security apenas se projeto for Django/Laravel/...".
- **Testing (12)**: `ai-regression-testing`, `cpp-testing`, `csharp-testing`, `e2e-testing`, `fsharp-testing`, `golang-testing`, `kotlin-testing`, `perl-testing`, `python-testing`, `react-testing`, `rust-testing`, `swift-protocol-di-testing`
  - *Diagnostico:* Legitimo por linguagem, mas `python-testing` (818), `kotlin-testing` (826), `golang-testing` (722) gigantes. `csharp-testing`↔`fsharp-testing` Jaccard 0.58. *Acao:* extrair patterns comuns para skill base `testing-base` + delegacao.
- **Verification (4+):** `django-verification`↔`laravel-verification` (0.68), `quarkus-verification`↔`springboot-verification` (0.77), cruzados 0.52
  - *Diagnostico:* Template com troca de nome do stack. Corpo difere em tamanho (quarkus 480 vs springboot 232 linhas) mas descriptions indistinguiveis. Maior risco de trigger errado. *Acao prioritaria:* diferenciar descriptions ("apenas se Quarkus...") + criar `verification-loop-base`.
- **Patterns (N):** `golang-patterns`↔`perl-patterns` (0.68), ↔`kotlin-patterns` (0.65), ↔`python-patterns` (0.57); `dotnet-patterns`↔`golang-patterns` (0.64)
  - *Diagnostico:* Mesmo template. *Acao:* idem verification.
- **TDD:** `quarkus-tdd`↔`springboot-tdd` (0.57), `django-tdd`↔`python-testing` (0.48) — revisar escopo tdd vs testing.
- **Homelab (5)**: `homelab-network-readiness`, `homelab-network-setup`, `homelab-pihole-dns`, `homelab-vlan-segmentation`, `homelab-wireguard-vpn`
  - *Diagnostico:* Foco bom, fragmentado. *Acao:* skill guarda-chuva com referencias cruzadas.
- **Healthcare (4)**: `healthcare-cdss-patterns`, `healthcare-emr-patterns`, `healthcare-eval-harness`, `healthcare-phi-compliance` (+ `hipaa-compliance` fora do prefixo)
  - *Diagnostico:* `healthcare-phi-compliance` vs `hipaa-compliance` (HIPAA e subconjunto de PHI). *Acao:* fundir ou hipaa como entrypoint que delega.
- **Claude family (11, era 9)**: `claude-account-optimizer`, `claude-chrome-automation`, `claude-connector-strategy`, `claude-cowork-patterns`, `claude-devfleet`, `claude-md-auditor`, `claude-model-router`, `claude-project-template`, `claude-video` (nova), `claude-voice-workflow`, + `notebooklm-claude-rag`
  - *Diagnostico:* Gatilhos corrigidos no v1→v2, mas tamanhos ainda grandes. *Acao:* fatiar + triggers ja ok.
- **Workflows (8)**: `claude-voice-workflow`, `dmux-workflows`, `dynamic-workflow-mode`, `git-workflow`, `memory-import-workflow`, `mle-workflow`, `tdd-workflow`, `workflows`
  - *Diagnostico:* `workflows` vs `dynamic-workflow-mode` vs `dmux-workflows` confusos. *Acao:* renomear descriptions para escopo claro.
- **Novos clusters grandes:** `agent*` (24), `skill*` (13: auditar-skills, book-to-skill, criar-skill, encontrar-skill, ...), `orch*` (9), `motion*` (7), `kotlin*` (5), `django*` (5), `laravel*` (5)
  - *Acao:* auditar `skill*` (meta-skills que falam de skills — alto risco de auto-referencia) e `agent*` (24 — maior cluster do repo, precisa taxonomia).

## Tabela Completa (condensada) — Todas as 416 skills por faixa

### Faixa 40-59 (Critica/Fraca - 0 skills)
Faixa zerada nesta rodada (era 29 no v1). Ultima remanescente `skill-execution-dashboard` corrigida 51→100.

### Faixa 60-79 (Regular - 108 skills)
Amostra: `docker-patterns`(70, ganhou Quando Ativar — falta fatiar 534 linhas), `fastapi-patterns`(70, idem 528), `flutter-dart-code-review`(73), `mysql-patterns`(73, `## Activation`→`## When to Activate`), `threejs-voxel-block-system`(70), `laravel-security`(70), `windows-desktop-e2e`(70) ... ver JSON para lista completa. Perfil tipico: gatilho OK, mas >350 linhas sem disclosure.

### Faixa 80-99 (Boa - 165 skills) & 100 (Excelente - 134 skills)
Ex-fracas que subiram para 73-79 apos ganhar gatilho: `universal-portability`(79), `frontend-a11y`(73), `prompt-optimizer`(73), `voice-cloning-local`(74), `obsidian-cli`(79), `configure-ecc`(79). Amostra 100pts: `impeccable-design`, `autopilot-content-factory`, `vox-style-video`, `orch-change-feature`, `orch-fix-defect`, `claude-video`, `orch-refine-code`, `orch-add-feature`, `orch-build-mvp`, `grills`, `nextjs-turbopack`, `skill-comply`, `mcp-server-patterns`, `capricho`, `buzz-workspace-teaming` ... (134 com 100pts).

## Plano de Correcao Priorizado (ordem de esforco x ganho)

### Fase 1 — Quick wins (CONCLUIDA)
- [x] Triggers em 189 descriptions, literal blocks, pastas vazias, name mismatch (v1→v2)
- [x] `skill-execution-dashboard` — frontmatter + gatilhos + Quando usar/NAO usar + exemplo (51→100, esta rodada). Pendencia: criar `scripts/dashboard_tracker.js` e `docs/EXECUTION-DASHBOARD.md` referenciados (marcados como planejados no SKILL.md).

### Fase 2 — Fatiamento (em andamento: 8/47 concluidos)
0. [x] **Concluidos (70→100):** `rust-patterns` (500→84, 11 refs), `rust-testing` (501→118, 12 refs), `perl-patterns` (505→~95, 8 refs), `perl-security` (504→~115, 8 refs), `security-review` (504→~70, 5 refs), `golang-patterns` (676→~100, 8 refs), `python-patterns` (751→~120, 11 refs), `kotlin-patterns` (712→~150, 9 refs). Metodo: script de split por faixas + SKILL.md com indice + exemplo + quick reference. Scripts em `C:\Users\magro\AppData\Local\Temp\opencode\slice_*.py`.
1. **Restam 39 mega-monolitos >500 linhas** — proximo lote mecanico: `kotlin-testing` (826), `python-testing` (818), `golang-testing` (722), `django-patterns` (736), `django-tdd` (731), `quarkus-patterns` (724).
2. **Depois os gigantes manuais:** threejs-voxel-block-system (1290), laravel-security (949), windows-desktop-e2e (889) — exigem leitura integral e quebra em 2-4 skills.
3. **Na sequencia:** 37 skills 351-500 + 84 skills 201-350 — disclosure progressivo. Meta: 160→<50 skills >200 linhas.

### Fase 3 — Deduplicacao (em andamento)
3. [x] Condicao exclusiva (`Only for X — not for other...`) em 13 descriptions boilerplate: 4 verification, `django/laravel-security`, `csharp/fsharp-testing`, 5 patterns (Go/Perl/Kotlin/Python/.NET). Revisar pares Jaccard>=0.45 restantes (tdd, quarkus/springboot-patterns) — adicionar secao Quando NAO usar cruzada.
4. Revisar clusters Three.js, Security, Testing, Healthcare, agent*(24), skill*(13) — taxonomia + skill base com delegacao.
5. Auditar global vs projeto (`~/.config/opencode/skills` tinha 408 globais no v1 — re-verificar) — remover duplicatas globais.

## Correcoes aplicadas (2026-09-05, esta rodada)

| # | Skill(s) | Antes | Depois | O que foi feito |
|---|---|---|---|---|
| 1 | `skill-execution-dashboard` | 51 pts, 14 linhas, sem frontmatter | 100 pts, 40 linhas | frontmatter + triggers + Quando usar/NAO usar + exemplo; refs marcadas como planejadas (script/dashboard ausentes) |
| 2 | `docker-patterns`, `fastapi-patterns` | 63, sem Quando Ativar | 70 | secao When to Activate + When NOT to Use |
| 3 | `flutter-dart-code-review`, `mysql-patterns` | 66 | 73 | idem (`mysql`: `## Activation`→`## When to Activate`) |
| 4 | 4 verification + 2 security + 2 testing + 5 patterns | triggers genericos indistinguiveis | — | condicao exclusiva `Only for X` nas descriptions |
| 5 | `rust-patterns` | 70, 500 linhas monolito | 100, 84 linhas + 11 refs | split por script, SKILL.md com indice + exemplo + quick ref |
| 6 | `rust-testing` | 70, 501 linhas monolito | 100, 118 linhas + 12 refs | idem |
| 7 | `perl-patterns`, `perl-security`, `security-review` | 70, ~504 monolitos | 100 (lote 2) | split mecanico + SKILL.md indice |
| 8 | `golang-patterns` (676), `python-patterns` (751), `kotlin-patterns` (712) | 70 monolitos | 100 (lote 2) | idem |
| Efeito global | media 87.5, 1 sem gatilho, 168 >200, 47 >500, 134×100 | media 88.2, 0 sem gatilho, 160 >200, 39 >500, 143×100 | — |

### Fase 4 — Maturidade (continuo)
- **Nivel atual estimado:** 2-3 (skill propria -> biblioteca) para maioria; 143 skills em padrao premium (100 pts).
- **Proximo nivel:** 5 (evals/A-B) — criar evals de ativacao: medir taxa de trigger correto vs falso positivo, antes/depois do fatiamento.
- **CI:** travar regressao — validar em `scripts/ci/validate-skills.js`: frontmatter obrigatorio, `Use when|Use quando` na description, `name==pasta`, `description: >` (nao `|`), limite 200 linhas com excecao se tiver references/.

## Criterios de Nota (replicaveis)

| Criterio | Peso | Como foi medido (heuristica automatizada) |
|---|---|---|
| Frontmatter valido | 15 | tem name+description (8) + sem literal block (4) + name==pasta (3) |
| Frases gatilho | 20 | description/FM contem Use when / Use quando / quando / triggers on / gatilho |
| Clareza do corpo | 20 | tem Quando Ativar (7) + exemplos codigo ``` (7) + >=3 headers (6, 1-2 headers =3) |
| Foco | 10 | <=200=10, 201-350=6, 351-500=3, >500=0 |
| Tamanho/disclosure | 20 | <=200=20, 201-300=10, 301-500=5, >500=0; -5 sem references/scripts se >200 |
| Overlap | 15 | baseline 15 (penalidade manual se duplicata confirmada; Jaccard>=0.45 sinaliza revisao) |

## Anexos

- **Metodo:** leitura automatizada de todas as `skills/*/SKILL.md` (utf-8-sig) + validacao heuristica + amostragem manual de piores/melhores/duplicatas (ex: dashboard lido integralmente; quarkus vs springboot verification comparados; clareza/coordenacao/conversa/curriculo verificados como falso-positivo de regex).
- **Correcao metodologica v2:** regex de gatilho inclui `Use quando` (PT). No calculo intermediario 5 skills PT foram falso-positivo; numero final correto e 1 sem gatilho, nao 6.
- **Limitacao:** clareza semantica real exige leitura humana; heuristica de headers/exemplos e proxy. Jaccard em descriptions e triagem, nao prova de duplicata.
- **Arquivos:** `skills/*/SKILL.md` (416 pastas). Backup do v1 em `C:\Users\magro\AppData\Local\Temp\opencode\auditoria-skills-2026-09-02.bak.*`.
- **Reproducibilidade:** scripts temp em `C:\Users\magro\AppData\Local\Temp\opencode\audit_calc.py` (score), `audit_dup.py` (clusters+Jaccard), `audit_tables.py` (tabelas); `auditoria-skills.json` ordenado pior→melhor.
- **Distribuicao de linhas:** <=200:256 (61.5%) | 201-350:84 | 351-500:37 | >500:39.

---
*Nota e meio, nao fim: objetivo e 1 correcao acionavel por skill. Fase 1 concluida — comece pelo `skill-execution-dashboard` (15 min) e depois pelo maior monolito `threejs-voxel-block-system` (1290 linhas).*
