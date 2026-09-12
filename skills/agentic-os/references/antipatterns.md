# Agentic OS — Anti-patterns

## Monolithic Single Agent

```markdown
# BAD - One agent does everything
You are a full-stack developer, writer, researcher, and DevOps engineer.
```

Split em agentes especialistas. O kernel roteia.

## Stateless Sessions

```markdown
# BAD - No memory between sessions
Starting fresh every time Claude Code opens.
```

Sempre leia `data/` no início e escreva de volta no fim da sessão.

## Hardcoded Credentials

```markdown
# BAD - API keys in agent files or CLAUDE.md
Your OpenAI API key is sk-xxxxxxxx
```

Use env vars ou `.env` carregado por scripts. Agentes referenciam `process.env.API_KEY`.

## External Database for Simple State

```markdown
# BAD - PostgreSQL for a solo user's agentic OS
```

Use JSON/markdown até ter múltiplos usuários concorrentes ou GBs de dados.

## Over-Engineered Routing

```markdown
# BAD - Routing logic in code instead of markdown tables
if (intent.includes('deploy')) { agent = opsAgent; }
```

Roteamento declarativo em tabelas markdown no `CLAUDE.md` — inspectable, editável, debugável.
