# Kimi: Project Surface Install

Destination `./.kimi-code`; `hooks=unsupported` for ECC lifecycle hooks. Do not ask Claude scope or hook-mode questions. State this summary before confirmation. Preview first:

```bash
npx --yes --package ecc-universal ecc install --profile core --target kimi --dry-run
```

One confirmation for that project destination, then the identical command without `--dry-run`. Verify with:

```bash
npx --yes --package ecc-universal ecc doctor --target kimi
```

Only after doctor succeeds and instructions + skills remain inside `./.kimi-code`, render:

```bash
npx --yes --package ecc-universal ecc welcome --action configured
```

Do not claim Kimi installed or configured ECC lifecycle hooks.
