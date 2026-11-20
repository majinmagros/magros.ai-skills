---
name: monitor-novidades-ia
description: "Motor de sinal pessoal para o segundo cérebro: centenas de fontes de IA (Reddit, YouTube, RSS, HN, GitHub, changelogs) viram um digest diário sem afogar em ruído. Use quando o usuário quiser monitorar novidades de IA, montar um signal engine ou filtrar o excesso de conteúdo. Triggers PT: monitorar novidades, digest diário, motor de sinal, radar de fontes, filtrar ruído de IA. Triggers EN: signal engine, AI news digest, noise filter, second brain radar."
metadata:
  origin: ECC
---

# Monitor de Novidades IA — Motor de Sinal Pessoal

> Fonte: ColeMedin `@ColeMedin/2i_ZyqDmtio` ("How I Keep Up with AI Without Drowning in It (Free Skill)", 2026-10-15).

## Quando usar

- O usuário se afoga em novidades de IA (X, Reddit, YouTube, RSS, changelogs...).
- Quer um digest diário só com o que importa para o perfil dele.
- Quer construir um motor de sinal reaproveitável (Claude Code ou outro harness).

## Pipeline (6 estágios)

1. **Coleta** — centenas de fontes via APIs/CLIs/MCP (Apify quando preciso); normaliza para Markdown otimizado.
2. **Filtro determinístico** — antes de qualquer LLM: DB central de já-vistos, descarta antigos e baixo engajamento. Mata a maior parte do ruído a custo zero.
3. **Jev (1ª linha de defesa)** — modelo de julgamento barato com 3 critérios: (a) cabe no tema? (b) interessa ao MEU perfil? (c) é novidade específica ou demo-brinquedo? Score ~0.7 → aceita / rejeita / incerto.
4. **Claude Haiku 3.5** — só nos incertos, com memory das decisões anteriores para calibrar.
5. **Digest diário** — entrega o aprovado; gráfico de frequência mostra tendências.
6. **Feedback** — ajuste de interesse vira config em linguagem natural, não código.

## Config e construção

- Uma config JSON única: fontes + queries (ex.: "o que mudou no Claude Code", "novos padrões de agente").
- Skill de construção (`/build signal engine`) roda entrevista: quais fontes; "o que você aprendeu tarde demais?" (vira query); perfil visual em linguagem natural.
- Empacota como plugin do Claude Code; outros agentes consomem via repo URL.

## Números de referência (vídeo)

- 864 posts por run → Jev 3¢ + Haiku 42¢ → menos de $0.5/dia no total.
- Regra: filtro barato primeiro, LLM caro por último; se o determinístico resolve, não chame modelo.

## Regras

- Determinístico antes de LLM: visto/antigo/baixo engajamento nunca chega ao modelo.
- Os 3 critérios sempre — novidade genérica e demo-brinquedo não passam.
- Digest curto: legível em 2 min; se não, filtre mais.
- Feedback alimenta o perfil, não só a fila daquele dia.

## Related skills

- `coletar-oportunidades-youtube` — radar de canais + curadoria (loop deste repo).
- `defuddle-leitura-limpa` — limpeza do conteúdo coletado antes do digest.
- `triagem-ideias` — transforma sinal aprovado em ação.
- `system-one-judgment-triage` — julgamento barato antes de escalar para modelo maior.
