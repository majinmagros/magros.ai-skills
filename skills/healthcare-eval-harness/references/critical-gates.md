# Critical Gates (100% Required)

> **Note:** Examples use Jest as the reference test runner. Adapt commands for your framework (Vitest, pytest, PHPUnit, etc.) — the test categories and pass thresholds are framework-agnostic.

The eval harness runs five test categories in order. The first three (CDSS Accuracy, PHI Exposure, Data Integrity) are CRITICAL gates requiring 100% pass rate — a single failure blocks deployment. The remaining two (Clinical Workflow, Integration) are HIGH gates requiring 95%+ pass rate.

Each category maps to a Jest test path pattern. The CI pipeline runs CRITICAL gates with `--bail` (stop on first failure) and enforces coverage thresholds with `--coverage --coverageThreshold`.

## 1. CDSS Accuracy (CRITICAL — 100% required)

Tests all clinical decision support logic: drug interaction pairs (both directions), dose validation rules, clinical scoring vs published specs, no false negatives, no silent failures.

```bash
npx jest --testPathPattern='tests/cdss' --bail --ci --coverage
```

## 2. PHI Exposure (CRITICAL — 100% required)

Tests for protected health information leaks: API error responses, console output, URL parameters, browser storage, cross-facility isolation, unauthenticated access, service role key absence.

```bash
npx jest --testPathPattern='tests/security/phi' --bail --ci
```

## 3. Data Integrity (CRITICAL — 100% required)

Tests clinical data safety: locked encounters, audit trail entries, cascade delete protection, concurrent edit handling, no orphaned records.

```bash
npx jest --testPathPattern='tests/data-integrity' --bail --ci
```
