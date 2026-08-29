#!/usr/bin/env python3
"""
pretool-block-env.py — PreToolUse hook: block reading .env* / secrets files
Part of rules-to-hooks-auditor templates

Install:
    cp pretool-block-env.py .claude/hooks/pretool-block-env.py
    chmod +x .claude/hooks/pretool-block-env.py

Configure in .claude/settings.json:
    {
      "hooks": {
        "PreToolUse": [{
          "matcher": "Read",
          "hooks": [{ "type": "command", "command": "python3 .claude/hooks/pretool-block-env.py" }]
        }]
      }
    }

The hook receives JSON on stdin with tool call details.
Exit codes:
    0 = ALLOW (tool call proceeds)
    2 = BLOCK (tool call blocked, message sent to agent)
    1 = HOOK ERROR
"""

import sys
import json
import os
import re
from pathlib import Path

# ============ CONFIG ============
BLOCKED_PATTERNS = [
    # Environment / secrets files
    r"\.env(\.\w+)?$",
    r"\.secrets(\.\w+)?$",
    r"\.credentials(\.\w+)?$",
    r"\.keys(\.\w+)?$",
    r"secrets\.\w+$",
    r"credentials\.\w+$",
    # Private keys / certs
    r"\.pem$",
    r"\.key$",
    r"\.crt$",
    r"\.pfx$",
    r"\.p12$",
    r"id_rsa$",
    r"id_ed25519$",
    # Config with secrets
    r"config\.json$",
    r"settings\.json$",
    r"\.config/.*\.json$",
    # Cloud credentials
    r"\.aws/credentials",
    r"\.gcp/credentials",
    r"\.azure/credentials",
    # Database
    r"\.pgpass$",
    r"\.my\.cnf$",
]

# Files that are SAFE alternatives to suggest
SAFE_ALTERNATIVES = {
    r"\.env(\.\w+)?$": ".env.example",
    r"\.secrets(\.\w+)?$": ".secrets.example",
    r"config\.json$": "config.example.json",
    r"settings\.json$": "settings.example.json",
}

def is_blocked(filepath: str) -> Tuple[bool, Optional[str]]:
    """Check if filepath matches blocked patterns. Returns (blocked, suggested_alternative)."""
    filename = Path(filepath).name
    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, filepath, re.IGNORECASE) or re.search(pattern, filename, re.IGNORECASE):
            # Find safe alternative
            alt = None
            for pat, suggestion in SAFE_ALTERNATIVES.items():
                if re.search(pat, filepath, re.IGNORECASE):
                    alt = suggestion
                    break
            return True, alt
    return False, None

def main():
    try:
        # Read tool call from stdin
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        print("Invalid JSON input", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        return 1
    
    tool_name = data.get("tool", "")
    tool_input = data.get("tool_input", {})
    
    # Only process Read tool
    if tool_name != "Read":
        return 0
    
    file_path = tool_input.get("file_path", "")
    if not file_path:
        return 0
    
    # Check if blocked
    blocked, alternative = is_blocked(file_path)
    if not blocked:
        return 0  # ALLOW
    
    # BLOCK with helpful message
    msg = f"🔒 BLOCKED: Reading secrets file '{file_path}' is not allowed.\n"
    msg += "   This prevents API keys, tokens, and credentials from entering the LLM context.\n"
    
    if alternative:
        msg += f"\n   💡 SUGGESTION: Read '{alternative}' instead — it contains the schema without secrets."
    
    msg += "\n\n   If you need to verify env vars exist, use a script that checks without exposing values."
    
    print(msg, file=sys.stderr)
    return 2  # BLOCK

if __name__ == "__main__":
    sys.exit(main())