#!/usr/bin/env python3
"""
stop-run-tests.py — Stop hook: run full test suite, block if any fail
Part of rules-to-hooks-auditor templates

Install:
    cp stop-run-tests.py .claude/hooks/stop-run-tests.py
    chmod +x .claude/hooks/stop-run-tests.py

Configure in .claude/settings.json:
    {
      "hooks": {
        "Stop": [{
          "matcher": "",
          "hooks": [{ "type": "command", "command": "python3 .claude/hooks/stop-run-tests.py" }]
        }]
      }
    }

Exit codes:
    0 = PASS (allow conversation to end)
    2 = BLOCK (force agent to resume and fix failures)
    1 = HOOK ERROR (script failure)
"""

import subprocess
import sys
import os
import json
from pathlib import Path
from typing import List, Tuple, Optional

# ============ CONFIG ============
TEST_COMMANDS = [
    # (detector_file, test_command, description)
    ("pytest.ini", ["pytest", "-x", "-q"], "pytest"),
    ("pyproject.toml", ["pytest", "-x", "-q"], "pytest (pyproject)"),
    ("package.json", ["npm", "test", "--", "--passWithNoTests"], "npm test"),
    ("package.json", ["yarn", "test", "--passWithNoTests"], "yarn test"),
    ("package.json", ["pnpm", "test", "--passWithNoTests"], "pnpm test"),
    ("Cargo.toml", ["cargo", "test"], "cargo test"),
    ("go.mod", ["go", "test", "./..."], "go test"),
    ("build.gradle", ["./gradlew", "test"], "gradle test"),
    ("pom.xml", ["mvn", "test"], "maven test"),
    ("Makefile", ["make", "test"], "make test"),
    ("jest.config.js", ["npx", "jest", "--passWithNoTests"], "jest"),
    ("vitest.config.ts", ["npx", "vitest", "run"], "vitest"),
]

TIMEOUT_SECONDS = 120
VERBOSE = os.environ.get("HOOK_VERBOSE", "0") == "1"

def log(msg: str):
    if VERBOSE:
        print(f"[stop-run-tests] {msg}", file=sys.stderr)

def detect_test_runner(cwd: Path) -> Tuple[Optional[List[str]], str]:
    """Detect test runner based on config files in cwd and parents."""
    for parent in [cwd] + list(cwd.parents):
        for detector, cmd, desc in TEST_COMMANDS:
            if (parent / detector).exists():
                log(f"Detected {desc} via {detector} in {parent}")
                return cmd, desc
    return None, "unknown"

def run_tests(cmd: List[str], cwd: Path) -> Tuple[int, str, str]:
    """Run test command, return (exit_code, stdout, stderr)."""
    log(f"Running: {' '.join(cmd)} in {cwd}")
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=TIMEOUT_SECONDS
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, "", f"Test timeout after {TIMEOUT_SECONDS}s"
    except FileNotFoundError:
        return -1, "", f"Command not found: {cmd[0]}"
    except Exception as e:
        return -1, "", str(e)

def parse_test_output(desc: str, stdout: str, stderr: str) -> Tuple[int, int, List[str]]:
    """Parse test output for summary. Returns (passed, failed, failure_details)."""
    passed = failed = 0
    failures = []
    
    output = stdout + "\n" + stderr
    
    # Pytest
    if "pytest" in desc:
        for line in output.splitlines():
            if "passed" in line and "failed" in line:
                import re
                m = re.search(r"(\d+)\s+passed", line)
                if m: passed = int(m.group(1))
                m = re.search(r"(\d+)\s+failed", line)
                if m: failed = int(m.group(1))
            if "FAILED" in line and "::" in line:
                failures.append(line.strip())
    
    # Jest/Vitest
    elif "jest" in desc or "vitest" in desc:
        for line in output.splitlines():
            if "Tests:" in line:
                import re
                m = re.search(r"(\d+)\s+passed", line)
                if m: passed = int(m.group(1))
                m = re.search(r"(\d+)\s+failed", line)
                if m: failed = int(m.group(1))
    
    # Go test
    elif "go test" in desc:
        for line in output.splitlines():
            if line.startswith("--- PASS:"):
                passed += 1
            elif line.startswith("--- FAIL:"):
                failed += 1
                failures.append(line.strip())
    
    # Cargo test
    elif "cargo test" in desc:
        for line in output.splitlines():
            if "test result:" in line:
                import re
                m = re.search(r"(\d+)\s+passed", line)
                if m: passed = int(m.group(1))
                m = re.search(r"(\d+)\s+failed", line)
                if m: failed = int(m.group(1))
    
    # Generic fallback
    if passed == 0 and failed == 0:
        if "error" in output.lower() or "fail" in output.lower() or "FAIL" in output:
            failed = 1
            failures.append("Test output indicates failure (generic detection)")
        else:
            passed = 1
    
    return passed, failed, failures

def main():
    cwd = Path.cwd()
    
    # Detect test runner
    cmd, desc = detect_test_runner(cwd)
    if not cmd:
        print("⚠️  No test runner detected (no pytest.ini, package.json, Cargo.toml, go.mod, etc.)", file=sys.stderr)
        print("   Skipping test enforcement. Add test config or create .claude/hooks/stop-run-tests.py custom.", file=sys.stderr)
        return 0  # PASS - no tests to run
    
    print(f"🧪 Running tests ({desc})...", file=sys.stderr)
    
    # Run tests
    exit_code, stdout, stderr = run_tests(cmd, cwd)
    
    # Parse results
    passed, failed, failures = parse_test_output(desc, stdout, stderr)
    
    if failed == 0 and exit_code == 0:
        print(f"✅ All {passed} tests passed ({desc})", file=sys.stderr)
        return 0  # PASS
    
    # FAILURE - block conversation
    print(f"❌ TESTS FAILED: {failed} failed, {passed} passed ({desc})", file=sys.stderr)
    if failures:
        print("   Failures:", file=sys.stderr)
        for f in failures[:10]:  # Limit output
            print(f"     - {f}", file=sys.stderr)
        if len(failures) > 10:
            print(f"     ... and {len(failures) - 10} more", file=sys.stderr)
    
    # Show relevant output
    if stdout:
        print("   STDOUT:", file=sys.stderr)
        for line in stdout.splitlines()[-20:]:  # Last 20 lines
            print(f"     {line}", file=sys.stderr)
    if stderr:
        print("   STDERR:", file=sys.stderr)
        for line in stderr.splitlines()[-20:]:
            print(f"     {line}", file=sys.stderr)
    
    return 2  # BLOCK - force agent to fix

if __name__ == "__main__":
    sys.exit(main())