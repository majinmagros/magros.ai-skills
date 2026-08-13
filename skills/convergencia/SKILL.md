---
name: convergencia
description: Use after implementation to compare code against spec/plan/tasks and surface remaining work. Triggers on "/convergencia", "converge a implementação", "código bate com o spec?", "o que falta implementar?", "gap entre código e requisitos". Avalia o estado ATUAL do código contra spec/plano/tarefas, classifica gaps (missing/partial/contradicts/unrequested) e ANEXA tarefas restantes à lista — append-only, nunca reescreve.
---

# Skill: /convergencia — Feche o gap entre spec e código

Feche a distância entre o que spec/plano/tarefas pedem e o que o código
implementa hoje. Os artefatos são a **única fonte de intenção** (com a
constituição como restrição de governança).

Isto **não** é ferramenta de diff: não usa git, não compara branches, não
rastreia histórico. Avalia o estado presente do código contra os artefatos.

## Restrições de operação

**APPEND-ONLY, NUNCA REESCREVE**. A única escrita permitida é **anexar** uma
nova seção `## Fase N: Convergência` à lista de tarefas. Proibido:

- modificar spec ou plano de qualquer forma;
- reescrever, renumerar, reordenar ou deletar tarefa existente (inclusive de
  fase de convergência anterior);
- criar/modificar/deletar código de aplicação — completar as tarefas anexadas
  é trabalho da fase de implementação.

Se o código já satisfaz tudo: **nenhuma alteração** na lista de tarefas (nem
header vazio) e reporte resultado limpo.

**Constituição**: inegociável. Código que viola princípio MUST = achado de
maior severidade + tarefa de remediação. Constituição ainda em template não
preenchido → pule a checagem graciosamente.

## Passos

### 1. Localize os artefatos

SPEC, PLAN, TASKS e constituição (se existir). Algum dos três primeiros
faltando → pare com mensagem indicando qual etapa rodar antes (especificar,
planejar, ou gerar tarefas). Sem output parcial.

### 2. Carregamento progressivo

- **Spec**: requisitos funcionais, critérios de sucesso (só itens construíveis
  — exclua métricas pós-launch), user stories com cenários de aceite, edge cases.
- **Plano**: decisões de arquitetura/stack, modelo de dados, fases e
  touch-points nomeados (arquivos/componentes a criar/editar), restrições.
- **Tarefas**: IDs (para calcular o próximo ID e próxima fase), descrições,
  fases, caminhos referenciados.
- **Constituição**: princípios e regras MUST/SHOULD.

### 3. Inventário de intenção

- Chave estável por requisito/critério/cenário de aceite (ex.: `US1/AC2`),
  mais decisões de plano e princípios de constituição que impõem obrigação
  construível.
- **Mapa de escopo de código**: a partir dos caminhos nomeados no plano/tarefas
  + busca por palavras-chave dos conceitos de cada requisito. Avalie **só**
  dentro desse escopo — não infira além dos artefatos.

### 4. Avalie o código e classifique gaps

Para cada item do inventário, inspecione o código no escopo e crie um
`Achado` apenas onde há gap. Tipos:

- **`faltando`** (missing): o trabalho está ausente do código.
- **`parcial`** (partial): existe mas não satisfaz plenamente o
  requisito/critério/decisão.
- **`contradiz`** (contradicts): o código conflita com a intenção declarada
  ou com MUST da constituição.
- **`não-solicitado`** (unrequested): código não pedido pelos artefatos —
  surge para consciência; a skill não deleta código, só anexa tarefa de
  revisar/justificar ou remover.

Cada achado: id estável, `fonte` rastreável, tipo de gap, severidade,
descrição curta com evidência (arquivo/área observada).

Casos extremos: pouco ou nenhum código ainda → trate todo o escopo
especificado como `faltando` (não falhe). Nada restante → zero achados, vá ao
passo 7 (ramo convergido).

### 5. Severidade

- **CRITICAL**: viola MUST da constituição, ou gap `faltando`/`contradiz`
  que bloqueia funcionalidade baseline de user story P1.
- **HIGH**: gap `faltando`/`parcial` em requisito funcional ou critério de
  aceite central.
- **MEDIUM**: gap `parcial` em requisito secundário, ou `não-solicitado` sem
  justificativa clara.
- **LOW**: gaps parciais menores, polimento, `não-solicitado` de baixo risco.

### 6. Resumo na sessão (antes de escrever)

| ID | Tipo de gap | Severidade | Fonte | Evidência | Trabalho restante |
|----|-------------|------------|-------|-----------|-------------------|

Métricas: requisitos/critérios checados, decisões de plano checadas,
princípios checados (ou "pulado — template"), achados por tipo e por severidade.

### 7. Anexe tarefas (ou declare convergido)

**Com achados acionáveis**: anexe ao **fim** da lista de tarefas:

1. Varra os IDs existentes; `M` = máximo. Próxima fase `N` = maior fase + 1.
2. Um único header novo: `## Fase N: Convergência`.
3. Um item por achado, CRITICAL/HIGH primeiro, IDs `T{M+1:03d}, T{M+2:03d}…`:

   ```markdown
   - [ ] T042 <descrição imperativa> conforme <fonte> (<tipo de gap>)
   ```

   `fonte` rastreia a origem: `FR-003`, `SC-002`, `US1/AC2`,
   `plano: decisão de storage`, `Constituição II`. Tarefas de violação de
   constituição vêm primeiro e são marcadas CRITICAL.
4. Nunca reutilize ou renumere IDs existentes; fase de convergência anterior
   fica intacta, a nova vai abaixo.

**Sem achados**: não toque na lista de tarefas. Reporte:
"✅ Convergiu — a implementação satisfaz spec, plano e tarefas." com contagens.

### 8. Próximos passos

- Tarefas anexadas: diga quantas e em qual fase; recomende implementar essas
  tarefas e re-rodar a convergência (deve achar menos ou nada).
- Convergiu: recomende revisão/PR — nenhum novo passe de implementação é
  necessário para o escopo especificado.
