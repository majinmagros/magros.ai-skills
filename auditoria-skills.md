# Auditoria de Skills — Scorecard de Clareza e Saude

> Gerado automaticamente em 2026-09-02 | Projeto: magros.ai-skills | Total: 409 pastas em skills/

## Resumo Executivo

- **Media geral:** 83.9/100 (regular — longe do 80+ desejavel para corpus premium)
- **Pastas sem SKILL.md:** 0 (quebradas, score 0)
- **Description sem gatilho quando usar:** 46 / 409 (11.2%) — **padrao critico**
- **Description com literal block | :** 0 (quebra renderers flat-table)
- **SKILL.md >200 linhas:** 168 (41.1%) | >500 linhas: 47
- **Com progressive disclosure (references/scripts):** 62 / 409 (15.2%) — 85% sao monolitos
- **Distribuicao por faixa:** 0-19:0 | 20-39:1 | 40-59:29 | 60-79:100 | 80-99:178
- **Conclusao:** Corpus sofre de **inflacao quantitativa** (406 pastas) sem curadoria de foco; 42% violam regra de ouro <=200 linhas e 57% nao disparam por falta de gatilho. Qualidade media aceitavel, mas cauda longa de skills fracas arrasta discoverability.

## Padroes Repetidos (encontrados no conjunto)

| Padrao | Evidencia | Impacto | Acao sistemica |
|---|---|---|---|
| Descriptions sem gatilho | 46 skills (56.7%) sem Use when/quando | Skills nunca auto-ativam | Reescrever todas com formula Use when + Triggers on |
| Literal block pipe em description | 0 skills | Quebra renderers flat-table | Trocar pipe por > (folded) |
| Monolitos >200 linhas | 168 skills | Custo tokens alto, sem disclosure | Fatiar e mover para references/ |
| Mega-monolitos >500 linhas | 47 skills | Impossivel manter | Quebrar em 2-4 skills focadas |
| Sem progressive disclosure | 347 sem references/scripts | Tudo no SKILL.md | Criar references/ |
| Clusters duplicados | threejs(7), security(11), testing(12), homelab(5), healthcare(5), claude(9) | Overlap e confusao roteamento | Fundir ou diferenciar com Nao use para cruzado |
| Name != pasta | 6 skills | Quebra tooling | Renomear frontmatter |
| 3 pastas vazias | claude-voice-workflow, cloud-code-internal-tools, cloud-code-vps-deploy | Score 0 | Remover ou completar |

## Ranking Pior -> Melhor (Top 30 Piores - acao prioritaria)

| # | Score | Linhas | Skill | Origem | Maior Correcao | Motivos |
|---|---|---|---|---|---|---|
| 1 | **39** | 240 | `universal-portability` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | sem frontmatter; sem secao Quando Ativar; sem exemplos |
| 2 | **45** | 690 | `claude-md-auditor` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 3 | **45** | 818 | `graph-engineering-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 4 | **45** | 517 | `hyper3d-rodin-pipeline` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 5 | **45** | 661 | `metahuman-identity-pipeline` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 6 | **45** | 804 | `threejs-config-constants` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 7 | **45** | 606 | `threejs-deploy-pipeline` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 8 | **45** | 856 | `threejs-responsive-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 9 | **45** | 1290 | `threejs-voxel-block-system` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 10 | **51** | 14 | `skill-execution-dashboard` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | sem frontmatter; sem secao Quando Ativar; sem exemplos |
| 11 | **53** | 447 | `frontend-a11y` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; 350-500 linhas |
| 12 | **53** | 433 | `fusion-harness` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 13 | **53** | 417 | `hyper3d-rodin-api` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 14 | **53** | 422 | `metahuman-animation-retarget` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 15 | **53** | 484 | `metahuman-unreal-blueprint` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 16 | **53** | 399 | `prompt-optimizer` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; 350-500 linhas |
| 17 | **53** | 441 | `sub-agent-cost-guard` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 18 | **53** | 408 | `threejs-shader-effects` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 19 | **54** | 213 | `carrier-relationship-management` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 20 | **54** | 215 | `competitive-platform-analysis` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 21 | **54** | 264 | `customs-trade-compliance` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 22 | **54** | 229 | `energy-procurement` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 23 | **54** | 248 | `inventory-demand-planning` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 24 | **54** | 223 | `logistics-exception-management` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 25 | **54** | 239 | `production-scheduling` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 26 | **54** | 261 | `quality-nonconformance` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 27 | **54** | 241 | `returns-reverse-logistics` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem exemplos |
| 28 | **56** | 317 | `claude-account-optimizer` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 29 | **56** | 319 | `claude-cowork-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 30 | **56** | 329 | `voice-cloning-local` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |

> Correcao de maior valor = a unica mudanca que mais aumenta score/impacto.

## Amostra do Top 15 Melhores (referencia de qualidade)

| # | Score | Linhas | Skill | Por que e boa |
|---|---|---|---|---|
| 1 | 100 | 148 | `accessibility` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 2 | 100 | 148 | `agent-eval` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 3 | 100 | 155 | `agent-introspection-debugging` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 4 | 100 | 183 | `agent-self-evaluation` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 5 | 100 | 122 | `api-connector-builder` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 6 | 100 | 181 | `architecture-decision-records` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 7 | 100 | 144 | `automation-audit-ops` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 8 | 100 | 96 | `benchmark` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 9 | 100 | 166 | `blender-motion-state-inspection` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 10 | 100 | 120 | `browser-qa` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 11 | 100 | 86 | `bun-runtime` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 12 | 100 | 109 | `canary-watch` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 13 | 100 | 165 | `cisco-ios-patterns` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 14 | 100 | 113 | `claude-devfleet` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 15 | 100 | 172 | `codehealth-mcp` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |

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

## Tabela Completa (condensada) — Todas as 406 skills por faixa

### Faixa 0-39 (Critica - 1 skills)
- `universal-portability` — 39 pts, 240 linhas — Adicionar secao ## Quando Ativar com 4-5 gatilhos literais

### Faixa 40-59 (Fraca - 29 skills)
> Amostra:
- `claude-md-auditor` — 45 pts, 690 linhas — sem gatilho quando usar; desc curta
- `graph-engineering-patterns` — 45 pts, 818 linhas — sem gatilho quando usar; desc curta
- `hyper3d-rodin-pipeline` — 45 pts, 517 linhas — sem gatilho quando usar; desc curta
- `metahuman-identity-pipeline` — 45 pts, 661 linhas — sem gatilho quando usar; desc curta
- `threejs-config-constants` — 45 pts, 804 linhas — sem gatilho quando usar; desc curta
- `threejs-deploy-pipeline` — 45 pts, 606 linhas — sem gatilho quando usar; desc curta
- `threejs-responsive-patterns` — 45 pts, 856 linhas — sem gatilho quando usar; desc curta
- `threejs-voxel-block-system` — 45 pts, 1290 linhas — sem gatilho quando usar; desc curta
- `skill-execution-dashboard` — 51 pts, 14 linhas — sem frontmatter; sem secao Quando Ativar
- `frontend-a11y` — 53 pts, 447 linhas — sem gatilho quando usar; desc curta
- `fusion-harness` — 53 pts, 433 linhas — sem gatilho quando usar; desc curta
- `hyper3d-rodin-api` — 53 pts, 417 linhas — sem gatilho quando usar; desc curta
- `metahuman-animation-retarget` — 53 pts, 422 linhas — sem gatilho quando usar; desc curta
- `metahuman-unreal-blueprint` — 53 pts, 484 linhas — sem gatilho quando usar; desc curta
- `prompt-optimizer` — 53 pts, 399 linhas — sem gatilho quando usar; desc curta
... +14 outras

### Faixa 60-79 (Regular - 100 skills)
Amostra: `claude-chrome-automation`(61), `claude-model-router`(61), `claude-project-template`(61), `motion-design-skill`(61), `obsidian-cli`(61), `skill-creator-methodology`(61), `docker-patterns`(63), `fastapi-patterns`(63), `hyperledger-fabric-generator`(65), `e2e-testing`(66) ...

### Faixa 80-99 & 100 (Boa/Excelente - 279 skills)
Amostra 100pts: `accessibility`, `agent-eval`, `agent-introspection-debugging`, `agent-self-evaluation`, `api-connector-builder`, `architecture-decision-records`, `automation-audit-ops`, `benchmark`, `blender-motion-state-inspection`, `browser-qa`, `bun-runtime`, `canary-watch`, `cisco-ios-patterns`, `claude-devfleet`, `codehealth-mcp` ... (101 com 100pts)

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
