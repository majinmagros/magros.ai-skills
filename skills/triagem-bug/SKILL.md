---
name: triagem-bug
description: Use when a bug is reported and needs triage before any fix. Triggers on "/triagem-bug", "triagem de bug", "esse bug é grave?", "prioriza esse defeito", "avalia esse erro". Pipeline avaliar→corrigir→provar com separação de papéis: primeiro reproduz e classifica severidade/impacto (read-only), só depois corrige com causa-raiz e prova com teste — nada de patch especulativo.
---

# Skill: /triagem-bug — Avaliar antes de corrigir

Bug reportado entra, **correção provada** sai. O erro clássico que esta skill
impede: consertar o sintoma sem reproduzir, sem causa-raiz, sem prova.

## Separação de papéis (o coração da skill)

As três fases são de "funções" diferentes e não se misturam:

- **Avaliador**: só lê e reproduz. Não toca em código de aplicação.
- **Corretor**: só age sobre a causa-raiz confirmada pelo avaliador.
- **Provador**: só aceita correção demonstrada por execução real.

Em sessão solo, execute as fases em ordem estrita com entrega explícita entre
elas — nunca pule para a correção sem o relatório de avaliação.

## Fase 1 — Avaliar (read-only)

1. **Reproduza**: encontre o caminho mínimo e determinístico até o bug.
   Sem reprodução, diga-o explicitamente — não avance para a fase 2 com
   base em descrição apenas (pode coletar mais info do usuário).
2. **Classifique severidade** (uma só):
   - **S1 — crítico**: perda de dados, segurança, bloqueio total do fluxo.
   - **S2 — alto**: fluxo principal quebrado com contorno penoso.
   - **S3 — médio**: funcionalidade secundária ou contorno fácil.
   - **S4 — baixo**: cosmético, edge case raro.
3. **Classifique impacto**: quem/quanto é afetado, frequência, se piora com
   o tempo ou com carga.
4. **Delimite suspeitas**: liste 2–4 hipóteses de causa, cada uma com o
   arquivo/área provável. Sem hipótese plausível → peça mais evidência.

**Entrega da fase 1**: relatório curto — reprodução (passos), severidade,
impacto, hipóteses ranqueadas. Pare e apresente. S1: proponha corrigir já;
S3/S4: pode recomendar registrar e agendar, a decisão é do usuário.

## Fase 2 — Corrigir (mínimo e raiz)

- Corrija a **causa-raiz** da hipótese confirmada, não o sintoma.
  Sintoma sem raiz = o bug volta.
- Mudança mínima: só os arquivos necessários. Sem refatoração de brinde,
  sem limpar código vizinho, sem "aproveitar e melhorar".
- Se a correção exigir mudança de contrato/API/comportamento esperado:
  pare e peça aprovação — isso é decisão do usuário.
- Se a causa-raiz confirmar outra hipótese mais profunda ou exigir redesign:
  volte à fase 1 com a nova evidência.

## Fase 3 — Provar

- Reproduza os passos originais: o bug **não acontece mais**.
- Rode o caminho de regressão: o que funcionava continua funcionando
  (testes existentes, ou fluxo manual equivalente).
- Adicione/ajuste teste que trava este bug específico quando fizer sentido
  (barato e determinístico) — sem suíte nova de brinde.
- Correção sem prova executada = tarefa incompleta. Diga claramente o que
  foi e o que não foi verificado.

**Entrega final**: causa-raiz em 1–2 frases, arquivos tocados, prova executada
(comando/saída ou passos manuais), risco residual se houver.

## Regras

- Nunca aplique patch especulativo ("talvez isso resolva") sem reprodução.
- Nunca marque S1 como cosmético para "passar logo" — severidade é sobre o
  usuário, não sobre a dificuldade do fix.
- Correção impossível dentro do escopo: entregue o relatório da fase 1
  completo como produto útil e pare.
