# Pipeline Problems 1-5

## 1. Problema: CLAUDE.md Muito Longo

> **"If Claude keeps doing something you don't want despite having a rule against it in your CLAUDE.md, the file is probably too long and the rule is getting lost."** — Simon Scrapes

> **"Claude code's own system prompt is around 50 instructions... models are supposedly following somewhere in between 150 to 200 instructions reliably."** — Anthropic Docs

## 2. Classificação: Process vs Judgment

> **"Is this naming an event or encoding a judgment?"** — Cole Medin

| Tipo | Exemplo | Ação |
|------|---------|------|
| **Judgment/Convention** | "money is integer cents never floats" | **Manter como Rule** |
| **Process/Event** | "after implementing run the tests" | **→ Stop Hook** |
| **Process/Event** | "never read .env file" | **→ PreToolUse Hook** |
| **Process/Event** | "when session starts read decisions.md" | **→ StartSession Hook** |
| **Vago/Inútil** | "write clean code" | **Deletar** |

## 3. HTML Comments para Notas Pessoais

> **"Actually, write those in HTML comments... Claude will not spend any tokens reading that."** — Simon Scrapes

```html
<!-- NOTA: Esta regra é temporária até o PR #123 ser mergeado -->
<!-- LEMBRETE: Verificar se a regra de tipos ainda faz sentido após refactor -->
```

## 4. Path-Specific Rules (Claude Code Feature)

```markdown
# CLAUDE.md

## Global Rules
- Use TypeScript strict mode
- Run tests before commit

<!-- Path-specific rules carregados apenas quando relevante -->
## src/api
- Always validate input with Zod
- Use REST conventions

## src/components
- Use functional components
- Props interface required

## tests/
- Use Vitest
- Mock external APIs
```

> **"Those rules would only be loaded into our Claude session when Claude actually came upon that rule inside the claw.md... wouldn't need to unwrap those rules until it needed them."** — Anthropic Docs

## 5. Prompt-for-Next-Session (Paul's Programming Notes)

> **"Write it as a prompt for the next session, not a document for a human."** — Paul's Programming Notes

```markdown
# Próxima Sessão Prompt
Você está continuando o Rank Spot Marketing Homepage Redesign.
Aqui estão os arquivos e pastas exatos. Estas são as tarefas e breakdown.
- files: src/pages/Home.tsx, src/components/Hero.tsx
- tasks: 
  - Fix hero section responsive bug
  - Update CTA button styling
- Next: Start with Hero.tsx responsive fix
```

> **"A prompt naturally does the right things. It's going to point them at the files instead of describing the files."** — Paul's Programming Notes

## 5. `/doctor` Command Automation

```bash
# /doctor command automations
/doctor                          # Full health check
/doctor --trim                   # Propose trims
/doctor --path-rules             # Check path-specific rules
/doctor --html-comments          # Check HTML comments
/doctor --prompt-next            # Generate next-session prompt
/doctor --full                   # All checks
```

---
