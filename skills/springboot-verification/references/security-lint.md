# Phase 4: Security Scan, Phase 5: Lint/Format

## Dependency CVEs

```bash
mvn org.owasp:dependency-check-maven:check
# or
./gradlew dependencyCheckAnalyze
```

## Secrets in Source and History

```bash
grep -rn "password\s*=\s*\"" src/ --include="*.java" --include="*.yml" --include="*.properties"
grep -rn "sk-\|api_key\|secret" src/ --include="*.java" --include="*.yml"

git secrets --scan  # if configured
```

## Common Findings

```
# System.out instead of logger
grep -rn "System\.out\.print" src/main/ --include="*.java"

# Raw exception messages in responses
grep -rn "e\.getMessage()" src/main/ --include="*.java"

# Wildcard CORS
grep -rn "allowedOrigins.*\*" src/main/ --include="*.java"
```

## Phase 5: Lint/Format (Optional Gate)

```bash
mvn spotless:apply   # if using Spotless plugin
./gradlew spotlessApply
```
