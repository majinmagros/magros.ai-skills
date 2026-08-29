#!/usr/bin/env python3
"""
subagentstop-audit.py — SubAgentStop hook: audit sub-agent output
Part of rules-to-hooks-auditor templates

Install:
    cp subagentstop-audit.py .claude/hooks/subagentstop-audit.py
    chmod +x .claude/hooks/subagentstop-audit.py

Configure in .claude/settings.json:
    {
      "hooks": {
        "SubAgentStop": [{
          "hooks": [{ "type": "command", "command": "python3 .claude/hooks/subagentstop-audit.py" }]
        }]
      }
    }

Audits sub-agent completion for:
- Task completion (did it actually finish?)
- Output quality (hallucination check)
- Security (no secrets leaked)
- Cost tracking
Exit codes: 0=ok, 2=block parent (force review), 1=error
"""

import sys
import json
import os
import re
from pathlib import Path
from datetime import datetime

# ============ CONFIG ============
AUDIT_LOG = Path(".claude/logs/subagent-audit.jsonl")

# Patterns that indicate problems
HALLUCINATION_INDICATORS = [
    r"as an ai language model",
    r"i cannot",
    r"i don't have access",
    r"i'm not able",
    r"as of my knowledge cutoff",
    r"i apologize",
]

SECRET_PATTERNS = [
    (r"sk-[a-zA-Z0-9]{32,}", "OpenAI API key"),
    (r"sk-ant-[a-zA-Z0-9-_]{95,}", "Anthropic API key"),
    (r"ghp_[a-zA-Z0-9]{36}", "GitHub PAT"),
    (r"glpat-[a-zA-Z0-9-_]{20,}", "GitLab PAT"),
    (r"xoxb-[0-9]{11}-[0-9]{11}-[a-zA-Z0-9]{24}", "Slack bot token"),
    (r"AIza[0-9A-Za-z-_]{35}", "Google API key"),
    (r"AKIA[0-9A-Z]{16}", "AWS access key"),
    (r"-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----", "Private key"),
]

INCOMPLETE_INDICATORS = [
    r"todo:",
    r"fixme:",
    r"placeholder",
    r"not implemented",
    r"coming soon",
    r"\[...\]",
]

def check_hallucination(text: str) -> List[str]:
    issues = []
    text_lower = text.lower()
    for pattern in HALLUCINATION_INDICATORS:
        if re.search(pattern, text_lower):
            issues.append(f"Possible hallucination/hedging: '{pattern}'")
    return issues

def check_secrets(text: str) -> List[str]:
    issues = []
    for pattern, label in SECRET_PATTERNS:
        if re.search(pattern, text):
            issues.append(f"SECRET LEAK: {label} detected in output")
    return issues

def check_incomplete(text: str) -> List[str]:
    issues = []
    text_lower = text.lower()
    for pattern in INCOMPLETE_INDICATORS:
        if re.search(pattern, text_lower):
            issues.append(f"Possible incomplete work: '{pattern}'")
    return issues

def main():
    try:
        data = json.load(sys.stdin)
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        return 1
    
    # SubAgentStop data structure
    agent_name = data.get("agent_name", "unknown")
    agent_output = data.get("output", "")
    agent_result = data.get("result", {})
    
    all_issues = []
    
    # Run checks
    all_issues.extend(check_hallucination(agent_output))
    all_issues.extend(check_secrets(agent_output))
    all_issues.extend(check_incomplete(agent_output))
    
    # Check if task actually completed
    if agent_result.get("success") is False:
        all_issues.append("Sub-agent reported failure")
    
    # Log audit entry
    AUDIT_LOG.parent.mkdir(parents=True, exist_ok=True)
    audit_entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "agent_name": agent_name,
        "issues_found": len(all_issues),
        "issues": all_issues,
        "output_length": len(agent_output),
        "success": agent_result.get("success", True)
    }
    
    try:
        with open(AUDIT_LOG, "a") as f:
            f.write(json.dumps(audit_entry) + "\n")
    except Exception:
        pass
    
    # Report
    if all_issues:
        print(f"⚠️  SUB-AGENT AUDIT: {agent_name} — {len(all_issues)} issue(s)", file=sys.stderr)
        for issue in all_issues[:5]:
            print(f"   - {issue}", file=sys.stderr)
        if len(all_issues) > 5:
            print(f"   ... and {len(all_issues) - 5} more", file=sys.stderr)
        
        # Block if secrets leaked or critical failure
        secret_leaks = [i for i in all_issues if "SECRET LEAK" in i]
        if secret_leaks or agent_result.get("success") is False:
            print("🛑 BLOCKING: Critical issue requires human review", file=sys.stderr)
            return 2  # BLOCK parent
    
    return 0  # OK

if __name__ == "__main__":
    sys.exit(main())