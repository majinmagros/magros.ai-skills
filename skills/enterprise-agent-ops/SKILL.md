---
name: enterprise-agent-ops
description: "Use when operate long-lived agent workloads with observability, security boundaries, and lifecycle management. Triggers on \"enterprise-agent-ops\", \"enterprise agent ops\"."
metadata:
  origin: ECC
---

# Enterprise Agent Ops

Use this skill for cloud-hosted or continuously running agent systems that need operational controls beyond single CLI sessions.

## When to Use

- "Run this agent 24/7 in production"
- "Agent fleet needs observability and kill switches"
- "Rollout/rollback plan for agent version"
- "Track cost per successful agent task"
- "Failure spike in the agent service"

## Example

```yaml
agent_service:
  timeout_s: 300
  max_retries: 2
  kill_switch: env.KILL_AGENT_V2
  audit: high-risk-actions-only
```

## Operational Domains

1. runtime lifecycle (start, pause, stop, restart)
2. observability (logs, metrics, traces)
3. safety controls (scopes, permissions, kill switches)
4. change management (rollout, rollback, audit)

## Baseline Controls

- immutable deployment artifacts
- least-privilege credentials
- environment-level secret injection
- hard timeout and retry budgets
- audit log for high-risk actions

## Metrics to Track

- success rate
- mean retries per task
- time to recovery
- cost per successful task
- failure class distribution

## Incident Pattern

When failure spikes:
1. freeze new rollout
2. capture representative traces
3. isolate failing route
4. patch with smallest safe change
5. run regression + security checks
6. resume gradually

## Deployment Integrations

This skill pairs with:
- PM2 workflows
- systemd services
- container orchestrators
- CI/CD gates
