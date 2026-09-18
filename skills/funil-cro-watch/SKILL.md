---
name: funil-cro-watch
description: Watch your funnel 24/7, diagnose CRO causes and escalate to a human. Use when monitoring conversion, page speed, or funnel breakage daily. Use quando monitorar funil/CRO todo dia, diagnosticar queda de conversão, detectar página lenta ou etapa quebrada.
---

# Funil CRO Watch

Um funcionário-IA que vigia o funil, diagnostica a causa e escala para humano — sem virar spam nem auto-fix arriscado.

## Quando usar

Quando há funil com tráfego pago ou volume relevante e você quer relatório diário + alerta ao primeiro sinal de dinheiro queimado (página lenta, etapa quebrada, conversão despencando).

## Passos

1. **Defina agente-funcionário e funil** — cargo, responsabilidade e acessos (ads, analytics, pagamento, site). Mapeie etapas do funil + baseline de conversão por etapa e por canal.
2. **Execute o pipeline principal uma vez na mão** — prompt a prompt: coletar métricas de ontem → analisar → gerar relatório. Corrija no caminho (token expirado, API, refresh). Não pule para skill antes de rodar 1x.
3. **Vire skill do histórico** — gere a skill a partir do chat que funcionou; cada feedback seu vira regra. Teste em sessão com contexto fresco (a sessão de construção sempre parece melhor do que é).
4. **Otimize para custo e template** — troque "gerar HTML do zero todo dia" por template + variáveis; só gera gráfico extra se necessário. Peça 5 templates, escolha 1, refine até ficar redondo.
5. **Opere o loop diário CRO** — coleta → compara (7d, 14d, YoY, por canal) → diagnostica causa: velocidade de carregamento, etapa com drop, link quebrado, mudança de campanha. Ex.: gastar 10k/dia levando tráfego para página lenta = alerta imediato.
6. **Atue com permissão, escale o resto** — com acesso a browser automation, GitHub e deploy, o agente pode propor e aplicar fix pequeno; sem permissão ou em risco alto, ele NÃO conserta sozinho: envia alerta e espera humano. Agende a skill todo dia cedo + alerta event-driven.

## Regras

- NEVER operar sem baseline: sem conversão esperada por etapa, tudo vira "parece normal".
- NEVER auto-fix em produção sem permissão explícita; escale para humano.
- NEVER falhar em silêncio ou travar: todo erro de coleta vira mensagem de escalação.
- Leia os arquivos que o agente cria (cérebro, settings, credenciais, logs); Frankenstein não auditado quebra na primeira mudança.
- Separe coleta, análise e layout: valide a análise antes de investir no visual.

## Related skills

- `ads-reporter-multi` — coleta multi-plataforma de métricas de ads.
- `analise-concorrentes` — contexto externo para quedas e benchmarks.
- `approval-loop-morning-digest` — digest matinal com gate de aprovação humana.
