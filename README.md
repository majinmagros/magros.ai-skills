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

- **322 `SKILL.md`** no total.
- **284** herdadas do upstream ECC (inventário do bundle, idiomas, e documentação de cada uma ficam no upstream).
- **38 autorais** (em português ou originais):

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
| `routines` | Agenda sessões autônomas do Claude Code na nuvem (gatilho horário/webhook/GitHub), sem VPS nem computador ligado. | agentic-patterns |
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

### Redundância tratada (3 candidatas NÃO adicionadas)

Na comparação com as 288 skills do upstream, 3 candidatas foram **puladas** por já existirem equivalentes no bundle — seguindo a política do `skill-scout` (não duplicar):

| Candidata | Equivalente no bundle |
|-----------|----------------------|
| `prompt-builder` | `prompt-optimizer` (pipeline de 6 fases, mapeado ao ecossistema ECC) |
| `encontrar-skill` | `skill-scout` (busca local/GitHub/web + vetting + ranking) |
| `auditar-skills` | `skill-stocktake` (auditoria com quick/full scan e verdicts) |

## Estrutura

```
skills/          # todas as skills (284 ECC + 38 autorais)
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
.github/         # (workflows ECC removidos — não aplicáveis a repo de skills)
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
manualmente — o git vai apontá-los. As suas **13 skills autorais não são tocadas** pelo merge, pois
não existem no upstream.

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
5. **Documentar**: atualize as tabelas deste README (total, autorais, módulo).

### 3. Auditoria periódica

- `skill-stocktake` (no bundle): avalia as skills instaladas (Keep/Improve/Update/Retire/Merge).
- `auditar-skills` (skill local equivalente, fora do repo): scorecard 0–100 com ranking pior→melhor.
- `validate-no-personal-paths.js`: CI que impede caminhos absolutos pessoais em docs/skills/commands.

## Licença

- Conteúdo herdado do ECC: **MIT** (ver `LICENSE` — mantido do upstream `affaan-m/ECC`).
- Skills autorais (todas as 13 listadas acima): MIT, salvo indicação em contrário.
