# Phase 1: Build, Phase 2: Static Analysis

Run before PRs, after major changes, pre-deploy. If build fails, stop and fix.

## Phase 1: Build

```bash
mvn -T 4 clean verify -DskipTests
# or
./gradlew clean assemble -x test
```

## Phase 2: Static Analysis

Maven (common plugins):

```bash
mvn -T 4 spotbugs:check pmd:check checkstyle:check
```

Gradle (if configured):

```bash
./gradlew checkstyleMain pmdMain spotbugsMain
```
