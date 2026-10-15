# Auditoria de Skills — Scorecard de Clareza e Saude

> Gerado automaticamente em 2026-10-15 | Projeto: magros.ai-skills | Total: 499 pastas em skills/

## Resumo Executivo

- **Media geral:** 99.2/100 (boa — acima do 80 desejavel para corpus premium)
- **Pastas sem SKILL.md:** 0 (quebradas, score 0)
- **Description sem gatilho quando usar:** 10 / 499 (2.0%) — **padrao critico**
- **Description com literal block | :** 0 (quebra renderers flat-table)
- **SKILL.md >200 linhas:** 0 (0.0%) | >500 linhas: 0
- **Com progressive disclosure (references/scripts):** 206 / 499 (41.3%) — 85% sao monolitos
- **Distribuicao por faixa:** 0-19:0 | 20-39:0 | 40-59:0 | 60-79:5 | 80-99:31
- **Conclusao:** Corpus sofre de **inflacao quantitativa** (499 pastas) sem curadoria de foco; 0.0% violam regra de ouro <=200 linhas e 2.0% nao disparam por falta de gatilho. Qualidade media aceitavel, mas cauda longa de skills fracas arrasta discoverability.

## Padroes Repetidos (encontrados no conjunto)

| Padrao | Evidencia | Impacto | Acao sistemica |
|---|---|---|---|
| Descriptions sem gatilho | 10 skills (2.0%) sem Use when/quando | Skills nunca auto-ativam | Reescrever todas com formula Use when + Triggers on |
| Literal block pipe em description | 0 skills | Quebra renderers flat-table | Trocar pipe por > (folded) |
| Monolitos >200 linhas | 0 skills | Custo tokens alto, sem disclosure | Fatiar e mover para references/ |
| Mega-monolitos >500 linhas | 0 skills | Impossivel manter | Quebrar em 2-4 skills focadas |
| Sem progressive disclosure | 293 sem references/scripts | Tudo no SKILL.md | Criar references/ |
| Clusters duplicados | threejs(7), security(11), testing(12), homelab(5), healthcare(5), claude(9) | Overlap e confusao roteamento | Fundir ou diferenciar com Nao use para cruzado |
| Name != pasta | 6 skills | Quebra tooling | Renomear frontmatter |

## Ranking Pior -> Melhor (Top 30 Piores - acao prioritaria)

| # | Score | Linhas | Skill | Origem | Maior Correcao | Motivos |
|---|---|---|---|---|---|---|
| 1 | **73** | 70 | `claude-admin-model-governance` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; sem exemplos |
| 2 | **73** | 54 | `proposta-comercial-auto` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc longa; sem exemplos |
| 3 | **73** | 50 | `repurpose-shorts-dm-funnel` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc longa; sem exemplos |
| 4 | **73** | 53 | `support-agent-report-card` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc longa; sem exemplos |
| 5 | **73** | 117 | `system-one-judgment-triage` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc longa; sem exemplos |
| 6 | **80** | 112 | `context-ledger-sync` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar |
| 7 | **80** | 61 | `episode-planner-and-script` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar |
| 8 | **80** | 85 | `multi-source-researcher` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar |
| 9 | **80** | 107 | `post-production-pipeline` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar |
| 10 | **80** | 109 | `whatsapp-link-collector` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar |
| 11 | **93** | 42 | `agent-misbehavior-controls` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 12 | **93** | 53 | `agentic-benchmark-top5` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 13 | **93** | 39 | `attention-architecture` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 14 | **93** | 60 | `cartao-pontos-optimizer` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 15 | **93** | 70 | `caveman-saida-enxuta` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 16 | **93** | 59 | `claude-safety-monitoring-window` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 17 | **93** | 70 | `claude-zero-retention-frontier` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 18 | **93** | 36 | `codebase-mapa-indexado` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 19 | **93** | 50 | `codex-subscription-offload` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 20 | **93** | 37 | `design-code-drift-ci` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 21 | **93** | 36 | `design-in-repo` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 22 | **93** | 55 | `drive-screen-os-control` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 23 | **93** | 36 | `funil-cro-watch` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 24 | **93** | 41 | `google-adk-patterns` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 25 | **93** | 44 | `harness-arena-comparison` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 26 | **93** | 66 | `health-coach-wearables` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 27 | **93** | 84 | `junior-seniorizado-playbook` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 28 | **93** | 40 | `knowledge-work-proxy-eval` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 29 | **93** | 63 | `linkedin-inbox-triage` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 30 | **93** | 37 | `mcp-local-bridge` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |

> Correcao de maior valor = a unica mudanca que mais aumenta score/impacto.

## Amostra do Top 15 Melhores (referencia de qualidade)

| # | Score | Linhas | Skill | Por que e boa |
|---|---|---|---|---|
| 1 | 100 | 74 | `12-factor-agents` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 2 | 100 | 74 | `a2a-interoperability` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 3 | 100 | 65 | `accessibility` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 4 | 100 | 83 | `ads-creative-factory` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 5 | 100 | 73 | `ads-operator` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 6 | 100 | 73 | `ads-reporter-multi` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 7 | 100 | 74 | `aeo-geo-visibility` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 8 | 100 | 50 | `agent-architecture-audit` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 9 | 100 | 70 | `agent-browser` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 10 | 100 | 74 | `agent-commerce-interface` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 11 | 100 | 74 | `agent-cost-optimization-batch` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 12 | 100 | 81 | `agent-eval` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 13 | 100 | 126 | `agent-guardrails` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 14 | 100 | 109 | `agent-harness-construction` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 15 | 100 | 65 | `agent-introspection-debugging` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |

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

## Tabela Completa (condensada) — Todas as 499 skills por faixa

### Faixa 0-39 (Critica - 0 skills)

### Faixa 40-59 (Fraca - 0 skills)
> Amostra:
... +-15 outras

### Faixa 60-79 (Regular - 5 skills)
Amostra: `claude-admin-model-governance`(73), `proposta-comercial-auto`(73), `repurpose-shorts-dm-funnel`(73), `support-agent-report-card`(73), `system-one-judgment-triage`(73) ...

### Faixa 80-99 & 100 (Boa/Excelente - 494 skills)
Amostra 100pts: `12-factor-agents`, `a2a-interoperability`, `accessibility`, `ads-creative-factory`, `ads-operator`, `ads-reporter-multi`, `aeo-geo-visibility`, `agent-architecture-audit`, `agent-browser`, `agent-commerce-interface`, `agent-cost-optimization-batch`, `agent-eval`, `agent-guardrails`, `agent-harness-construction`, `agent-introspection-debugging` ... (463 com 100pts)

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
