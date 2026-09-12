---
name: wayfinder-planning
description: Use when planning massive chunks of work that exceed a single agent session, breaking them down into a shared map of decision tickets and resolving them incrementally. Triggers on "wayfinder", "planejamento multi-sessão", "mapa de tickets", "long-horizon project planning".
metadata:
  origin: Matt Pocock / ECC
---

# Wayfinder Planning

Plan and execute large-scale, multi-session engineering tasks using a shared map of decision-based tickets.

## Core Concepts
- **Shared Destination**: A clearly defined end state for a multi-session project.
- **Decision Tickets**: Incremental tasks focused on resolving architectural forks or critical dependencies rather than writing boilerplate.
- **Incremental Convergence**: Resolving one ticket at a time while updating the master roadmap.

## Workflow
1. Map out the architectural milestones and open questions.
2. Create ordered decision tickets (local files or issue tracker).
3. Execute session by session, marking dependencies as resolved until the destination is reached.

## Quando Ativar

- Planejar trabalho grande que excede uma sessão de agente
- Usuário diz "wayfinder", "planejamento multi-sessão", "mapa de tickets", "long-horizon project planning"
- Quebrar épico em tickets de decisão incrementais com dependências
- Retomar projeto multi-sessão pelo mapa compartilhado

## Exemplo

```markdown
## Ticket D-03 — Auth store
- Decisão: Zustand vs Context para sessão?
- Depende de: D-01 (modelo de usuário)
- Pronto quando: login/logout persistidos + teste e2e verde
```
