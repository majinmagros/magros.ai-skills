---
name: engenharia-de-grafos
description: Engenharia de Grafos (Graph Engineering) — decompor um objetivo em tarefas paralelas que executam simultaneamente e convergem para um único resultado, com verificadores independentes por ramo, e iterar até uma nota mínima quando houver candidatos ranqueáveis. Use quando várias sub-tarefas independentes podem rodar ao mesmo tempo (pesquisa de fontes múltiplas, geração em volume, coleta paralela, thumbnails/variantes) e precisam convergir em um único entregável, em vez de uma execução sequencial uma-de-cada-vez. Também cobre a decisão de NÃO usar grafo (anti-overengineering) e a relação loop-como-nó-de-grafo. Triggers on "graph engineering", "engenharia de grafos", "orquestrar agentes em paralelo", "verificar em paralelo", "grafos", "gerar candidatos", "rankear", "nota 80", "pipeline", "dynamic workflow".
metadata:
  origin: ECC
---

# Engenharia de Grafos (Graph Engineering)

Transforme um pipeline sequencial lento em um grafo de execução paralela: várias tarefas independentes rodam ao mesmo tempo, cada uma com sua verificação, até todas convergirem para um resultado único. Quando os candidatos são ranqueáveis, itere até uma nota mínima — a mesma lógica de grafo aplicada ao refino.

## Quando usar

- Várias sub-tarefas independentes que não dependem umas das outras (pesquisar N canais/fontes, gerar N vídeos/páginas/produtos, coletar dados de N origens).
- O resultado final é um único entregável que consolida tudo (relatório/PDF, tabela comparativa, síntese).
- O custo de falha é alto e paralelizar exige confiança — só faz sentido quando o verificador dá segurança o suficiente para gastar tokens em paralelo.
- Candidatos gerados em volume que precisam ser rankeados por nota até atingir um corte.

## Princípios

1. **Sem contexto compartilhado** — cada tarefa paralela roda em sessão/janela de contexto isolada. Isso economiza tokens (não carrega o contexto das outras) e melhora performance em tarefas complexas.
2. **Verificador separado do gerador** — quem avalia deve ser independente de quem construiu. Quem tomou as decisões de construção tende a justificar a própria revisão (viés); o verificador olha só o resultado produzido, objetivamente, e reprova mais vezes de forma confiável. (Esse é o problema do loop puro: a mesma pessoa implementa e revisa com o mesmo contexto.)
3. **Etapas de verificação por ramo** — cada tarefa paralela passa por coleta + verificação antes de convergir.

## Passos

1. **Decomponha o objetivo** — identifique as tarefas independentes que podem rodar em paralelo. Se uma tarefa depende da saída de outra, ela é um elo sequencial do grafo, não um ramo paralelo.
2. **Defina os ramos** — liste cada tarefa paralela (ex.: canal A, canal B, canal C). A lógica não muda com a quantidade — apenas o gasto de tokens.
3. **Configure um verificador independente por ramo (ou por etapa)** — cada ramo, após executar, passa por uma verificação com contexto novo, sem compartilhar o contexto da coleta.
4. **Converja** — quando todos os ramos concluem e são verificados, consolide em um único entregável (relatório, PDF/HTML, tabela comparativa).
5. **Escale a granularidade** — a arquitetura mais inteligente (que no início é a mais difícil de configurar) é um agente cuidando de cada parte do pipeline, com um orquestrador coordenando entradas/saídas entre eles.

## Iteração por nota (quando os ramos geram candidatos ranqueáveis)

1. Gere N candidatos por elemento (ex.: `amostras` por elemento de áudio, N thumbnails, N versões de título).
2. Verifique todos em paralelo (grafo) com o verificador independente.
3. **Ranking**: ordene por nota, guarde o melhor.
4. Se `melhor < notaMin` e iterações ainda disponíveis → refine os prompts/estratégia e volte ao passo 1.
5. Senão, entregue o vencedor; se esgotar `maxIters`, entregue o melhor (best-effort) **sem** declarar aprovado.

| Decisão | Valor sugerido |
|---|---|
| notaMin (aprovado) | 80/100 |
| mínimo de candidatos | 3 por elemento |
| máximo de iterações | 3 |

## Loop como nó de grafo (relação, não oposição)

Loop e grafo **não são excludentes**: um nó do grafo pode ser um loop (ex.: um ramo que precisa iterar até atingir condição antes de convergir). Loop = uma tarefa sequencial com condição de conclusão; grafo = orquestração de fluxos paralelos. Use grafo quando houver paralelismo real; use loop dentro do nó quando aquele ramo precisar refinar até passar.

## Anti-overengineering (quando NÃO usar grafo)

- **Artefatos ruins = queima de tokens.** Se a definição de agentes/skills/harness está ruim, adicionar mais etapas paralelas não polir o output — só torra tokens.
- **Não use grafo para tudo.** Em fluxos simples ou quando você quer controle fino sobre cada resultado, o loop de interação (humano no meio) rende mais.
- **Autonomia tem custo.** Delegar a estrutura toda ao modelo (ex.: dynamic workflow) queima tokens e perde controle — teste antes de assumir que vale a pena.
- Regra de ouro: construa o harness (definições de agente, skills, guidelines) com a mesma ou maior qualidade que o grafo em si; sem ele, o paralelismo amplifica o erro.

## Níveis de implementação

| Nível | Como | Prós | Contras |
|---|---|---|---|
| 1. Delegar à IA | Deixe o modelo criar o dynamic workflow (ex.: "faça 3 pesquisas em paralelo") | Menos especificação | Queima tokens, menos controle |
| 2. Especificar manualmente | Você define os ramos, agentes e verificadores (este skill) | Controle, reprodutível | Mais trabalho de setup |
| 3. Ferramenta dedicada | Migre para ferramenta de orquestração visual (ex.: L-graph) quando os fluxos ficarem complexos demais para manter à mão | Escala, inspeção | Dependência de ferramenta |

## Estrutura de apoio (opcional)

- Um comando próprio (ex. `/workflows`) para disparar todo o fluxo com mínimo de input — a lógica vive no harness do agente, não precisa re-ditá-la no prompt.
- Para visualizar: sessões paralelas aparecem como tarefas simultâneas que você pode abrir e inspecionar (ferramentas/estado/tokens) até receber o check de conclusão e a consolidação.

## Regras

- NUNCA coloque em paralelo tarefas que dependem da saída umas das outras — elas precisam ser sequenciais.
- NUNCA deixe o próprio executor se auto-avaliar como único verificador; use um agente verificador independente para revisão confiável.
- NUNCA afirme convergência de um ramo que não foi verificado.
- NUNCA declare aprovado um candidato abaixo do corte só porque esgotou as iterações — entregue como best-effort e declare a limitação.

## Relação com outras skills

- Iteração até nota com verificador independente genérico: `score-loop`.
- Orquestração de sessões nomeadas que se falam (Claude Code session-to-session): `sessoes-orquestradas`.
- Aplicação específica de áudio (DnB, BPM 174, `verify_loop.ps1`): `graph-engineering` (companion do `dnb-production`).
- Verificação paralela/iteração de candidatos em domínio de música: `dnb-production`.