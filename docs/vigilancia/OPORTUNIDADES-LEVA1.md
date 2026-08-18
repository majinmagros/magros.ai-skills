# Relatório de Vigilância — Oportunidades Leva 1 (2026-08-18)

Primeira leva de análise dos 8 canais vigiados (`manifests/canais-vigilados.json`).
12 vídeos analisados na íntegra (transcrições em `C:\Projetos\<canal>\`, fora do repo).
Cruzamento com `docs/data/skills.json` (337 skills) e decisões por vídeo.

---

## 1. Fontes Analisadas

| Canal | Vídeo | Tema | Decisão |
|---|---|---|---|
| @AIJasonZ | `iWRmtPdFbGw` | CodeBase Memory MCP: motor C/C++, índice em segundos, hook pre-tool-use, corte de ~50% de tokens, mapa de blast radius ("GPS" do código) | **Exercício**: rodar `avaliar-ferramenta-ia` (2.2) contra a ferramenta |
| @AIJasonZ | `JQ_We_ztxrI` | Anatomia de loops: **loop contract** (md com goal/boundaries/SOP + state + log append-only), 4 tipos de trigger, orquestrador + executors em worktrees isolados + verifier, evoluir loop a cada 5–10 runs | **Gap**: template "loop contract" → enriquecer `loop-design-check` + `continuous-agent-loop` |
| @SimonScrapes | `H9BUkgDf5Y4` + `F4At4St1iH8` | Memória para agentes: 3 jobs (storage/injection/recall), 4 requisitos (cita fontes, snapshot congelado, busca semântica, acesso escopado), árvore de decisão, PG Lite/PG Vector + RLS, retrieval em 3 níveis | **Gap**: atualizar `unified-memory` com o framework storage/injection/recall |
| @SimonScrapes | `yh_fZZVbNwc` | Brand system: 3 arquivos (voice profile, **body of work**, visual identity com tokens.json) | **Coberto com enriquecimento**: `brand-voice`/`brand-discovery` já cobrem; ângulo novo = extração de "body of work" |
| @SimonScrapes | `mNawxNjrR_E` | 14 superpowers: Ultra Code/dynamic workflows (6 padrões), auto mode, /loop+/goal, skill design (<200 linhas, progressive disclosure, self-learning), skill systems (Lego), MCP vs CLI, memória, CLAUDE.md como folder architecture, plano sobrevive no projeto, slot machine (/rewind), agent view, portabilidade (agents.md/skills), VPS+Tmux, skills vs sub-agents | **Coberto**: `superpowers`, `engenharia-de-grafos`/`workflows`, `criar-skill`, `routines`, `unified-memory`; insight MCP-vs-CLI (custo de tokens sempre em contexto) → anotar em `context-budget` |
| @matthew_berman | `F4a8aMLb678` | Loops primer: taxonomia de triggers (manual/schedule/action), goal (verificável vs LLM-judge), **loop library**, 7 exemplos concretos | **Gap**: template de loop library → enriquecer `autonomous-agent-harness`/`loop-design-check` |
| @ColeMedin | `MbiMwgbGdxw` | SDLC via skills: split PRD/spec, validation-first (TDD para agentes), skills minimalistas plug-and-play, context rot | **Coberto**: `orch-pipeline`/`plan`/`superpowers` |
| @ColeMedin | `ulNsa0sD8N0` | Harness engineering: AI layer com 6 componentes (rules, skills, MCP, busca de código, hooks, sub-agents), "todo erro vira regra", hooks pre-tool-use, plan→implement→validate em sessões separadas | **Coberto**: `hookify-rules`/`harness-optimizer` |
| @IndyDevDan | `VQy50fuxI34` | **Anti-loop-engineering**: "AI developer workflows" (ADW) — 3 atores (engenheiro/agente/código), código é o herói (barato, determinístico), separar código DE skills ao escalar, hotfix agent cirúrgico, routing barato p/ chores, software factory | **Gap**: reframe ADW → enriquecer `automacao-deterministica` (código para fora da skill) + `roteamento-modelos-baratos` (workhorse p/ chores) |
| @IndyDevDan | `DzbqeO_diOQ` | Rebuild do `/Plan` para modelos Mythos-class: **property-based engineering**, plan format templatizado (o modelo preenche seções e preserva o resto), trade-off trifecta (perf/speed/cost), público do plano (agent-driven), meta-skill que cria outra skill | **Gap**: enriquecer `plan` — format de plano templatizado + trade-off trifecta + público do plano |
| @celinexu6598 | `sjby032qNF0` | Short: "skills > agents" para enterprise, governance | **Informativo**: baixo valor (16 linhas), sem ação |

---

## 2. Oportunidades Candidatas (ordenadas por valor/esforço)

| # | Oportunidade | Fonte | Ação | Esforço |
|---|---|---|---|---|
| 1 | Template **loop contract** (md canônico: goal/boundaries/SOP + state + log append-only; 4 triggers; orquestrador+executors+verifier; evoluir a cada 5–10 runs) | @AIJasonZ `JQ_We_ztxrI` | Enriquecer `loop-design-check` + `continuous-agent-loop` | M |
| 2 | Framework **storage/injection/recall** para `unified-memory` (4 requisitos, árvore de decisão, 3 níveis de retrieval) | @SimonScrapes `H9BUkgDf5Y4`+`F4At4St1iH8` | Atualizar `unified-memory` | M |
| 3 | **Loop library** (catálogo de 7 loops prontos, taxonomia de triggers, goal verificável vs LLM-judge) | @matthew_berman `F4a8aMLb678` | Enriquecer `autonomous-agent-harness`/`loop-design-check` | M |
| 4 | Reframe **ADW**: separar código de skills ao escalar, hotfix agent, routing barato para chores | @IndyDevDan `VQy50fuxI34` | Enriquecer `automacao-deterministica` + `roteamento-modelos-baratos` | P |
| 5 | **Property-based planning** / plan format templatizado p/ `plan` (trade-off trifecta, público do plano) | @IndyDevDan `DzbqeO_diOQ` | Enriquecer `plan` | P |
| 6 | **Body of work** (extração do histórico de criação da marca) em `brand-voice` | @SimonScrapes `yh_fZZVbNwc` | Enriquecer `brand-voice` | P |
| 7 | **CodeBase Memory MCP** — validar antes de qualquer skill | @AIJasonZ `iWRmtPdFbGw` | Exercício `avaliar-ferramenta-ia` (read-only, sem skill nova) | B |
| 8 | MCP vs CLI (MCP sempre pesa tokens no contexto; CLI só quando chamado) | @SimonScrapes `mNawxNjrR_E` | Anotar decisão de design em `context-budget` | B |

---

## 3. Já Cobertos (não duplicar)

- SDLC via skills / PRD-spec / validation-first → `orch-pipeline`, `plan`, `superpowers`.
- Harness 6 componentes / erro-vira-regra / hooks pre-tool-use → `hookify-rules`, `harness-optimizer`.
- 14 superpowers (dynamic workflows, /loop+/goal, skill design, skill systems, memória, CLAUDE.md como agentic OS, slot machine) → já mapeadas em `superpowers`, `engenharia-de-grafos`, `criar-skill`, `routines`, `unified-memory`, `workflows`.
- Short Celine Xu (skills > agents) → informativo.

## 4. Próximos Passos

1. Decidir materialização das oportunidades 1–6 (editar skills existentes, sem duplicar).
2. Rodar exercício `avaliar-ferramenta-ia` contra CodeBase Memory MCP (7) antes de qualquer adoção.
3. Próxima leva: `node scripts/yt-oportunidades.mjs diff-all --since 2026-08-18` após novos uploads.
4. Repos (7) entram no fluxo via `scripts/repo-oportunidades.mjs` (a criar).