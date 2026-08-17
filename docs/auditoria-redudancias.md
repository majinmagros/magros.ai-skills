# Auditoria de redundâncias — catálogo de skills

Relatório da Fase C (auditar-skills). Escopo: detectar pares com overlap real
para decidir consolidações em lote. Método: similaridade de description
(Jaccard >= 0.30) + inspeção manual das famílias autoral/loop/grill.

Gerado em: 2026-08-17 · Catálogo base: 336 skills.

## Resumo executivo

- **2 pares já consolidados** nesta rodada (Fases A1–A4): `engenharia-de-grafos`
  ↔ `graph-engineering` (canônica + companion) e `autonomous-loops` →
  deprecada (superseded por `continuous-agent-loop`).
- **Nenhum par novo exige fusão imediata.** A maioria da similaridade por
  description é paralelismo intencional por linguagem/framework, não
  redundância.
- **1 decisão de fronteira confirmada:** `score-loop` ↔ `gauntlet-loop` são
  complementares — manter ambos.
- **1 risco de naming** (não de conteúdo): `grilling` vs `grills`.

## Pares analisados e veredito

### 1. engenharia-de-grafos ↔ graph-engineering — CONSOLIDADO

- `engenharia-de-grafos` (autoral, sem módulo): canônica genérica (decompor em
  tarefas paralelas com verificadores independentes, loop por nota >= 80).
- `graph-engineering` (autoral, sem módulo): virou **companion fina do
  `dnb-production`** (BPM 174, pesos Clip/BPM/Densidade, `verify_loop.ps1`).
- Ação: `engenharia-de-grafos` registrada no módulo `agentic-patterns`.

### 2. autonomous-loops ↔ continuous-agent-loop — CONSOLIDADO

- `autonomous-loops` (agentic-patterns): patterns de loops autônomos.
- `continuous-agent-loop` (agentic-patterns): loops contínuos com quality
  gates/evals — cobertura estrita de autonomous-loops.
- Ação: `autonomous-loops` deprecada no frontmatter
  (`status: deprecated`, `supersededBy: continuous-agent-loop`).

### 3. score-loop ↔ gauntlet-loop — MANTER AMBOS (complementares)

| | score-loop | gauntlet-loop |
|---|---|---|
| Barra de aprovação | nota numérica (default 85) | "uau"/surpresa do verificador |
| Avaliação | rubrica ponderada, mesma sessão | julgamento às cegas (verificador sem contexto) |
| Estrutura | loop único iterativo | segmentação + pares executor/verificador |
| Orçamento | baixo-médio | alto (horas + centenas de milhares de tokens) |
| Persistência | warm-start (`vencedores.json`) | — |

Fronteira clara: tarefa que "só precisa funcionar provado por nota" → score-loop;
tarefa criativa que "precisa impressionar" → gauntlet-loop. A description do
gauntlet-loop já referencia essa divisão.

- Ação: nenhuma fusão. `score-loop` registrada no módulo `agentic-patterns`
  (junto com `engenharia-de-grafos`).

### 4. grilling ↔ grill-with-docs — MANTER (superset)

- `grill-with-docs` é o `grilling` + gravação de decisões em `docs/DECISIONS.md`.
- Relação irmã proposital (uma grava, outra não). Sem redundância.

### 5. grilling ↔ grills — RISCO DE NAMING, SEM FUSÃO

- `grilling` (autoral): entrevista de pressão-teste da IDEIA — uma pergunta de
  decisão por vez, interroga o USUÁRIO.
- `grills` (autoral): stress-test repetido e adverso da SOLUÇÃO (edge cases,
  concurrency, load) antes de finalizar.
- Conteúdo distinto, mas o nome é confuso (singular/plural). Recomenda-se:
  clarificar as descriptions (deixar explícito "entrevista do usuário" vs
  "stress-test do código") em uma próxima rodada — não é urgente.

### 6. goal ↔ superpowers — MANTER (distintos)

- `goal`: objetivo durável com critério de aceite para sessão longa.
- `superpowers`: workflow TDD em passos pequenos com aprovação.
- Sem overlap real (critério de aceite vs método de execução).

### 7. plan ↔ blueprint — OVERLAP PARCIAL, MANTER

- `plan` (autoral): plano aprovado-gated para uma tarefa, ancorado nos arquivos.
- `blueprint` (agentic-patterns): plano multi-sessão/multi-agente com grafo de
  dependências e portões de revisão — caso complexo.
- Recomendação: `plan` = tarefa única; `blueprint` = multi-PR/multi-sessão.
  Adicionar referência cruzada nas descriptions (opcional, baixa prioridade).

## Similaridade por description que NÃO é redundância (sem ação)

- Família verification por framework: `quarkus-verification`,
  `springboot-verification`, `django-verification`, `laravel-verification` —
  mesmo template, linguagens diferentes (intencional).
- Família patterns/testing por linguagem: `golang-patterns`, `kotlin-patterns`,
  `dotnet-patterns`, `perl-patterns`, `python-patterns`, `rust-patterns` e
  respectivos testing — paralelismo por linguagem (intencional).
- Família security por framework: `django-security`, `laravel-security`,
  `quarkus-security`, `springboot-security` — idem.
- `motion-patterns` ↔ `motion-ui`: camadas da mesma stack de motion
  (foundations → patterns → ui), hierarquia proposital.

## Skills autoral/curated sem módulo (27 → 25 após registro)

Após registrar `engenharia-de-grafos` e `score-loop` no `agentic-patterns`,
restam 25 skills sem módulo — maioria autoral local (agentes pessoais como
`clareza`, `conversa`, `coordenacao`, `criatividade`, `dnb-production`,
`superpowers`, `plan`, `grilling`, etc.). Não é redundância: são skills do
workspace pessoal que não foram distribuídas em módulos. Decisão em aberto:
registrar em um módulo "pessoal" ou manter fora do manifest (só local).

## Ações recomendadas (próxima rodada, opcional)

1. Clarificar description de `grilling` vs `grills` (risco de ativação errada).
2. Referência cruzada `plan` ↔ `blueprint`.
3. Decidir o destino das 25 skills autoral sem módulo (módulo pessoal vs
   manter fora do manifest).