# Agentic OS — Commands e persistent memory

## Slash Commands

Comandos são arquivos markdown em `.claude/commands/`. Definem workflows reutilizáveis.

### Command Structure

```markdown
# /daily-sync

Run the morning briefing:

1. Read `data/logs/last-sync.md` for context
2. Check project status: `git status`, pending PRs, CI health
3. Review `data/inbox/` for new tasks or decisions needed
4. Generate a summary of blockers, priorities, and next actions
5. Append the briefing to `data/logs/daily/<date>.md`
```

### Standard Command Set

| Command | Purpose |
|---|---|
| `/daily-sync` | Morning briefing: status, blockers, priorities |
| `/outreach` | Run outreach workflow (email, LinkedIn, etc.) |
| `/research <topic>` | Deep research with citation tracking |
| `/apply-jobs` | Tailor resume + cover letter for a target role |
| `/analytics` | Pull metrics from Stripe, GitHub, or custom sources |
| `/interview-prep` | Generate flashcards or mock interview questions |
| `/decision <topic>` | Log a decision with pros/cons and chosen path |

Coloque em `.claude/commands/<command-name>.md` — auto-discovery via `/<command-name>`.

## Persistent Memory

Memória é file-based. Sem vector DB, Redis ou PostgreSQL: JSON + markdown em `data/` são o banco.

```
data/
├── daily-logs/         # Append-only daily activity logs
├── projects/           # Per-project context files
├── decisions/          # Architectural and business decisions (ADR format)
├── inbox/              # New tasks or ideas awaiting triage
├── contacts/           # People, companies, relationship notes
└── templates/          # Reusable prompts and formats
```

### Daily Log Format

```markdown
# 2026-04-22 - Daily Log

## Sessions
- 09:00 - Session 1: Refactored auth module (@dev)
- 11:30 - Session 2: Drafted investor update (@writer)

## Decisions
- Switched from JWT to session cookies (see `data/decisions/2026-04-22-auth.md`)

## Blockers
- Waiting on API key from vendor (follow up 2026-04-24)

## Next Actions
- [ ] Merge auth refactor PR
- [ ] Send investor update for review
```

### Auto-Reflection Pattern

No fim de cada sessão, o kernel anexa uma reflexão:

```markdown
## Reflection - Session 3
- What worked: Parallel agent execution saved 20 minutes
- What didn't: @researcher hit a paywalled source, need better source ranking
- What to change: Add `source-tier` field to research notes (A/B/C credibility)
```

Feedback loop que melhora o sistema sem mudar código.
