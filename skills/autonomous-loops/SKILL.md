---
name: autonomous-loops
description: "DEPRECATED — use continuous-agent-loop. Legacy patterns for autonomous Claude Code loops (sequential pipelines, REPL, infinite loops, PR loops, de-sloppify, Ralphinho DAG). Triggers on \"autonomous-loops\", \"autonomous loops\", \"loops\"."
metadata:
  origin: ECC
  status: deprecated
  supersededBy: continuous-agent-loop
---

# Autonomous Loops Skill (DEPRECATED)

> Compatibility note (v1.8.0): `autonomous-loops` is retained for one release.
> The canonical skill name is now `continuous-agent-loop`. New loop guidance
> should be authored there, while this skill remains available to avoid
> breaking existing workflows.

## Quando usar

- Apenas para compatibilidade com workflows existentes que referenciam `autonomous-loops`
- Para todo uso novo, prefira `continuous-agent-loop`

## Quando NÃO usar

- Qualquer projeto novo → use `continuous-agent-loop`
- Loops com gates de CI → use `continuous-agent-loop`
- Orquestracao multi-agente → use `team-agent-orchestration`

## Migracao

```
# Antes
autonomous-loops (Sequential Pipeline, NanoClaw, Infinite Loop, Ralphinho...)

# Agora
continuous-agent-loop (Loop Selection Flow + Combined Pattern)
```

Full legacy content preserved in `references/legacy-patterns.md` (verbatim, 600+ lines: spectrum table, 6 patterns, decision matrix, anti-patterns, references).

## Referências

- `continuous-agent-loop` (skill canonica)
- `references/legacy-patterns.md` — conteudo legado integral
