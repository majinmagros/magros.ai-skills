---
name: rules-to-hooks-auditor
description: >-
  Audita CLAUDE.md / AGENTS.md / .claude/rules/ e extrai processos probabilísticos que devem virar hooks determinísticos (stop, pre-tool-use, post-tool-use, start-session, sub-agent-stop). Gera hooks prontos com templates baseados em hookify-rules + agent-guardrails. Use quando: "auditoria rules hooks", "converter rules em hooks", "hooks create skill", "garantias determinísticas", "test enforcement", ".env block", "security hooks", "stop hook tests". Non-triggers: criar hooks do zero sem rules existentes, hooks para eventos não mapeados em rules. Outcome: relatório de migração (rule → hook type + script template + settings.json patch) + hooks prontos para instalar.
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

#### A. Template de Script (determinístico)
```python
# Ex: stop-run-tests.py
#!/usr/bin/env python3
import subprocess, sys, json

def run_tests():
    # Detectar test suite (pytest, vitest, jest, cargo test, go test, etc.)
    result = subprocess.run(["pytest", "-x", "-q"], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"TESTS FAILED:\n{result.stdout}\n{result.stderr}", file=sys.stderr)
        return 2  # BLOCK: force agent to resume and fix
    print("All tests passed")
    return 0  # PASS: allow conversation to end

if __name__ == "__main__":
    sys.exit(run_tests())
```

#### B. Configuração `settings.json` (patch)
```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/stop-run-tests.py"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/pretool-block-env.py"
          }
        ]
      }
    ]
  }
}
```

#### C. Relatório de Migração (Markdown)
```markdown
# Rules → Hooks Migration Report

## Source: CLAUDE.md (47 lines parsed)

### ✅ Converted to Hooks (3)

| Rule | Hook Type | Script | Blocker? |
|---|---|---|---|
| after implementing run the tests | Stop | stop-run-tests.py | Yes (exit 2) |
| never read .env file | PreToolUse (Read) | pretool-block-env.py | Yes (exit 2) |
| when session starts read decisions.md | StartSession | startsession-inject-context.py | No (exit 0) |

### ⚠️ Kept as Rules (Judgments) (12)
- money is integer cents never floats
- use snake_case for variables
- prefer async/await over promises
...

### 🗑️ Deleted (Vague/Redundant) (5)
- write clean code
- be helpful
...

### 📋 Settings.json Patch
[JSON patch pronto para aplicar]
```

### 4. Instalação Assistida
- Cria pasta `.claude/hooks/`
- Escreve scripts (Python/TypeScript/Bash)
- Aplica patch no `.claude/settings.json` (backup automático)
- Valida com `claude doctor` (se disponível)

## Templates Prontos (References)

| Template | Hook Type | Use Case |
|---|---|---|
| `stop-run-tests.py` | Stop | Rodar test suite completo, bloquear se falhar |
| `stop-lint-typecheck.py` | Stop | Lint + typecheck antes de finalizar |
| `pretool-block-env.py` | PreToolUse (Read) | Bloquear leitura de `.env*`, `.secrets*`, `*.pem` |
| `pretool-block-rm-rf.py` | PreToolUse (Bash) | Bloquear `rm -rf`, `rm -fr`, `sudo rm` |
| `pretool-file-coupling.py` | PreToolUse (Edit/Write) | Exigir leitura de arquivos acoplados antes de editar |
| `startsession-inject-context.py` | StartSession | Ler `decisions.md`, `git status`, `context.md` |
| `posttool-log-actions.py` | PostToolUse | Log estruturado de todas tool calls (JSONL) |
| `subagentstop-audit.py` | SubAgentStop | Auditar saída de sub-agentes |

## Regras de Ouro (Anti-patterns)

| ❌ Erro | ✅ Correto |
|---|---|
| Tentar fazer rule "write tests" virar hook sem test suite detectada | Detectar test runner primeiro; sugerir setup se ausente |
| Hook sem exit code 2 para bloquear | Exit 2 = block agent; exit 0 = pass; exit 1 = hook error |
| Script dependente de path absoluto hardcoded | Usar `.claude/hooks/` relativo; detectar cwd via `PWD` env |
| Sobrescrever `settings.json` sem backup | Backup em `.claude/settings.json.bak.<timestamp>` |
| Hook que roda >30s sem feedback | Timeout 30s; logs de progresso para stderr |

## Validação contra Docs Oficiais (2026-08-29)

- [Claude Code Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) — eventos: `PreToolUse`, `PostToolUse`, `Stop`, `StartSession`, `SubAgentStop`, `Notification`
- [Hook Exit Codes](https://docs.anthropic.com/en/docs/claude-code/hooks#exit-codes) — 0=pass, 2=block, 1=error
- [Settings.json Schema](https://docs.anthropic.com/en/docs/claude-code/settings) — `hooks.<event>[].matcher`, `hooks.<event>[].hooks[].command`

## Referências

- `references/rule-classifier.md` — heurísticas detalhadas + exemplos
- `references/hook-templates/` — 8 templates prontos (Python)
- `references/settings-patch-examples.json` — patches completos por cenário
- `references/migration-checklist.md` — checklist passo a passo

## Outcome Esperado

Ao rodar esta skill, o usuário recebe:
1. **Relatório Markdown** com classificação de cada rule (hook/judgment/delete)
2. **Scripts de hook** prontos em `.claude/hooks/` (determinísticos, testados)
3. **Patch `settings.json`** pronto para aplicar (com backup)
4. **Checklist de validação** para testar cada hook instalado