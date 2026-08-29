#!/usr/bin/env python3
"""
startsession-inject-context.py — StartSession hook: inject context at session start
Part of rules-to-hooks-auditor templates

Install:
    cp startsession-inject-context.py .claude/hooks/startsession-inject-context.py
    chmod +x .claude/hooks/startsession-inject-context.py

Configure in .claude/settings.json:
    {
      "hooks": {
        "StartSession": [{
          "hooks": [{ "type": "command", "command": "python3 .claude/hooks/startsession-inject-context.py" }]
        }]
      }
    }

The hook prints context to stdout which gets injected into the session.
Exit codes:
    0 = SUCCESS (output injected)
    1 = ERROR
"""

import sys
import os
import json
from pathlib import Path
from datetime import datetime

# ============ CONFIG ============
CONTEXT_FILES = [
    # (file_path, label, max_chars)
    ("decisions.md", "📋 Project Decisions", 5000),
    ("context.md", "🧠 Project Context", 3000),
    ("CLAUDE.md", "📖 CLAUDE.md (rules)", 2000),
    ("AGENTS.md", "🤖 AGENTS.md", 2000),
    ("README.md", "📄 README", 1000),
]

GIT_COMMANDS = [
    (["git", "status", "--short"], "📊 Git Status"),
    (["git", "log", "--oneline", "-5"], "📜 Recent Commits"),
    (["git", "branch", "-a"], "🌿 Branches"),
]

def read_file_safe(path: Path, max_chars: int) -> str:
    """Read file with size limit."""
    try:
        if not path.exists():
            return ""
        content = path.read_text(encoding="utf-8")
        if len(content) > max_chars:
            content = content[:max_chars] + f"\n... (truncated, {len(content)} total chars)"
        return content
    except Exception:
        return ""

def run_git(cmd: list) -> str:
    """Run git command safely."""
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=5, cwd=Path.cwd())
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout.strip()
    except Exception:
        pass
    return ""

def main():
    cwd = Path.cwd()
    output_parts = []
    
    # Header
    output_parts.append(f"🚀 SESSION STARTED — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    output_parts.append(f"📁 Working directory: {cwd}")
    output_parts.append("=" * 60)
    
    # Context files
    for file_path, label, max_chars in CONTEXT_FILES:
        full_path = cwd / file_path
        content = read_file_safe(full_path, max_chars)
        if content:
            output_parts.append(f"\n{label} ({file_path}):")
            output_parts.append("-" * 40)
            output_parts.append(content)
    
    # Git info
    output_parts.append("\n" + "=" * 60)
    output_parts.append("🔧 GIT REPOSITORY INFO")
    output_parts.append("-" * 40)
    
    for cmd, label in GIT_COMMANDS:
        result = run_git(cmd)
        if result:
            output_parts.append(f"\n{label}:")
            output_parts.append(result)
    
    # Environment hints
    output_parts.append("\n" + "=" * 60)
    output_parts.append("💡 QUICK REMINDERS")
    output_parts.append("-" * 40)
    output_parts.append("• Use /fh commands for multi-model orchestration")
    output_parts.append("• Hooks active: stop-run-tests, pretool-block-env, pretool-block-rm-rf")
    output_parts.append("• Check .claude/settings.json for hook configuration")
    output_parts.append("• Run `python3 .fusion-harness/scripts/fh-opinion.py \"question\"` for opinions")
    
    # Print all to stdout (injected into session)
    print("\n".join(output_parts))
    return 0

if __name__ == "__main__":
    import subprocess
    sys.exit(main())