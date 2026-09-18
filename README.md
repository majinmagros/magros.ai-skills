# magros.ai-skills

Biblioteca pessoal de skills de IA para agentes de código (Claude Code, OpenCode, Codex, etc.).

Este repositório é uma **base do bundle ECC** ([Everything Claude Code](https://github.com/affaan-m/ECC), MIT) com um conjunto de **skills autorais** adicionadas por cima.

> **Primeira vez aqui?** Veja o [Guia de Instalação para Iniciantes](GUIA-INSTALACAO-INICIANTES.md) —
> passo a passo em linguagem simples, sem exigir experiência com tecnologia.
>
> A ideia central: a biblioteca funciona como um **"cérebro externo"** — procedimentos
> detalhados que permitem até a modelos de IA mais simples produzir trabalho de
> qualidade, com o conhecimento vivendo no seu computador.

## Conteúdo

- **491 `SKILL.md`** no total (`node scripts/ci/count-skills.js` — fonte única).
- **411** herdadas do upstream ECC (inventário do bundle, idiomas, e documentação de cada uma ficam no upstream).
- **80 autorais** (em português ou originais; lista curada em [`manifests/skills-autorais.json`](manifests/skills-autorais.json)):

### Autorais — núcleo

| Skill | O que faz |
|-------|-----------|
| `doctor` | Auditoria e enxugamento de "peso morto" em instruções/contexto de projetos, agentes e skills — remove conteúdo que modelos modernos não precisam mais, com fases read-only → diagnóstico → aprovação → rollback. |
| `engenharia-de-grafos` | Práticas de engenharia de grafos para agentes de IA. |
| `grills` | Stress-test adversarial de planos e implementações (casos extremos, concorrência, carga) antes de finalizar. |
| `score-loop` | Loop gerador-avaliador com nota mínima: gera em alto padrão, avalia contra rubrica, e refaz até atingir o corte. |

### Autorais — derivadas de análise de conteúdo (2026-08-11)

| Skill | O que faz | Módulo no manifest |
|-------|-----------|--------------------|
| `humanizar-texto` | Remove padrões de texto que denunciam IA (AI-slop): travessão abusivo, "inovador", trios perfeitos. Mantém tom e fatos. | business-content |
| `analise-concorrentes` | Levanta o que concorrentes rodam AGORA (Meta Ads Library, landing pages, funis, hooks, ofertas) e vira relatório acionável. | business-content |
| `criar-campanha-visual` | Gera campanha visual (imagem/vídeo/site) com orçamento fechado, roteia o modelo mais barato entre fornecedores, usa referências de marca e registra histórico (posse dos arquivos). | business-content |
| `pesquisa-social` | Pesquisa sentimento/experiência real de usuários em plataformas sociais (meio-termo entre busca web e deep research); ranqueia por convergência. | research-apis |
| `workflows` | Guia de decisão da escada chat→skill→subagente→agent team→workflow, com controle de custo (escopo fechado, Haiku nos workers, monitoramento). | agentic-patterns |
| `routines` | Agenda sessões autônomas do seu agente de IA na nuvem (gatilho horário/webhook/GitHub), sem VPS nem computador ligado. Funciona com Claude Code, OpenCode, Codex e outros. | agentic-patterns |
| `graphify` | Transforma repositório grande/legado em grafo de conhecimento consultável; economiza tokens e responde como as coisas se conectam. | workflow-quality |
| `criar-skill` | Autoragem de skills: processo de 4 etapas, Skill Creator/Record a Skill, estrutura de 3 camadas, as 4 regras dos engenheiros da Anthropic. | workflow-quality |
| `automacao-deterministica` | Decide o que vira script (tarefa previsível A+B=C) vs o que fica na IA (criativo/raciocínio); com guardrails de manutenção e segurança. | operator-workflows |

### Autorais — fluxo spec-driven (derivadas do [spec-kit](https://github.com/github/spec-kit), 2026-08-13)

| Skill | O que faz | Módulo no manifest |
|-------|-----------|--------------------|
| `constituicao-projeto` | Cria/atualiza a constituição do projeto — princípios inegociáveis com versionamento semântico, Scope Guard e Sync Impact Report. | workflow-quality |
| `clarificar` | Interrogatório de ambiguidade do spec: até 5 perguntas dirigidas (uma por vez, com recomendação justificada), respostas gravadas de volta no documento. | workflow-quality |
| `checklist-requisitos` | "Unit tests for English": checklist que testa a qualidade dos requisitos (completude, clareza, consistência), não a implementação. Agente nunca marca [x]. | workflow-quality |
| `auditoria-artefatos` | Análise read-only de consistência entre spec/plano/tarefas: duplicações, ambiguidades, lacunas de cobertura, violações de constituição, com severidade. | workflow-quality |
| `convergencia` | Compara código atual com spec/plano/tarefas e anexa o trabalho restante como tarefas (append-only) até a implementação convergir. | workflow-quality |
| `triagem-ideias` | Pipeline go/kill para ideias cruas (intake→pesquisa→definição→formato→decisão) antes de investir em especificar/codar. | workflow-quality |
| `triagem-bug` | Avaliar→corrigir→provar com separação de papéis: reproduz e classifica antes de tocar no código, corrige causa-raiz, prova com execução. | workflow-quality |

### Autorais — leva YouTube (derivadas da coleta `coletar-oportunidades-youtube`, 2026-09-18)

| Skill | O que faz | Módulo no manifest |
|-------|-----------|--------------------|
| `defuddle-leitura-limpa` | Sanitiza página web para só o conteúdo relevante antes de entregar ao agente (remove chrome/ads/scripts), com medida de redução. | workflow-quality |
| `caveman-saida-enxuta` | Poda verbosidade de saída do modelo (preâmbulo, resumo repetido, oferta de ajuda); preserva fatos e define quando NÃO cortar. | workflow-quality |
| `swarm-readiness-gate` | Checklist go/no-go antes de rodar swarm (sandbox, DoD+bail-out, budget, referee/canônico, mailbox/locks, kill-switch). | agentic-patterns |
| `drive-screen-os-control` | Pilota o SO só com coding agent + CLI nativa (sem harness pesado): control-loop discover→screenshot→focus→act, triagem último-recurso. | agentic-patterns |
| `sast-gate-pr` | Gate SAST determinístico em workflow issue→PR: scanner via API como nó de script, iteração forçada até green, taxonomia CVE. | security |
| `claude5-prompt-rewrite` | Reescreve prompts/skills pré-Claude-5 (7 regras Fable/Opus 5 + apêndice Astra): goal+why+done, sem over-triggers/rituais, diff para aprovação. | agentic-patterns |
| `agentic-benchmark-top5` | Monta Top-5 pessoal de benchmarks (Terminal/Apex/Automation/Omniscience/Deep SWE) pelo triângulo performance/custo/velocidade. | optimization-workflows |
| `harness-arena-comparison` | Compara harnesses em arena third-party: battle-log, scoring cego por rubrica, leitura cautelosa de leaderboard, benchmark próprio. | optimization-workflows |
| `codebase-mapa-indexado` | Indexa o repo 1x e consulta o mapa (GPS + blast-radius) em vez de reler arquivos; atualização incremental. | workflow-quality |
| `funil-cro-watch` | Funcionário-IA que vigia funil/CRO todo dia: coleta, compara, diagnostica causa, atua com permissão ou escala a humano. | business-content |
| `youtube-packaging` | Embala vídeo final: 3 thumbs + 3 títulos para A/B, descrição com timestamps, página de links com pixels. | media-generation |
| `knowledge-work-proxy-eval` | Avalia agentes em pacotes banking/consulting/legal (prompts vagos + workspace + trajectory) como proxy do seu domínio. | optimization-workflows |
| `agent-misbehavior-controls` | Controles contra agente insider (sandbox por task, sem infra compartilhada gravável, auditoria de processo, tripwires, eval separado). | security |

### Autorais — leva YouTube rodada 2 (2026-09-18, +14 vídeos)

| Skill | O que faz | Módulo no manifest |
|-------|-----------|--------------------|
| `attention-architecture` | Supervisão N→1 durante-run: envelope de evidência, inbox de exceções, batching, escalation path, métrica N:1. | agentic-patterns |
| `mcp-local-bridge` | Ponte MCP local via STDIO: checklist de conexão, matriz de paths Win/WSL/Mac, extensão sem selo, read-skill-first. | framework-language |
| `design-in-repo` | Design versionado no repo (`.pen` JSON em `design/`, gitattributes binário, split lib/pages, nunca editar na mão). | framework-language |
| `design-code-drift-ci` | CI de drift design↔código por PR: motor headless, relatório com evidência, AI review, gate vs warn. | framework-language |
| `meeting-brief-pre-read` | Brief before/during/after escaneável em 60s (who→why→action), choose-not-to-show, rubrica UX. | operator-workflows |
| `proposta-comercial-auto` | Transcrição→proposta via tabela de preços (conformidade, gate humano obrigatório) + follow-up D+3/D+7/D+14. | business-content |
| `repurpose-shorts-dm-funnel` | Long→shorts com funil keyword-DM: 1 keyword/corte, CTA em voz, gate de revisor, multi-conta. | media-generation |
| `claude-admin-model-governance` | Playbook de governança: defaults por role, entitlements, effort caps, custo-por-tarefa. | agentic-patterns |
| `support-agent-report-card` | QA de suporte: golden set 16+ (mystery+adversarial), policy versionada, rerun, relatório client-ready. | optimization-workflows |
| `system-one-judgment-triage` | Triagem barata (~100-200ms): bundle Choice/Score/Prob, negação explícita, other/unknown + human review. | workflow-quality |

### Autorais — leva YouTube rodada 3 (2026-09-18, +6 vídeos)

| Skill | O que faz | Módulo no manifest |
|-------|-----------|--------------------|
| `ugc-seedance-talking-head` | UGC talking-head fim-a-fim: trends → vibe-clone JSON → Seedance → demo sem rosto → 1 demo × N hooks → ledger $/s. | media-generation |
| `health-coach-wearables` | Coach de bem-estar via wearables (MCP + fallback manual): coleta semanal, análise simples, 1 mudança por vez, sem diagnóstico. | operator-workflows |
| `cartao-pontos-optimizer` | Otimizador PF de cartões: 2-6 faturas → gasto por categoria → 1 cartão por benefício → cancela/downgrade + plano 90d. | business-content |
| `linkedin-inbox-triage` | Triagem de inbox LinkedIn em 4 buckets, draft-first, segredo nunca vai ao bot, resposta com 1 comando. | social-distribution |
| `junior-seniorizado-playbook` | Hiring-readiness verificável: 5 movimentos, rubrica "sabe dizer se a IA fez tá certo?", projeto dono-real, filtro de empresas. | business-content |
| `claude-safety-monitoring-window` | Política da janela rolante de monitoramento (~30d): o que retém, por quê, checklist de aceite e revisão. | security |
| `claude-zero-retention-frontier` | ZDR + Frontier Safeguards: matriz de decisão, custódia BYOK no cloud do cliente, transição faseada. | security |

### Autorais — leva YouTube rodada 4 (2026-09-18, +7 vídeos + 4 enriches)

| Skill | O que faz | Módulo no manifest |
|-------|-----------|--------------------|
| `self-improvement-ladder` | Governança da escada B0–L5: banco de experiências, repair-procedures, gate estrutural≠efetivo, anti-benchmark-gaming. | agentic-patterns |

Enrichments cirúrgicos da rodada: `agent-misbehavior-controls` (+legibilidade emergente, +bateria RL-stress, +janela CoT), `eval-harness` (+Petri/paridade prod↔teste), `fusion-harness` (+coordenador evoluído).

### Redundância reconciliada (3 variantes PT mantidas)

As skills `prompt-builder`, `encontrar-skill` e `auditar-skills` têm equivalentes no bundle
(`prompt-optimizer`, `skill-scout`, `skill-stocktake`), mas foram **mantidas no repo como variantes
em português/enriquecidas** — não são duplicatas cruas:

| Skill (PT) | Equivalente no bundle | Motivo de manter |
|-----------|----------------------|------------------|
| `prompt-builder` | `prompt-optimizer` (pipeline de 6 fases, mapeado ao ecossistema ECC) | Adaptação em PT com ajustes por modelo/mídia |
| `encontrar-skill` | `skill-scout` (busca local/GitHub/web + vetting + ranking) | Fluxo de descoberta em PT, filtro por estrelas/instalações |
| `auditar-skills` | `skill-stocktake` (auditoria com quick/full scan e verdicts) | Scorecard 0–100 em PT, ranking pior→melhor |

## Estrutura

```
skills/          # todas as skills (295 ECC + 49 autorais; lista autorais em manifests/skills-autorais.json)
  doctor/                  # autoral
  engenharia-de-grafos/    # autoral
  grills/                  # autoral
  score-loop/              # autoral
  humanizar-texto/         # autoral
  analise-concorrentes/    # autoral
  criar-campanha-visual/   # autoral
  pesquisa-social/         # autoral
  workflows/               # autoral
  routines/                # autoral
  graphify/                # autoral
  criar-skill/             # autoral
  automacao-deterministica/# autoral
  constituicao-projeto/    # autoral (spec-driven)
  clarificar/              # autoral (spec-driven)
  checklist-requisitos/    # autoral (spec-driven)
  auditoria-artefatos/     # autoral (spec-driven)
  convergencia/            # autoral (spec-driven)
  triagem-ideias/          # autoral (spec-driven)
  triagem-bug/             # autoral (spec-driven)
scripts/         # ferramentas, incl. sync do upstream
manifests/       # install-modules.json (módulos de instalação)
.github/         # deploy-pages (GitHub Pages) + CODEOWNERS/dependabot do autor
```

## Proveniência das skills autorais novas

As 9 skills derivadas foram criadas a partir da análise de **16 vídeos transcritos**
(yt-dlp auto-subs, 2026-08-11). Relatório, scorecard de auditoria das skills e
transcrições `.dedup.txt` ficam em um diretório local fora deste repo.
Mapa transcrição→skill no `RELATORIO.md`.

## Manutenção / atualização das skills

### 1. Sync do upstream ECC

A parte ECC do bundle vem do upstream `affaan-m/ECC` (MIT). Para atualizar as skills herdadas:

```bash
# Adiciona o upstream (uma vez)
git remote add upstream https://github.com/affaan-m/ECC.git

# Sincroniza (fetch + merge) — veja scripts/sync-upstream.sh
./scripts/sync-upstream.sh
```

O script `sync-upstream.sh` faz `fetch` + `merge` do branch principal do upstream para o seu `master`.
Conflitos (ex.: se você editou uma skill que também mudou lá em cima) precisam ser resolvidos
manualmente — o git vai apontá-los. As suas **49 skills autorais** (ver `manifests/skills-autorais.json`)
não são tocadas pelo merge, pois não existem no upstream.

Recomendação: rode o sync após novas releases do ECC, e rode a skill `doctor` periodicamente para
remover peso morto acumulado.

### 2. Fluxo para adicionar skill autoral nova

1. **Redundância**: rode `skill-scout` (busca no bundle/GitHub antes de criar) — se existir
   equivalente, adapte o existente em vez de duplicar.
2. **Autoragem**: siga `criar-skill` (processo de 4 etapas + as 4 regras da Anthropic).
3. **Registrar**: adicione o caminho `skills/<nome>` ao módulo certo em `manifests/install-modules.json`
   (ex.: conteúdo → `business-content`, pesquisa → `research-apis`, orquestração → `agentic-patterns`,
   qualidade/auditoria → `workflow-quality`, automação → `operator-workflows`).
4. **Validar**: `node scripts/ci/validate-skills.js --strict` e
   `node scripts/ci/validate-install-manifests.js` (requer `npm install` no repo).
5. **Documentar**: atualize as tabelas deste README (total, autorais, módulo) — os números são
   gerados por `node scripts/ci/count-skills.js` (fonte única de verdade:
   `manifests/skills-autorais.json`).

### 3. Auditoria periódica

- `skill-stocktake` (no bundle): avalia as skills instaladas (Keep/Improve/Update/Retire/Merge).
- `auditar-skills` (skill autoral no repo): scorecard 0–100 com ranking pior→melhor.
- `validate-no-personal-paths.js`: CI que impede caminhos absolutos pessoais em docs/skills/commands/manifests.

## Autor

> Conteúdo pessoal — não representa o empregador nem reflete políticas de nenhuma instituição financeira.

**William Batista Gomes** — aka **magros Zapatero**

SRE e Engenheiro de Software. Constrói bibliotecas de skills de IA, portfólios 3D interativos e produz DJ sets sob o alias **Björk von Hohenheim**. 

**Experiência:**
- **Class Runner** na ESL (English as Second Language).
- **Host/Manager/DJ** no Fiteiro Cultural.

- Portfólio: https://majinmagros.github.io/folio-2025/
- GitHub: https://github.com/majinmagros
- LinkedIn: https://www.linkedin.com/in/william-batista-gomes-601a2883/
- YouTube: https://www.youtube.com/channel/UC5sg6RpxRIWdaPtyI7bznjg
- X/Twitter: https://x.com/MagrosZapatero
- Instagram: https://www.instagram.com/magroszapatero/

Biografia completa em [`AUTHOR.md`](AUTHOR.md).

## Licença

> Conteúdo pessoal de uso livre do autor. **Não representa o empregador.** Não use as skills com
> dados corporativos/internos da sua empresa.

- Conteúdo herdado do ECC: **MIT** (ver `LICENSE` — mantido do upstream `affaan-m/ECC`).
- Skills autorais (ver `manifests/skills-autorais.json`): MIT, salvo indicação em contrário.
