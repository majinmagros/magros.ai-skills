---
name: springboot-verification
description: "Use when verifying Spring Boot services before PRs, after refactors, or pre-deploy. Triggers on \"springboot-verification\", \"springboot verification\", \"verification\"."
metadata:
  origin: ECC
---

# Spring Boot Verification Loop

Build → static → tests → security → diff gate before PRs and deploys. Detalhes em `references/`.

## When to Activate

- Before opening a pull request for a Spring Boot service
- After major refactoring or dependency upgrades
- Pre-deployment verification for staging or production
- Running full build → lint → test → security scan pipeline
- Validating test coverage meets thresholds

## Core Principles

1. **Build first** — `mvn -T 4 clean verify -DskipTests`; stop on failure
2. **Static gate** — spotbugs + pmd + checkstyle, zero tolerance in prod
3. **Tests at 80%+** — Mockito units, Testcontainers integration, MockMvc API
4. **Security scan** — dependency CVEs, secrets, System.out, wildcard CORS
5. **Diff review** — no debug logs, correct statuses, report READY/NOT READY

## Example

```bash
mvn -T 4 clean verify -DskipTests
mvn -T 4 spotbugs:check pmd:check checkstyle:check
mvn -T 4 test && mvn jacoco:report
```

## References

- `references/build-static.md` — Phase 1 build, Phase 2 Maven/Gradle static analysis
- `references/tests.md` — Phase 3 Mockito, Testcontainers, MockMvc patterns
- `references/security-lint.md` — Phase 4 CVEs/secrets/findings, Phase 5 Spotless
- `references/report-loop.md` — Phase 6 diff review, report template, continuous mode

## Checklist

- [ ] Build green; static analysis clean
- [ ] Tests pass with 80%+ line/branch coverage
- [ ] No CVEs, secrets, System.out, or wildcard CORS
- [ ] Diff reviewed: errors, statuses, transactions, config docs
- [ ] Report emitted: READY or issues listed
