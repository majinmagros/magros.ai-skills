---
name: engenharia-de-grafos
description: Engenharia de Grafos (Graph Engineering) — decompor um objetivo em tarefas paralelas que executam simultaneamente e convergem para um único resultado, com verificadores independentes por ramo. Use quando várias sub-tarefas independentes podem rodar ao mesmo tempo (pesquisa de fontes múltiplas, geração em volume, coleta paralela) e precisam convergir em um único entregável, em vez de uma execução sequencial uma-de-cada-vez.
---

# Engenharia de Grafos

Transforme um pipeline sequencial lento em um grafo de execução paralela: várias tarefas independentes rodam ao mesmo tempo, cada uma com sua verificação, até todas convergirem para um resultado único.

## Quando usar

- Várias sub-tarefas independentes que não dependem umas das outras (pesquisar N canais/fontes, gerar N vídeos/páginas/produtos, coletar dados de N origens).
- O resultado final é um único entregável que consolida tudo (relatório/PDF, tabela comparativa, síntese).
- O custo de falha é alto e paralelizar exige confiança — só faz sentido quando o verificador dá segurança o suficiente para gastar tokens em paralelo.

## Princípios

1. **Sem contexto compartilhado** — cada tarefa paralela roda em sessão isolada. Isso economiza tokens (não carrega o contexto das outras) e melhora performance em tarefas complexas.
2. **Verificador separado do gerador** — quem avalia deve ser independente de quem construiu. Quem tomou as decisões de construção tende a justificar a própria revisão (viés); o verificador olha só o resultado produzido, objetivamente, e reprova mais vezes de forma confiável.
3. **Etapas de verificação por ramo** — cada tarefa paralela passa por coleta + verificação antes de convergir.

## Passos

1. **Decomponha o objetivo** — identifique as tarefas independentes que podem rodar em paralelo. Se uma tarefa depende da saída de outra, ela é um elo sequencial do grafo, não um ramo paralelo.
2. **Defina os ramos** — liste cada tarefa paralela (ex.: canal A, canal B, canal C). A lógica não muda com a quantidade — apenas o gasto de tokens.
3. **Configure um verificador independente por ramo (ou por etapa)** — cada ramo, após executar, passa por uma verificação com contexto novo, sem compartilhar o contexto da coleta.
4. **Converja** — quando todos os ramos concluem e são verificados, consolide em um único entregável (relatório, PDF/HTML, tabela comparativa).
5. **Escale a granularidade** — a arquitetura mais inteligente (que no início é a mais difícil de configurar) é um agente cuidando de cada parte do pipeline, com um orquestrador coordenando entradas/saídas entre eles.

## Estrutura de apoio (opcional)

- Um comando próprio (ex. `/workflows`) para disparar todo o fluxo com mínimo de input — a lógica vive no harness do agente, não precisa re-ditá-la no prompt.
- Para visualizar: sessões paralelas aparecem como tarefas simultâneas que você pode abrir e inspecionar (ferramentas/estado/tokens) até receber o check de conclusão e a consolidação.

## Regras

- NUNCA coloque em paralelo tarefas que dependem da saída umas das outras — elas precisam ser sequenciais.
- NUNCA deixe o próprio executor se auto-avaliar como único verificador; use um agente verificador independente para revisão confiável.
- NUNCA afirme convergência de um ramo que não foi verificado.