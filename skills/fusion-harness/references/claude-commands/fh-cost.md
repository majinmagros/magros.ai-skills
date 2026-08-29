---
name: fh-cost
description: Cost dashboard — real-time token/cost tracking per model
---
# /fh cost

Cost tracking dashboard for Fusion Harness.

**Usage:**
```
/fh cost
/fh cost --session
/fh cost --workflow feature-build
/fh cost --model Flux
/fh cost --export costs.csv
/fh cost --since 2026-08-01
```

**Output:**
```
┌──────────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Model        │ Sessions │ Tokens In│ Tokens Out│ Latency  │ Cost     │
├──────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Rune (Arch)  │ 12       │ 45,230   │ 18,450   │ 2.3s     │ $3.42    │
│ Flux         │ 45       │ 120,500  │ 89,200   │ 0.8s     │ $0.07    │
│ Drift        │ 38       │ 98,100   │ 67,300   │ 1.2s     │ $0.08    │
│ Local        │ 22       │ 45,000   │ 32,100   │ 3.5s     │ $0.00    │
├──────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ TOTAL        │ 117      │ 308,830  │ 207,050  │ —        │ $3.57    │
└──────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘

Budget: $10.00/session | $50.00/workflow
Remaining: $6.43 / $46.43
```

**Data source:** `.fusion-harness/costs.db` (SQLite, auto-populated by hooks)

**Hooks auto-tracking:** Add to `.claude/settings.json`:
```json
{
  "hooks": {
    "PreToolUse": [{"matcher": "Task", "hooks": [{"command": "python3 .fusion-harness/scripts/cost-tracker.py pretool"}]}],
    "PostToolUse": [{"matcher": "Task", "hooks": [{"command": "python3 .fusion-harness/scripts/cost-tracker.py posttool"}]}]
  }
}
```

!`python3 .fusion-harness/scripts/cost-tracker.py $ARGUMENTS`