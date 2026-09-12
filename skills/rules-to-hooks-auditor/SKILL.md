---
name: rules-to-hooks-auditor
description: Use when auditing CLAUDE.md / AGENTS.md / rules and migrating probabilistic processes to deterministic hooks — stop, pre-tool-use, post-tool-use, start-session, sub-agent-stop. Triggers on "auditoria rules hooks", "converter rules em hooks", "hooks create skill", "garantias determinísticas", "test enforcement", ".env block", "security hooks", "stop hook tests".
metadata:
  origin: ECC
  source_docs:
    - https://github.com/coleam00/hooks-create-skill (referenciado no vídeo Cole Medin)
    - https://docs.anthropic.com/en/docs/claude-code/hooks
    - https://context7.com/anthropic/claude-code
  skills_used:
    - hookify-rules
    - agent-guardrails
    - criar-skill
---

# Rules to Hooks Auditor — Auditoria Automatizada Rules → Hooks

Converte **regras probabilísticas** (em `CLAUDE.md`, `AGENTS.md`, `.claude/rules/`) em **hooks determinísticos** que garantem execução (exit code 0/2) — baseado no framework do vídeo do Cole Medin "Watch This If Your Coding Agent is Ignoring Your Rules (You Need Hooks)".

## Quando usar (gatilhos concretos)

- "Audite meus rules e me diga quais virar hooks"
- "Converta CLAUDE.md em hooks determinísticos"
- "Meu agente ignora rules — preciso de garantias"
- "Bloquear leitura de .env / comandos perigosos"
- "Garantir que testes rodem no final da conversa"
- "Injetar contexto no start da sessão"
- "Observar ações do agente (post-tool-use logging)"

## Quando NÃO usar

- Criar hooks do zero sem rules base (use `hookify-rules` direto)
- Events não mapeados em rules existentes
- Hooks para ferramentas customizadas não cobertas por rules

## Pipeline (baseado no vídeo + docs oficiais)

### 1. Descoberta & Parsing (Input)
Lê arquivos de rules do projeto:
- `CLAUDE.md` (raiz + path-specific)
- `AGENTS.md` (se existir)
- `.claude/rules/**/*.md` (rules modulares)
- `.claude/settings.json` (hooks já existentes)

Extrai **linhas/seções** que nomeiam **eventos** (processos) vs **judgments** (convenções).

### 2. Classificação (Core Logic)
Para cada regra extraída, classifica:

| Tipo | Exemplo | Ação |
|---|---|---|
| **Judgment/Convention** | "money is integer cents never floats" | **Manter como rule** (encode judgment) |
| **Process/Event** | "after implementing run the tests" | **→ Stop Hook** |
| **Process/Event** | "never read .env file" | **→ PreToolUse Hook** |
| **Process/Event** | "when session starts read decisions.md" | **→ StartSession Hook** |
| **Process/Event** | "before editing routes read rag/citations.py" | **→ PreToolUse Hook (file coupling)** |
| **Process/Event** | "log every command you run" | **→ PostToolUse Hook** |
| **Process/Event** | "never run recursive force delete" | **→ PreToolUse Hook (security)** |
| **Vago/Inútil** | "write clean code" | **Deletar** (modelo já sabe) |

**Heurística**: "Is this naming an event or encoding a judgment?" (pergunta do vídeo)

### 3. Geração de Hook (Output)
Para cada **Process/Event** identificado, gera:
