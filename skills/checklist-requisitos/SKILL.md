---
name: checklist-requisitos
description: Use when reviewing or hardening requirements/specs before implementation. Triggers on "/checklist-requisitos", "checklist de requisitos", "validar qualidade dos requisitos", "requisitos estão bem escritos?", "unit tests for English". Gera checklist que testa a QUALIDADE DOS REQUISITOS (completude, clareza, consistência, mensurabilidade) — não a implementação. O agente gera itens, nunca marca [x].
---

# Skill: /checklist-requisitos — "Unit tests" para requisitos

## Conceito central: "Unit Tests for English"

Checklist é **teste da qualidade da escrita dos requisitos**, não teste do
sistema implementado.

**NÃO é** (testa implementação — proibido):

- ❌ "Verificar que o botão clica corretamente"
- ❌ "Testar que o tratamento de erro funciona"
- ❌ "Confirmar que a API retorna 200"

**É** (testa qualidade dos requisitos):

- ✅ "Os requisitos de hierarquia visual estão definidos para todos os tipos de card? [Completude]"
- ✅ "'Display proeminente' está quantificado com tamanho/posição específicos? [Clareza]"
- ✅ "Os requisitos de hover são consistentes em todos os elementos interativos? [Consistência]"
- ✅ "O spec define o que acontece quando a imagem do logo falha ao carregar? [Edge Case]"

Metáfora: se o spec é código escrito em português, o checklist é a suíte de
testes unitários dele. Testa-se se os requisitos estão bem escritos, completos,
sem ambiguidade e prontos para implementação.

## Propriedade dos checkboxes

- O checklist pertence ao **revisor humano**.
- `[x]` significa que o revisor aprovou o critério de qualidade — NÃO que
  trabalho de implementação foi concluído.
- Esta skill gera ou anexa itens; **NUNCA marca itens gerados como `[x]`**.
- O agente só ajuda a avaliar itens se o revisor pedir explicitamente.

## Passos

### 1. Clarifique a intenção (até 3 perguntas, máx. 5 no total)

Gere perguntas dinamicamente a partir do pedido do usuário + sinais do
spec/plano — nunca catálogo pré-pronto. Arquétipos:

- Refino de escopo: "Inclui integração com X e Y ou só o módulo local?"
- Priorização de risco: "Quais áreas de risco recebem checagem obrigatória?"
- Calibragem de profundidade: "Lista leve de sanity ou gate formal de release?"
- Audiência: "Uso do autor ou revisão por pares em PR?"
- Exclusão: "Exclui itens de tuning de performance desta vez?"
- Lacuna de cenário: "Fluxos de recovery/rollback estão no escopo?"

Se apresentar opções, tabela `| Opção | Candidata | Por que importa |`
(A–E no máximo). Nunca peça para repetir o que já foi dito. Sem categorias
especulativas — na dúvida pergunte "X está no escopo?".

Padrões sem interação: profundidade Standard; audiência Revisor (PR) se código,
senão Autor; foco nos 2 clusters mais relevantes.

### 2. Carregue o contexto

Leia os requisitos/spec (e plano/tarefas se existirem). Carregue só as partes
relevantes às áreas de foco; resuma seções longas em bullets; sem despejo de
arquivo inteiro.

### 3. Gere o checklist

Arquivo em `checklists/<dominio>.md` (ex.: `ux.md`, `api.md`, `security.md`).
Se já existe: **anexe** continuando do último ID CHK###. Nunca delete ou
substitua conteúdo existente. Todo item novo nasce `[ ]`.

Todo item DEVE avaliar os requisitos quanto a:

- **Completude**: todos os requisitos necessários estão presentes?
- **Clareza**: sem ambiguidade, específicos?
- **Consistência**: requisitos alinhados entre si?
- **Mensurabilidade**: verificáveis objetivamente?
- **Cobertura**: todos os cenários/edge cases endereçados?

Agrupamento por dimensão: Completude / Clareza / Consistência / Qualidade dos
critérios de aceite / Cobertura de cenários / Cobertura de edge cases /
Não-funcionais / Dependências e suposições / Ambiguidades e conflitos.

### 4. Padrões de escrita

❌ **PROIBIDO** (transforma em teste de implementação): item começando com
"Verificar", "Testar", "Confirmar", "Checar" + comportamento do sistema;
"funciona corretamente", "renderiza", "carrega"; detalhes de implementação.

✅ **PADRÕES OBRIGATÓRIOS**:

- "Os requisitos de [tipo] estão definidos/especificados para [cenário]?"
- "[Termo vago] está quantificado/clarificado com critérios específicos?"
- "Os requisitos estão consistentes entre [seção A] e [seção B]?"
- "[Requisito] pode ser medido/verificado objetivamente?"
- "O spec define [aspecto faltante]?"

Estrutura de cada item: formato pergunta; foca no que ESTÁ (ou não está)
ESCRITO; dimensão entre colchetes `[Completude]` `[Clareza]` `[Gap]`;
referência `[Spec §X.Y]` quando checa requisito existente; `[Gap]` para
requisito ausente.

**Rastreabilidade**: mínimo 80% dos itens com referência `[Spec §X.Y]` ou
marcador `[Gap]` `[Ambiguidade]` `[Conflito]` `[Assunção]`. Sem esquema de
IDs no spec: incluir item "Um esquema de IDs de requisitos está estabelecido?
[Rastreabilidade]".

### 5. Consolidação

- Mais de 40 itens candidatos: priorize por risco/impacto.
- Funda quase-duplicados; mais de 5 edge cases de baixo impacto → um item só:
  "Os edge cases X, Y, Z estão endereçados nos requisitos? [Cobertura]".

### 6. Relatório

Caminho do arquivo, contagem de itens, criou ou anexou, áreas de foco,
profundidade, audiência, itens obrigatórios do usuário incorporados.

## Exemplos corretos

```markdown
- [ ] CHK001 - O número e layout dos episódios em destaque estão especificados? [Completude, Spec §FR-001]
- [ ] CHK002 - Os requisitos de hover estão consistentes entre todos os elementos interativos? [Consistência, Spec §FR-003]
- [ ] CHK003 - "Carregamento rápido" está quantificado com thresholds de tempo? [Clareza, Spec §NFR-2]
- [ ] CHK004 - Os requisitos de rollback para falha de migração estão definidos? [Gap]
```
