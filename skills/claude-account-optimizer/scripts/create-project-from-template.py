#!/usr/bin/env python3
"""
create-project-from-template.py — Cria projeto a partir de template
Parte do skill claude-account-optimizer
"""

import json
import sys
import os
import shutil
from pathlib import Path
from typing import Dict, List, Optional

TEMPLATES_DIR = Path(__file__).parent.parent / "references" / "project-templates"

TEMPLATES = {
    "course": {
        "description": "Curso online com módulos, aulas, assets",
        "structure": {
            "course": ["modules", "lessons", "assets", "quizzes"],
            ".claude": ["project-instructions.md", "skills", "connectors"]
        }
    },
    "client-project": {
        "description": "Projeto de cliente com requirements, arch, deploy",
        "structure": {
            "docs": ["requirements.md", "architecture.md", "deploy.md"],
            "src": [],
            "tests": [],
            ".claude": ["project-instructions.md", "skills", "connectors"]
        }
    },
    "automation": {
        "description": "Automação com workflows, scripts, skills, conectores",
        "structure": {
            "workflows": ["daily-report.yaml", "weekly-review.yaml", "monthly-billing.yaml"],
            "scripts": [],
            ".claude": ["project-instructions.md", "skills", "connectors"]
        }
    },
    "product": {
        "description": "Produto/SaaS com specs, src, tests, CI/CD",
        "structure": {
            "specs": [],
            "src": [],
            "tests": [],
            ".github": ["workflows"],
            ".claude": ["project-instructions.md", "skills", "connectors"]
        }
    },
    "research": {
        "description": "Pesquisa com sources, analysis, reports",
        "structure": {
            "sources": [],
            "analysis": [],
            "reports": [],
            ".claude": ["project-instructions.md", "skills", "connectors"]
        }
    },
    "minimal": {
        "description": "Projeto mínimo apenas com .claude",
        "structure": {
            ".claude": ["project-instructions.md"]
        }
    }
}

def create_project(template: str, project_name: str, target_dir: Path, dry_run: bool = False) -> Dict[str, Any]:
    """Cria projeto a partir de template."""
    if template not in TEMPLATES:
        return {"success": False, "error": f"Template não encontrado: {template}. Disponíveis: {list(TEMPLATES.keys())}"}
    
    target = target_dir / project_name
    if target.exists():
        return {"success": False, "error": f"Diretório já existe: {target}"}
    
    template_info = TEMPLATES[template]
    result = {"success": True, "created": [], "template": template, "project": project_name}
    
    def create_structure(base: Path, structure: Dict, path_prefix: str = ""):
        for name, content in structure.items():
            path = base / path_prefix / name
            if isinstance(content, list):
                # É um diretório
                if not dry_run:
                    path.mkdir(parents=True, exist_ok=True)
                result["created"].append(str(path.relative_to(target_dir)))
                if content:
                    create_structure(path, {item: None for item in content}, "")
            elif content is None:
                # É um arquivo vazio
                if not dry_run:
                    path.parent.mkdir(parents=True, exist_ok=True)
                    path.touch()
                result["created"].append(str(path.relative_to(target_dir)))
            else:
                # É um arquivo com conteúdo
                if not dry_run:
                    path.parent.mkdir(parents=True, exist_ok=True)
                    path.write_text(content, encoding='utf-8')
                result["created"].append(str(path.relative_to(target_dir)))
    
    if not dry_run:
        target.mkdir(parents=True, exist_ok=True)
    result["created"].append(str(target.relative_to(target_dir)))
    
    create_structure(target, template_info["structure"])
    
    # Cria .claude/project-instructions.md básico se não existir
    instructions_file = target / ".claude" / "project-instructions.md"
    if not dry_run and not instructions_file.exists():
        instructions_file.parent.mkdir(parents=True, exist_ok=True)
        instructions_file.write_text(f"""# {project_name} - Project Instructions

## Overview
{TEMPLATES[template]['description']}

## Project Type
{template}

## Conventions
- Use semantic HTML
- Follow project conventions
- Write tests for new features
- Document decisions in ADR

## Commands
- dev: npm run dev
- test: npm test
- build: npm run build
- lint: npm run lint

## Skills Available
- meeting-notes-to-notion
- weekly-report-generator
- code-review-automation
- email-triage
- calendar-optimizer
- file-organizer
- research-synthesis

## Connectors
- gmail
- google_calendar
- google_drive
- notion
- github

""", encoding='utf-8')
        result["created"].append(str(instructions_file.relative_to(target_dir)))
    
    return result

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Cria projeto a partir de template")
    parser.add_argument("template", help=f"Template: {', '.join(TEMPLATES.keys())}")
    parser.add_argument("name", help="Nome do projeto")
    parser.add_argument("--target", "-t", default=".", help="Diretório alvo")
    parser.add_argument("--dry-run", action="store_true", help="Simula sem criar arquivos")
    parser.add_argument("--list", action="store_true", help="Lista templates disponíveis")
    args = parser.parse_args()
    
    if args.list:
        print("Templates Disponíveis:")
        for name, info in TEMPLATES.items():
            print(f"  {name}: {info['description']}")
        return
    
    if not args.name:
        parser.error("Nome do projeto é obrigatório")
    
    target_dir = Path(args.target).resolve()
    result = create_project(args.template, args.name, target_dir, args.dry_run)
    
    if not result["success"]:
        print(f"❌ {result['error']}", file=sys.stderr)
        sys.exit(1)
    
    action = "Simulado" if args.dry_run else "Criado"
    print(f"✅ Projeto {action}: {result['project']} ({result['template']})")
    print(f"📁 Local: {Path(args.target).resolve() / result['project']}")
    print(f"📄 Arquivos: {len(result['created'])}")
    for f in result["created"][:20]:
        print(f"  {f}")
    if len(result["created"]) > 20:
        print(f"  ... e mais {len(result['created']) - 20} arquivos")

if __name__ == "__main__":
    main()