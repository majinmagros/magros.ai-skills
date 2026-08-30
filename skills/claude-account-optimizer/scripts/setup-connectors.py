#!/usr/bin/env python3
"""
setup-connectors.py — Configura conectores prioritários no Claude
Parte do skill claude-account-optimizer
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, List, Any

# Conectores prioritários por categoria
CONNECTORS = {
    "priority_1": [
        {"id": "gmail", "name": "Gmail", "description": "Email triage, draft responses, search", "category": "communication"},
        {"id": "google_calendar", "name": "Google Calendar", "description": "Schedule optimization, conflict detection", "category": "scheduling"},
    ],
    "priority_2": [
        {"id": "google_drive", "name": "Google Drive", "description": "File access, folder org, sharing", "category": "storage"},
        {"id": "notion", "name": "Notion", "description": "Knowledge base, project docs, wiki", "category": "knowledge"},
    ],
    "priority_3": [
        {"id": "github", "name": "GitHub", "description": "Code access, PR reviews, issues", "category": "development"},
        {"id": "linear", "name": "Linear", "description": "Task management, sprint planning", "category": "project_management"},
        {"id": "slack", "name": "Slack", "description": "Notifications, team communication", "category": "communication"},
    ],
    "mcp_servers": [
        {"id": "filesystem", "name": "Filesystem", "description": "Local file operations", "type": "mcp"},
        {"id": "postgres", "name": "PostgreSQL", "description": "Database queries", "type": "mcp"},
        {"id": "redis", "name": "Redis", "description": "Cache inspection", "type": "mcp"},
    ]
}

def get_all_connectors() -> List[Dict]:
    """Retorna todos conectores achatados."""
    all_conn = []
    for priority, connectors in CONNECTORS.items():
        for c in connectors:
            c_copy = c.copy()
            c_copy["priority"] = priority
            all_conn.append(c_copy)
    return all_conn

def get_claude_settings_path() -> Path:
    """Retorna caminho do settings.json do Claude."""
    # Tenta vários locais possíveis
    possible_paths = [
        Path.home() / ".claude" / "settings.json",
        Path.cwd() / ".claude" / "settings.json",
    ]
    for p in possible_paths:
        if p.exists():
            return p
    # Default para home
    return Path.home() / ".claude" / "settings.json"

def load_settings() -> Dict[str, Any]:
    """Carrega settings.json existente ou cria estrutura base."""
    path = get_claude_settings_path()
    if path.exists():
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "model": "sonet-3.7",
        "auto_compact": True,
        "auto_compact_threshold": 0.85,
        "hooks": {},
        "permissions": {
            "default": "ask",
            "allowed_tools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "Task", "WebFetch", "WebSearch"]
        }
    }

def save_settings(settings: Dict[str, Any]) -> None:
    """Salva settings.json."""
    path = get_claude_settings_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(settings, f, indent=2, ensure_ascii=False)

def get_configured_connectors(settings: Dict) -> List[str]:
    """Retorna lista de conectores já configurados."""
    # No Claude Code, conectores são gerenciados via API, não no settings.json
    # Esta função simula verificação - na prática, usa-se API do Claude
    return []

def generate_connectors_config() -> Dict[str, Any]:
    """Gera configuração recomendada de conectores."""
    return {
        "connectors": {
            "enabled": [c["id"] for c in get_all_connectors() if c["priority"] in ["priority_1", "priority_2"]],
            "available": {c["id"]: {"name": c["name"], "description": c["description"], "category": c["category"]} 
                          for c in get_all_connectors()},
            "mcp_servers": {c["id"]: {"name": c["name"], "description": c["description"]} 
                            for c in CONNECTORS["mcp_servers"]}
        }
    }

def print_connectors_table() -> None:
    """Imprime tabela de conectores organizados por prioridade."""
    print("\n=== CONECTORES RECOMENDADOS ===\n")
    for priority in ["priority_1", "priority_2", "priority_3"]:
        connectors = CONNECTORS[priority]
        print(f"📌 {priority.replace('_', ' ').upper()}:")
        for c in connectors:
            print(f"  • {c['name']} ({c['id']}) - {c['description']}")
        print()
    
    print("🔧 MCP SERVERS:")
    for c in CONNECTORS["mcp_servers"]:
        print(f"  • {c['name']} ({c['id']}) - {c['description']}")

def setup_connectors_interactive() -> None:
    """Setup interativo de conectores."""
    print("\n=== SETUP DE CONECTORES ===")
    print("Este script mostra os conectores recomendados.")
    print("Para conectar de fato, use a interface do Claude Code:")
    print("  1. Abra o Claude Code")
    print("  2. Digite /connectors")
    print("  3. Selecione os conectores desejados")
    print()
    print_connectors_table()
    
    print("\n📋 PRIORIDADE 1 (Configure primeiro):")
    print("  • gmail - Email triage, draft responses, search")
    print("  • google_calendar - Schedule optimization, conflict detection")
    print()
    print("📌 PRIORIDADE 2:")
    print("  • google_drive - File access, folder org, sharing")
    print("  • notion - Knowledge base, project docs, wiki")
    print()
    print("📌 PRIORIDADE 3:")
    print("  • github - Code access, PR reviews, issues")
    print("  • linear - Task management, sprint planning")
    print("  • slack - Notifications, team communication")
    print()
    print("🔧 MCP SERVERS:")
    print("  • filesystem - Local file operations")
    print("  • postgres - Database queries")
    print("  • redis - Cache inspection")

def generate_settings_patch() -> Dict:
    """Gera patch para settings.json com hooks recomendados."""
    return {
        "hooks": {
            "PreToolUse": [
                {
                    "matcher": "Read",
                    "hooks": [{"type": "command", "command": "python3 .claude/hooks/pretool-block-env.py"}]
                },
                {
                    "matcher": "Bash",
                    "hooks": [{"type": "command", "command": "python3 .claude/hooks/pretool-block-rm-rf.py"}]
                },
                {
                    "matcher": "Task",
                    "hooks": [{"type": "command", "command": "python3 .claude/hooks/cost-tracker.py pretool"}]
                }
            ],
            "PostToolUse": [
                {
                    "matcher": "Task",
                    "hooks": [{"type": "command", "command": "python3 .claude/hooks/cost-tracker.py posttool"}]
                }
            ],
            "Stop": [
                {
                    "matcher": "",
                    "hooks": [{"type": "command", "command": "python3 .claude/hooks/stop-run-tests.py"}]
                }
            ],
            "StartSession": [
                {
                    "hooks": [{"type": "command", "command": "python3 .claude/hooks/startsession-inject-context.py"}]
                }
            ]
        }

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Configura conectores prioritários no Claude")
    parser.add_argument("--list", action="store_true", help="Lista conectores recomendados")
    parser.add_argument("--generate-settings", action="store_true", help="Gera patch para settings.json")
    parser.add_argument("--apply", action="store_true", help="Aplica patch no settings.json (backup automático)")
    parser.add_argument("--output", help="Arquivo de saída para patch JSON")
    args = parser.parse_args()
    
    if args.list:
        print_connectors_table()
        return
    
    if args.generate_settings:
        patch = generate_settings_patch()
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(patch, f, indent=2, ensure_ascii=False)
            print(f"✅ Patch salvo em: {args.output}")
        else:
            print(json.dumps(patch, indent=2, ensure_ascii=False))
        return
    
    if args.apply:
        settings = load_settings()
        patch = generate_settings_patch()
        # Merge hooks
        if "hooks" not in settings:
            settings["hooks"] = {}
        for event, hooks in patch["hooks"].items():
            if event not in settings["hooks"]:
                settings["hooks"][event] = []
            # Evita duplicatas
            existing_commands = {h["command"] for h in settings["hooks"][event] for h in hooks if "command" in h}
            for hook in hooks:
                if hook["command"] not in existing_commands:
                    settings["hooks"][event].append(hook)
        
        # Backup
        backup_path = get_claude_settings_path().with_suffix(".json.backup")
        import shutil
        shutil.copy2(get_claude_settings_path(), backup_path)
        print(f"📦 Backup salvo em: {backup_path}")
        
        save_settings(settings)
        print("✅ Settings.json atualizado com hooks recomendados")
        return
    
    # Default: mostra ajuda
    parser.print_help()

if __name__ == "__main__":
    main()