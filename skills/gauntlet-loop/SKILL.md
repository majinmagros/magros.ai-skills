---
name: gauntlet-loop
description: Use when a task needs an exceptional/impressive result and you can afford many tokens and time — large creative builds (games, apps, sites, 3D scenes) with subagents. Triggers on "gauntlet loop", "gauntlet-loop", "resultado de outro nível", "impressionar", "arquitetura de agentes", "subagentes em paralelo", "julgamento às cegas", "maestro mode", "bail-out", "parar o loop sem quebrar". Same family as graph-engineering/score-loop but adds BLIND judgment (verifier never sees the creation context), the "impress the supervisor" acceptance bar, and a clean mid-run bail-out. Do NOT use for small/fast tasks — it burns a lot of tokens.
---

# Skill: Gauntlet-loop — segmentação + verificadores às cegas

Arquitetura para entrega de nível "uau" (inspirada na técnica Gauntlet Loop).
Quebra a tarefa em muitos segmentos, dá a cada um um par
executor + verificador, e só libera o que deixa o verificador IMPRESSIONADO.

Custo alto: horas + centenas de milhares de tokens. Usar só quando o resultado
precisa ser excepcional.

## Quando usar

- Projetos criativos grandes: jogo, app, site, cena 3D, simulador.
- Resultado precisa ser "impressionante", não apenas "funciona".
- Você pode deixar o agente trabalhando por horas.
- Tens orçamento de tokens para múltiplas rodadas + verificação.

NÃO usar para: bug fix, tarefa pequena, output que uma nota 0-100 resolve.
Nesses casos use `graph-engineering` / `score-loop` / `superpowers`.

## 2. Pipeline (4 etapas)

```
1. DEFINIR   entrada = tarefa + meta + critérios de aceitação
2. SEGMENTAR quebra o projeto em N partes pequenas
3. PARALELIZAR por segmento: subagente EXECUTOR + subagente VERIFICADOR
             verificador julga ÀS CEGAS (sem contexto) e precisa ficar
             impressionado (barra "uau") para aprovar
4. ITERAR    reprovação → volta ao loop do segmento; tudo aprovado → relatório
```

## 3. Etapa 1 — Definir (input)

Capture do usuário:

| Campo | Exemplo |
|---|---|
| **Tarefa** | "simulador de voo em duna com nave 3D" |
| **Meta** | resultado observável e desejado |
| **Critérios de aceitação** | do PROJETO (ex.: "comparar com jogos comerciais") |
| **Barra de aprovação** | por padrão: verificador IMPRESSIONADO (surpresa real) |
| **Orçamento** | rodadas máx (ex.: 8), tempo máx, tokens máx |

Se a tarefa for vaga, pergunte antes (não invente critério).

## 4. Etapa 2 — Segmentar

- Divida o projeto em **muitas partes pequenas e independentes** (ex.: cenário,
  física, nave, câmera, som, UI — cada uma é um segmento).
- Cada segmento tem saída verificável isolada.
- Considere o tamanho: tarefa complexa → mais rodadas permitidas.

## 5. Etapa 3 — Paralelizar (executor + verificador)

Para CADA segmento, crie o par:

- **EXECUTOR**: subagente que constrói o segmento sozinho.
- **VERIFICADOR**: subagente separado que avalia o resultado.

**Regras do verificador (o diferencial):**

- Recebe **só o artefato** (screenshot, build, URL, arquivo) — nunca o prompt
  original nem o histórico do executor. Contexto limpo é o que impede o
  verificador de "entender a intenção" e perdoar o resultado medíocre.
- Julga contra a **barra "uau"**, não contra "funciona". Critério explícito:
  "isso me surpreenderia comparado a um produto comercial?"
- Reprovação precisa vir com **motivo acionável** (o que está genérico, o que
  falta, o que quebra a comparação) — não "melhore".
- Verificador que aprova tudo é sinal de barra baixa: reveja os critérios antes
  de aceitar a rodada.

## 6. Etapa 4 — Iterar

```
reprovado → volta ao executor com o motivo (nova rodada, mesmo segmento)
aprovado  → segmento fecha, não reabre
todos aprovados → relatório final (o que passou, quantas rodadas, custo)
```

Regras de parada, todas obrigatórias:

- **Orçamento de rodadas por segmento** (ex.: 8). Estourou → entregue o melhor
  resultado com o débito declarado, não fique girando.
- **Orçamento global de tempo/tokens**. Estourou → pare e reporte.
- **Sem progresso em 2 rodadas seguidas** (mesmo motivo de reprovação) → o
  problema é o critério ou o segmento está mal cortado; escale em vez de iterar.

## 7. Maestro Mode (bail-out controlado)

Versão com saída limpa, vista no @maestrosdaia ("I Tested 100+ GitHub Repos",
2026-10-28). O Gauntlet clássico tem dois defeitos recorrentes:

1. **Gasta caro no que é trivial** — tarefa que não muda a experiência do
   usuário final consome rodadas de "uau".
2. **Não tem freio** — pedir para parar no meio quebra o processo e você perde
   o trabalho.

O que o Maestro Mode adiciona:

- **Priorização por impacto**: segmentos que o usuário final percebe recebem
  barra "uau"; infraestrutura/teste/refactor recebem barra "correto e testado".
  Não aplique julgamento cego a tudo.
- **Bail-out**: "encerre o projeto" é um comando válido a qualquer momento. O
  agente fecha o ciclo em andamento, roda a verificação final nos segmentos
  prontos e entrega a **versão do momento** com o que ficou pendente listado.
  Custo do encerramento é alguns tokens, não a perda da run.
- **Custo visível**: informe tokens/hora por segmento para o usuário decidir
  cortar antes de estourar.

## 8. Saída esperada

```text
Segmentos: 6 | Aprovados: 6 | Rodadas: 23 | Tempo: 3h10 | Tokens: ~410k
Reprovados que voltaram: física (4x), som (2x)
Débito declarado: áudio ambiente sem variação dinâmica
```

## 9. Quando NÃO usar

- Bug fix, tarefa de 1 arquivo, mudança óbvia → `superpowers` / `tdd-workflow`.
- Output que uma nota 0–100 já resolve → `score-loop`.
- Várias sub-tarefas independentes convergindo num entregável → `graph-engineering`.
- Você não pode esperar horas → qualquer outra coisa.

## Relacionadas

- `score-loop` — loop com nota e cutoff, mais barato que "uau".
- `engenharia-de-grafos` — paralelismo com verificadores por ramo.
- `outcome-rubric-verification` — rubrica + verificador independente.
- `loop-design-check` — desenhar o freio e o critério de parada antes de rodar.

