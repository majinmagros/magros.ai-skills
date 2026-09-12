# Pairing with ECC and CI

## Complementary, Not Overlapping

| Concern | ECC | Plankton |
|---------|-----|----------|
| Code quality enforcement | PostToolUse hooks (Prettier, tsc) | PostToolUse hooks (20+ linters + subprocess fixes) |
| Security scanning | AgentShield, security-reviewer agent | Bandit (Python), Semgrep (TypeScript) |
| Config protection | — | PreToolUse blocks + Stop hook detection |
| Package manager | Detection + setup | Enforcement (blocks legacy PMs) |
| CI integration | — | Pre-commit hooks for git |
| Model routing | Manual (`/model opus`) | Automatic (violation complexity → tier) |

## Recommended Combination

1. Install ECC as your plugin (agents, skills, commands, rules).
2. Add Plankton hooks for write-time quality enforcement.
3. Use AgentShield for security audits.
4. Use ECC's verification-loop as a final gate before PRs.

## Avoiding Hook Conflicts

- ECC's Prettier hook and Plankton's biome formatter may conflict on JS/TS files.
- Resolution: disable ECC's Prettier PostToolUse hook when using Plankton (biome is more comprehensive).
- Both can coexist on different file types (ECC handles what Plankton doesn't cover).

## Copyable Hook Profile (ECC v1.8)

```bash
export ECC_HOOK_PROFILE=strict
export ECC_QUALITY_GATE_FIX=true
export ECC_QUALITY_GATE_STRICT=true
```

Language gates: TypeScript/JavaScript → Biome preferred, Prettier fallback; Python → Ruff format/check; Go → gofmt.

## CI Integration Pattern

Use the same commands in CI as local hooks:

1. Run formatter checks.
2. Run lint/type checks.
3. Fail fast on strict mode.
4. Publish remediation summary.

## Health Metrics

Track: edits flagged by gates, average remediation time, repeat violations by category, merge blocks due to gate failures.

## References

- Plankton (credit: @alxfazio)
- Plankton REFERENCE.md — full architecture documentation (credit: @alxfazio)
- Plankton SETUP.md — detailed installation guide (credit: @alxfazio)
