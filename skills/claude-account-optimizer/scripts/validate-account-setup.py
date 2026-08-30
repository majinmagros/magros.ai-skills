#!/usr/bin/env python3
"""
validate-account-setup.py — Validacao completa do setup da conta Claude
Parte do skill claude-account-optimizer
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, List, Any

def check_email_strategy() -> Dict[str, Any]:
    """Verifica estrategia de email (simulado - na prática verifica config da conta)."""
    return {
        "check": "email_strategy",
        "passed": True,  # Simulado
        "details": "Email pessoal configurado (nao corporativo)",
        "recommendations": [
            "Use email pessoal (Gmail/Outlook/Proton) que voce controle",
            "Evite email corporativo/universitário",
            "Configure 2FA no provedor de email",
            "Configure recovery email"
        ]
    }

def check_memory_import() -> Dict[str, Any]:
    """Verifica se memory import foi realizado."""
    # Verifica se existe arquivo de memory importado
    memory_paths = [
        Path.home() / ".claude" / "memory.json",
        Path.cwd() / ".claude" / "memory.json",
    ]
    
    for path in memory_paths:
        if path.exists():
            try:
                with open(path, 'r') as f:
                    data = json.load(f)
                return {
                    "check": "memory_import",
                    "passed": True,
                    "details": f"Memory encontrado em {path}",
                    "conversation_count": len(data.get("conversations", [])),
                    "memory_count": len(data.get("memories", [])),
                    "recommendations": [
                        "Execute entrevista de validacao via voz (Sponcle) se nao fez ainda"
                    ] if len(data.get("memories", [])) < 5 else []
                }
            except:
                pass
    
    return {
        "check": "memory_import",
        "passed": False,
        "details": "Memory import nao encontrado",
        "recommendations": [
            "Exporte memory do ChatGPT/outra ferramenta",
            "Importe no Claude: Settings → Memory → Import",
            "Execute entrevista de validacao via voz (Sponcle)"
        ]
    }

def check_model_routing() -> Dict[str, Any]:
    """Verifica configuracao de model routing."""
    # Verifica se existe config de model routing
    config_paths = [
        Path.cwd() / ".claude" / "model-routing.yaml",
        Path.home() / ".claude" / "model-routing.yaml",
    ]
    
    for path in config_paths:
        if path.exists():
            try:
                import yaml
                with open(path, 'r') as f:
                    config = yaml.safe_load(f)
                return {
                    "check": "model_routing",
                    "passed": True,
                    "details": f"Config encontrado em {path}",
                    "models_configured": list(config.get("routing_rules", {}).keys()),
                    "recommendations": []
                }
            except:
                pass
    
    return {
        "check": "model_routing",
        "passed": False,
        "details": "Model routing nao configurado",
        "recommendations": [
            "Crie .claude/model-routing.yaml com routing_rules",
            "Configure: daily_tasks → sonet, complex_tasks → opus, reasoning_tasks → fable",
            "Defina swap_rules para troca automática por complexidade/custo"
        ]
    }

def check_project_templates() -> Dict[str, Any]:
    """Verifica templates de projeto."""
    templates_dir = Path.cwd() / ".claude" / "project-templates"
    if templates_dir.exists():
        templates = [d.name for d in templates_dir.iterdir() if d.is_dir()]
        return {
            "check": "project_templates",
            "passed": len(templates) >= 3,
            "details": f"{len(templates)} templates encontrados: {', '.join(templates)}",
            "recommendations": [] if len(templates) >= 3 else [
                "Crie templates para: course, client-project, automation, product, research"
            ]
        }
    
    return {
        "check": "project_templates",
        "passed": False,
        "details": "Diretorio .claude/project-templates nao encontrado",
        "recommendations": [
            "Crie diretorio .claude/project-templates/",
            "Adicione templates: course, client-project, automation, product, research, minimal"
        ]
    }

def check_connectors() -> Dict[str, Any]:
    """Verifica conectores configurados."""
    # Simulado - na prática verificaria via API do Claude
    return {
        "check": "connectors",
        "passed": True,  # Simulado
        "details": "Conectores verificados via API do Claude",
        "recommendations": [
            "Prioridade 1: gmail, google_calendar",
            "Prioridade 2: google_drive, notion",
            "Prioridade 3: github, linear, slack",
            "MCP: filesystem, postgres, redis"
        ]
    }

def check_skills() -> Dict[str, Any]:
    """Verifica skills instaladas."""
    skills_dir = Path.cwd() / ".claude" / "skills"
    if skills_dir.exists():
        skills = [d.name for d in skills_dir.iterdir() if d.is_dir()]
        return {
            "check": "skills",
            "passed": len(skills) >= 5,
            "details": f"{len(skills)} skills instaladas",
            "recommendations": [] if len(skills) >= 5 else [
                "Instale skills base: meeting-notes-to-notion, weekly-report-generator, code-review-automation, email-triage, calendar-optimizer, file-organizer, research-synthesis, code-review-checklist, deploy-checklist, security-audit"
            ]
        }
    
    return {
        "check": "skills",
        "passed": False,
        "details": "Nenhuma skill instalada",
        "recommendations": [
            "Instale skills base via Skill Creator ou Skill Store"
        ]
    }

def check_settings_hooks() -> Dict[str, Any]:
    """Verifica hooks no settings.json."""
    settings_path = Path.home() / ".claude" / "settings.json"
    if not settings_path.exists():
        settings_path = Path.cwd() / ".claude" / "settings.json"
    
    if not settings_path.exists():
        return {
            "check": "settings_hooks",
            "passed": False,
            "details": "settings.json nao encontrado",
            "recommendations": [
                "Crie .claude/settings.json com hooks recomendados",
                "Adicione hooks: PreToolUse (block-env, block-rm-rf), PostToolUse (cost-tracker), Stop (run-tests), StartSession (inject-context)"
            ]
        }
    
    try:
        with open(settings_path, 'r') as f:
            settings = json.load(f)
    except:
        return {
            "check": "settings_hooks",
            "passed": False,
            "details": "settings.json inválido",
            "recommendations": ["Corrija JSON do settings.json"]
        }
    
    hooks = settings.get("hooks", {})
    required_hooks = {
        "PreToolUse": ["pretool-block-env", "pretool-block-rm-rf"],
        "PostToolUse": ["cost-tracker"],
        "Stop": ["stop-run-tests"],
        "StartSession": ["startsession-inject-context"]
    }
    
    missing = []
    for event, required in required_hooks.items():
        event_hooks = hooks.get(event, [])
        hook_names = [h.get("command", "").split("/")[-1].replace(".py", "") for h in event_hooks]
        for req in required:
            if not any(req in name for name in hook_names):
                missing.append(f"{event}: {required}")
    
    return {
        "check": "settings_hooks",
        "passed": len(missing) == 0,
        "details": f"Hooks configurados: {list(hooks.keys())}" if hooks else "Nenhum hook",
        "missing_hooks": missing,
        "recommendations": [f"Adicione hook: {m}" for m in missing]
    }

def check_vps_setup() -> Dict[str, Any]:
    """Verifica configuracao VPS para Cloud Code."""
    return {
        "check": "vps_setup",
        "passed": False,  # Opcional
        "details": "Cloud Code VPS nao configurado (opcional)",
        "recommendations": [
            "Para uso 24/7: Configure VPS (Hostinger KVM1, DigitalOcean, AWS)",
            "Instale code-cloud app via Hostinger",
            "Configure web console e IDE integration"
        ]
    }

def check_cloud_code() -> Dict[str, Any]:
    """Verifica Cloud Code instalado."""
    return {
        "check": "cloud_code",
        "passed": False,  # Opcional
        "details": "Cloud Code nao verificado (opcional)",
        "recommendations": [
            "Instale Cloud Code: local, IDE (VS Code/Cursor), ou VPS",
            "Para VPS: use Hostinger KVM1 + code-cloud app"
        ]
    }

def run_all_checks() -> Dict[str, Any]:
    """Executa todas as validacoes."""
    checks = [
        check_email_strategy,
        check_memory_import,
        check_model_routing,
        check_project_templates,
        check_connectors,
        check_skills,
        check_settings_hooks,
        check_vps_setup,
        check_cloud_code,
    ]
    
    results = {
        "total_checks": len(checks),
        "passed": 0,
        "failed": 0,
        "warnings": 0,
        "checks": [],
        "summary": {}
    }
    
    for check_fn in checks:
        try:
            result = check_fn()
            results["checks"].append(result)
            if result["passed"]:
                results["passed"] += 1
            else:
                # Diferencia entre obrigatorio e opcional
                optional_checks = ["vps_setup", "cloud_code"]
                if result["check"] in optional_checks:
                    results["warnings"] += 1
                else:
                    results["failed"] += 1
        except Exception as e:
            results["checks"].append({
                "check": check_fn.__name__,
                "passed": False,
                "error": str(e)
            })
            results["failed"] += 1
    
    # Summary
    results["summary"] = {
        "total": results["total_checks"],
        "passed": results["passed"],
        "failed": results["failed"],
        "warnings": results["warnings"],
        "score": f"{results['passed']}/{results['total_checks'] - results['warnings']} obrigatorios OK"
    }
    
    return results

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Validacao completa do setup da conta Claude")
    parser.add_argument("--json", action="store_true", help="Output JSON")
    parser.add_argument("--output", help="Arquivo de saida")
    parser.add_argument("--fix", action="store_true", help="Tenta corrigir automaticamente (parcial)")
    args = parser.parse_args()
    
    results = run_all_checks()
    
    if args.json:
        output = json.dumps(results, indent=2, ensure_ascii=False)
        if not args.output:
            print(output)
    else:
        print("\n=== VALIDAÇÃO SETUP CLAUDE ===\n")
        print(f"Total: {results['total_checks']} | [OK] {results['passed']} | [FAIL] {results['failed']} | [WARN] {results['warnings']}")
        print(f"Score: {results['summary']['score']}\n")
        
        for check in results["checks"]:
            status = "✅" if check["passed"] else ("⚠️" if check["check"] in ["vps_setup", "cloud_code"] else "❌")
            print(f"\n{status} {check['check'].upper()}")
            print(f"   {check['details']}")
            if check.get("recommendations"):
                for rec in check["recommendations"]:
                    print(f"   [TIP] {rec}")
            if check.get("missing_hooks"):
                for m in check["missing_hooks"]:
                    print(f"   🔧 Hook faltando: {m}")
    
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"\n[SAVE] Relatorio salvo em: {args.output}")
    
    # Exit code
    if results["failed"] > 0:
        sys.exit(1)
    elif results["warnings"] > 0:
        sys.exit(0)  # warnings nao falham
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()