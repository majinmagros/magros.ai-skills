---
name: claude-account-optimizer
description: >-
  Otimização completa de conta Claude: email strategy, memory import workflow, model routing rules, project templates, connector defaults.
  Use quando: "otimizar conta claude", "configurar claude do zero", "melhorar setup claude", "email da conta claude", "memory import claude", "model routing claude", "project template claude", "connector strategy claude".
  Não use para: criar skills do zero (use `criar-skill`), hooks (use `rules-to-hooks-auditor`), deploy (use `cloud-code-vps-deploy`).
  Outcome: Conta Claude otimizada com email strategy, memory workflow, model routing, project templates, connector defaults.
metadata:
  origin: ECC
  source_docs:
    - https://docs.anthropic.com/en/docs/claude-code/memory
    - https://docs.anthropic.com/en/docs/claude-code/settings
    - https://docs.anthropic.com/en/docs/claude-code/hooks
    - https://docs.anthropic.com/en/docs/claude-code/projects
    - https://docs.anthropic.com/en/docs/claude-code/skills
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, settings]
---

# claude-account-optimizer — Otimização Completa de Conta Claude

Otimiza uma conta Claude do zero: email strategy, memory import workflow, model routing rules, project templates, connector defaults.

## Quando usar (gatilhos concretos)

- "Configure minha conta Claude do zero"
- "Otimize minha conta Claude"
- "Qual melhor email para conta Claude?"
- "Como importar memory do ChatGPT pro Claude?"
- "Como configurar model routing no Claude?"
- "Templates de projeto para Claude"
- "Quais conectores ativar no Claude?"
- "Configurar conta Claude para equipe"

## Quando NÃO usar

- Criar skills do zero → use `criar-skill`
- Auditar rules → hooks → use `rules-to-hooks-auditor`
- Deploy Cloud Code → use `cloud-code-vps-deploy`
- Criar skills → use `criar-skill`

## Pipeline (Baseado no vídeo Luciana Papini + docs oficiais)

### 1. Email Strategy (Fundação)

```bash
# Regra de ouro: NUNCA use email corporativo
# Use email pessoal que você controle para sempre
# Ex: seu_nome@gmail.com (não empresa@empresa.com)
```

**Checklist:**
- [ ] Email pessoal (Gmail/Outlook/Proton) que você controla
- [ ] Não é email corporativo/universitário
- [ ] Acesso garantido por 5+ anos
- [ ] 2FA ativado no provedor de email
- [ ] Recovery email configurado

### 2. Memory Import Workflow (Crítico)

```bash
# 1. Export memory da ferramenta origem (ChatGPT, etc.)
# Settings → Memory → Export → Download JSON

# 2. Import no Claude
# Settings → Memory → Import → Upload JSON

# 3. Entrevista de validação (OBRIGATÓRIA)
# Use voz (Sponcle/Whisper) → transcrição → prompt
prompt = """
Me entreviste para me conhecer melhor e trabalhar melhor comigo.
Faça uma pergunta por vez sobre: minha vida, trabalho, negócio, objetivos, projetos,
e principalmente COMO EU GOSTO DE TRABALHAR.
"""
```

**Script de validação:** `scripts/validate-memory-import.py`

### 3. Model Routing Strategy (Economia)

```yaml
# config/model-routing.yaml
routing_rules:
  daily_tasks:
    model: "sonet-3.7"
    max_cost_per_task: 0.05
    use_for: ["writing", "analysis", "research", "organization", "coding_simple"]
  
  complex_tasks:
    model: "opus-5"
    max_cost_per_task: 2.00
    use_for: ["architectural_decisions", "complex_debugging", "security_audit", "multi_step_reasoning"]
  
  reasoning_tasks:
    model: "fable-5"
    max_cost_per_task: 5.00
    use_for: ["complex_math", "algorithm_design", "security_research"]
  
  swap_rules:
    - if: "task_complexity > 7/10"
      then: "upgrade_to_opus"
    - if: "task_cost > 3x_expected"
      then: "downgrade_to_sonet"
    - if: "context_tokens > 100k"
      then: "consider_fable"
```

**Script:** `scripts/model-router.py`

### 4. Project Templates (Organização)

```
.project-templates/
├── course/
│   ├── .claude/
│   │   ├── project-instructions.md
│   │   ├── skills/ (course-specific)
│   │   └── connectors/ (drive, youtube)
│   ├── structure/
│   │   ├── modules/
│   │   ├── lessons/
│   │   └── assets/
│   └── README.md
├── client-project/
│   ├── .claude/
│   │   ├── project-instructions.md
│   │   ├── skills/ (client-specific)
│   │   └── connectors/ (gmail, calendar, drive, notion)
│   ├── docs/
│   │   ├── requirements.md
│   │   ├── architecture.md
│   │   └── deploy.md
│   └── src/
├── automation/
│   ├── .claude/
│   │   ├── project-instructions.md
│   │   ├── skills/ (hooks, coworkers)
│   │   └── connectors/ (gmail, calendar, drive, sheets)
│   ├── workflows/
│   │   ├── daily-report.yaml
│   │   ├── weekly-review.yaml
│   │   └── monthly-billing.yaml
│   └── scripts/
├── product/
│   ├── .claude/
│   │   ├── project-instructions.md
│   │   ├── skills/ (feature-dev, code-review)
│   │   └── connectors/ (github, linear, slack)
│   ├── specs/
│   ├── src/
│   ├── tests/
│   └── .github/
└── research/
    ├── .claude/
    │   ├── project-instructions.md
    │   ├── skills/ (deep-research, synthesis)
    │   └── connectors/ (web, arxiv, github)
    ├── sources/
    ├── analysis/
    └── reports/
```

**Script:** `scripts/create-project-from-template.py`

### 5. Connector Strategy (Integração)

**Prioridade Máxima (Configure First):**
```yaml
# .claude/connectors.yaml
connectors:
  priority_1:
    - gmail: "email triage, draft responses, search"
    - google_calendar: "schedule optimization, conflict detection"
  
  priority_2:
    - google_drive: "file access, folder org, sharing"
    - notion: "knowledge base, project docs, wiki"
  
  priority_3:
    - github: "code access, PR reviews, issues"
    - linear: "task management, sprint planning"
    - slack: "notifications, team communication"
  
  mcp_servers:
    - filesystem: "local file ops"
    - postgres: "database queries"
    - redis: "cache inspection"
```

**Script:** `scripts/setup-connectors.py`

### 6. Skills Defaults (Biblioteca Base)

```
.skills/
├── meeting-notes-to-notion/
├── weekly-report-generator/
├── code-review-automation/
├── email-triage/
├── calendar-optimizer/
├── file-organizer/
├── research-synthesis/
├── code-review-checklist/
├── deploy-checklist/
└── security-audit/
```

### 7. Settings Otimizados

```json
// .claude/settings.json
{
  "model": "sonet-3.7",
  "auto_compact": true,
  "auto_compact_threshold": 0.85,
  "hooks": {
    "PreToolUse": [
      { "matcher": "Read", "hooks": [{ "type": "command", "command": "python3 .claude/hooks/pretool-block-env.py" }] },
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "python3 .claude/hooks/pretool-block-rm-rf.py" }] }
    ],
    "PostToolUse": [
      { "matcher": "Task", "hooks": [{ "type": "command", "command": "python3 .claude/hooks/cost-tracker.py posttool" }] }
    ],
    "Stop": [
      { "matcher": "", "hooks": [{ "type": "command", "command": "python3 .claude/hooks/stop-run-tests.py" }] }
    ],
    "StartSession": [
      { "hooks": [{ "type": "command", "command": "python3 .claude/hooks/startsession-inject-context.py" }] }
    ]
  },
  "permissions": {
    "default": "ask",
    "allowed_tools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "Task", "WebFetch", "WebSearch"]
  }
}
```

---

## Scripts Inclusos

| Script | Função |
|--------|--------|
| `scripts/validate-memory-import.py` | Valida memory import + entrevista voz |
| `scripts/model-router.py` | Roteamento inteligente por complexidade/custo |
| `scripts/create-project-from-template.py` | Cria projeto a partir de template |
| `scripts/setup-connectors.py` | Configura conectores prioritários |
| `scripts/validate-account-setup.py` | Valida setup completo da conta |

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/ (pretool-block-env, pretool-block-rm-rf, cost-tracker, stop-run-tests)
│   ├── settings/ (opencode-hooks.json)
│   └── README.md
├── cursor/
│   ├── hooks/ (.cursor/rules/)
│   ├── settings/ (.cursor/settings.json)
│   └── README.md
├── codex/
│   ├── hooks/ (codex-hooks.json)
│   ├── settings/ (CODEX_COMMANDS.md)
│   └── README.md
├── gemini-cli/
│   ├── skills/ (Agent Skills format)
│   ├── settings/ (.gemini/settings.json)
│   └── README.md
└── ...
```

---

## Validação (CI)

```bash
# Rodar validação completa
node scripts/validate-account-setup.py

# Verificar hooks
python3 -m pytest tests/test-hooks.py -v

# Verificar model routing
python3 scripts/model-router.py --test

# Validar templates
python3 scripts/create-project-from-template.py --dry-run
```

---

## Checklist de Entrega

- [ ] Email pessoal configurado
- [ ] Memory import realizado + entrevista validada
- [ ] Model routing configurado + testado
- [ ] 4+ project templates criados
- [ ] 6+ conectores prioritários configurados
- [ ] 10+ skills base instaladas
- [ ] Settings.json otimizado com hooks
- [ ] Adapters para plataformas-alvo criados
- [ ] CI passando (validate-account-setup.py)
- [ ] Documentação de uso criada

---

## Referências Oficiais

- [Claude Code Memory](https://docs.anthropic.com/en/docs/claude-code/memory)
- [Claude Code Settings](https://docs.anthropic.com/en/docs/claude-code/settings)
- [Claude Code Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Claude Code Projects](https://docs.anthropic.com/en/docs/claude-code/projects)
- [Claude Code Skills](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Claude Code Model Routing](https://docs.anthropic.com/en/docs/claude-code/model-routing)