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

1. **Blind judgment** — verifica SEM olhar como o executor criou (sem histórico,
   sem contexto da decisão). Julga só o resultado pronto. Igual avaliar comida
   que você não cozinhou: o executor tende a ser ameno com o próprio trabalho.
2. **Barra "uau"** — aprova só se ficar de fato surpreso/impressionado com a
   qualidade. O "funciona perfeitamente" NÃO basta; precisa exceder expectativa.
3. **Método de verificação real** — não basta revisar código. Sempre que
   possível, EXPERIMENTE como usuário final: abra o browser/jogo/app e teste
   (Playwright MCP, browser, comando real). Propriedade que a internet não
   cobria: conferir que o verificador tem a FERRAMENTA certa pra julgar.
4. Se faltar ferramenta pro verificador (ex.: browser MCP), instale antes.
5. **Criador ≠ Verificador** (mesma regra do harness): quem gera nunca avalia
   o próprio resultado.

## 6. Etapa 4 — Iterar

- Aprovado → segmento liberado, passa pro próximo.
- Reprovado → segmento volta ao executor (rebuilt ou refinado). O verificador
  pode descartar e pedir do zero se estiver crítico.
- O loop roda até: todos aprovados OU orçamento esgotado (entregar best-effort).
- Como normalização: verificador pode dar nota 0-100; só libera acima da barra
  definida (ex.: >= 90) — mas a barra padrão é a SURPRESA, não a nota.

## 7. Entregar

- Relatório final: segmentos aprovados, quantas rodadas cada um levou, o que
  foi descartado/refeito do zero, tokens/tempo gastos.
- O usuário é o diretor final — mesmo com tudo aprovado pelos verificadores.

## 8. Eficiência (ditar)

- Rodadas paralelas gastam o mesmo tanto de tokens que sequenciais, mas
  entregam muito mais rápido (lógica do graph engineering).
- Rodadas de verificação consomem tokens extras — é o preço da qualidade.
- Se o custo importa mais que o "uau", troque pra `graph-engineering`
  (nota numérica, critério objetivo).

## 9. Regras de segurança

- Não delegar a subagente nada que exija credencial sua sem você aprovar.
- Verificador deve pedir EXECUÇÃO real, não "olhar o código e confiar".
- Blind judgment é obrigatório: se o verificador tiver acesso ao histórico do
  executor, o viés volta. Se grelhar, separe os contextos.