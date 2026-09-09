#!/bin/bash
# verify.sh — Automated verification: build → lint → test+coverage → security → native
# Extraído de SKILL.md (2026-09-09).
set -e

echo "=== Phase 1: Build ==="
mvn clean verify -DskipTests

echo "=== Phase 2: Static Analysis ==="
mvn checkstyle:check pmd:check spotbugs:check

echo "=== Phase 3: Tests + Coverage ==="
mvn test jacoco:report jacoco:check

echo "=== Phase 4: Security Scan ==="
mvn org.owasp:dependency-check-maven:check

echo "=== Phase 5: Native Compilation ==="
mvn package -Dnative -Dquarkus.native.container-build=true

echo "=== All Phases Complete ==="
echo "Review reports:"
echo "  - Coverage: target/site/jacoco/index.html"
echo "  - Security: target/dependency-check-report.html"
echo "  - Native: target/*-runner"
