---
name: sast-gate-pr
description: Enforce a deterministic SAST gate inside a coding-agent workflow (issue to PR): scanner via API as script node, agent forced to iterate until green, PR readied only on clean scan. Use when securing agentic code, adding vulnerability gates, fixing CVEs in AI-generated code, choosing scan-in-workflow vs CI-only scanning. Gatilhos PT: gate de segurança, scan SAST no workflow, vulnerabilidade em código de agente, CVE em dependência, PR só no verde. Gatilhos EN: SAST gate, deterministic security gate, scan before PR, CVE triage, force agent to fix vulnerabilities.
---

# SAST Gate PR

Deterministic security gates beat LLM reviewers. A scanner checks every change the same way, every time — the agent iterates until green, and only then is the PR readied.

> Manual checklist reviews (`security-review`) and one-shot scans (`vibe-security-scanner`) still help, but neither gates the workflow. This skill is the gate.

## Quando usar

Any agentic workflow whose output is a PR: fix-issue flows, feature builds, dependency-adding tasks. Especially when agents write auth, input handling, crypto, secrets, or install third-party packages.

## Why agents need a gate (know the enemy)

1. **Two injection paths** — the agent writes the vuln directly (SQLi, hardcoded secret) or installs a dependency carrying one.
2. **CVE taxonomy** — `direta` (your code / top-level dep), `transitiva` (sub-dependency down the chain — agents never walk it), `silenciosa` (agent notices, mentions in PR description as "follow-up", never fixes).
3. **Why agents miss them** — the CVE catalog is too large for context; training data is full of corner-cutting examples; speed bias rewards first-pass output. A second reviewer agent shares the same blind spots — probabilistic review on probabilistic code is not a guarantee.

## Steps

1. **Shape the workflow issue → PR** — classify (bug vs. feature) → plan/investigate → implement → open a *draft* PR (or local diff) → **scan gate** → fix loop → ready PR for human review. The gate sits between implementation and ready, never after merge.
2. **Scan as a deterministic node** — call the SAST scanner via its API from a script/bash step (SonarQube or any API-capable scanner), never via an agent improvising checks. Pass tokens via environment, scope the scan to the PR diff, and capture the machine-readable report (rule ID, CVE refs, file:line, severity).
3. **Feed the report to the implementer agent** — hand the full report (not a summary) back with one instruction: fix every red finding in code, not in prose. Forbid "will fix later" PR-description notes — silent CVEs fail the gate.
4. **Re-scan to green** — re-run the identical scan; the gate assertion is mechanical: security rating clean / zero open issues at or above threshold. Loop fix → rescan until green, with a max-iteration cap after which the workflow stops and escalates to a human with the remaining findings attached.
5. **Ready the PR only on green** — attach the final clean report to the PR. Human code review happens after the gate, not instead of it.
6. **Decide scan-in-workflow × scan-only-in-CI** — CI-only scanning reports after the PR exists but cannot force iteration; scan-in-workflow feeds findings back to the agent while context is hot. Use both (workflow gate for iteration, CI scan as backstop), never CI-only for agentic code.

## Rules

- NEVER accept an agent's "no vulnerabilities found" claim — only a green scanner report passes the gate.
- NEVER let the scanner step be an agent prompt — script/API call with fixed parameters, identical every run.
- NEVER merge past red: threshold breach blocks ready-for-review, no exceptions, no follow-up PR promises.
- NEVER scope the gate to new files only when dependencies changed — lockfile diffs always trigger a full dependency (transitive) check.
- Record what the gate does NOT cover (secrets in history, runtime config, infra) — declared gaps beat silent ones.

## Gate contract

```text
Scope: [PR diff + lockfile transitives]
Threshold: [zero issues >= severity | security rating]
Scan: [tool + API call, deterministic]
Result: GREEN → ready PR | RED → fix loop (n/N) → escalate with findings
Report attached: [yes]
```

## Related skills

- `security-review` — manual checklist to complement (not replace) the gate.
- `vibe-security-scanner` — one-shot scan; use its findings as gate input, not as the gate.
- `closed-loop-verifier-pattern` — the generic implement → verify → iterate loop this gate instantiates.
