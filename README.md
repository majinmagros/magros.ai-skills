# magros.ai-skills

Biblioteca pessoal de skills de IA para agentes de código (Claude Code, OpenCode, Codex, etc.).

Este repositório é uma **base do bundle ECC** ([Everything Claude Code](https://github.com/affaan-m/ECC), MIT) com um conjunto de **skills autorais** adicionadas por cima.

## Conteúdo

- **314 `SKILL.md`** no total.
- **284** herdadas do upstream ECC (inventário do bundle, idiomas, e documentação de cada uma ficam no upstream).
- **30 autorais** (em português ou originais):

### Autorais — núcleo

| Skill | O que faz | Módulo no manifest |
|-------|-----------|--------------------|
| `doctor` | Auditoria e enxugamento de "peso morto" em instruções/contexto de projetos, agentes e skills — remove conteúdo que modelos modernos não precisam mais, com fases read-only → diagnóstico → aprovação → rollback. | workflow-quality |
| `engenharia-de-grafos` | Práticas de engenharia de grafos para agentes de IA. | workflow-quality |
| `grills` | Stress-test adversarial de planos e implementações (casos extremos, concorrência, carga) antes de finalizar. | workflow-quality |
| `score-loop` | Loop gerador-avaliador com nota mínima: gera em alto padrão, avalia contra rubrica, e refaz até atingir o corte. | workflow-quality |

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

### Autorais — assistentes pessoais de produtividade

| Skill | O que faz | Módulo no manifest |
|-------|-----------|--------------------|
| `anti-hallucination` | Impede a IA de inventar fatos: verifica caminhos, comandos e fontes contra o sistema real antes de afirmar ou agir (anti-alucinação). | workflow-quality |
| `auditar-skills` | Dá nota 0–100 de clareza/qualidade para cada skill instalada e produz um scorecard rankeado (pior → melhor) com 1 correção acionável por skill. | workflow-quality |
| `encontrar-skill` | "App store de skills": entende o problema, busca no GitHub/marketplaces, filtra por estrelas/licença/recência e recomenda a skill certa pro SEU caso. | workflow-quality |
| `goal` | Fixa um objetivo durável + critério de aceite para sessões longas; só declara pronto após PROVAR com checagens reais (testes, não vibes). | workflow-quality |
| `graph-engineering` | Loop & graph engineering: gera candidatos, verifica em paralelo e itera até a nota mínima. Companheira da `dnb-production`; método vale p/ qualquer saída rankeável. | workflow-quality |
| `grill-with-docs` | Mesma entrevista do `/grill`, mas grava cada decisão num `DECISIONS.md` estruturado (decisão, racional, alternativas rejeitadas, critério de validação). | workflow-quality |
| `grilling` | Pressão-teste de ideias: entrevista de UMA pergunta por vez (objetivo → escopo → restrições → riscos → validação) até o plano ficar afiado. Não implementa. | workflow-quality |
| `plan` | Plano decision-complete ancorado nos arquivos reais; para e pede aprovação antes de escrever código (`/plan`). | workflow-quality |
| `superpowers` | TDD leve + tarefas pequenas e verificáveis + aprovação do usuário a cada passo. Aplica a todo trabalho multi-etapa. | workflow-quality |
| `gauntlet-loop` | Arquitetura p/ resultado "uau": quebra em segmentos, cada um com subagente executor + verificador às CEGAS (sem contexto de criação), barra de aprovação = surpresa real. Caro (horas + muitos tokens) — só p/ entregas excepcionais. | workflow-quality |
| `prompt-builder` | Transforma instrução preguiçosa em prompt bom pelos 4 pilares (objetivo, contexto, exemplo, restrições); gera, conserta ou adapta por modelo/mídia. | agentic-patterns |
| `baixar-musica` | Baixa áudio do YouTube: busca via `ytsearch`, CONFIRMA a faixa com o usuário e só então baixa com `baixar_audio.ps1`. | media-generation |
| `dnb-production` | Produção de Drum'n Bass original via harness: MusicGen gera, verificador nota 0–100, itera até >= 80. 100% original, sem stems de artistas. | media-generation |
| `clareza` | Analista de documentos/contratos: modo telescópio (panorama) ou microscópio (cláusulas, prazos, riscos), sempre com fonte citada. | business-content |
| `conversa` | Simulador + treinador de conversas de alto risco (reuniões, entrevistas, negociação): ensaia e depois dá feedback objetivo. | business-content |
| `coordenacao` | Protege a rotina: categoriza mensagens (urgente/informativo/ignorar), cruza com a agenda, propõe blocos de foco e rascunha respostas. | business-content |
| `criatividade` | Transforma anotações brutas em entregáveis formatados (slides PPTX, DOCX, PDF) com aprovação do usuário em cada etapa. | business-content |

### Redundância tratada (equivalentes no bundle)

`prompt-builder`, `encontrar-skill` e `auditar-skills` têm equivalentes herdados do ECC
(`prompt-optimizer`, `skill-scout`, `skill-stocktake`). As versões autorais **foram mantidas
de propósito**: são mais curtas, em português e adaptadas ao fluxo pessoal — escolha conforme
a profundidade desejada (bundle = pipeline completo; autoral = decisão rápida).

## Estrutura

```
skills/          # todas as skills (284 ECC + 30 autorais)
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
  anti-hallucination/      # autoral (produtividade)
  auditar-skills/          # autoral (produtividade)
  baixar-musica/           # autoral (produtividade)
  clareza/                 # autoral (produtividade)
  conversa/                # autoral (produtividade)
  coordenacao/             # autoral (produtividade)
  criatividade/            # autoral (produtividade)
  dnb-production/          # autoral (produtividade)
  encontrar-skill/         # autoral (produtividade)
  goal/                    # autoral (produtividade)
  graph-engineering/       # autoral (produtividade)
  gauntlet-loop/           # autoral (produtividade)
  grill-with-docs/         # autoral (produtividade)
  grilling/                # autoral (produtividade)
  plan/                    # autoral (produtividade)
  prompt-builder/          # autoral (produtividade)
  superpowers/             # autoral (produtividade)
scripts/         # ferramentas, incl. sync do upstream
manifests/       # install-modules.json (módulos de instalação)
.github/         # (workflows ECC removidos — não aplicáveis a repo de skills)
```

## Instalação

### Jeito fácil (copiar a pasta `skills/`)

As skills são pastas com um arquivo `SKILL.md` dentro. Instalar = copiar a pasta da
skill para o diretório de skills do seu agente:

- **Claude Code**: `~/.claude/skills/` (global) ou `.claude/skills/` (por projeto)
- **OpenCode**: `~/.config/opencode/skills/`
- **Cursor**: `.cursor/skills/`
- **Codex**: `~/.codex/skills/`

Quer só algumas? Copie só as pastas que te interessam (ex.: `skills/grilling/`,
`skills/plan/`). Cada skill é independente.

### Jeito gerenciado (instalador ECC)

```bash
# clona o repo e instala um perfil completo (recomendado p/ quem quer TUDO)
git clone https://github.com/majinmagros/magros.ai-skills.git
cd magros.ai-skills
npm install
./install.sh --target claude --profile full

# só skills autorais de produtividade (ex.: OpenCode)
./install.sh --target opencode --modules workflow-quality,agentic-patterns,business-content,media-generation

# skills avulsas por id
./install.sh --target claude --skills grilling,plan,goal
```

### Verificando a instalação

- O arquivo ficou em `SKILL.md` dentro da pasta certa? Ok.
- Reinicie o agente. As skills não são hot-reloaded.
- Rode `npm test` no repo (valida skills, manifests e ausência de caminhos pessoais).

> **Detalhe para leigos**: a skill é um "manual de instruções" que o agente de IA lê
> quando o assunto aparece. Não é um programa instalado no sistema — é um arquivo `.md`
> estruturado que ensina o agente a agir daquele jeito específico.

**Guia completo (leigo)**: veja [`GUIA-COMPLETO.md`](GUIA-COMPLETO.md) — explica o que
é uma skill, instalação passo a passo e como funciona cada uma das 30 autorais.

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
manualmente — o git vai apontá-los. As suas **30 skills autorais não são tocadas** pelo merge, pois
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
- Skills autorais (todas as 30 listadas acima): MIT, salvo indicação em contrário.
