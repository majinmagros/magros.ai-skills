# Agentic OS — Enriquecimentos (YouTube 2026-08-20)

## Sandbox (`exe.dev`) — VM isolada vs container/CI

- Fonte `SEI_qIW4o2c` (exe.dev): **true isolation, insane scale, agency**. Use sandbox quando precisar **isolar agentes com risco** (acesso a credenciais, exec de código não confiável) ou **escalar paralelismo além do laptop** (best-of-N em VMs). Ferramentas de referência: Herder (multiplexer), Pi SDK + Claude Fable como orquestrador, padrão `best-of-N` em VMs novas. Regra: se `inside the loop → bottleneck`, mova factory para sandbox.

## Brand context folder (evita context rot)

- Fonte `BMEaJTl3Vo0`/`CBcyKfpldTo`: 3 arquivos obrigatórios — `brand-voice.md` (varia por plataforma LinkedIn/school/email, não 1D), `visual-identity.json` (tokens fonts/cores), `positioning.md` + `ICP.md`. `CLAUDE.md` vira **índice com ponteiros**, não dicionário — se digitou 2× no chat, vira arquivo. Evita bloat que causou 37k tokens para "Hi" (`d9XCX0PcOq0`).

## Team memory (Notion + supermemory.ai)

- Fonte `PzaC81yCJg0`/`9CiOwbmOKdU`/`4iMZA1omCkM`: memory single-player por padrão. Padrão time: `Notion` (shared drive + permissions) + `supermemory.ai` (working memory queryable) + `Claude desktop`. Supera `Memory MD` nativo (5-10 notes após meses). Para solo, use `unified-memory` + `continuous-learning-v2` para continuidade.
