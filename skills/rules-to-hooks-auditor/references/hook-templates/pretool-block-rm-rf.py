#!/usr/bin/env python3
"""
pretool-block-rm-rf.py — PreToolUse hook: block dangerous bash commands (rm -rf, etc.)
Part of rules-to-hooks-auditor templates

Install:
    cp pretool-block-rm-rf.py .claude/hooks/pretool-block-rm-rf.py
    chmod +x .claude/hooks/pretool-block-rm-rf.py

Configure in .claude/settings.json:
    {
      "hooks": {
        "PreToolUse": [{
          "matcher": "Bash",
          "hooks": [{ "type": "command", "command": "python3 .claude/hooks/pretool-block-rm-rf.py" }]
        }]
      }
    }
"""

import sys
import json
import re

# ============ CONFIG ============
DANGEROUS_PATTERNS = [
    # Recursive force delete
    (r"rm\s+.*-[a-z]*r[a-z]*f|rm\s+.*-[a-z]*f[a-z]*r", "rm -rf / recursive force delete"),
    (r"rm\s+--recursive\s+--force|rm\s+--force\s+--recursive", "rm --recursive --force"),
    (r"rm\s+-rf\s+/", "rm -rf on root paths"),
    (r"rm\s+-rf\s+\*|rm\s+-rf\s+~", "rm -rf with wildcards/home"),
    
    # Dangerous sudo
    (r"sudo\s+rm\s+-rf", "sudo rm -rf"),
    (r"sudo\s+dd\s+", "sudo dd (disk write)"),
    (r"sudo\s+mkfs", "sudo mkfs (format)"),
    (r"sudo\s+fdisk", "sudo fdisk (partition)"),
    
    # Shell destruction
    (r":\(\)\{\s*:\|\s*:\}\s*;\s*:", "fork bomb"),
    (r">\s*/dev/sd[a-z]", "direct disk write"),
    (r"shred\s+", "shred (secure delete)"),
    (r"wipefs\s+", "wipefs (filesystem wipe)"),
    
    # Network danger
    (r"curl\s+.*\|\s*bash|curl\s+.*\|\s*sh", "curl | bash (pipe to shell)"),
    (r"wget\s+.*\|\s*bash|wget\s+.*\|\s*sh", "wget | bash"),
    
    # Package manager danger
    (r"pip\s+install\s+.*--break-system-packages", "pip breaking system packages"),
    (r"npm\s+install\s+-g\s+.*--unsafe-perm", "npm unsafe perm"),
]

def check_command(command: str) -> Tuple[bool, str]:
    """Check if command matches dangerous patterns. Returns (blocked, reason)."""
    # Normalize whitespace
    normalized = re.sub(r"\s+", " ", command.strip())
    
    for pattern, reason in DANGEROUS_PATTERNS:
        if re.search(pattern, normalized, re.IGNORECASE):
            return True, reason
    
    return False, ""

def main():
    try:
        data = json.load(sys.stdin)
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        return 1
    
    tool_name = data.get("tool", "")
    tool_input = data.get("tool_input", {})
    
    if tool_name != "Bash":
        return 0
    
    command = tool_input.get("command", "")
    if not command:
        return 0
    
    blocked, reason = check_command(command)
    if not blocked:
        return 0
    
    # BLOCK with explanation
    msg = f"🛑 BLOCKED: Dangerous command detected\n"
    msg += f"   Command: {command}\n"
    msg += f"   Reason: {reason}\n\n"
    msg += "   This command could cause irreversible data loss or system damage.\n"
    msg += "   If you really need to run this, use a safer alternative or run manually.\n"
    
    print(msg, file=sys.stderr)
    return 2

if __name__ == "__main__":
    sys.exit(main())