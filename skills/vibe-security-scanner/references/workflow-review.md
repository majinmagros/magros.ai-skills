# Scan Workflow and Review

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

## Enrichment 2026-08-20 — profile JS/TS + escopo funcionalidade (3zrc63xB-hc)

- Fonte `3zrc63xB-hc` (Sujeito Programador): auditoria focada **React/Next/TS + Drizzle/Prisma + Supabase**. 2 modos: `projeto inteiro` (checkup <50 arquivos) vs `funcionalidade` (diff da feature). Para `Prisma/Drizzle`, valide `@@unique`/`relationMode`, `enable RLS` já visto acima, e `supabase.rpc` para admin. Esta skill cobre `npx prisma validate`/`drizzle-kit check` antes de escanear.

## References

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP ZAP: https://www.zaproxy.org/
- GitLeaks: https://github.com/gitleaks/gitleaks
- Bandit: https://bandit.readthedocs.io/
- OpenGrype: https://github.com/anchore/grype
- Video source: Mano Davin — "USOU VIBECODING? TÁ CORRENDO RISCO" (https://www.youtube.com/watch?v=6DJFl-g83dM)
