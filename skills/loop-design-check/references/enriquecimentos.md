# Loop Design Check — Enriquecimentos (YouTube 2026-09-20)

## Teto de rodadas + critério subjetivo — YouTube 2026-09-20

- Fonte `_uQYzCxCvSw` (Maestros da IA, "Grafos de IA"): todo loop de worker/supervisor leva **teto máximo de iterações** (3 ou 30 — você decide) contra spin infinito e queima de tokens; estourar o teto = sinal de metodologia, modelo ou prompt errado, não de "tentar mais uma vez".
- Critério "o supervisor precisa ser **surpreendido**" funciona p/ tarefas subjetivas (layout, paleta, experiência) e QUEIMA tokens em tarefas funcionais (passou nos testes = basta, sem reinventar). Regra: rubrica binária p/ funcional, rubrica de surpresa só p/ subjetivo — nunca a mesma verificação p/ os dois.
