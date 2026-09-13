# Auditoria de Skills — Scorecard de Clareza e Saude

> Gerado automaticamente em 2026-09-13 | Projeto: magros.ai-skills | Total: 459 pastas em skills/

## Resumo Executivo

- **Media geral:** 99.5/100 (boa — acima do 80 desejavel para corpus premium)
- **Pastas sem SKILL.md:** 0 (quebradas, score 0)
- **Description sem gatilho quando usar:** 0 / 459 (0.0%) — **padrao critico**
- **Description com literal block | :** 0 (quebra renderers flat-table)
- **SKILL.md >200 linhas:** 0 (0.0%) | >500 linhas: 0
- **Com progressive disclosure (references/scripts):** 213 / 459 (46.4%) — 85% sao monolitos
- **Distribuicao por faixa:** 0-19:0 | 20-39:0 | 40-59:0 | 60-79:0 | 80-99:31
- **Conclusao:** Corpus sofre de **inflacao quantitativa** (459 pastas) sem curadoria de foco; 0.0% violam regra de ouro <=200 linhas e 0.0% nao disparam por falta de gatilho. Qualidade media aceitavel, mas cauda longa de skills fracas arrasta discoverability.

## Padroes Repetidos (encontrados no conjunto)

| Padrao | Evidencia | Impacto | Acao sistemica |
|---|---|---|---|
| Descriptions sem gatilho | 0 skills (0.0%) sem Use when/quando | Skills nunca auto-ativam | Reescrever todas com formula Use when + Triggers on |
| Literal block pipe em description | 0 skills | Quebra renderers flat-table | Trocar pipe por > (folded) |
| Monolitos >200 linhas | 0 skills | Custo tokens alto, sem disclosure | Fatiar e mover para references/ |
| Mega-monolitos >500 linhas | 0 skills | Impossivel manter | Quebrar em 2-4 skills focadas |
| Sem progressive disclosure | 246 sem references/scripts | Tudo no SKILL.md | Criar references/ |
| Clusters duplicados | threejs(7), security(11), testing(12), homelab(5), healthcare(5), claude(9) | Overlap e confusao roteamento | Fundir ou diferenciar com Nao use para cruzado |
| Name != pasta | 6 skills | Quebra tooling | Renomear frontmatter |

## Ranking Pior -> Melhor (Top 30 Piores - acao prioritaria)

| # | Score | Linhas | Skill | Origem | Maior Correcao | Motivos |
|---|---|---|---|---|---|---|
| 1 | **93** | 65 | `recursive-decision-ledger` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | sem secao Quando Ativar |
| 2 | **93** | 65 | `research-ops` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 3 | **93** | 44 | `retomar-sessao` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | desc longa; sem secao Quando Ativar |
| 4 | **93** | 65 | `roteamento-modelos-baratos` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 5 | **93** | 65 | `roteamento-modelos-gratuitos` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 6 | **93** | 65 | `rule-drift-auditor` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 7 | **93** | 65 | `rules-to-hooks-auditor` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 8 | **93** | 65 | `scientific-thinking-literature-review` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 9 | **93** | 65 | `scientific-thinking-scholar-evaluation` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 10 | **93** | 65 | `search-first` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | sem secao Quando Ativar |
| 11 | **93** | 65 | `self-improving-skill` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 12 | **93** | 65 | `seo` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 13 | **93** | 65 | `sessoes-orquestradas` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 14 | **93** | 65 | `site-clone-migration` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 15 | **93** | 65 | `skill-eval-runner` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 16 | **93** | 43 | `skill-map` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 17 | **93** | 65 | `skill-stocktake` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | sem secao Quando Ativar |
| 18 | **93** | 65 | `slack-tag-ops` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 19 | **93** | 65 | `subscription-tier-routing` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 20 | **93** | 65 | `telegram-channel-operator` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 21 | **93** | 56 | `terminal-opener` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | desc longa; sem secao Quando Ativar |
| 22 | **93** | 65 | `terminal-ops` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 23 | **93** | 65 | `triagem-ideias` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | desc longa; sem secao Quando Ativar |
| 24 | **93** | 65 | `unified-notifications-ops` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 25 | **93** | 64 | `validacao-ideia-24h` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | sem exemplos |
| 26 | **93** | 65 | `video-cut-pipeline` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 27 | **93** | 65 | `visa-doc-translate` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | sem secao Quando Ativar |
| 28 | **93** | 65 | `visual-qa-designer` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |
| 29 | **93** | 65 | `whatsapp-evolution-go` | projeto | Adicionar secao ## Quando Ativar com 4-5 gatilhos literais | desc longa; sem secao Quando Ativar |
| 30 | **93** | 65 | `word-revision-workflow` | projeto | Revisar descricao e adicionar 1 exemplo copiavel | desc longa; sem exemplos |

> Correcao de maior valor = a unica mudanca que mais aumenta score/impacto.

## Amostra do Top 15 Melhores (referencia de qualidade)

| # | Score | Linhas | Skill | Por que e boa |
|---|---|---|---|---|
| 1 | 100 | 74 | `12-factor-agents` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 2 | 100 | 37 | `9router-gateway` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 3 | 100 | 39 | `9router-resilient-fallback` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 4 | 100 | 74 | `a2a-interoperability` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 5 | 100 | 65 | `accessibility` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 6 | 100 | 74 | `ads-creative-factory` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 7 | 100 | 73 | `ads-operator` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 8 | 100 | 73 | `ads-reporter-multi` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 9 | 100 | 74 | `aeo-geo-visibility` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 10 | 100 | 50 | `agent-architecture-audit` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 11 | 100 | 65 | `agent-browser` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 12 | 100 | 74 | `agent-commerce-interface` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 13 | 100 | 74 | `agent-cost-optimization-batch` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 14 | 100 | 65 | `agent-eval` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |
| 15 | 100 | 74 | `agent-guardrails` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |

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

### Faixa 60-79 (Regular - 0 skills)
Amostra:  ...

### Faixa 80-99 & 100 (Boa/Excelente - 459 skills)
Amostra 100pts: `12-factor-agents`, `9router-gateway`, `9router-resilient-fallback`, `a2a-interoperability`, `accessibility`, `ads-creative-factory`, `ads-operator`, `ads-reporter-multi`, `aeo-geo-visibility`, `agent-architecture-audit`, `agent-browser`, `agent-commerce-interface`, `agent-cost-optimization-batch`, `agent-eval`, `agent-guardrails` ... (428 com 100pts)

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
