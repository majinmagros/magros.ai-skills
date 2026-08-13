---
name: auditoria-artefatos
description: Use after spec/plan/tasks exist, before implementing, to cross-check artifacts for inconsistencies. Triggers on "/auditoria-artefatos", "audita os artefatos", "consistência entre spec e plano", "spec, plano e tarefas batem?", "análise cruzada dos documentos". Análise READ-ONLY de consistência entre requisitos, plano técnico e lista de tarefas — reporta duplicações, ambiguidades, lacunas de cobertura e violações de constituição com severidade. Não modifica nada.
---

# Skill: /auditoria-artefatos — Consistência cruzada pré-implementação

Identifique inconsistências, duplicações, ambiguidades e subespecificação
entre os artefatos do projeto (requisitos/spec, plano técnico, lista de
tarefas) **antes** de implementar.

## Restrição absoluta

**ESTRITAMENTE READ-ONLY**: não modifique nenhum arquivo. Entregue um
relatório estruturado. Ofereça plano de remediação opcional — o usuário
aprova explicitamente antes de qualquer edição.

**Autoridade da constituição**: se o projeto tem constituição (skill
`constituicao-projeto`), ela é **inegociável**. Conflito com princípio MUST =
automaticamente CRITICAL. Ajusta-se spec/plano/tarefas — nunca se dilui ou
reinterpretar o princípio. Mudar um princípio acontece em atualização de
constituição separada e explícita.

## Passos

### 1. Localize os artefatos

- SPEC: documento de requisitos/especificação.
- PLAN: plano técnico (pode ser o output da skill `plan`).
- TASKS: lista de tarefas (pode estar dentro do plan).
- Qualquer um faltando: aborte com mensagem dizendo qual pré-requisito rodar.

### 2. Carregamento progressivo (só o necessário)

- **Do spec**: visão geral, requisitos funcionais, critérios de sucesso
  mensuráveis, user stories, edge cases.
- **Do plano**: stack/arquitetura, modelo de dados, fases, restrições técnicas.
- **Das tarefas**: IDs, descrições, agrupamento por fase, marcadores de
  paralelismo, caminhos de arquivo referenciados.
- **Da constituição** (se existir): nomes de princípios e regras MUST/SHOULD.

### 3. Modelos semânticos internos (sem despejar texto cru)

- **Inventário de requisitos**: chave estável por requisito (FR-###, critério
  de sucesso). Inclua só critérios que exigem trabalho construível — exclua
  métricas de resultado pós-launch (ex.: "reduzir tickets em 50%").
- **Inventário de ações de usuário**: ações discretas com critérios de aceite.
- **Mapa de cobertura**: cada tarefa ↔ requisitos/stories (por referência
  explícita ou inferência por palavras-chave).
- **Regras da constituição**: princípios e declarações normativas.

### 4. Passadas de detecção (alto sinal; máx. 50 achados)

- **A. Duplicação**: requisitos quase-duplicados; marque a redação pior para
  consolidação.
- **B. Ambiguidade**: adjetivos vagos (rápido, escalável, seguro, intuitivo,
  robusto) sem métrica; placeholders não resolvidos (TODO, ???).
- **C. Subespecificação**: requisito com verbo mas sem objeto/resultado
  mensurável; user story sem critério de aceite; tarefa referenciando
  arquivo/componente não definido em spec/plano.
- **D. Constituição**: conflito com MUST; seção/quality gate obrigatório ausente.
- **E. Lacunas de cobertura**: requisito sem nenhuma tarefa; tarefa sem
  requisito mapeado; critério de sucesso construível sem reflexo em tarefas.
- **F. Inconsistência**: deriva terminológica (mesmo conceito com nomes
  diferentes); entidade no plano ausente no spec (e vice-versa); ordem de
  tarefas contraditória; requisitos conflitantes.

### 5. Severidade

- **CRITICAL**: viola MUST da constituição, artefato central faltando, ou
  requisito sem cobertura que bloqueia funcionalidade baseline.
- **HIGH**: requisito duplicado/conflitante, atributo de segurança/performance
  ambíguo, critério de aceite não testável.
- **MEDIUM**: deriva terminológica, cobertura não-funcional faltando, edge
  case subespecificado.
- **LOW**: estilo/redação, redundância menor sem impacto na execução.

### 6. Relatório compacto

| ID | Categoria | Severidade | Localização | Resumo | Recomendação |
|----|-----------|------------|-------------|--------|--------------|

Mais: tabela de cobertura (requisito ↔ tarefas), problemas de constituição,
tarefas não mapeadas, e métricas — total de requisitos, total de tarefas,
cobertura %, contagem de ambiguidades/duplicações/críticos.

### 7. Próximos passos

- Com CRITICAL: resolva antes de implementar.
- Só LOW/MEDIUM: pode prosseguir, com sugestões de melhoria.
- Sugestões explícitas: "rode `clarificar`", "ajuste o plano", "adicione
  tarefa de cobertura para X manualmente".

### 8. Ofereça remediação

Pergunte: "Quer sugestões concretas de edição para os N principais problemas?"
— **nunca aplique automaticamente**.

## Princípios operacionais

- Tokens mínimos de alto sinal; resultados determinísticos (re-rodar sem
  mudanças produz os mesmos IDs/contagens).
- Nunca invente seções ausentes — reporte a ausência com precisão.
- Violação de constituição sempre CRITICAL, primeiro.
- Zero problemas: reporte sucesso com estatísticas de cobertura.
