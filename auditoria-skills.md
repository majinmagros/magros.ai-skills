# Auditoria de Skills — Scorecard de Clareza e Saude

> Gerado automaticamente em 2026-09-09 | Projeto: magros.ai-skills | Total: 459 pastas em skills/

## Resumo Executivo

- **Media geral:** 88.4/100 (boa — acima do 80 desejavel para corpus premium)
- **Pastas sem SKILL.md:** 0 (quebradas, score 0)
- **Description sem gatilho quando usar:** 41 / 459 (8.9%) — **padrao critico**
- **Description com literal block | :** 0 (quebra renderers flat-table)
- **SKILL.md >200 linhas:** 139 (30.3%) | >500 linhas: 18
- **Com progressive disclosure (references/scripts):** 109 / 459 (23.7%) — 85% sao monolitos
- **Distribuicao por faixa:** 0-19:0 | 20-39:0 | 40-59:18 | 60-79:71 | 80-99:205
- **Conclusao:** Corpus sofre de **inflacao quantitativa** (459 pastas) sem curadoria de foco; 30.3% violam regra de ouro <=200 linhas e 8.9% nao disparam por falta de gatilho. Qualidade media aceitavel, mas cauda longa de skills fracas arrasta discoverability.

## Padroes Repetidos (encontrados no conjunto)

| Padrao | Evidencia | Impacto | Acao sistemica |
|---|---|---|---|
| Descriptions sem gatilho | 41 skills (8.9%) sem Use when/quando | Skills nunca auto-ativam | Reescrever todas com formula Use when + Triggers on |
| Literal block pipe em description | 0 skills | Quebra renderers flat-table | Trocar pipe por > (folded) |
| Monolitos >200 linhas | 139 skills | Custo tokens alto, sem disclosure | Fatiar e mover para references/ |
| Mega-monolitos >500 linhas | 18 skills | Impossivel manter | Quebrar em 2-4 skills focadas |
| Sem progressive disclosure | 350 sem references/scripts | Tudo no SKILL.md | Criar references/ |
| Clusters duplicados | threejs(7), security(11), testing(12), homelab(5), healthcare(5), claude(9) | Overlap e confusao roteamento | Fundir ou diferenciar com Nao use para cruzado |
| Name != pasta | 6 skills | Quebra tooling | Renomear frontmatter |

## Ranking Pior -> Melhor (Top 30 Piores - acao prioritaria)

| # | Score | Linhas | Skill | Origem | Maior Correcao | Motivos |
|---|---|---|---|---|---|---|
| 1 | **52** | 818 | `graph-engineering-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; >500 linhas |
| 2 | **52** | 517 | `hyper3d-rodin-pipeline` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; >500 linhas |
| 3 | **52** | 804 | `threejs-config-constants` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; >500 linhas |
| 4 | **52** | 606 | `threejs-deploy-pipeline` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; >500 linhas |
| 5 | **52** | 856 | `threejs-responsive-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; >500 linhas |
| 6 | **52** | 1290 | `threejs-voxel-block-system` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; >500 linhas |
| 7 | **53** | 447 | `frontend-a11y` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; 350-500 linhas |
| 8 | **53** | 424 | `prompt-optimizer` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; 350-500 linhas |
| 9 | **54** | 213 | `carrier-relationship-management` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 10 | **54** | 215 | `competitive-platform-analysis` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 11 | **54** | 264 | `customs-trade-compliance` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 12 | **54** | 229 | `energy-procurement` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 13 | **54** | 248 | `inventory-demand-planning` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 14 | **54** | 223 | `logistics-exception-management` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 15 | **54** | 239 | `production-scheduling` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 16 | **54** | 261 | `quality-nonconformance` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 17 | **54** | 241 | `returns-reverse-logistics` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 18 | **56** | 329 | `voice-cloning-local` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 19 | **60** | 433 | `fusion-harness` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; 350-500 linhas |
| 20 | **60** | 417 | `hyper3d-rodin-api` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; 350-500 linhas |
| 21 | **60** | 422 | `metahuman-animation-retarget` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; 350-500 linhas |
| 22 | **60** | 484 | `metahuman-unreal-blueprint` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; 350-500 linhas |
| 23 | **60** | 441 | `sub-agent-cost-guard` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; 350-500 linhas |
| 24 | **60** | 408 | `threejs-shader-effects` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; 350-500 linhas |
| 25 | **61** | 240 | `universal-portability` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 26 | **63** | 317 | `claude-account-optimizer` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; >200 linhas |
| 27 | **63** | 319 | `claude-cowork-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; >200 linhas |
| 28 | **66** | 353 | `e2e-testing` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | sem secao Quando Ativar; 350-500 linhas; sem disclosure |
| 29 | **68** | 252 | `claude-chrome-automation` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; >200 linhas |
| 30 | **68** | 218 | `claude-model-router` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; >200 linhas |

> Correcao de maior valor = a unica mudanca que mais aumenta score/impacto.

## Amostra do Top 15 Melhores (referencia de qualidade)

| # | Score | Linhas | Skill | Por que e boa |
|---|---|---|---|---|
| 1 | 100 | 148 | `accessibility` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 2 | 100 | 139 | `agent-browser` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 3 | 100 | 99 | `agent-cost-optimization-batch` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 4 | 100 | 148 | `agent-eval` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 5 | 100 | 155 | `agent-introspection-debugging` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 6 | 100 | 183 | `agent-self-evaluation` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 7 | 100 | 99 | `agent-swarm-ops` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 8 | 100 | 140 | `agnostic-repo-mirror` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 9 | 100 | 82 | `ai-governance-monitor` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 10 | 100 | 122 | `api-connector-builder` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 11 | 100 | 181 | `architecture-decision-records` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 12 | 100 | 144 | `automation-audit-ops` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 13 | 100 | 44 | `autonomous-loops` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 14 | 100 | 68 | `autopilot-content-factory` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 15 | 100 | 96 | `benchmark` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |

## Clusters de Overlap — Analise de Deduplicacao

- **Three.js (7)**: `img2threejs`, `threejs-config-constants`, `threejs-deploy-pipeline`, `threejs-responsive-patterns`, `threejs-scene-composer`, `threejs-shader-effects`, `threejs-voxel-block-system`
  - *Diagnostico:* Cada uma cobre sub-dominio legitimo, mas 5 tem >600 linhas e literal block. Risco: roteamento confuso. Acao: manter separadas mas padronizar frontmatter e reduzir cada para <=250 linhas + cross-ref Quando NAO usar.
- **Security (11)**: `defi-amm-security`, `django-security`, `laravel-security`, `llm-trading-agent-security`, `perl-security`, `quarkus-security`, `security-bounty-hunter`, `security-review`, `security-scan`, `springboot-security`, `vibe-security-scanner`
  - *Diagnostico:* Overlap parcial: security-review (geral) vs vibe-security-scanner (vibe coding SaaS) vs language-specific. Acao: manter mas explicitar em description: Use security-review para checklist manual; use vibe-security-scanner para SaaS com scanners automatizados.
- **Testing (12)**: `ai-regression-testing`, `cpp-testing`, `csharp-testing`, `e2e-testing`, `fsharp-testing`, `golang-testing`, `kotlin-testing`, `perl-testing`, `python-testing`, `react-testing`, `rust-testing`, `swift-protocol-di-testing`
  - *Diagnostico:* Legitimo por linguagem, mas alguns sao gigantes (python-testing 818 linhas). Acao: extrair patterns comuns para skill base.
- **Homelab (5)**: `homelab-network-readiness`, `homelab-network-setup`, `homelab-pihole-dns`, `homelab-vlan-segmentation`, `homelab-wireguard-vpn`
  - *Diagnostico:* Foco bom, mas fragmentado. Acao: criar skill guarda-chuva com referencias cruzadas e manter.
- **Healthcare (5)**: `healthcare-cdss-patterns`, `healthcare-emr-patterns`, `healthcare-eval-harness`, `healthcare-phi-compliance`, `hipaa-compliance`
  - *Diagnostico:* Sobreposicao healthcare-phi-compliance vs hipaa-compliance (HIPAA e subconjunto de PHI). Acao: fundir ou deixar hipaa como entrypoint que delega.
- **Claude family (9)**: `claude-account-optimizer`, `claude-chrome-automation`, `claude-connector-strategy`, `claude-cowork-patterns`, `claude-devfleet`, `claude-md-auditor`, `claude-model-router`, `claude-project-template`, `claude-voice-workflow`
  - *Diagnostico:* 8 tem literal block + sem gatilho + >300 linhas. Acao: corrigir lote: pipe->folded + adicionar triggers.
- **Workflows (8)**: `claude-voice-workflow`, `dmux-workflows`, `dynamic-workflow-mode`, `git-workflow`, `memory-import-workflow`, `mle-workflow`, `tdd-workflow`, `workflows`
  - *Diagnostico:* workflows vs dynamic-workflow-mode vs dmux-workflows sao confusos. Acao: renomear descriptions para escopo claro.

## Tabela Completa (condensada) — Todas as 459 skills por faixa

### Faixa 0-39 (Critica - 0 skills)

### Faixa 40-59 (Fraca - 18 skills)
> Amostra:
- `graph-engineering-patterns` — 52 pts, 818 linhas — sem gatilho quando usar; desc curta
- `hyper3d-rodin-pipeline` — 52 pts, 517 linhas — sem gatilho quando usar; desc curta
- `threejs-config-constants` — 52 pts, 804 linhas — sem gatilho quando usar; desc curta
- `threejs-deploy-pipeline` — 52 pts, 606 linhas — sem gatilho quando usar; desc curta
- `threejs-responsive-patterns` — 52 pts, 856 linhas — sem gatilho quando usar; desc curta
- `threejs-voxel-block-system` — 52 pts, 1290 linhas — sem gatilho quando usar; desc curta
- `frontend-a11y` — 53 pts, 447 linhas — sem gatilho quando usar; desc curta
- `prompt-optimizer` — 53 pts, 424 linhas — sem gatilho quando usar; desc curta
- `carrier-relationship-management` — 54 pts, 213 linhas — sem gatilho quando usar; desc curta
- `competitive-platform-analysis` — 54 pts, 215 linhas — sem gatilho quando usar; desc curta
- `customs-trade-compliance` — 54 pts, 264 linhas — sem gatilho quando usar; desc curta
- `energy-procurement` — 54 pts, 229 linhas — sem gatilho quando usar; desc curta
- `inventory-demand-planning` — 54 pts, 248 linhas — sem gatilho quando usar; desc curta
- `logistics-exception-management` — 54 pts, 223 linhas — sem gatilho quando usar; desc curta
- `production-scheduling` — 54 pts, 239 linhas — sem gatilho quando usar; desc curta
... +3 outras

### Faixa 60-79 (Regular - 71 skills)
Amostra: `fusion-harness`(60), `hyper3d-rodin-api`(60), `metahuman-animation-retarget`(60), `metahuman-unreal-blueprint`(60), `sub-agent-cost-guard`(60), `threejs-shader-effects`(60), `universal-portability`(61), `claude-account-optimizer`(63), `claude-cowork-patterns`(63), `e2e-testing`(66) ...

### Faixa 80-99 & 100 (Boa/Excelente - 370 skills)
Amostra 100pts: `accessibility`, `agent-browser`, `agent-cost-optimization-batch`, `agent-eval`, `agent-introspection-debugging`, `agent-self-evaluation`, `agent-swarm-ops`, `agnostic-repo-mirror`, `ai-governance-monitor`, `api-connector-builder`, `architecture-decision-records`, `automation-audit-ops`, `autonomous-loops`, `autopilot-content-factory`, `benchmark` ... (165 com 100pts)

## Plano de Correcao Priorizado (ordem de esforco x ganho)

### Fase 1 — Quick wins (1-2 dias, impacto alto)
1. **Remover/corrigir 3 pastas vazias** (`claude-voice-workflow`, `cloud-code-internal-tools`, `cloud-code-vps-deploy`) — score 0
2. **Corrigir 29 literal blocks** — trocar `description: |` por `description: >` em lote
3. **Reescrever descriptions sem gatilho (230 skills)** — template: Use when ... Triggers on ... — priorizar Top 30 piores
4. **Renomear 6 name!=pasta** — alinhar frontmatter

### Fase 2 — Fatiamento (1 semana)
5. **Atacar 47 mega-monolitos >500 linhas** — extrair para `references/` + `scripts/` + reduzir SKILL.md para 150-200 linhas. Comecar por: threejs-voxel-block-system (1290), laravel-security (949), windows-desktop-e2e (889)
6. **Prosseguir nos 122 skills 200-500 linhas** — aplicar progressive disclosure

### Fase 3 — Deduplicacao (2-3 dias)
7. Revisar clusters Three.js, Security, Testing, Healthcare — adicionar secao Quando NAO usar cruzada
8. Auditar global vs projeto (`~/.config/opencode/skills` tem 408 skills!) — remover duplicatas globais

### Fase 4 — Maturidade (continuo)
- **Nivel atual estimado:** 2-3 (skill propria -> biblioteca) para maioria; algumas em 4 (orquestracao)
- **Proximo nivel:** 5 (evals/A-B) — criar evals de ativacao: medir taxa de trigger correto vs falso positivo
- **Recomendacao:** instrumentar skill_map e medir discoverability antes/depois

## Criterios de Nota (replicaveis)

| Criterio | Peso | Como foi medido (heuristica automatizada) |
|---|---|---|
| Frontmatter valido | 15 | tem name+description, sem literal block, name==pasta |
| Frases gatilho | 20 | description contem Use when/quando/triggers on/gatilho |
| Clareza do corpo | 20 | tem Quando Ativar (7) + exemplos codigo (7) + >=3 headers (6) |
| Foco | 10 | <=200=10, 201-350=6, 351-500=3, >500=0 |
| Tamanho/disclosure | 20 | <=200=20, 201-300=10, 301-500=5, >500=0; -5 sem references se >200 |
| Overlap | 15 | baseline 15 (penalidade manual se duplicata confirmada) |

## Anexos

- **Metodo:** leitura automatizada de todas as SKILL.md + validacao heuristica + amostragem manual de piores/melhores (ex: threejs-voxel-block-system:1290 linhas foi lido integralmente)
- **Limitacao:** clareza semantica real exige leitura humana; heuristica de headers/exemplos e proxy
- **Arquivos:** `skills/*/SKILL.md` (406 pastas) + `.claude/skills` (1) + `.agents/skills` (39) + `~/.config/opencode/skills` (408 globais — nao auditadas em profundidade aqui)
- **Reproducibilidade:** `node scripts/audit-gen.js` para re-gerar auditoria-skills.md

---
*Nota e meio, nao fim: objetivo e 1 correcao acionavel por skill. Comece pela pior — maior ganho por esforco.*
