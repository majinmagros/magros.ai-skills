# Relatório de Oportunidades: Maestros da IA (2026)

Condensa os aprendizados dos vídeos processados e as skills materializadas a
partir deles. Transcrições ficam em pastas locais (nunca no repo público).

---

## 1. Fontes Analisadas

| Vídeo | Tema | Decisão |
|---|---|---|
| `j3AV7xsCepI` | Sessões do Claude Code conversando entre si + supervisor loop com nota | **Skill nova**: `sessoes-orquestradas` |
| `ut2YqOMRkeo` | Gemini Spark agentic (skills, MCP, @tool, tarefas agendadas, AI Studio) | **Skill nova**: `gemini-cli-agent-skills` |
| `ltmH3Oo49fE` | DeepSeek V4 Flash barato, custo-por-tarefa, OpenRouter no Claude Code | **Skill nova**: `roteamento-modelos-baratos` |
| `fTok7Z-Bz40` | Pipeline claymation: áudio-first, imagem-depois-anima, ledger de custos | **Skill nova**: `pipeline-video-agente` |
| `ZeD44y55t6I` | Skills "simplificar resposta" e "ADHD/multi-perspectiva" (Opus 5 slop) | **Já coberto**: `plain-language-response` + `multi-perspective-convergence` |
| `Hdn1BXqGeTE` | Anthropic cortou 80% do system prompt (`/doctor`) | **Já coberto**: `doctor` |
| `M4euu8xqO-k` | IA resolve conjectura jacobiana (87 anos em aberto) com Fable 5 + verificação LEAN | **Informativo**: sem workflow concreto, sem skill |
| `ZQIbgHsf_iE` | Conselhos do Boris Cherny (criador do Claude Code): instruções envelhecem rápido, framework fiável (prompt desafiante + verificação + não parar até 100%), gap modelo-produto | **Coberto com enriquecimento**: 2.1 "instruções envelhecem" → `doctor` (falta a estratégia radical de rodar com prompt enxuto a cada ~6 meses); framework fiável → `score-loop` (já cobre, nota 85/100); gap modelo-produto → insight de negócio, sem skill |
| `dRGKKq_1aYs` | Grokbot (xAI): central de agentes na nuvem, $200/mês no recurso definidor, lock-in total no ecossistema, só roda Grok; review real mostra beta instável (auths quebradas, créditos consumidos no trial); conclusão: "clone bonito de ferramentas abertas (OpenClaw/Claude Code/Codex)" | **Skill nova**: `avaliar-ferramenta-ia` — framework cético de adoção (escopo real vs marketing, custo do recurso definidor, lock-in, comparativo com o stack, trial hands-on, linha do hype) |
| `0I83GmuUjDI` | 9router: router de IAs open source (25k+ estrelas) que agrega tiers gratuitos (OpenCode free, Nvidia API, contas gratuitas rotacionando) num endpoint único com failover automático (429/402/404/410 → próximo da cadeia); roda Claude Code/agentes 24/7 num VPS ~R$50/mês sem pagar Anthropic/OpenAI ("$0 in Tokens") | **Skill nova**: `roteamento-modelos-gratuitos` — configurar 9router, combo com fallback, rotação de contas, diagnóstico de travamento (quota de todos = router "travado") |

---

## 1.1 Batch 2026-08-19 — canais vigiados (8 canais)

### Skills autoragem (foco da leva)

| Vídeo | Canal | Tema | Decisão |
|---|---|---|---|
| `YkpEX_jlb04` | ai-foundations | DBS + anatomia de pasta de skill + departamentos/C-suite | **Enriquecimento**: `criar-skill` |
| `dTGF-AUpxAQ` | ai-foundations | Framework de 4 passos + filtro EADA (Eliminate/Automate/Delegate/Accelerate) | **Enriquecimento**: `criar-skill` (seção 0) |
| `UqUx0-A15FY` | ai-foundations | DBS na prática + reverse engineering de skill + eval reviewer do Skill Creator | **Enriquecimento**: `criar-skill` (1.1 e seção 7) |
| `m-5DjcgFmfQ` | grace-leung | Skills para marketer: 3 formas de criar + skills vs MCP vs projects | **Enriquecimento**: `criar-skill` (seção 0) |
| `Ph-maUAiSU8` | grace-leung | Marketing skills stack: taxonomia brand/function/specialty, versionamento, biblioteca central | **Enriquecimento**: `criar-skill` (seção 5); resto coberto por `marketing-campaign`/`brand-voice`/`design-system` |
| `1WImBwiA7RA` | ai-jason | Skills vs MCP (consumo de tokens, progressive disclosure) + anatomia skill.md | **Enriquecimento**: `criar-skill` (seção 3) |
| `FD53kEpLh9c` | simon-scrapes | Skill systems: orquestrador + skills filhas, anti-mega-skill | **Enriquecimento**: `criar-skill` (seção 5) |
| `RrMTtG1ZccI` | simon-scrapes | Skill chaining / composição de skills | **Enriquecimento**: `criar-skill` (seção 5) |
| `-u_igSQHAIo` | simon-scrapes | 7 níveis de maturidade em skills: ≤200 linhas, 15k chars, ~20% ativação, evals/A-B, learnings file | **Enriquecimento**: `criar-skill` (seções 3 e 7) + `auditar-skills` |
| `w2z4Fai2s9c` | full-cycle | Skill Creator (Anthropic) na prática: eval de descrição + benchmark qualitativo por modelo (com/sem skill, delta de 40 pts Haiku vs Opus) | **Enriquecimento**: `criar-skill` (seção 7 — benchmark por modelo decide manter/descartar) |

### Harness/agentes (cobertura — sem skill nova)

| Vídeo | Canal | Tema | Decisão |
|---|---|---|---|
| `arkWBqSI7Uc` | celine-xu | Delegação: 4 quadrantes de conhecimento, blind spot scan, AI entrevista, evidence gates | **Coberto**: `clarificar` + `grilling` + `intent-driven-development` |
| `MW3t6jP9AOs` | ai-jason | Sistema de docs `.agent` (task PRDs, system docs, SOPs, README index) | **Coberto**: `codebase-onboarding` + `knowledge-ops` |
| `RairMJflUSA` | indyddevdan | Harness 3 camadas (orchestrator→leads→workers), mental models por agente | **Coberto**: `team-agent-orchestration` + `sessoes-orquestradas` |
| `2KcITKKJikA` | indyddevdan | 5 pilares do engenheiro agêntico + tokenomics/token arbitrage | **Coberto**: `agentic-engineering` + `cost-aware-llm-pipeline` |
| `efRIrLXoOVA` | cole-medin | AI layer (7 componentes) p/ codebases grandes: CLAUDE.md hierárquico, path-scoped skills, LSP via MCP | **Coberto**: `graphify` + `codebase-onboarding` + `context-budget` |
| `HAkSUBdsd6M` | cole-medin | Adversarial dev (GAN): planner→generator+evaluator, contrato de sprint, sycophancy, modelos baratos com harness | **Coberto**: `gan-style-harness` (já materializada do paper da Anthropic) |
| `t6NxHM5peus` | ai-foundations | Vender sistemas agênticos (Lerty/Leverage): 4 camadas, $500–1000/mês | **Informativo**: modelo de negócio, sem skill |

**Enriquecidas neste lote:** `criar-skill` (filtro EADA, DBS, reverse engineering, progressive disclosure com números reais, taxonomia brand/function/specialty, sistemas de skills, evals/A-B, benchmark por modelo, learnings file) e `auditar-skills` (critério de tamanho/disclosure + 7 níveis de maturidade).

---

## 2. Skills Materializadas Neste Lote

| Skill | Módulo | Gatilho |
|---|---|---|
| `coletar-oportunidades-youtube` | workflow-quality | pipeline deste próprio relatório (catalog/diff/download/dedup/mark) |
| `sessoes-orquestradas` | agentic-patterns | sessões nomeadas que se falam + supervisor loop 0-100 + roteamento de modelo |
| `gemini-cli-agent-skills` | agentic-patterns | Gemini Spark, MCP, @tool, tarefas agendadas, AI Studio |
| `roteamento-modelos-baratos` | agentic-patterns | OpenRouter, custo-por-tarefa, executor barato + verificador forte |
| `pipeline-video-agente` | media-generation | áudio-first, imagem→anima, consistência via referências, ledger de custos |
| `avaliar-ferramenta-ia` | workflow-quality | Grokbot/xAI review — framework cético: escopo real vs marketing, custo do recurso definidor, lock-in, comparativo com stack, trial, linha do hype (2026-08-18) |
| `a2a-interoperability` | agentic-patterns | A2A: protocolo agente→agente (Linux Foundation), Agent Card, Task, JSON-RPC 2.0, complementar ao MCP (2026-08-19) |
| `agent-guardrails` | security | proteção de agentes contra prompt injection, jailbreak, exfiltração — pipelines em camadas, humano no loop (2026-08-19) |
| `12-factor-agents` | agentic-patterns | 12 princípios humanlayer para LLM apps de produção: dono do contexto, tools = outputs estruturados, reducer stateless (2026-08-19) |
| `roteamento-modelos-gratuitos` | agentic-patterns | 9router: tiers gratuitos com failover automático, combo no SQLite, VPS 24/7 (2026-08-19) |

## 3. Já Cobertos (não duplicar)

- Vídeo das skills anti-slop → `plain-language-response` (texto) e
  `multi-perspective-convergence` (multi-perspectiva) já existiam.
- Vídeo do `/doctor` → a skill `doctor` foi materializada na leva anterior.

### 3.1 Canal Attekita Dev (terceiro canal)

| Vídeo | Tema | Decisão |
|---|---|---|
| `6GcfKpfA2kM` | Graph Engineering: orquestração de agentes em paralelo com verificadores independentes, sem contexto compartilhado | **Coberto com enriquecimento**: conceito central já em `engenharia-de-grafos`; absorver anti-overengineering (artefatos ruins = queima de tokens), os 3 níveis de implementação (delegar à IA / especificar manual / ferramenta dedicada) e "loop como nó de grafo" na skill canônica |

### 3.2 Canal Full Cycle (quarto canal)

| Vídeo | Tema | Decisão |
|---|---|---|
| `RO5y-fCIBy8` | Novo papel do dev → "engenheiro de IA": dev vira arquiteto que guia agentes; 2 camadas (AI engineering vs software dev); gaps de quem programa com IA (domínio superficial, sem metodologia, pouco paralelismo, sem critério de validação, skills mal feitas) | **Persona materializada**: agente `jarvis` (agents/jarvis.md; aliases Kitt/Mega Brain; subagente opencode em `.opencode/prompts/agents/jarvis.txt`) com as características do vídeo — define direção/limites/critérios, modela o harness, decompõe em workflows paralelos, critério de validação com cutoff, guard rails, equilíbrio custo/latência/segurança/fiabilidade |
| `w2z4Fai2s9c` | Skill Creator (Anthropic) na prática: eval de descrição + benchmark qualitativo por modelo (com/sem skill; Haiku 90% com vs 50% sem; Opus 100/100 → skill desnecessária no modelo forte) | **Enriquecimento**: `criar-skill` (seção 7 — benchmark por modelo decide manter/descartar). Publicado 2026-08-19; ver batch 1.1 |
| `PXpI0AsS-RE` | Prompt vs Context vs Harness Engineering: "se você não é o modelo, você é o harness"; harness embutido (Claude Code/Cursor/Antigravity) vs harness que você constrói (CLAUDE.md, regras, skills, MCP, workflows, testes, recuperação de erro); contexto certo na hora certa (nem pouco nem demais) | **Coberto**: conceito de harness já amplamente coberto por `agent-harness-construction` + `autonomous-agent-harness` + `configure-ecc` + `workspace-surface-audit` + `dynamic-workflow-mode` + `gan-style-harness`; contexto certo na hora certa → `context-budget` + `iterative-retrieval` + `strategic-compact`. Vídeo conceitual/fundacional, sem skill nova |
| `ZfpYVS7oG6A` | Papel do dev com IA: fundamentos persistem (SOLID/DDD/clean arch); novos protocolos (MCP, A2A); 12-factor agents; design patterns de agentes (ReAct, Plan, Tools, routing); multi-agent architecture; novos problemas de segurança (jailbreak, prompt injection, guardrails); tradeoff latência/custo/qualidade (analogia CAP); evals; autocorreção autônoma de bugs (erro→issue→PR→auto-merge→publica) | **Gaps candidatos a skill nova**: (1) `a2a-interoperability` — protocolo A2A (agente→agente) complementar ao MCP, nenhuma skill cobre; (2) segurança genérica de agentes (jailbreak/prompt injection/guardrails) — só `llm-trading-agent-security` cobre, e é específica de trading; (3) `12-factor-agents` (humanlayer) como framework consolidado — fatias já existem (context-budget, cost-aware, loop skills), verificar se vira skill nova ou enriquecimento de `agent-harness-construction`. Resto coberto: tradeoffs → `cost-aware-llm-pipeline` + `roteamento-modelos-baratos`; evals → `eval-harness` + `agent-eval`; autocorreção → `continuous-agent-loop` + `autonomous-agent-harness` + `routines` + `github-ops`; multi-agent → `sessoes-orquestradas` + `agentic-os` |

Transcrições do canal ficam em `C:\projetos\full-cycle\` (fora do repo; via `YT_DIR`).

## 1.2 Batch 2026-08-20 — @Sujeitoprogramador (6 vídeos novos)

### Skills candidatas (gap real)

| Vídeo | Tema | Decisão |
|---|---|---|
| `8mNDmxHDmy4` | **Spec Kit**: constitution → specify → plan → tasks → implement com git branch por spec, UV package manager, memory/constitution files | **Skill nova**: `spec-kit` — workflow espec-driven com comandos CLI (`constitution`, `specify`, `plan`, `tasks`, `implement`), branch automática por spec, constituição global do projeto. Não coberto por `blueprint`/`plan`/`orch-*` (são ECC-genéricos; Spec Kit é tool concreta com CLI própria e fluxo opinionado). |
| `dsOGGuZi-JY` | **Cloud Design** (Claude): prototipagem alta-fidelidade com design system, referências visuais, export HTML/PDF para implementação; limites separados do Cloud Code | **Skill nova**: `cloud-design` — usar Cloud Design para protótipos fiéis, design system versionado, export standalone HTML/PDF, handoff para Cursor/Cloud Code. Gap: `frontend-design-direction`/`make-interfaces-feel-better`/`taste` são direção criativa; Cloud Design é tool concreta com workflow próprio. |
| `texoSrIvWRQ` | **Playwright MCP vs Agent Browser**: Playwright = determinístico, baixo nível (click, type, navigate, screenshot); Agent Browser (Vercel) = alto nível, objetivo em linguagem natural, navegação autônoma, robusto a variação de layout | **Skill nova**: `agent-browser` — quando usar cada um: Playwright MCP para testes determinísticos/ações precisas; Agent Browser para automações com objetivo vago, responsividade, variação de UI. Gap: `e2e-testing`/`browser-qa` cobrem Playwright; Agent Browser não tem skill. |

### Enriquecimento de skills existentes

| Vídeo | Skill a enriquecer | O que adicionar |
|---|---|---|
| `7phrurXJwH8` | `criar-skill` | Referenciar **Cursor Skills** como exemplo de skill system com carregamento sob demanda (description + triggers), scripts Python/JS, instalação project/global. Adicionar nota: skills podem ter código executável → auditar antes de instalar (já avisado no vídeo). |
| `7phrurXJwH8` | `agent-harness-construction` | Adicionar padrões Cursor: Agent MD (instruções de projeto), Rules (sempre injetadas), Skills (sob demanda), Multitask (subagentes com contexto separado), Model routing (auto/composer/opus/sonnet). |
| `PNP10gVp4Is` | `agent-harness-construction` | Referenciar frameworks de orquestração: **LangChain** (TypeScript/Python, tools com Zod, session memory), **Crew AI** (multiagentes, roles), **AI SDK** (Vercel, streaming, tool calling), **AG2/AutoGen** (conversação multiagente). Cada um tem tradeoffs: LangChain = flexível/verbose; Crew AI = opinionado/multiagente; AI SDK = integrado Next.js/React; AG2 = conversação. |
| `8mNDmxHDmy4` | `criar-skill` | Citar **UV** (Astral) como gerenciador de pacotes moderno Python (usado por Spec Kit, ruff, ty); `uv add`, `uv run`, `uv sync` — mais rápido que pip/poetry, lockfile universal. |
| `dsOGGuZi-JY` | `frontend-design-direction` | Cloud Design como tool de prototipagem alta-fidelidade com design system versionado; export HTML/PDF para handoff; limites de uso separados do Cloud Code. |
| `texoSrIvWRQ` | `e2e-testing` / `browser-qa` | Adicionar **Agent Browser** (Vercel) como alternativa de alto nível: objetivo em linguagem natural → navegação autônoma; bom para responsividade, variação de layout, automações web; roda Chrome headful/headless; instala via `npm i -g @vercel/agent-browser` + skill. |
| `7phrurXJwH8` | `roteamento-modelos-baratos` | Cursor model routing nativo: Auto (gerencia custo/qualidade), Composer 2.5 (modelo próprio, barato, bom p/ implementação), Opus/Sonnet/GPT-4.5 (caros, raciocínio). Limite "High" (quase ilimitado no plano Pro) vs API (cobra extra após 100%). Padrão: planejar com caro (Opus) → implementar com barato (Composer/Auto). |

### Já cobertos (não duplicar)

| Vídeo | Tema | Cobertura existente |
|---|---|---|
| `6cGoTqevIHo` | AI para aprendizado júnior (não substituir raciocínio) | **Persona/conselho** — sem workflow concreto; `agentic-engineering` já cobre "decompor trabalho em unidades de 15 min", "eval-first"; vídeo é orientação comportamental, não skill. |
| `7phrurXJwH8` | MCPs (Context7, Playwright, Stripe, etc.) | **Consumo de MCPs** — `mcp-server-patterns` cobre *construir* MCPs; usar MCPs prontos é configuração, não skill nova. |
| `7phrurXJwH8` | Multiagentes, subagentes, contexto separado | **Coberto**: `sessoes-orquestradas` (sessões nomeadas + handoff), `graph-engineering` (paralelo com verificadores), `agentic-os` (multiagente persistente), `team-agent-orchestration` (Kanban de agentes). |
| `PNP10gVp4Is` | Session management, tool calling, Zod schemas | **Coberto**: `agent-harness-construction` (tool schemas, observation design), `unified-memory` (memória compartilhada), `contract-first` (schemas tipados). |

---

## 4. Próximos Passos

1. Rodar o pipeline em novos vídeos: `node scripts/yt-oportunidades.mjs diff --since <data>`
   (agora com `--since-last` por canal, via `ULTIMA-COLETA.json`).
2. Analisar vídeos novos → materializar via `criar-skill`.
3. **Backlog matthew_berman**: ~30 vídeos sem transcrição desde 2026-07-19 —
   não são do foco "skills" desta leva; coletar quando quiser (assistir IA/LLM geral).
4. Rodar validators (`validate-no-personal-paths.js`, testes CI) antes de qualquer commit.
5. **Validação oficial (nova regra)**: todo claim central de skill materializada
   passa pela conferência contra docs oficiais (passos 4/5 de
   `coletar-oportunidades-youtube`) antes de gravar.

---

## 5. Validação contra documentação oficial (2026-08-19)

Rodada de conferência dos claims das skills materializadas contra as docs
oficiais — virou etapa obrigatória do pipeline.

| Skill | Claims validados | Divergência corrigida | Fonte oficial conferida |
|---|---|---|---|
| `gemini-cli-agent-skills` | Spark agenda tarefas; skills = `SKILL.md`+pastas; AI Studio importa GitHub + subdomínio grátis; Gemini Notebook = ex-NotebookLM; Lyria 3.5 no Flow Music | "domínio próprio" → subdomínio grátis `*.ai.studio` (domínio real exige Cloud Run/Firebase); removidos `@tool mentions`, "3.6 Flash / 3.5 FlashLight" e "Lyria com tier grátis" (não confirmados); adicionadas restrições do Spark (18+, conta pessoal, AI Pro/Ultra, regiões) | support.google.com/gemini (Spark skills/schedules), blog.google (Gemini Notebook, Lyria 3.5), geminicli.com/docs, @GoogleAIStudio (custom URLs) |
| `roteamento-modelos-baratos` | OpenRouter no Claude Code via 3 env vars | Preço DeepSeek V4 Flash atualizado para peak/off-peak (vigente desde 16/08/2026); adicionado caveat oficial OpenRouter (garantido só com provedor first-party Anthropic); alternativa: endpoint Anthropic direto da DeepSeek | api-docs.deepseek.com/quick_start/pricing, openrouter.ai/docs/cookbook/coding-agents/claude-code-integration, api-docs.deepseek.com/guides/coding_agents |
| `sessoes-orquestradas` | Sessões nomeadas, `--resume <nome>`, `/resume`, `/branch` | Removido claim de "sessões que se falam ao vivo" (não existe nas docs); descrito o mecanismo real: resume/handoff por nome, `/branch`, e worktrees para paralelismo verdadeiro | code.claude.com/docs/en/sessions |
| `criar-skill` | Estrutura `SKILL.md`+scripts/references/assets; progressive disclosure 3 níveis; Skill Creator oficial; SKILL.md enxuto | "Record a Skill / Claude Cowork" marcado como **não confirmado** nas docs oficiais; adicionada seção 8 com fontes oficiais | platform.claude.com/docs/.../agent-skills/best-practices, github.com/anthropics/skills (skill-creator) |
| `coletar-oportunidades-youtube` | `--write-auto-subs`, `--sub-langs` (aceita regex), `--extractor-args IE_KEY:ARGS` | Download agora usa `--write-subs --write-auto-subs` (legenda manual com fallback auto) conforme docs | github.com/yt-dlp/yt-dlp (README oficial) |
| `pipeline-video-agente` | Lyria 3.5 / Flow Music existem (citados como exemplo) | sem divergência — workflow autoral | blog.google (Lyria 3.5), deepmind.google/models/lyria |
| `avaliar-ferramenta-ia` | framework cético (sem claims de terceiros) | sem divergência — framework autoral; já exige docs oficiais na fase 2 | — |
| `auditar-skills` | framework de scorecard (sem claims de terceiros) | sem divergência — framework autoral | — |
| `ZfpYVS7oG6A` → candidata `a2a-interoperability` | A2A = protocolo aberto agente→agente, complementar ao MCP, sob a Linux Foundation (antes Google) | claim do vídeo confirmado; anotar em qualquer skill que cite A2A: MCP conecta agente a ferramentas; A2A conecta agentes entre si (peer-to-peer) | a2a-protocol.org, github.com/google/A2A, developers.googleblog.com (anúncio 2025-04-09), learn.microsoft.com/en-us/agents/architecture/multi-agent-patterns |
| `ZfpYVS7oG6A` → candidata `12-factor-agents` | 12 fatores para LLM apps confiáveis em produção (own your context window, tools = structured outputs, small focused agents, stateless reducer...) | claim do vídeo confirmado; humanlayer/12-factor-agents é o framework de referência (não é padrão oficial, é comunidade) | github.com/humanlayer/12-factor-agents |
| `0I83GmuUjDI` → `roteamento-modelos-gratuitos` | 9router existe e faz fallback automático por status HTTP (429/402/404/410 → `shouldFallback:true`); combo = lista ordenada de modelos no SQLite, ordem = precedência, sem restart (router relê o banco por request); erros embutidos com HTTP 200 (ex.: qoder `403 code 115`) NÃO disparam fallback → manter por último | claims do vídeo confirmados na instalação local real deste ambiente (2026-08-13): runbook `~/.config/opencode/9router-runbook.md` documenta providers (`gemini/*`, `groq/*`, `cbai/*`, `nvidia/*`), limites/resets, e o fix de combo; skill ancorada no comportamento verificado localmente, não apenas no vídeo | runbook local do 9router (estado real 2026-08-13) |