#!/usr/bin/env python3
"""
posttool-log-actions.py — PostToolUse hook: log all tool calls (JSONL)
Part of rules-to-hooks-auditor templates

Install:
    cp posttool-log-actions.py .claude/hooks/posttool-log-actions.py
    chmod +x .claude/hooks/posttool-log-actions.py

Configure in .claude/settings.json:
    {
      "hooks": {
        "PostToolUse": [{
          "matcher": "Edit|Write|MultiEdit|Bash|Task",
          "hooks": [{ "type": "command", "command": "python3 .claude/hooks/posttool-log-actions.py" }]
        }]
      }
    }

Output: .claude/logs/tool-calls.jsonl (one JSON line per tool call)
Exit codes: 0=success, 1=error
"""

import sys
import json
import os
from pathlib import Path
from datetime import datetime

LOG_DIR = Path(".claude/logs")
LOG_FILE = LOG_DIR / "tool-calls.jsonl"
MAX_LOG_SIZE = 10 * 1024 * 1024  # 10MB rotation

def rotate_log():
    """Rotate log if too large."""
    if LOG_FILE.exists() and LOG_FILE.stat().st_size > MAX_LOG_SIZE:
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        rotated = LOG_DIR / f"tool-calls-{timestamp}.jsonl"
        LOG_FILE.rename(rotated)

def main():
    try:
        data = json.load(sys.stdin)
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        return 1
    
    # Extract relevant fields
    tool_name = data.get("tool", "")
    tool_input = data.get("tool_input", {})
    tool_result = data.get("tool_result", {})
    
    # Build log entry
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "tool": tool_name,
        "input": tool_input,
        "result_summary": {
            "success": tool_result.get("success", True),
            "error": tool_result.get("error"),
            # Don't log full output (too large)
            "output_preview": str(tool_result.get("output", ""))[:200] if tool_result.get("output") else None
        }
    }
    
    # Add context
    if "session_id" in data:
        entry["session_id"] = data["session_id"]
    if "request_id" in data:
        entry["request_id"] = data["request_id"]
    
    # Ensure log dir
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    rotate_log()
    
    # Append JSONL
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception as e:
        print(f"Log write error: {e}", file=sys.stderr)
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())