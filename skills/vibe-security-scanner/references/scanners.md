# Automated Scanners

## Tool 1: OWASP ZAP (Web App Scanner)

```bash
# Docker-based scan (no install needed)
docker run --rm -v $(pwd)/zap-report:/zap/wrk/:rw \
  -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t http://localhost:3000 -r report.html

# Quick scan
npx @zaproxy/cli baseline http://localhost:3000
```

Finds: XSS, SQLi, CSRF, missing headers, info leakage.

## Tool 2: GitLeaks (Secrets in Git History)

```bash
# Install
brew install gitleaks  # or: scoop install gitleaks

# Scan repo
gitleaks detect --source . --verbose

# Scan git history (finds deleted secrets)
gitleaks detect --source . --log-opts="--all" --verbose

# Pre-commit hook
gitleaks protect --staged --verbose
```

Finds: API keys, passwords, tokens, connection strings in any commit.

## Tool 3: Bandit (Python Security Linter)

```bash
# Install
pip install bandit

# Scan project
bandit -r . -f json -o bandit-report.json

# Quick scan with severity filter
bandit -r . -ll  # only HIGH and MEDIUM
```

Finds: SQL injection, hardcoded passwords, insecure deserialization, eval() usage.

## Tool 4: OpenGrype (Dependency Vulnerabilities)

```bash
# Docker-based (no install)
docker run --rm -v $(pwd):/src anchore/grype dir:/src

# Scan specific image
docker run --rm anchore/grype myapp:latest

# With JSON output
docker run --rm -v $(pwd):/src anchore/grype dir:/src -o json
```

Finds: CVEs in npm/pip/go dependencies.
