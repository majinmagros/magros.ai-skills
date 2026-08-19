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

**Enriquecidas neste lote:** `criar-skill` (filtro EADA, DBS, reverse engineering, progressive disclosure com números reais, taxonomia brand/function/specialty, sistemas de skills, evals/A-B, learnings file) e `auditar-skills` (critério de tamanho/disclosure + 7 níveis de maturidade).

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

Transcrições do canal ficam em `C:\projetos\full-cycle\` (fora do repo; via `YT_DIR`).

## 4. Próximos Passos

1. Rodar o pipeline em novos vídeos: `node scripts/yt-oportunidades.mjs diff --since <data>`
   (agora com `--since-last` por canal, via `ULTIMA-COLETA.json`).
2. Analisar vídeos novos → materializar via `criar-skill`.
3. **Backlog matthew_berman**: ~30 vídeos sem transcrição desde 2026-07-19 —
   não são do foco "skills" desta leva; coletar quando quiser (assistir IA/LLM geral).
4. Rodar validators (`validate-no-personal-paths.js`, testes CI) antes de qualquer commit.