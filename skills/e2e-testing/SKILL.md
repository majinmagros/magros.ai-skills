---
name: e2e-testing
description: "Use when playwright E2E testing patterns, Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strategies. Triggers on \"e2e-testing\", \"e2e testing\", \"testing\"."
metadata:
  origin: ECC
---

# E2E Testing Patterns

Playwright patterns for stable, fast E2E suites. Detalhes em `references/pom.md`, `references/playwright-config.md`, `references/flaky-artifacts.md`.

## When to Use

- User asks for "e2e test", "playwright test", "page object" or "flaky test"
- New E2E suite, CI integration, or artifact/report setup

## Core Flow

Every suite: **Organize -> POM -> Assert -> Stabilize**. Never `waitForTimeout` — wait for a condition.

```typescript
await page.locator('[data-testid="button"]').click()
await page.waitForResponse(r => r.url().includes('/api/data'))
```

## References

- `references/pom.md` — file layout, ItemsPage POM, test structure
- `references/playwright-config.md` — `defineConfig` multi-browser + GitHub Actions CI
- `references/flaky-artifacts.md` — quarantine, race/network/animation fixes, screenshots/traces/video, report template, wallet/web3, Agent Browser alternative

## Checklist

- [ ] `data-testid` selectors, auto-wait locators
- [ ] `trace/screenshot/video` on failure only
- [ ] Flaky quarantined with issue link, `--repeat-each=10` to confirm
- [ ] CI uploads `playwright-report/` as artifact
