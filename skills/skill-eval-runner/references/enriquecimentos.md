# Skill Eval Runner — Enriquecimentos (YouTube 2026-09-20)

## Precedentes: plugin-eval A/B (clawed) + /skill doctor — YouTube 2026-09-20

- Fonte `u1dW4z5Ye90` (AICodeKing, "Claude Code 3.0 Mods"): `plugin eval` (v2.1.269) — você fornece casos de teste + verificações de pontuação, ele executa COM e SEM o plugin por padrão (comparação A/B direta); são chamadas reais de modelo (eval consome recursos) — usar antes de adicionar workflow complicado, em tarefas que você repete, para provar que o plugin paga o custo+complexidade.
- `/skill doctor`: mostra custo de contexto e uso das skills — a lista de skills disponíveis ocupa contexto mesmo sem uso; base para a dieta (desativar o que não paga).
- Regra: nenhum plugin/skill entra sem eval A/B (com/sem) em casos repetidos + checagem de custo de contexto via doctor.
