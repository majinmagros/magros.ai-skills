# Auditoria de Skills — Scorecard de Clareza e Saude

> Gerado automaticamente em 2026-09-09 | Projeto: magros.ai-skills | Total: 459 pastas em skills/

## Resumo Executivo

- **Media geral:** 92.8/100 (boa — acima do 80 desejavel para corpus premium)
- **Pastas sem SKILL.md:** 0 (quebradas, score 0)
- **Description sem gatilho quando usar:** 0 / 459 (0.0%) — **padrao critico**
- **Description com literal block | :** 0 (quebra renderers flat-table)
- **SKILL.md >200 linhas:** 90 (19.6%) | >500 linhas: 0
- **Com progressive disclosure (references/scripts):** 137 / 459 (29.8%) — 85% sao monolitos
- **Distribuicao por faixa:** 0-19:0 | 20-39:0 | 40-59:0 | 60-79:40 | 80-99:196
- **Conclusao:** Corpus sofre de **inflacao quantitativa** (459 pastas) sem curadoria de foco; 19.6% violam regra de ouro <=200 linhas e 0.0% nao disparam por falta de gatilho. Qualidade media aceitavel, mas cauda longa de skills fracas arrasta discoverability.

## Padroes Repetidos (encontrados no conjunto)

| Padrao | Evidencia | Impacto | Acao sistemica |
|---|---|---|---|
| Descriptions sem gatilho | 0 skills (0.0%) sem Use when/quando | Skills nunca auto-ativam | Reescrever todas com formula Use when + Triggers on |
| Literal block pipe em description | 0 skills | Quebra renderers flat-table | Trocar pipe por > (folded) |
| Monolitos >200 linhas | 90 skills | Custo tokens alto, sem disclosure | Fatiar e mover para references/ |
| Mega-monolitos >500 linhas | 0 skills | Impossivel manter | Quebrar em 2-4 skills focadas |
| Sem progressive disclosure | 322 sem references/scripts | Tudo no SKILL.md | Criar references/ |
| Clusters duplicados | threejs(7), security(11), testing(12), homelab(5), healthcare(5), claude(9) | Overlap e confusao roteamento | Fundir ou diferenciar com Nao use para cruzado |
| Name != pasta | 6 skills | Quebra tooling | Renomear frontmatter |

## Ranking Pior -> Melhor (Top 30 Piores - acao prioritaria)

| # | Score | Linhas | Skill | Origem | Maior Correcao | Motivos |
|---|---|---|---|---|---|---|
| 1 | **66** | 353 | `e2e-testing` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | sem secao Quando Ativar; 350-500 linhas; sem disclosure |
| 2 | **73** | 400 | `agentic-os` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 3 | **73** | 387 | `ai-regression-testing` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 4 | **73** | 446 | `clickhouse-io` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 5 | **73** | 431 | `database-migrations` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 6 | **73** | 429 | `deployment-patterns` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 7 | **73** | 459 | `django-celery` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 8 | **73** | 378 | `error-handling` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 9 | **73** | 449 | `flutter-dart-code-review` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 10 | **73** | 383 | `intent-driven-development` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | desc longa; 350-500 linhas; sem disclosure |
| 11 | **73** | 385 | `java-coding-standards` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 12 | **73** | 417 | `laravel-patterns` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 13 | **73** | 435 | `motion-patterns` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 14 | **73** | 414 | `mysql-patterns` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 15 | **73** | 402 | `prisma-patterns` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 16 | **73** | 398 | `pytorch-patterns` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 17 | **73** | 425 | `react-testing` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 18 | **73** | 405 | `redis-patterns` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 19 | **73** | 467 | `ui-demo` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 20 | **73** | 451 | `vite-patterns` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | 350-500 linhas; sem disclosure |
| 21 | **74** | 223 | `configure-ecc` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | sem secao Quando Ativar; >200 linhas; sem disclosure |
| 22 | **74** | 217 | `financiamento-imobiliario` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | desc longa; sem secao Quando Ativar; >200 linhas |
| 23 | **74** | 230 | `ito-basket-compare` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | sem secao Quando Ativar; >200 linhas; sem disclosure |
| 24 | **76** | 341 | `android-clean-architecture` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | >200 linhas; sem disclosure |
| 25 | **76** | 304 | `autonomous-agent-harness` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | desc longa; >200 linhas; sem disclosure |
| 26 | **76** | 301 | `compose-multiplatform-patterns` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | >200 linhas; sem disclosure |
| 27 | **76** | 326 | `cpp-testing` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | >200 linhas; sem disclosure |
| 28 | **76** | 323 | `csharp-testing` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | >200 linhas; sem disclosure |
| 29 | **76** | 323 | `dotnet-patterns` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | >200 linhas; sem disclosure |
| 30 | **76** | 313 | `homelab-vlan-segmentation` | projeto | Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas | >200 linhas; sem disclosure |

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
| 11 | 100 | 58 | `api-design` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 12 | 100 | 181 | `architecture-decision-records` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 13 | 100 | 144 | `automation-audit-ops` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 14 | 100 | 44 | `autonomous-loops` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 15 | 100 | 68 | `autopilot-content-factory` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |

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

### Faixa 40-59 (Fraca - 0 skills)
> Amostra:
... +-15 outras

### Faixa 60-79 (Regular - 40 skills)
Amostra: `e2e-testing`(66), `agentic-os`(73), `ai-regression-testing`(73), `clickhouse-io`(73), `database-migrations`(73), `deployment-patterns`(73), `django-celery`(73), `error-handling`(73), `flutter-dart-code-review`(73), `intent-driven-development`(73) ...

### Faixa 80-99 & 100 (Boa/Excelente - 419 skills)
Amostra 100pts: `accessibility`, `agent-browser`, `agent-cost-optimization-batch`, `agent-eval`, `agent-introspection-debugging`, `agent-self-evaluation`, `agent-swarm-ops`, `agnostic-repo-mirror`, `ai-governance-monitor`, `api-connector-builder`, `api-design`, `architecture-decision-records`, `automation-audit-ops`, `autonomous-loops`, `autopilot-content-factory` ... (223 com 100pts)

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
