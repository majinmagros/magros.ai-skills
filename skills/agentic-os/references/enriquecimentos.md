# Agentic OS — Enriquecimentos (YouTube 2026-08-20)

## Sandbox (`exe.dev`) — VM isolada vs container/CI

- Fonte `SEI_qIW4o2c` (exe.dev): **true isolation, insane scale, agency**. Use sandbox quando precisar **isolar agentes com risco** (acesso a credenciais, exec de código não confiável) ou **escalar paralelismo além do laptop** (best-of-N em VMs). Ferramentas de referência: Herder (multiplexer), Pi SDK + Claude Fable como orquestrador, padrão `best-of-N` em VMs novas. Regra: se `inside the loop → bottleneck`, mova factory para sandbox.

## Brand context folder (evita context rot)

- Fonte `BMEaJTl3Vo0`/`CBcyKfpldTo`: 3 arquivos obrigatórios — `brand-voice.md` (varia por plataforma LinkedIn/school/email, não 1D), `visual-identity.json` (tokens fonts/cores), `positioning.md` + `ICP.md`. `CLAUDE.md` vira **índice com ponteiros**, não dicionário — se digitou 2× no chat, vira arquivo. Evita bloat que causou 37k tokens para "Hi" (`d9XCX0PcOq0`).

## Team memory (Notion + supermemory.ai)

- Fonte `PzaC81yCJg0`/`9CiOwbmOKdU`/`4iMZA1omCkM`: memory single-player por padrão. Padrão time: `Notion` (shared drive + permissions) + `supermemory.ai` (working memory queryable) + `Claude desktop`. Supera `Memory MD` nativo (5-10 notes após meses). Para solo, use `unified-memory` + `continuous-learning-v2` para continuidade.

## Projects-as-orchestrator (threads delegam, projeto não executa) — YouTube 2026-09-19

- Fonte `afVpjeoQF2I` (SimonScrapes, sobre o upgrade oficial de Projects): o projeto vira **uma conversa longa que não executa trabalho — ela delega**. O projeto é o orquestrador principal: recebe o objetivo e abre múltiplas sub-threads, cada thread uma sessão full Claude Code cloud **no próprio branch**, com contexto isolado; threads dividem-se em sub-agents/workflows. Regra oficial: **threads do the work**.
- Migre seu OS para esse formato quando o provedor oferecer: 1 objetivo por conversa-mãe, trabalho em threads com branch próprio, nunca acumular execução na conversa-mãe (ela estoura contexto igual ao problema antigo de pasta+chats isolados).
- Juízo de valor da fonte (e regra de migração): o framework do provedor é MVP — o valor está no que você layerou em cima (memory que distingue dado pessoal vs compartilhado, skills que codificam como o negócio trabalha, brand context refinado por meses, permissões que espelham a empresa). Quando o provedor shippar o OS, **migre para ele e leve as camadas** — o objetivo nunca foi a estrutura de pastas, foi o outcome.
