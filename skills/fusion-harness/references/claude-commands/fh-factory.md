---
name: fh-factory
description: Software factory scheduler — run variants 24/7
---
# /fh factory

Software factory daemon: schedules and runs variant workflows autonomously.

**Usage:**
```
/fh factory schedule
/fh factory run <variant>
/fh factory status
/fh factory stop
```

**Variants (in .fusion-harness/config/variants/):**
- `nightly-refactor` — Daily codebase refactoring
- `pr-review` — Automated PR review on webhook
- `feature-build` — On-demand feature development
- `incident-response` — Auto-investigate alerts

**Schedule config (.fusion-harness/config/factory-schedule.yaml):**
```yaml
jobs:
  - variant: nightly-refactor
    cron: "0 2 * * *"
  - variant: pr-review
    webhook: true
  - variant: dependency-update
    cron: "0 3 * * 1"  # Weekly Monday
```

**Commands:**
```
/fh factory schedule    # Start daemon (runs forever)
/fh factory run nightly-refactor    # Run once manually
/fh factory status      # Show running jobs, next scheduled
/fh factory stop        # Stop daemon
```

!`python3 .fusion-harness/scripts/factory-scheduler.py $ARGUMENTS`