# Method, Evidence, Risk Lenses

Build the audit from local and user-authorized evidence. Do not run unpinned
remote code, upload repository contents to third-party services, or call
external scanners unless the user explicitly approves that specific tool and
data flow.

Use this order:

1. Establish the release surface.
2. Read recent changes and current branch state.
3. Inspect runtime, auth, data, payment, background-job, AI, and deployment
   boundaries that actually exist in the repo.
4. Check CI, tests, migrations, environment documentation, and rollback path.
5. Produce a short ship/block recommendation with specific fixes.

## Evidence Checklist

Start with cheap, local signals:

```text
git status --short --branch
git log --oneline --decorate -20
git diff --stat origin/main...HEAD
```

Then inspect the project-specific surface:

- Package scripts, CI workflows, release scripts, Docker files, and deployment
  manifests.
- API routes, webhooks, auth middleware, background workers, cron jobs, and
  database migrations.
- Environment variable documentation and startup checks.
- Observability hooks, error reporting, logs, health checks, and dashboards.
- Rollback, seed, migration, and backfill instructions.
- E2E coverage for the user paths that matter most.

If a deployed URL is in scope, use browser or HTTP checks only against that URL
and avoid credentialed actions unless the user supplies a safe test account.

## Risk Lenses

### Security And Auth

- Are public routes, API routes, and admin routes clearly separated?
- Are auth and authorization enforced server-side?
- Are secrets kept out of client bundles, logs, example output, and checked-in
  files?
- Are rate limits, CSRF protections, CORS policy, and upload validation present
  where the app needs them?
- Does the AI or agent surface defend against prompt injection, tool abuse, and
  untrusted content crossing into privileged actions?

### Data Integrity

- Do migrations run forward cleanly and have a rollback or recovery plan?
- Are destructive migrations, backfills, and data imports staged safely?
- Do database policies, grants, and service-role boundaries match the app's
  tenancy model?
- Are retries idempotent for writes, jobs, and webhook handlers?

### Payments And Webhooks

- Are webhook signatures verified before parsing trusted payload fields?
- Is each payment, subscription, or fulfillment webhook idempotent?
- Are replay, duplicate delivery, and out-of-order delivery handled?
- Are test-mode and live-mode credentials separated?

### Operations

- Can the app start from a clean checkout using documented commands?
- Are required environment variables named, validated, and fail-fast?
- Is there a health check that proves dependencies are reachable?
- Are deploy, rollback, and incident-owner paths documented?
- Are logs useful without leaking secrets or personal data?

### User Experience

- Are the launch-critical paths covered on desktop and mobile?
- Are forms usable on mobile without input zoom, layout overlap, or blocked
  submission states?
- Do loading, empty, error, and permission-denied states tell the user what
  happened?
- Is there a support or recovery path when a critical operation fails?
