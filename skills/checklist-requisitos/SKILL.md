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