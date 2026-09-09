# Templates — course, client-project, automation, product, research + instructions + creator

## 1. Course Template

```
course/
├── .claude/
│   ├── project-instructions.md
│   ├── skills/ (course-specific)
│   └── connectors/ (youtube, drive)
├── modules/
│   ├── module-01/
│   │   ├── lessons/
│   │   ├── assets/
│   │   └── quizzes/
│   └── ...
├── assets/
│   ├── images/
│   ├── videos/
│   └── downloads/
├── scripts/
│   ├── build.py
│   └── deploy.py
└── README.md
```

## 2. Client Project Template

```
client-project/
├── .claude/
│   ├── project-instructions.md
│   ├── skills/ (client-specific)
│   └── connectors/ (gmail, calendar, drive, notion)
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── deploy.md
│   └── api-contracts.md
├── src/
├── tests/
├── deploy/
└── README.md
```

## 3. Automation Template

```
automation/
├── .claude/
│   ├── project-instructions.md
│   ├── skills/ (workflow skills)
│   └── connectors/ (gmail, calendar, drive, sheets)
├── workflows/
│   ├── daily-report.yaml
│   ├── weekly-review.yaml
│   └── monthly-billing.yaml
├── scripts/
│   ├── run-daily.py
│   └── deploy.py
└── schedules/
    └── cron.yaml
```

## 4. Product Template

```
product/
├── .claude/
│   ├── project-instructions.md
│   ├── skills/ (feature-dev, code-review)
│   └── connectors/ (github, linear, slack)
├── specs/
├── src/
├── tests/
├── .github/
│   └── workflows/
└── docs/
```

## 5. Research Template

```
research/
├── .claude/
│   ├── project-instructions.md
│   ├── skills/ (deep-research, synthesis)
│   └── connectors/ (web, arxiv, github)
├── sources/
├── analysis/
├── reports/
└── README.md
```

## Criar Projeto a partir de Template

```bash
# CLI usage
claude-project-template create --template course --name "My Course"
claude-project-template create --template client-project --name "Client ABC"
claude-project-template create --template automation --name "Daily Reports"
```

```python
# create-project-from-template.py
TEMPLATES = {
    "course": {"description": "Curso online com módulos, aulas, assets", "structure": {...}},
    "client-project": {"description": "Projeto de cliente com requirements, arch, deploy", "structure": {...}},
    "automation": {"description": "Automação com workflows, scripts, cron", "structure": {...}},
    "product": {"description": "Produto/SaaS com specs, src, tests, CI/CD", "structure": {...}},
    "research": {"description": "Pesquisa com sources, analysis, reports", "structure": {...}},
    "minimal": {"description": "Projeto mínimo apenas com .claude/", "structure": {...}}
}

def create_project(template, name, target_dir):
    template_info = TEMPLATES[template]
    target = Path(target_dir) / name

    # Create structure
    for path, content in template_info["structure"].items():
        # Create dirs/files

    # Create .claude/project-instructions.md
    # Create skills/ connectors/ as per template

    return {"success": True, "created": created_files}
```

## .claude/project-instructions.md Template

```markdown
# {{PROJECT_NAME}} - Project Instructions

## Overview
{{DESCRIPTION}}

## Project Type
{{TEMPLATE_TYPE}}

## Conventions
- Code style: {{STYLE_GUIDE}}
- Git: {{GIT_CONVENTIONS}}
- Commits: {{COMMIT_CONVENTION}}

## Commands
- dev: {{DEV_COMMAND}}
- test: {{TEST_COMMAND}}
- build: {{BUILD_COMMAND}}
- lint: {{LINT_COMMAND}}

## Skills Available
{{SKILLS_LIST}}

## Connectors Configured
{{CONNECTORS_LIST}}

## Project Structure
{{STRUCTURE_TREE}}

## Important Files
- `docs/requirements.md` - Requirements
- `docs/architecture.md` - Architecture decisions
- `.claude/project-instructions.md` - This file
```

## Integração com Skill Creator

```python
# Integration with criar-skill
# When creating a new skill, it can suggest project template

def suggest_template(project_type: str) -> str:
    templates = {
        "course": "course",
        "client": "client-project",
        "automation": "automation",
        "saas": "product",
        "research": "research",
        "quick": "minimal"
    }
    return templates.get(project_type, "minimal")
```
