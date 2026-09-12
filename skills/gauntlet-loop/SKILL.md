---
name: gauntlet-loop
description: Use when a task needs an exceptional/impressive result and you can afford many tokens and time — large creative builds (games, apps, sites, 3D scenes) with subagents. Triggers on "gauntlet loop", "gauntlet-loop", "resultado de outro nível", "impressionar", "arquitetura de agentes", "subagentes em paralelo", "julgamento às cegas". Same family as graph-engineering/score-loop but adds BLIND judgment (verifier never sees the creation context) and the "impress the supervisor" acceptance bar. Do NOT use for small/fast tasks — it burns a lot of tokens.
---

# Skill: Gauntlet-loop — segmentação + verificadores às cegas

Arquitetura para entrega de nível "uau" (inspirada na técnica Gauntlet Loop).
Quebra a tarefa em muitos segmentos, dá a cada um um par
executor + verificador, e só libera o que deixa o verificador IMPRESSIONADO.

Custo alto: horas + centenas de milhares de tokens. Usar só quando o resultado
precisa ser excepcional.

## 1. Quando usar

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
