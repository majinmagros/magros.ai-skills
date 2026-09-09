# Setup Guide — Conta Claude do Zero (7 passos detalhados)

## 1. Email Strategy (Fundação)

Regra de ouro: NUNCA email corporativo. Use email pessoal que você controle para sempre.

Checklist: email pessoal (Gmail/Outlook/Proton) · não corporativo/universitário · acesso 5+ anos · 2FA no provedor · recovery email configurado.

## 2. Memory Import Workflow (Crítico)

```bash
# 1. Export memory da origem (ChatGPT etc.): Settings → Memory → Export → JSON
# 2. Import no Claude: Settings → Memory → Import → Upload JSON
# 3. Entrevista de validação OBRIGATÓRIA (voz Sponcle/Whisper → transcrição → prompt):
```

```
Me entreviste para me conhecer melhor e trabalhar melhor comigo.
Faça uma pergunta por vez sobre: minha vida, trabalho, negócio, objetivos, projetos,
e principalmente COMO EU GOSTO DE TRABALHAR.
```

Script de validação: `scripts/validate-memory-import.py`. Detalhe em `memory-import-workflow`.

## 3. Model Routing Strategy (Economia)

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

Script: `scripts/model-router.py`. Detalhe em `claude-model-router`.

## 4. Project Templates (Organização)

```
.project-templates/
├── course/            # .claude/ (instructions, skills, connectors drive/youtube) + structure/modules/lessons/assets
├── client-project/    # .claude/ (instructions, skills, gmail/calendar/drive/notion) + docs/requirements/architecture/deploy + src/
├── automation/        # .claude/ (instructions, hooks/coworkers, gmail/calendar/drive/sheets) + workflows/daily-weekly-monthly + scripts/
├── product/           # .claude/ (instructions, feature-dev/code-review, github/linear/slack) + specs/src/tests/.github/
└── research/          # .claude/ (instructions, deep-research/synthesis, web/arxiv/github) + sources/analysis/reports/
```

Script: `scripts/create-project-from-template.py`. Detalhe em `claude-project-template`.

## 5. Connector Strategy (Integração)

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

Script: `scripts/setup-connectors.py`. Detalhe em `claude-connector-strategy`.

## 6. Skills Defaults (Biblioteca Base)

```
.skills/
├── meeting-notes-to-notion/ · weekly-report-generator/ · code-review-automation/
├── email-triage/ · calendar-optimizer/ · file-organizer/ · research-synthesis/
└── code-review-checklist/ · deploy-checklist/ · security-audit/
```

## 7. Settings Otimizados

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

## Scripts Inclusos

| Script | Função |
|--------|--------|
| `scripts/validate-memory-import.py` | Valida memory import + entrevista voz |
| `scripts/model-router.py` | Roteamento inteligente por complexidade/custo |
| `scripts/create-project-from-template.py` | Cria projeto a partir de template |
| `scripts/setup-connectors.py` | Configura conectores prioritários |
| `scripts/validate-account-setup.py` | Valida setup completo da conta |

## Validação (CI)

```bash
node scripts/validate-account-setup.py   # validação completa
python3 -m pytest tests/test-hooks.py -v # hooks
python3 scripts/model-router.py --test   # routing
python3 scripts/create-project-from-template.py --dry-run  # templates
```
