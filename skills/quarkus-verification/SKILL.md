---
name: quarkus-verification
description: "Use when verification loop for Quarkus projects: build, static analysis, tests with coverage, security scans, native compilation, and diff review before release or PR. Only for Quarkus — not for other stacks. Triggers on \"quarkus-verification\", \"quarkus verification\", \"verification\"."
metadata:
  origin: ECC
---

# Quarkus Verification Loop

Run before PRs, after major changes, and pre-deploy. Phases 1–10 in `references/`, automation in `scripts/verify.sh`, CI in `references/ci.yml`.

## When to Activate

- Before opening a pull request for a Quarkus service
- After major refactoring or dependency upgrades
- Pre-deployment verification for staging or production
- Running full build → lint → test → security scan → native compilation pipeline
- Validating test coverage meets thresholds (80%+)
- Testing native image compatibility

## Phases (resumo)

| # | Phase | Gate |
|---|---|---|
| 1 | **Build** (`mvn clean verify -DskipTests`) | zero compilation errors |
| 2 | **Static Analysis** (checkstyle/pmd/spotbugs, Sonar) | no high/medium issues |
| 3 | **Tests + Coverage** (unit Mockito, Testcontainers, REST Assured; JaCoCo ≥80% line, ≥70% branch) | all green |
| 4 | **Security** (OWASP dep-check, `quarkus:audit`, ZAP API scan; secrets/env, CORS, headers, BCrypt checklist) | no CVEs |
| 5 | **Native** (`mvn package -Dnative`, container-build; reflection/resources/JNI fixes; smoke `/q/health`) | runner boots |
| 6 | **Performance** (k6 stages 50→100→0; p50/p95/p99, throughput, errors, mem/CPU) | within SLOs |
| 7 | **Health** (`/q/health/live|ready`, `/q/metrics`) | status UP |
| 8 | **Container** (quarkus container-image build + registry; Trivy/Grype scan) | clean scan |
| 9 | **Config** (`quarkus:info`; per-env DB/secrets/logging/CORS/ratelimit/monitoring) | valid per env |
| 10 | **Docs** (swagger-ui current, README, API changes, migrations, config props; `curl /q/openapi`) | up to date |

```bash
./scripts/verify.sh   # fases 1–5 automatizadas; relatórios em target/
```

## Verification Checklist (resumo)

Quality (build clean, lint clean, conventions, no TODOs) · Testing (all pass, ≥80%, real DB, security, perf) · Security (no vulns, auth tested, validation, no secrets, headers) · Deployment (native ok, image builds, health ok, config valid) · Native (builds, tests pass, startup <100ms, mem ok).

## Best Practices

- Run verification loop before every PR; automate in CI
- Fix issues immediately; don't accumulate debt
- Keep coverage above 80%; update dependencies regularly
- Test native compilation periodically; monitor perf trends
- Document breaking changes; review security scans; validate config per env
