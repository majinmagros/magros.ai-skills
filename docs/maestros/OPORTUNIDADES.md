# Oportunidades do YouTube — Relatório de Análise

Data: 2026-09-01  
Canais analisados: IndyDevDan, ColeMedin, SimonScrapes, AI Foundations, AI Jason, Maestros da IA, Attekita Dev, Sujeito Programador, AI Revolution PT, Inteligência Mil Grau, AI Code King, Claude Oficial, Nate Herk, Anwar Hermuche, **Gustavo Campelo (@gucampelo)**, **Joy Dev Studio (@joydevstudio)**, **Luciana Papini (@LucianaPapini)**, **Karine Lago (@KarineLago)**, **Pavan Adhav (@pavanadhav)**  
Transcrições baixadas e analisadas: **42 vídeos** (marcados em `ANALISADOS.json` de cada canal + state centralizado `state/yt-control.json`)

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
| 21 | **Dessa Forma Crio Sites 3D Interativos com IA** (Gustavo Campelo - @gucampelo) | Pipeline completo: referências → img2threejs (blocos individuais) → composição Three.js → GSAP ScrollTrigger → deploy Hostinger/Vite; elemento-por-elemento, constants para customização, shader pixelation, responsivo | ✅ **NOVO** | **Parcialmente coberto**: `img2threejs` + `gsap-skills` + `motion-design-skill`; **gaps**: **threejs-scene-composer** (composição modular), **threejs-deploy-pipeline** (Vite+Hostinger), **threejs-shader-effects** (pixelation, mouse distortion), **threejs-responsive-patterns**, **threejs-config-constants**, **threejs-voxel-block-system** |
| 22 | **Criando um Site 3D Animado do ZERO — Three.js + GSAP (Projeto Completo ao Vivo!)** (Gustavo Campelo - @gucampelo) | Live tutorial: HTML/CSS/JS estrutura → Three.js cena + lighting/camera → GSAP ScrollTrigger animações scroll → responsivo + deploy Hostinger/Vite; Figma design reference, 100vh sections, GSAP timeline, ScrollTrigger pin/scrub | ✅ **NOVO** | **Parcialmente coberto**: `img2threejs` + `gsap-skills` + `motion-design-skill` + `threejs-scene-composer`; **reforça gaps**: **threejs-deploy-pipeline**, **threejs-responsive-patterns**, **threejs-config-constants** |
| 23 | **3D Face Modeling is a THING OF THE PAST! ChatAvatar - Hyper3D Rodin + MetaHuman UE 5.7** (Joy Dev Studio - @joydevstudio) | Pipeline completo: ChatAvatar (Hyper3D Rodin) text-to-face/image-to-3D → prompt engineering com weights/seeds → Blender prep (FBX export) → MetaHuman Identity Solve (auto-rig, eye alignment) → Body setup → Animation retarget (ABP mannequin → MetaHuman) → UE 5.7 BP setup (camera, movement, virtual bones foot locking) | ✅ **NOVO** | **Parcialmente coberto**: `img2threejs` + `motion-design-skill`; **gaps críticos**: **hyper3d-rodin-pipeline**, **metahuman-identity-pipeline**, **metahuman-to-unreal-pipeline**, **metahuman-animation-retarget**, **hyper3d-rodin-api**, **metahuman-unreal-blueprint** |
| 24 | **Me de 34 minutos e eu te darei 10 000 horas de conhecimento do Claude** (Luciana Papini - @LucianaPapini) | Guia completo uso profissional do Claude: setup conta (email, memory import, model routing), skills (creator, patterns), projects (organization), connectors (Gmail, Calendar, Drive, 2000+), Chrome extension (browser automation), Cowork (task execution, file ops), Cloud Code (VPS, custom tools), Cloud Design (prototyping); evolução chat→conectores→Chrome→Cowork→Code→Design | ✅ **NOVO** | **Parcialmente coberto**: `criar-skill`, `mcp-server-patterns`, `routines`, `roteamento-modelos-baratos`, `google-workspace-ops`, `browser-qa`, `autonomous-agent-harness`, `orch-build-mvp`, `frontend-design-direction`; **gaps críticos**: **claude-account-optimizer**, **memory-import-workflow**, **claude-model-router**, **skill-creator-methodology**, **claude-project-template**, **claude-connector-strategy**, **claude-chrome-automation**, **claude-cowork-patterns**, **cloud-code-vps-deploy**, **cloud-code-internal-tools**, **cloud-design-prototyping**, **claude-voice-workflow** |
| 25 | **Learn 85% of Claude in under 23 minutes** (Karine Lago - @KarineLago) | Resumo rápido das 10 dicas mais impactantes do vídeo longo: email strategy, memory import, model routing, skills, projects, connectors, Chrome extension, Cowork, Cloud Code (VPS), Cloud Design | ✅ **NOVO** | **Parcialmente coberto**: `claude-account-optimizer`, `memory-import-workflow`, `claude-model-router`, `skill-creator-methodology`, `claude-project-template`, `claude-connector-strategy`, `claude-chrome-automation`, `claude-cowork-patterns`, `cloud-code-vps-deploy`, `cloud-code-internal-tools`, `cloud-design-prototyping`, `claude-voice-workflow` |
| 26 | **The NEW n8n assistant builds automations in seconds** (Karine Lago - @KarineLago) | n8n AI assistant que cria automações em segundos: conecta APIs, configura workflows, usa IA para sugerir nodes e conexões | ✅ **NOVO** | **Gap**: **n8n-ai-assistant** (skill para automação n8n com IA) |
| 27 | **How I Would Learn AI Today: A Beginner's Guide** (Karine Lago - @KarineLago) | Guia completo para iniciantes em IA: roadmap de aprendizado, ferramentas essenciais, projetos práticos, carreira em IA | ✅ **NOVO** | **Gap**: **ai-learning-roadmap** (skill para roadmap de aprendizado em IA) |
| 28 | **Creating n8n Automations with Claude (EASY)** (Karine Lago - @KarineLago) | Tutorial: cria automações n8n usando Claude Code: conecta APIs, configura webhooks, processa dados, deploy | ✅ **NOVO** | **Coberto parcialmente**: `n8n-agentic-flows`, `mcp-server-patterns`; gap: **claude-n8n-automation** |

---

## Oportunidades Prioritárias (Gap Real vs Skills Existentes)

### 🔴 ALTA PRIORIDADE — Gaps não cobertos

| Oportunidade | Descrição | Skill(s) Relacionada(s) | Ação Sugerida |
|---|---|---|---|
| **threejs-scene-composer** | Composição modular de cenas Three.js: blocos, iluminação, câmera, física, animações — pipeline modular estilo "elemento por elemento" do vídeo | `img2threejs`, `three.js` docs | Criar skill `threejs-scene-composer` |
| **threejs-deploy-pipeline** | Pipeline deploy 3D site: Vite build → zip → Hostinger/Netlify/Vercel → CI/CD automático | `vite-patterns`, `deployment-patterns` | Criar skill `threejs-deploy-pipeline` |
| **threejs-shader-effects** | Efeitos customizados: pixelation, comet trails, mouse distortion, post-processing, shadertoy integration | `three.js` examples, `motion-advanced` | Criar skill `threejs-shader-effects` |
| **threejs-responsive-patterns** | Patterns responsivos 3D: mobile/desktop, touch vs mouse, performance scaling, LOD | `three.js` docs, `motion-advanced` | Criar skill `threejs-responsive-patterns` |
| **threejs-config-constants** | Sistema de constants expostas para tuning: posição câmera, elevação, centro portal, velocidades — sem tocar código | `motion-design-skill` patterns | Criar skill `threejs-config-constants` |
| **threejs-voxel-block-system** | Sistema modular blocos estilo Minecraft: registry, geometries, materials, instancing, instanced mesh | `img2threejs`, `three.js` instancing | Criar skill `threejs-voxel-block-system` |

| **hyper3d-rodin-pipeline** | Pipeline completo ChatAvatar/Rodin: text-to-face, image-to-3D, prompt engineering com weights/seeds, seed control, model versions (DreamFace v1/v2, cartoon, hero), download formats (FBX/GLB/USDZ), MetaHuman/Studio export | `img2threejs`, `threejs-scene-composer`, `api-connector-builder` | Criar skill `hyper3d-rodin-pipeline` |
| **metahuman-identity-pipeline** | MetaHuman Identity Solve: photo requirements, marker placement, eye texture importance, auto-rigging, eye/mouth correction, neutral pose | `threejs-scene-composer`, `motion-design-skill` | Criar skill `metahuman-identity-pipeline` |
| **metahuman-to-unreal-pipeline** | Export FBX (Blender) → MetaHuman Identity → Body setup → Animation retarget → UE5 BP setup (camera, movement, virtual bones foot locking) | `threejs-deploy-pipeline`, `unreal-patterns` | Criar skill `metahuman-to-unreal-pipeline` |
| **metahuman-animation-retarget** | Retarget ABP mannequin → MetaHuman: animation blueprint copy, virtual bones (vbot, vbfk, vbik_fot, vbkf_r/l), foot locking | `motion-design-skill`, `unreal-animation-patterns` | Criar skill `metahuman-animation-retarget` |
| **hyper3d-rodin-api** | API/credits system, model versions (DreamFace v1/v2, cartoon, hero), download formats (FBX/GLB/USDZ), MetaHuman/Studio export, credit optimization strategies | `api-connector-builder`, `cost-aware-llm-pipeline` | Criar skill `hyper3d-rodin-api` |
| **metahuman-unreal-blueprint** | BP setup: camera spring arm, movement copier, animation retarget, virtual bones (vbot, vbik_fot, vbkf_r/l), foot locking, MetaHuman BP assignment | `unreal-patterns`, `motion-design-skill` | Criar skill `metahuman-unreal-blueprint` |
| **Rules → Hooks Migration Toolkit** | Auditoria automatizada de CLAUDE.md/AGENTS.md → extrair processes → gerar hooks (stop, pre-tool-use, post-tool-use) com templates | `hookify-rules`, `agent-guardrails` | Criar skill `rules-to-hooks-auditor` |
| **Graph Engineering Patterns Unificado** | Templates para code-as-graph (dynamic workflow) + LLM-as-graph (skill + SOP + scripts); I/O schemas, state management, verifier/planner separation | `engenharia-de-grafos`, `graph-engineering`, `dynamic-workflow-mode` | Criar skill `graph-engineering-patterns` |
| **Agent Eval Harness para Design/Code** | Benchmark side-by-side (Claude vs Codex vs outros): design quality, tokens, cost, time, sub-agent count; skill para scroll animations | `agent-eval`, `benchmark-optimization-loop` | Estender `agent-eval` com critérios de design |
| **Sub-Agent Cost Optimizer** | Detectar quando sub-agents 7x tokens; sugerir main context vs fork; fast mode guardrail (API credits, uncached penalty) | `cost-aware-llm-pipeline`, `context-budget` | Criar skill `sub-agent-cost-guard` |
| **Claude.md Length & Structure Auditor** | `/doctor` automation: medir linhas/palavras, sugerir trims, path-specific rules, HTML comments, prompt-for-next-session | `context-budget`, `strategic-compact` | Estender `context-budget` ou criar `claude-md-auditor` |
| **MCP para Hardware/IoT/Arduino** | MCP server pattern para dispositivos físicos (Arduino, robôs, sensores) | `mcp-server-patterns` | Criar skill `mcp-hardware-arduino` |
| **Software Factory Orchestration** | Out-loop agentic coding: agents + code, variants of SDLC, software factory concept (IndyDevDan) | `autonomous-agent-harness`, `agentic-os`, `engineering-de-grafos` | Criar skill `software-factory-orchestrator` |
| **claude-account-optimizer** | Otimização de conta Claude: email strategy, memory import workflow, model routing rules, project templates, connector defaults | `criar-skill`, `routines`, `roteamento-modelos-baratos`, `google-workspace-ops` | Criar skill `claude-account-optimizer` |
| **memory-import-workflow** | Workflow padronizado: export memory → prompt interview → voice input (Sponcle) → validate → sync across sessions | `criar-skill`, `mcp-server-patterns`, `routines` | Criar skill `memory-import-workflow` |
| **claude-model-router** | Estratégia de roteamento: Sonet (diário), Opus/Fable (complexo), swap mid-task, cost tracking per task | `roteamento-modelos-baratos`, `cost-aware-llm-pipeline`, `context-budget` | Criar skill `claude-model-router` |
| **skill-creator-methodology** | Metodologia Skill Creator: detectar repetição → documentar → criar → testar → versionar → share | `criar-skill`, `skill-description-optimizer`, `skill-comply` | Criar skill `skill-creator-methodology` |
| **claude-project-template** | Templates de projeto por tipo: curso, cliente, produto, automação, pesquisa — com docs, instructions, connectors | `criar-skill`, `project-flow-ops`, `google-workspace-ops` | Criar skill `claude-project-template` |
| **claude-connector-strategy** | Guia de conectores: priorização (Gmail/Calendar/Drive/Notion), MCP vs nativo, permissions granulares, OAuth flow | `mcp-server-patterns`, `google-workspace-ops`, `api-connector-builder` | Criar skill `claude-connector-strategy` |
| **claude-chrome-automation** | Padrões Chrome Ext: navegação autônoma, scraping ético, pesquisa multi-aba, preenchimento, approval gates | `browser-qa`, `mcp-server-patterns`, `automacao-deterministica` | Criar skill `claude-chrome-automation` |
| **claude-cowork-patterns** | Cowork patterns: file org (duplicates, categorization), task execution, recurring tasks, folder processing, approval gates | `routines`, `autonomous-agent-harness`, `data-throughput-accelerator` | Criar skill `claude-cowork-patterns` |
| **cloud-code-vps-deploy** | Deploy Cloud Code em VPS (Hostinger KVM1, DigitalOcean, AWS): code-cloud app, web console, IDE integration, web console | `deployment-patterns`, `vps-setup`, `vps-ssh-automation` | Criar skill `cloud-code-vps-deploy` |
| **cloud-code-internal-tools** | Building internal tools: planilha→app, relatórios automatizados, dashboards, internal APIs, planilha→API | `orch-build-mvp`, `agent-harness-construction`, `data-throughput-accelerator` | Criar skill `cloud-code-internal-tools` |
| **cloud-design-prototyping** | Cloud Design workflow: idea→prototype→iterate→export, mobile/desktop, design system, component library | `frontend-design-direction`, `motion-design-skill`, `design-system` | Criar skill `cloud-design-prototyping` |
| **claude-voice-workflow** | Voice input workflow: Sponcle/Whisper → transcrição → prompt engineering → Cloud, audio tips, interview patterns | `voice-cloning-local`, `criar-skill`, `prompt-builder` | Criar skill `claude-voice-workflow` |

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
- **Joy Dev Studio (@joydevstudio)**: 28+ vídeos (Hyper3D Rodin, MetaHuman, Unreal Engine, 3D modeling AI, Rodin API, Blender prep, UE5 MetaHuman pipeline) — apenas 1 baixado (`J2LkNI2MzKM`)
- **Luciana Papini (@LucianaPapini)**: 5 vídeos (canal tem 6 vídeos total, 1 analisado) — foco em automação, Claude, workflows, produtividade
- **Karine Lago (@KarineLago)**: 78 vídeos relevantes (canal tem 286 total, 4 analisados) — foco em automação, Claude, n8n, IA, desenvolvimento, Three.js, GSAP, web design, Unreal Engine, Power BI, Excel

> **Nota**: Rate limit 429 do YouTube está forte. Recomenda-se aguardar algumas horas e rodar `download-missing.cjs` em lotes pequenos (5-10 por vez) com backoff exponencial.

---

## Nova Análise — Maestros da IA (2026-08-31)

| # | Vídeo (Canal) | Conceito Principal | Status | Skill Existente / Gap |
|---|---|---|---|---|
| 29 | **Jack Dorsey's Buzz AI: How It Works and How to Use It** (Maestros da IA) | Buzz workspace: chat equipe humanos+agentes, identidade, permissões, Git nativo, delegação autônoma, VPS 24/7, multi-model (Cloud Code, Codex, OpenRouter, Hermes) | ✅ **Analisado** | **Coberto** por `buzz-workspace-teaming` |
| 30 | **How to Become a Genius with AI** (Maestros da IA) | AI Tutor personalizado: currículo adaptativo + aulas multimodais (texto/imagem/podcast/vídeo) + Feynman + flashcards + repetição espaçada + progress tracking + NotebookLM + fontes acadêmicas (Harvard/MIT) | 🆕 **NOVA SKILL** | **Gap real**: `ai-tutor-system` — pipeline completo de tutoria IA multimodal |
| 31 | **Ranking of the Best AI Models** (Maestros da IA) | Benchmarks práticos (web dev, escrita, 3D, coding, agentic) + custo/benefício (GPT 5.6 Sol 1/5 preço Opus) + modelos chineses competitivos + tese: **harness > modelo** | ✅ **Analisado** | **Coberto** por `llm-leaderboard-tracker`, `benchmark-*`, `agent-harness-construction`, `roteamento-modelos-baratos` |

---

## Nova Análise — Gustavo Campelo (@gucampelo) (2026-09-01)

| # | Vídeo | Conceito Principal | Status | Skill Existente / Gap |
|---|---|---|---|---|
| 32 | **O comando /design do Cloud Code** (M7ie0MRsmsk) | Cloud Design `/design` command: canvas interativo com 3 opções de estilo, edição manual + prompts, integração com skills (frontend design) | ✅ **Analisado** | **Coberto**: `frontend-design-direction`, `workflows`; **Gap**: `cloud-design-prototyping` (não existe) |
| 33 | **How to Turn Books into SKILLS** (XJOMq3KlzSE) | Book-to-Skill: transforma PDFs/livros em skills consultáveis, fragmentação inteligente, 50x menos tokens, cidades 3D de conceitos | ✅ **Analisado** | **Coberto**: `book-to-skill`, `agent-harness-construction` |
| 34 | **Chinese AIs Have Reached the Top** (npVm4tBalp8) | Roundup modelos chineses gratuitos: Qwen 3.8 Max (grátis no chat), Qwen 3 TTS (voice clone local), Qwen Image 3.0 (texto em imagem), Minimax H3 (vídeo+áudio), Seedance 2.5 (Dreamina), GLM 4.8 (2.8T params, #1 frontend arena) | ✅ **Analisado** | **Coberto**: `deployment-patterns`, `benchmark`, `llm-leaderboard-tracker`, `agent-harness-construction`, `voice-cloning-local` |

---

## Nova Análise — Pavan Adhav (@pavanadhav) (2026-09-01)

| # | Vídeo | Conceito Principal | Status | Skill Existente / Gap |
|---|---|---|---|---|
| 35 | **HyperFabric Contract Creation Part 1** (0ZSFOAyb5Og) | Blockchain HyperFabric: criação de contratos on-chain, PDF → S3 + hash no ledger, NanoID, estado atual no CouchDB | ✅ **Analisado** | **Coberto**: `buzz-workspace-teaming` (parcial - blockchain patterns) |
| 36 | **Custom Hyperledger Fabric Network Code Generator** (4tXGpabPRsE) | Ferramenta web: gera boilerplate completo Hyperledger Fabric (CA, peers, orderers, canais, chaincode, Explorer, Caliper, API Node.js) | ✅ **Analisado** | **Coberto**: `deployment-patterns`, `benchmark`; **Gap**: `hyperledger-fabric-generator` (blockchain scaffolding) |
| 37 | **Payment Gateway Integration Stripe** (-Pz6rEVuw9Q) | Stripe + ngrok webhook: payment intent, webhook signature validation, test cards, eventos (payment_intent.succeeded, charge.succeeded) | ✅ **Analisado** | **Coberto**: `agent-harness-construction`; **Gap**: `ai-tutor-system` (referência a Anki/flashcards no vídeo), `stripe-webhook-handler` |
| 38 | **Payment Gateway Integration Razorpay** (zPDh4OSuBTU) | Razorpay integration: similar ao Stripe, webhooks, validação de assinatura | ✅ **Analisado** | **Coberto**: patterns similares ao Stripe |
| 39 | **The Skill That Forcefully Fixes Any Lazy AI** (8fAuXr8fQBo) | Unlazy (anti-preguiça) + Capricho (versão aprimorada): Depth Tree, gates ledger `.outline/GATES.md` com CHECK/EXPECT/EVIDENCE, solo (tree ≤3) vs orquestrado (tree 4+ com dispatch.json), Stop hook bloqueia done até gates OK, honest ABANDON vs silent narrowing; Capricho adiciona quality gate visual + report forçado (transcript l.517-589). Tests: tabela, jogo, kanban, landing, desktop, galáxia, pano+esfera, cardume — Capricho vence 5/8, custo $52→$69, tempo <2h paralelo | ✅ **Analisado 2026-09-02** | **Gap real**: `unlazy` (public Leonxlnx/unlazy MIT, `npx skills add`) + `capricho` (exclusiva Maestros, sem repo público) — nenhuma existe no inventário; relacionadas: `tdd-workflow`, `verification-loop`, `agent-harness-construction` mas nenhuma com ledger executável |
| 40 | **How to Validate Any Business Idea in 24 Hours Using AI** (IbECGYRDd_w) | Framework validação 24h: ideia→dor→cliente ideal→scrape App Store/Play Store (avaliações, reclamacoes, concorrentes, brechas) → swarm 100 subagentes personas (compradores sintéticos) com nota/opinião → veredito GO/KILL/PIVOT + PDF + iteração por oferta; distinção produto vs oferta (multidão faminta, risco reverso), validação por comportamento de compra (checkout) não intenção (waitlist) | ✅ **Analisado 2026-09-02** | **Parcialmente coberto** por `triagem-ideias` (5 fases GO/KILL) e `agentic-engineering`; **Gap**: `validacao-ideia-24h` com App Store scraper + synthetic buyer swarm (100 agentes paralelos) |
| 41 | **Jack Dorsey's Buzz AI: How It Works and How to Use It** (DpiAtwZODnw) | Buzz workspace = Bring-Your-Own-Agent team chat + Relay/VPS/worktrees/signing/delegation; 9 personas (Caio, Davi, Kengi, Carol, Laura, Lia, Lisa, Nina, Zeca), per-agent harness routing, Hostinger KVM2 Docker + WSS, mobile QR, Playwright MCP + HTML report chain (15-20min) | ✅ **Analisado 2026-09-02** | **Parcialmente coberto** por `buzz-workspace-teaming` (22 linhas stub); **Gap**: deployment VPS, persona lib, channel topology, delegation chain — **enrich** skill existente |
| 42 | **How to Become a Genius with AI** (fVVo2sJMdvM) | Universidade de bolso: 3.000h = diploma, curva esquecimento, Bloom 2 sigma 98%, AI Tutor (currículo adaptativo + aulas multimodais NotebookLM + Feynman + flashcards FSRS + progress + multi-tutor) | ✅ **Analisado 2026-09-02** | **Coberto** por `ai-tutor-system` (8-stage pipeline já materializado deste vídeo) — **nenhum gap**, apenas enriquecer com gancho 3.000h + Bloom |
| 43 | **Ranking of the Best AI Models** (TdtbTbDrLKA) | Batalha 6 leaderboards (LiveBench, SWE-Bench, Artificial Analysis, WebDev/Terminal-Bench) + 5 tarefas práticas (frontend, escrita, 3D 3 spheres, coding, agentic) com LLM-as-judge + matriz custo/tempo/qualidade (harness>model) | ✅ **Analisado 2026-09-02** | **Parcialmente coberto** por `llm-leaderboard-tracker` + `agent-eval` + `roteamento-modelos-baratos`; **Gap**: workflow composto (snapshot 6 fontes + task suite 5 + cost matrix) — **enrich** 3 skills existentes |
| 44 | **4 AI Agents to Automate 99% of Your Life** (V1Fq4psulqU) | Framework 4C: Coordenação (Gmail/Calendar, 5-part prompt, 3 grupos, focus blocks), Criatividade (slides PPTX, design-system), Clareza (telescópio/microscópio, clause table), Conversa (voice role-play 1 pergunta, trainer feedback) | ✅ **Analisado 2026-09-02** | **Coberto** por `coordenacao` + `criatividade` + `clareza` + `conversa` (1:1) — **nenhum gap** |
| 45 | **How the World's Top AI Experts Are Using Claude** (eMkCr9bTBQQ) | Graph engineering: loops → graphs, isolated branches + independent verifier, orchestrator converge, UltraCode + /workflows, 3 canais YouTube paralelos (54k tokens/40s) | ✅ **Analisado 2026-09-02** | **Coberto** por `engenharia-de-grafos` (canonical) + `graph-engineering` + `sessoes-orquestradas` — **nenhum gap**, apenas adicionar demo UltraCode |
| 46 | **How to Make Money with AI (2026)** (GLHwx_1WRxk) | Solopreneur R$10k: venda>construção, 4 canais (tráfego pago Meta, prospecção VPS 24h, influencer, orgânico CAC negativo), funil fake-checkout 100 visitas, ROAS/CAC com tokens, automação por canal | ✅ **Analisado 2026-09-02** | **Parcial**: `validacao-ideia-24h` (swarm vs tráfego real), `lead-intelligence`, `criar-campanha-visual` — **enrich** `validacao-ideia-24h` + novo micro `aquisicao-vendas-ia-2026` |
| 47 | **Anthropic, OpenAI, and Google are in a PANIC...** (1p0HXLv_5wM) | 740B em 25GB (Colibri), Nvidia DGX Spark $3k local, Kimi K3 open-weights SOTA — cloud pay-to-play vs open/barato | ✅ **Analisado 2026-09-02** | **Gap**: `local-llm-efficiency` (GGUF/GPTQ/Colibri) + `local-ai-hardware` (DGX Spark) — nenhum cobre quantização genérica |
| 48 | **Create Vox-Style Videos from Scratch with Gemini Omni + Claude Code** (wLxlN7VgXXQ) | Vox factory: audio-first, word-sync, paper collage, GPT Image 2 + Gemini Omni + Seedance, `config.json` wizard, revise-before-animate | ✅ **Analisado 2026-09-02** | **Gap**: **novo** `vox-style-video` (paper craft + audio-timestamp pipeline) — coberto parcial por `video-editing`/`remotion` |
| 49 | **How to Gain Followers 100% on AUTOPILOT with AI** (TWfHFHxI6go) | Autopilot IG: Apify top 20% 24h → filtro marca → roteirista hook → HeyGen avatar + ElevenLabs → Remotion/FFmpeg → Metricool 3-trigger split (scrape/produce/post) | ✅ **Analisado 2026-09-02** | **Gap**: **novo** `autopilot-content-factory` (compõe Apify+HeyGen+Remotion) — atomos cobertos, fábrica não |
| 50 | **Harness Engineering: The Future of AI** (E1OUvFT2h0A) | Prompt→Context→Harness (Claude Code + Open Design + memory/brandbook + Vercel + PostHog + dual agents) — 7-step ladder, loop verification | ✅ **Analisado 2026-09-02** | **Coberto** por `agent-harness-construction` + `12-factor-agents` — **enrich** com ladder + loop screenshot |

---

### Atualização — Oportunidades Prioritárias (adicionar à tabela ALTA PRIORIDADE)

| Oportunidade | Descrição | Skill(s) Relacionada(s) | Ação Sugerida |
|---|---|---|---|
| **ai-tutor-system** | Pipeline tutor IA: nivelamento → currículo adaptativo → aulas multimodais (texto/imagem/áudio/vídeo via NotebookLM) → exercícios Feynman → flashcards (SM-2/FSRS) → repetição espaçada → progress tracking → multi-tutor por domínio → harness-agnóstico (Cloud Code, Codex, Antigravity, OpenRouter) | `content-engine`, `ai-media-generator`, `continuous-learning-v2`, `benchmark-methodology` | **Criar skill `ai-tutor-system`** — validar NotebookLM API, SM-2/FSRS, Anki format, Cloud Code/Codex agent configs, Qwen3-TTS/ElevenLabs para podcasts |
| **cloud-design-prototyping** | Cloud Design workflow: idea→prototype→iterate→export, mobile/desktop, design system, component library, `/design` command, canvas interativo, edição manual + prompts | `frontend-design-direction`, `motion-design-skill`, `design-system` | **Criar skill `cloud-design-prototyping`** — validar Cloud Design API atual, canvas protocol, artifact sharing |
| **threejs-scene-composer** | Composição modular de cenas Three.js: blocos, iluminação, câmera, física, animações — pipeline modular estilo "elemento por elemento" (Gustavo Campelo) | `img2threejs`, `three.js` docs | Criar skill `threejs-scene-composer` |
| **threejs-deploy-pipeline** | Pipeline deploy 3D site: Vite build → zip → Hostinger/Netlify/Vercel → CI/CD automático | `vite-patterns`, `deployment-patterns` | Criar skill `threejs-deploy-pipeline` |
| **threejs-shader-effects** | Efeitos customizados: pixelation, comet trails, mouse distortion, post-processing, shadertoy integration | `three.js` examples, `motion-advanced` | Criar skill `threejs-shader-effects` |
| **threejs-responsive-patterns** | Patterns responsivos 3D: mobile/desktop, touch vs mouse, performance scaling, LOD | `three.js` docs, `motion-advanced` | Criar skill `threejs-responsive-patterns` |
| **threejs-config-constants** | Sistema de constants expostas para tuning: posição câmera, elevação, centro portal, velocidades — sem tocar código | `motion-design-skill` patterns | Criar skill `threejs-config-constants` |
| **threejs-voxel-block-system** | Sistema modular blocos estilo Minecraft: registry, geometries, materials, instancing, instanced mesh | `img2threejs`, `three.js` instancing | Criar skill `threejs-voxel-block-system` |
| **hyperledger-fabric-generator** | Scaffolding blockchain: CA, peers, orderers, canais, chaincode, Explorer, Caliper, API Node.js — boilerplate completo | `deployment-patterns`, `mcp-server-patterns` | Criar skill `hyperledger-fabric-generator` |
| **stripe-webhook-handler** | Stripe webhook patterns: payment_intent, signature validation, ngrok tunnel, eventos, test cards, idempotency | `agent-harness-construction`, `api-connector-builder` | Criar skill `stripe-webhook-handler` |
| **unlazy** | Depth Tree + gates ledger (CHECK/EXPECT/EVIDENCE), solo vs orquestrado, Stop hook, ABANDON honesto — anti-preguiça executável (Leonxlnx/unlazy MIT) | `verification-loop`, `tdd-workflow`, `agent-harness-construction` | **Criar skill `unlazy`** — adaptar Leonxlnx/unlazy para ECC (frontmatter, ≤200 linhas + references/) |
| **capricho** | Capricho = Unlazy aprimorada: + visual quality gate + report forçado + pipeline redondo (transcript l.557-589), vence em 5/8 testes visuais | `unlazy`, `frontend-patterns`, `verification-loop` | **Criar skill `capricho`** — estende `unlazy` com gates visuais e relatório obrigatório |
| **validacao-ideia-24h** | Validação 24h: App Store scraper + swarm 100 compradores sintéticos + veredito GO/KILL/PIVOT + PDF (transcript IbEC l.259-652) | `triagem-ideias`, `agentic-engineering`, `market-research` | **Estender `triagem-ideias`** ou criar `validacao-ideia-24h` com App Store + swarm |
| **local-llm-efficiency** | Colibri 740B@25GB quantização GGUF/GPTQ/AWQ, llama.cpp, Ollama, vLLM local — 1000x custo | `foundation-models-on-device` (só iOS) | **Criar skill `local-llm-efficiency`** — verificar claim 740B/25GB |
| **local-ai-hardware** | DGX Spark $3k, AI PC, TCO token vs hardware, offline inference | `ito-compute` (aluguel) | **Criar skill `local-ai-hardware`** ou enrich `foundation-models-on-device` |
| **vox-style-video** | Vox paper collage, audio-first word-sync, GPT Image 2 + Gemini Omni + Seedance, revise-before-animate | `video-editing`, `remotion-video-creation` | **Criar skill `vox-style-video`** — pipeline Vox + Fal.ai cost table |
| **autopilot-content-factory** | Apify top 20% → filtro marca → HeyGen + ElevenLabs → Remotion/FFmpeg → Metricool 3-trigger split | `data-scraper-agent`, `content-engine`, `video-editing` | **Criar skill `autopilot-content-factory`** — compõe atomos |