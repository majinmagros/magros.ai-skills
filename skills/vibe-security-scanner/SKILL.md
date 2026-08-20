---
name: vibe-security-scanner
description: Use when auditing SaaS apps built with vibe coding / AI-assisted development. Runs free automated security scanners (OWASP ZAP, GitLeaks, Bandit, OpenGrype) to find the 5 most common vulnerabilities in AI-generated code: missing RLS, frontend-only auth, IDOR, hardcoded secrets, and XSS.
metadata:
  origin: ECC
  author: majinmagros
  video_source: "https://www.youtube.com/watch?v=6DJFl-g83dM"
---

# Vibe Security Scanner

Automated security scanning for SaaS apps built with AI-assisted development ("vibe coding"). Complements the manual checklist in `security-review` with free open-source scanners.

## When to Activate

- User built a SaaS with Cursor, Claude Code, Bolt, Lovable, or similar AI tools
- Pre-deployment security audit
- "Is my app secure?" or "scan my code"
- Payment integration review
- User handles customer data (LGPD, GDPR, HIPAA context)

## The 5 Vulnerabilities

These are the most common flaws in AI-generated SaaS code:

### 1. No Row Level Security (Supabase/Firebase)
```sql
-- FAIL: table wide open
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total NUMERIC
);
-- No RLS = any authenticated user reads ALL rows

-- PASS: RLS enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_orders" ON orders
  FOR ALL USING (user_id = auth.uid());
```

### 2. Frontend-Only Admin Check
```javascript
// FAIL: role stored in localStorage
const isAdmin = localStorage.getItem('role') === 'admin'
// Anyone can edit localStorage → full admin access

// PASS: server-side verification
const { data } = await supabase.rpc('is_admin', { uid: user.id })
if (!data) return res.status(403).json({ error: 'Forbidden' })
```

### 3. IDOR (Insecure Direct Object Reference)
```javascript
// FAIL: sequential ID, no ownership check
app.get('/api/invoices/:id', async (req, res) => {
  const invoice = await db.query(`SELECT * FROM invoices WHERE id = ${req.params.id}`)
  return res.json(invoice)  // user A reads user B's invoice
})

// PASS: ownership verified
app.get('/api/invoices/:id', async (req, res) => {
  const invoice = await db.query(
    `SELECT * FROM invoices WHERE id = $1 AND user_id = $2`,
    [req.params.id, req.user.id]
  )
  return res.json(invoice)
})
```

### 4. Hardcoded Secrets in Frontend
```javascript
// FAIL: API key in client bundle
const stripe = Stripe('sk_live_xxxxxxxxxxxxxxxx')

// PASS: secret only on server
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
```

### 5. XSS (Cross-Site Scripting)
```javascript
// FAIL: raw user input in DOM
element.innerHTML = userInput  // <script>steal_cookies()</script>

// PASS: sanitized
import DOMPurify from 'dompurify'
element.innerHTML = DOMPurify.sanitize(userInput)
// + Content-Security-Policy header
```

## Automated Scanning

### Tool 1: OWASP ZAP (Web App Scanner)
```bash
# Docker-based scan (no install needed)
docker run --rm -v $(pwd)/zap-report:/zap/wrk/:rw \
  -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t http://localhost:3000 -r report.html

# Quick scan
npx @zaproxy/cli baseline http://localhost:3000
```
Finds: XSS, SQLi, CSRF, missing headers, info leakage.

### Tool 2: GitLeaks (Secrets in Git History)
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

### Tool 3: Bandit (Python Security Linter)
```bash
# Install
pip install bandit

# Scan project
bandit -r . -f json -o bandit-report.json

# Quick scan with severity filter
bandit -r . -ll  # only HIGH and MEDIUM
```
Finds: SQL injection, hardcoded passwords, insecure deserialization, eval() usage.

### Tool 4: OpenGrype (Dependency Vulnerabilities)
```bash
# Docker-based (no install)
docker run --rm -v $(pwd):/src anchore/grype dir:/src

# Scan specific image
docker run --rm anchore/grype myapp:latest

# With JSON output
docker run --rm -v $(pwd):/src anchore/grype dir:/src -o json
```
Finds: CVEs in npm/pip/go dependencies.

## Scan Workflow

```
1. gitleaks detect --source . --verbose
   → Fix ALL secrets found (rotate keys, add to .gitignore, scrub history)

2. bandit -r . -ll  (if Python)
   → Fix HIGH/MEDIUM findings

3. docker run --rm anchore/grype dir:.
   → Update vulnerable dependencies

4. OWASP ZAP baseline scan
   → Fix XSS, CSRF, missing security headers

5. Manual review: search for the 5 patterns above
   → grep -rn "localStorage.*role\|localStorage.*admin" src/
   → grep -rn "innerHTML" src/
   → grep -rn "sk_live\|sk_test\|api_key.*=" src/ --include="*.js" --include="*.ts"
```

## Prompt for AI-Assisted Review

Paste this into your coding agent after building a feature:

```
Revisa esse código atrás dessas 5 falhas:
1. Banco sem RLS (Supabase/Firebase direto no frontend)
2. Permissão de admin só no frontend (localStorage)
3. Rota entregando dado pelo ID sem checar dono (IDOR)
4. Chave de API hardcoded no frontend
5. Inputs sem tratamento executando scripts (XSS)

Lista arquivo com arquivo, linha por linha, não pede para resolver também.
```

## Complementary Skills

- **security-review**: Manual security checklist (auth, payments, crypto)
- **security-scan**: Scans Claude Code `.claude/` config for misconfigurations
- **production-audit**: Pre-deployment readiness scoring (0-100)
- **security-bounty-hunter**: Bug bounty focus (HackerOne/Huntr scope)

## Enriquecimento 2026-08-20 — profile JS/TS + escopo funcionalidade (3zrc63xB-hc)

- Fonte `3zrc63xB-hc` (Sujeito Programador): auditoria focada **React/Next/TS + Drizzle/Prisma + Supabase**. 2 modos: `projeto inteiro` (checkup <50 arquivos) vs `funcionalidade` (diff da feature). Para `Prisma/Drizzle`, valide `@@unique`/`relationMode`, `enable RLS` já visto acima, e `supabase.rpc` para admin. Esta skill cobre `npx prisma validate`/`drizzle-kit check` antes de escanear.

## References

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP ZAP: https://www.zaproxy.org/
- GitLeaks: https://github.com/gitleaks/gitleaks
- Bandit: https://bandit.readthedocs.io/
- OpenGrype: https://github.com/anchore/grype
- Video source: Mano Davin — "USOU VIBECODING? TÁ CORRENDO RISCO" (https://www.youtube.com/watch?v=6DJFl-g83dM)
