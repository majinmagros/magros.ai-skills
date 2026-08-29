# Oportunidades do YouTube — Relatório de Análise

Data: 2026-08-29  
Canais analisados: IndyDevDan, ColeMedin, SimonScrapes, AI Foundations, AI Jason, Maestros da IA, Attekita Dev, Sujeito Programador, AI Revolution PT, Inteligência Mil Grau, AI Code King, Claude Oficial, Nate Herk, Anwar Hermuche  
Transcrições baixadas e analisadas: **17 vídeos** (marcados em `ANALISADOS.json` de cada canal)

---

## Resumo das Oportunidades Identificadas

| # | Vídeo (Canal) | Conceito Principal | Status | Skill Existente / Gap |
|---|---|---|---|---|
| 1 | **Intelligence EXPLOSION: Harness Engineering with Pi Agent** (IndyDevDan) | Fusion Harness: multi-model orchestration (architect + builders), debate/collaborate modes, cost-aware model routing, software factory concept | ✅ **NOVO** | Gap: `agent-harness-construction` cobre parte; falta skill para **multi-model debate/collab workflow** + **software factory orchestration** |
| 2 | **Watch This If Your Coding Agent is Ignoring Your Rules — You Need Hooks** (ColeMedin) | Hooks como garantias determinísticas (stop, pre-tool-use, post-tool-use); auditoria de rules → hooks; `/hooks create` skill; exit codes 0/2; security (.env block), test enforcement, context injection | ✅ **NOVO** | **Coberto parcialmente** por `hookify-rules` + `agent-guardrails`; gap: **skill prática de migração rules→hooks + templates prontos** |
| 3 | **37 Cheat Codes to Level Up In Claude Code** (SimonScrapes) | 37 dicas práticas: simple English skill, stop slop, caveman, concise output, keyboard shortcuts (Ctrl+R/S/T/G/O/B), rewind vs compact, session rename/resume/teleport, CC usage, recap, quick answer, plan mode clear context, path-specific claude.md, HTML comments, prompt-for-next-session, skill stacking (5 levels), skill description triggers/anti-triggers, Claude Design vs front-end skill, permissions mid-session, image annotation, memory import, scheduled tasks | ✅ **NOVO** | Vários cobertos: `plain-language-response`, `multi-perspective-convergence`, `strategic-compact`, `routines`, `unified-memory`; gaps: **skill de atalhos/keyboard shortcuts**, **skill description optimizer**, **scheduled tasks in project context** |
| 4 | **19 Claude Code Mistakes "Pro" Users Are Still Making** (SimonScrapes) | Personas don't work (tested 162); stop "do not X" → "do Y"; routine tool access; MCP tool search on demand; skill sync Code↔Code Work; sub-agents 7x tokens; fast mode API credits trap; hidden context (don't edit claude.md mid-session); claude.md short (300-350 words); sub-agent context isolation; auto-compact fixed tokens not %; large context degrades retrieval (1M tokens = 76%); compaction granularity (summarize up to here); Ctrl+G edit plan in VS Code; cheaper model cache rebuild costs; verification layers (inline → /goal → stop hooks → adversarial reviewer); resume cleanup period; /doctor /insights /btw /branch | ✅ **NOVO** | Cobertos: `strategic-compact`, `verification-loop`, `context-budget`, `retomar-sessao`, `unified-memory`; gaps: **sub-agent cost optimizer**, **fast mode guardrail**, **claude.md length auditor**, **compaction granularity skill** |
| 5 | **Automate Any Workflow in Your Business Using Claude** (AI Foundations) | Skills = SOPs automatizadas; anatomia skill (skill.md + references + scripts); connectors (Gmail, Drive, Notion, Zoom, 2000+); tool permissions granular; skill com tool use (Google Drive upload); schedule skills; business audit tool (AI discovery) | ✅ **NOVO** | Cobertos: `criar-skill`, `mcp-server-patterns`, `routines`, `google-workspace-ops`; gap: **skill de business process audit → skill candidates** |
| 6 | **Full 'Buzz' AI Agents Tutorial** (AI Foundations) | Buzz workspace: VPS deployment (Hostinger), identity keys, agent hiring (name, model, instructions), agent teams, channels, inbox triage, memory per agent, multi-agent handoff, 24/7 operation | ✅ **NOVO** | **Coberto** por `buzz-workspace-teaming` (materializado anteriormente) |
| 7 | **I don't prompt agents anymore...** (AI Jason) | Graph engineering = control graphs (LangGraph, dynamic workflow, SOP); three graph types: control flow, knowledge graph, graph of loops; modern harness primitives (agent, sub-agents, pipelines, parallel, hooks, bash scripts); two enforcement methods: code-as-graph (dynamic workflow) vs LLM-as-graph (skill + SOP); design patterns: separate verifier/planner nodes, code for deterministic steps, define I/O schemas, state via markdown + append-only log; examples: daily bad design triage, ship change workflow | ✅ **NOVO** | **Coberto parcialmente** por `engenharia-de-grafos`, `graph-engineering`, `dynamic-workflow-mode`, `agent-harness-construction`; gap: **skill unificada "Graph Engineering Patterns" com templates code-as-graph + LLM-as-graph** |
| 8 | **OpenAI Is Sinking: End of ChatGPT/Codex?** (Maestros da IA) | Análise financeira OpenAI (receita vs custo, vesting, buyback, circular funding); Anthropic lidera receita/modelos; China catching up; GPT-2 "too dangerous" parallel | ⚠️ **Notícia/Análise** | Não actionable como skill |
| 9 | **The Skill Workflow That Makes AI Program Like a Real Engineer** (Attekita Dev) | Spec Driven Development + Grilling (Grill + Grill with Docs); skills pack: setup → grill → to-spec → to-tickets → implement (TDD); grilling extrai requisitos implícitos; otimização de contexto por ticket; skills internas (TDD, code review) | ✅ **NOVO** | **Coberto** por `grilling` + `grill-with-docs` + `clarificar` + `tdd-workflow` + `convergencia`; gap: **skill pack integrado "Spec Driven Development Kit"** |
| 10 | **I Built an MCP Server from Scratch in TypeScript** (Sujeito Programador) | MCP server types: resources, tools, prompts; stdio (local) vs streamable HTTP (remote); Zod validation; cloud mcp add cmd; transport STDIo vs HTTP; persistência (SQLite, API) | ✅ **NOVO** | **Coberto** por `mcp-server-patterns` |
| 11 | **O primeiro sistema operacional totalmente baseado em IA** (AI Revolution PT) | AI OS concept: agentic OS, persistent agents, scheduled tasks | ⚠️ **Conceitual** | **Coberto** por `autonomous-agent-harness`, `agentic-os` |
| 12 | **Nova IA supera as melhores do mercado** (AI Revolution PT) | Model comparison, new model releases | ⚠️ **Notícia** | Não actionable |
| 13 | **NEW Anthropic MCP Brings Robots/Arduino** (Inteligência Mil Grau) | MCP para hardware/robótica; scientific research automation | 🔍 **Pesquisar** | Gap: **MCP para hardware/IoT/Arduino** (não coberto) |
| 14 | **NEW Qwen 3.8 Flash Tested** (Inteligência Mil Grau) | Local model benchmarking, context window issues | 🔍 **Benchmark** | Gap: **local model eval harness** (parcial em `benchmark-optimization-loop`) |
| 15 | **NEW Cursor Origin in Beta / Ox Alpha** (Inteligência Mil Grau) | New agent tools, OpenRouter records | 🔍 **Monitorar** | Não actionable ainda |
| 16 | **Herdr (AI Agent Multiplexer)** (AI Code King) | Open source agent multiplexer, multiple agents management | 🔍 **Pesquisar** | Gap: **agent multiplexer/orchestrator skill** |
| 17 | **Claude for Word / Chrome Side Panel** (Claude Oficial) | Product features: Word integration, Chrome side panel (Cowork) | ⚠️ **Produto** | Não actionable |
| 18 | **I Tested Claude Code vs Codex on Design** (Nate Herk) | Side-by-side benchmark: 8 sites, same prompts; Codex wins 7/8 on design, 3-5x faster, 3-5x cheaper, 1/5 tokens; sub-agents: Claude 4 vs Codex 1; specificity eliminates variance; skill para scroll animations | ✅ **NOVO** | Gap: **agent eval harness para design/code generation** (parcial em `agent-eval`); **skill de design system prompting** |
| 19 | **Graph Engineering explicado** (Anwar Hermuche) | Graph engineering, multiple agent orchestration, loop engineering | 🔍 **Pesquisar** | **Coberto** por `engenharia-de-grafos` + `graph-engineering` |
| 20 | **Como se TORNAR um ENGENHEIRO de IA em 2026** (Anwar Hermuche) | Career path, skills roadmap | ⚠️ **Educação** | Gap: **skill de career/learning path para AI Engineer** |

---

## Oportunidades Prioritárias (Gap Real vs Skills Existentes)

### 🔴 ALTA PRIORIDADE — Gaps não cobertos

| Oportunidade | Descrição | Skill(s) Relacionada(s) | Ação Sugerida |
|---|---|---|---|
| **Multi-Model Debate/Collab Harness** | Fusion Harness: architect + builders, debate rounds, collaboration workflow, cost tracking per model | `agent-harness-construction`, `engineering-de-grafos` | Criar skill `fusion-harness` ou estender `agent-harness-construction` |
| **Rules → Hooks Migration Toolkit** | Auditoria automatizada de CLAUDE.md/AGENTS.md → extrair processes → gerar hooks (stop, pre-tool-use, post-tool-use) com templates | `hookify-rules`, `agent-guardrails` | Criar skill `rules-to-hooks-auditor` |
| **Graph Engineering Patterns Unificado** | Templates para code-as-graph (dynamic workflow) + LLM-as-graph (skill + SOP + scripts); I/O schemas, state management, verifier/planner separation | `engenharia-de-grafos`, `graph-engineering`, `dynamic-workflow-mode` | Criar skill `graph-engineering-patterns` |
| **Agent Eval Harness para Design/Code** | Benchmark side-by-side (Claude vs Codex vs outros): design quality, tokens, cost, time, sub-agent count; skill para scroll animations | `agent-eval`, `benchmark-optimization-loop` | Estender `agent-eval` com critérios de design |
| **Sub-Agent Cost Optimizer** | Detectar quando sub-agents 7x tokens; sugerir main context vs fork; fast mode guardrail (API credits, uncached penalty) | `cost-aware-llm-pipeline`, `context-budget` | Criar skill `sub-agent-cost-guard` |
| **Claude.md Length & Structure Auditor** | `/doctor` automation: medir linhas/palavras, sugerir trims, path-specific rules, HTML comments, prompt-for-next-session | `context-budget`, `strategic-compact` | Estender `context-budget` ou criar `claude-md-auditor` |
| **MCP para Hardware/IoT/Arduino** | MCP server pattern para dispositivos físicos (Arduino, robôs, sensores) | `mcp-server-patterns` | Criar skill `mcp-hardware-arduino` |
| **Software Factory Orchestration** | Out-loop agentic coding: agents + code, variants of SDLC, software factory concept (IndyDevDan) | `autonomous-agent-harness`, `agentic-os`, `engineering-de-grafos` | Criar skill `software-factory-orchestrator` |

### 🟡 MÉDIA PRIORIDADE — Extensões de skills existentes

| Oportunidade | Descrição | Skill Base | Ação |
|---|---|---|---|
| **Spec Driven Development Kit** | Pack integrado: `grilling` → `clarificar` → `to-spec` → `to-tickets` → `implement` (TDD) + `convergencia` | `grilling`, `grill-with-docs`, `clarificar`, `tdd-workflow`, `convergencia` | Criar módulo/orquestrador `spec-driven-dev-kit` |
| **Keyboard Shortcuts Cheatsheet Skill** | Skill que ensina/lembra atalhos Ctrl+R/S/T/G/O/B, Ctrl+A/W, Option+T, /focus, /config | `criar-skill` (como reference) | Adicionar `references/claude-code-shortcuts.md` em skill existente |
| **Skill Description Optimizer** | Valida triggers/anti-triggers/description length; evita conflitos de ativação | `criar-skill`, `skill-comply` | Criar skill `skill-description-optimizer` |
| **Scheduled Tasks in Project Context** | Routines com acesso ao contexto do projeto (Buzz/Code Work style) | `routines`, `autonomous-agent-harness` | Estender `routines` |
| **Local Model Eval Harness** | Benchmark modelos locais (Qwen, GLM, etc.): context window, thinking time, MoE vs dense | `benchmark-optimization-loop` | Estender com presets de modelos locais |

### 🟢 BAIXA PRIORIDADE — Monitoramento / Já coberto

| Oportunidade | Status |
|---|---|
| Buzz Workspace Teaming | ✅ Materializado em `buzz-workspace-teaming` |
| MCP Server Patterns | ✅ Materializado em `mcp-server-patterns` |
| Autonomous Agent Harness | ✅ Materializado em `autonomous-agent-harness` / `agentic-os` |
| Engenharia de Grafos | ✅ Materializado em `engenharia-de-grafos` + `graph-engineering` |
| Model Routing (cheap/free tiers) | ✅ Materializado em `roteamento-modelos-baratos` + `roteamento-modelos-gratuitos` |
| Verification Layers | ✅ Materializado em `verification-loop` + `agent-guardrails` |
| Context Budget / Compaction | ✅ Materializado em `context-budget` + `strategic-compact` |
| Unified Memory / Session Resume | ✅ Materializado em `unified-memory` + `retomar-sessao` |

---

## Próximos Passos

1. **Criar skills de alta prioridade** (ordem sugerida):
   - `rules-to-hooks-auditor` (impacto imediato, usa `hookify-rules` + `agent-guardrails`)
   - `fusion-harness` ou estender `agent-harness-construction` (core do IndyDevDan)
   - `graph-engineering-patterns` (unifica code-as-graph + LLM-as-graph)
   - `sub-agent-cost-guard` (economia direta de tokens)
   - `claude-md-auditor` (extensão de `context-budget`)

2. **Validar claims contra docs oficiais** antes de materializar:
   - Fusion Harness: verificar se existe repo público do IndyDevDan
   - Graph engineering patterns: conferir `dynamic-workflow-mode` API atual
   - MCP hardware: verificar `modeltextprotocol.io` para transportes

3. **Atualizar `manifests/install-modules.json`** ao criar cada skill (módulo `framework-language`)

4. **Regenerar catálogo**: `node scripts/build-catalog.js`

5. **Rodar CI**: `node scripts/ci/validate-no-personal-paths.js`

---

## Vídeos Pendentes (matches_filtro: true, ainda não baixados)

- **Matthew Berman**: `0RqTLAeaVMM` (OpenAI Hack)
- **Gabriel Adamuchi**: 8+ vídeos (OMNIROUTE, Seedance, Codex Micro, Kimi K3, Fable 5, etc.)
- **Anwar Hermuche**: 30+ vídeos (Graph Engineering, AI Engineer roadmap, MCP Architecture, RAG, LangChain, Fine-tuning, etc.)
- **Inteligência Mil Grau**: 2 vídeos sem transcrição (`GsOBxTQ3O98`, `t1l6TniJlGE`)
- **AI Revolution PT**: 2 vídeos sem transcrição (`Scymli-lgcU`, `ls4ddUmiZkw`)

> **Nota**: Rate limit 429 do YouTube está forte. Recomenda-se aguardar algumas horas e rodar `download-missing.cjs` em lotes pequenos (5-10 por vez) com backoff exponencial.