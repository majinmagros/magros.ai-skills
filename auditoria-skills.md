# Auditoria de Skills — Scorecard de Clareza e Saude

> Gerado automaticamente em 2026-09-02 | Projeto: magros.ai-skills | Total: 409 pastas em skills/

## Resumo Executivo

- **Media geral:** 74.8/100 (regular — longe do 80+ desejavel para corpus premium)
- **Pastas sem SKILL.md:** 0 (quebradas, score 0)
- **Description sem gatilho quando usar:** 230 / 409 (56.2%) — **padrao critico**
- **Description com literal block | :** 0 (quebra renderers flat-table)
- **SKILL.md >200 linhas:** 169 (41.3%) | >500 linhas: 47
- **Com progressive disclosure (references/scripts):** 62 / 409 (15.2%) — 85% sao monolitos
- **Distribuicao por faixa:** 0-19:0 | 20-39:1 | 40-59:95 | 60-79:94 | 80-99:177
- **Conclusao:** Corpus sofre de **inflacao quantitativa** (406 pastas) sem curadoria de foco; 42% violam regra de ouro <=200 linhas e 57% nao disparam por falta de gatilho. Qualidade media aceitavel, mas cauda longa de skills fracas arrasta discoverability.

## Padroes Repetidos (encontrados no conjunto)

| Padrao | Evidencia | Impacto | Acao sistemica |
|---|---|---|---|
| Descriptions sem gatilho | 230 skills (56.7%) sem Use when/quando | Skills nunca auto-ativam | Reescrever todas com formula Use when + Triggers on |
| Literal block pipe em description | 0 skills | Quebra renderers flat-table | Trocar pipe por > (folded) |
| Monolitos >200 linhas | 169 skills | Custo tokens alto, sem disclosure | Fatiar e mover para references/ |
| Mega-monolitos >500 linhas | 47 skills | Impossivel manter | Quebrar em 2-4 skills focadas |
| Sem progressive disclosure | 347 sem references/scripts | Tudo no SKILL.md | Criar references/ |
| Clusters duplicados | threejs(7), security(11), testing(12), homelab(5), healthcare(5), claude(9) | Overlap e confusao roteamento | Fundir ou diferenciar com Nao use para cruzado |
| Name != pasta | 6 skills | Quebra tooling | Renomear frontmatter |
| 3 pastas vazias | claude-voice-workflow, cloud-code-internal-tools, cloud-code-vps-deploy | Score 0 | Remover ou completar |

## Ranking Pior -> Melhor (Top 30 Piores - acao prioritaria)

| # | Score | Linhas | Skill | Origem | Maior Correcao | Motivos |
|---|---|---|---|---|---|---|
| 1 | **39** | 240 | `universal-portability` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | sem frontmatter; sem secao Quando Ativar; sem exemplos |
| 2 | **43** | 515 | `fastapi-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; sem secao Quando Ativar; >500 linhas |
| 3 | **45** | 690 | `claude-md-auditor` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 4 | **45** | 818 | `graph-engineering-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 5 | **45** | 517 | `hyper3d-rodin-pipeline` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 6 | **45** | 661 | `metahuman-identity-pipeline` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 7 | **45** | 804 | `threejs-config-constants` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 8 | **45** | 606 | `threejs-deploy-pipeline` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 9 | **45** | 856 | `threejs-responsive-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 10 | **45** | 1290 | `threejs-voxel-block-system` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc curta; sem secao Quando Ativar |
| 11 | **46** | 353 | `e2e-testing` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; sem secao Quando Ativar; 350-500 linhas |
| 12 | **46** | 437 | `flutter-dart-code-review` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; sem secao Quando Ativar; 350-500 linhas |
| 13 | **46** | 414 | `mysql-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; sem secao Quando Ativar; 350-500 linhas |
| 14 | **49** | 337 | `ai-media-generator` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc longa; sem secao Quando Ativar |
| 15 | **50** | 525 | `api-design` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 16 | **50** | 614 | `autonomous-loops` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 17 | **50** | 563 | `backend-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 18 | **50** | 552 | `coding-standards` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 19 | **50** | 565 | `dart-flutter-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 20 | **50** | 736 | `django-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 21 | **50** | 645 | `django-security` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 22 | **50** | 731 | `django-tdd` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 23 | **50** | 658 | `frontend-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 24 | **50** | 821 | `generating-python-installer` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; desc longa; >500 linhas |
| 25 | **50** | 717 | `git-workflow` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 26 | **50** | 677 | `golang-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 27 | **50** | 722 | `golang-testing` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 28 | **50** | 721 | `kotlin-exposed-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 29 | **50** | 691 | `kotlin-ktor-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |
| 30 | **50** | 713 | `kotlin-patterns` | projeto | Reescrever description com Use when + triggers concretos | sem gatilho quando usar; >500 linhas; sem disclosure |

> Correcao de maior valor = a unica mudanca que mais aumenta score/impacto.

## Amostra do Top 15 Melhores (referencia de qualidade)

| # | Score | Linhas | Skill | Por que e boa |
|---|---|---|---|---|
| 1 | 100 | 122 | `api-connector-builder` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 2 | 100 | 144 | `automation-audit-ops` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 3 | 100 | 172 | `codehealth-mcp` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 4 | 100 | 122 | `config-gc` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 5 | 100 | 191 | `connections-optimizer` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 6 | 100 | 98 | `cost-tracking` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 7 | 100 | 142 | `customer-billing-ops` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 8 | 100 | 161 | `deep-research` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 9 | 100 | 123 | `email-ops` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 10 | 100 | 109 | `exa-search` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 11 | 100 | 129 | `finance-billing-ops` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 12 | 100 | 123 | `frontend-design-direction` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 13 | 100 | 146 | `github-ops` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 14 | 100 | 97 | `google-workspace-ops` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 15 | 100 | 53 | `grills` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |

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

### Faixa 40-59 (Fraca - 95 skills)
> Amostra:
- `fastapi-patterns` — 43 pts, 515 linhas — sem gatilho quando usar; sem secao Quando Ativar
- `claude-md-auditor` — 45 pts, 690 linhas — sem gatilho quando usar; desc curta
- `graph-engineering-patterns` — 45 pts, 818 linhas — sem gatilho quando usar; desc curta
- `hyper3d-rodin-pipeline` — 45 pts, 517 linhas — sem gatilho quando usar; desc curta
- `metahuman-identity-pipeline` — 45 pts, 661 linhas — sem gatilho quando usar; desc curta
- `threejs-config-constants` — 45 pts, 804 linhas — sem gatilho quando usar; desc curta
- `threejs-deploy-pipeline` — 45 pts, 606 linhas — sem gatilho quando usar; desc curta
- `threejs-responsive-patterns` — 45 pts, 856 linhas — sem gatilho quando usar; desc curta
- `threejs-voxel-block-system` — 45 pts, 1290 linhas — sem gatilho quando usar; desc curta
- `e2e-testing` — 46 pts, 353 linhas — sem gatilho quando usar; sem secao Quando Ativar
- `flutter-dart-code-review` — 46 pts, 437 linhas — sem gatilho quando usar; sem secao Quando Ativar
- `mysql-patterns` — 46 pts, 414 linhas — sem gatilho quando usar; sem secao Quando Ativar
- `ai-media-generator` — 49 pts, 337 linhas — sem gatilho quando usar; desc longa
- `api-design` — 50 pts, 525 linhas — sem gatilho quando usar; >500 linhas
- `autonomous-loops` — 50 pts, 614 linhas — sem gatilho quando usar; >500 linhas
... +80 outras

### Faixa 60-79 (Regular - 94 skills)
Amostra: `continuous-learning-v2`(60), `videodb`(60), `agent-architecture-audit`(61), `agent-payment-x402`(61), `claude-chrome-automation`(61), `claude-model-router`(61), `claude-project-template`(61), `code-tour`(61), `eval-harness`(61), `foundation-models-on-device`(61) ...

### Faixa 80-99 & 100 (Boa/Excelente - 219 skills)
Amostra 100pts: `api-connector-builder`, `automation-audit-ops`, `codehealth-mcp`, `config-gc`, `connections-optimizer`, `cost-tracking`, `customer-billing-ops`, `deep-research`, `email-ops`, `exa-search`, `finance-billing-ops`, `frontend-design-direction`, `github-ops`, `google-workspace-ops`, `grills` ... (42 com 100pts)

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
