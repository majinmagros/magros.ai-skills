# magros.ai-skills

Biblioteca pessoal de skills de IA para agentes de código (Claude Code, OpenCode, Codex, etc.).

Este repositório é uma **base do bundle ECC** ([Everything Claude Code](https://github.com/affaan-m/ECC), MIT) com um conjunto de **skills autorais** adicionadas por cima.

## Conteúdo

- **297 `SKILL.md`** no total.
- **284** herdadas do upstream ECC (inventário do bundle, idiomas, e documentação de cada uma ficam no upstream).
- **13 autorais** (em português ou originais):

### Autorais — núcleo

| Skill | O que faz |
|-------|-----------|
| `doctor` | Auditoria e enxugamento de "peso morto" em instruções/contexto de projetos, agentes e skills — remove conteúdo que modelos modernos não precisam mais, com fases read-only → diagnóstico → aprovação → rollback. |
| `engenharia-de-grafos` | Práticas de engenharia de grafos para agentes de IA. |
| `grills` | Stress-test adversarial de planos e implementações (casos extremos, concorrência, carga) antes de finalizar. |
| `score-loop` | Loop gerador-avaliador com nota mínima: gera em alto padrão, avalia contra rubrica, e refaz até atingir o corte. |

### Autorais — derivadas da análise do canal Maestros da IA (2026-08-11)

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

### Redundância tratada (3 candidatas NÃO adicionadas)

Na comparação com as 288 skills do upstream, 3 candidatas foram **puladas** por já existirem equivalentes no bundle — seguindo a política do `skill-scout` (não duplicar):

| Candidata | Equivalente no bundle |
|-----------|----------------------|
| `prompt-builder` | `prompt-optimizer` (pipeline de 6 fases, mapeado ao ecossistema ECC) |
| `encontrar-skill` | `skill-scout` (busca local/GitHub/web + vetting + ranking) |
| `auditar-skills` | `skill-stocktake` (auditoria com quick/full scan e verdicts) |

## Estrutura

```
skills/          # todas as skills (284 ECC + 13 autorais)
  doctor/                  # autoral
  engenharia-de-grafos/    # autoral
  grills/                  # autoral
  score-loop/              # autoral
  humanizar-texto/         # autoral (Maestros da IA)
  analise-concorrentes/    # autoral (Maestros da IA)
  criar-campanha-visual/   # autoral (Maestros da IA)
  pesquisa-social/         # autoral (Maestros da IA)
  workflows/               # autoral (Maestros da IA)
  routines/                # autoral (Maestros da IA)
  graphify/                # autoral (Maestros da IA)
  criar-skill/             # autoral (Maestros da IA)
  automacao-deterministica/# autoral (Maestros da IA)
scripts/         # ferramentas, incl. sync do upstream
manifests/       # install-modules.json (módulos de instalação)
.github/         # (workflows ECC removidos — não aplicáveis a repo de skills)
```

## Proveniência das skills autorais novas

As 9 skills "Maestros da IA" foram derivadas da análise de **16 vídeos transcritos** do canal
[Maestros da IA](https://www.youtube.com/@MaestrosdaIA) (yt-dlp auto-subs, 2026-08-11):
relatório, scorecard de auditoria das skills e transcrições `.dedup.txt` ficam em
`C:\projetos\maestros-da-ia\` (não fazem parte deste repo). Mapa transcrição→skill no `RELATORIO.md`.

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
