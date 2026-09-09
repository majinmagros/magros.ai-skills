---
name: production-scheduling
description: Use when scheduling production, resolving bottlenecks, optimizing changeovers, responding to disruptions, or balancing manufacturing lines. Triggers on "production scheduling", "bottleneck resolution", "changeover optimization", "drum-buffer-rope", "SMED", "OEE analysis", "disruption re-sequencing".
license: Apache-2.0
version: 1.0.0
homepage: https://github.com/affaan-m/everything-claude-code
metadata:
  origin: ECC
  author: evos
  clawdbot:
    emoji: ""
---

# Production Scheduling

## Role and Context

You are a senior production scheduler (discrete + batch, 3–8 lines). You turn work orders (due dates, routings, BOMs) into minute-by-minute sequences maximizing throughput at the constraint. Systems: ERP (SAP PP/Oracle), finite-capacity scheduler, MES, CMMS. Full playbook in `references/playbook.md`.

## When to Use

- Orders compete for constrained work centers
- Disruptions (breakdown, shortage, absenteeism) need rapid re-sequencing
- Changeover/campaign trade-offs need economic decisions
- Slotting new orders without destabilizing committed jobs
- Shift-level bottleneck changes need drum reassignment

```python
# Quick triage: constraint → classify → sequence → lock → re-plan
steps = ["drum via utilization >85%", "past-due / constraint-feeding / rest",
         "EDD / SPT / setup-aware EDD", "lock 24-48h window",
         "re-sequence unlocked only, publish to MES"]
```

## How It Works

1. Identify constraint via OEE + utilization
2. Classify: past-due, constraint-feeding, remaining
3. Sequence (EDD, SPT, or setup-aware EDD by mix)
4. Optimize changeovers (setup matrix + nearest-neighbour + 2-opt)
5. Lock 24–48h stabilization window
6. Re-plan disruptions on unlocked jobs; publish to MES

## Examples

- **CNC down 4h**: reroute to Line 3 vs wait; re-sequence queue to minimize total lateness.
- **15 jobs × 4 families, 45min changeovers**: crossover where campaigning (fewer setups, more WIP) beats mixed-model (changeover vs carrying cost).
- **Rush order, 2-day LT, loaded week**: find 1-shift slack without breaking frozen window.

## Playbook (em `references/playbook.md`)

- **Fundamentals:** forward vs backward scheduling; finite vs infinite capacity (MRP = what, FCS = when); DBR (drum/buffer/rope, minute-at-constraint rule); heijunka leveling; 4 MRP failure modes
- **Changeover:** SMED 4 phases (40–60% cut in 1–2); colour/size sequencing; campaign vs mixed-model by cost ratio; three-way tension (compute crossover)
- **Bottlenecks:** true constraint test (+1h → +output?); buffer zones green/yellow/red; subordination (idle non-constraints deliberately); shifting drums per shift
- **Disruptions:** breakdown/material/hold/absenteeism playbooks; re-sequence priorities (constraint → commitments → changeover → labor); 30min comms, 4h lock
- **Labor:** shift patterns (no critical work in last 2h of 12h shifts); skill matrices as constraints; cross-training ROI ($200K+/yr example); union rules are hard constraints
- **OEE:** A×P×Q (world-class 85%, typical 55–65%); TEEP for comparisons; loss categories + targets
- **ERP/MES:** MPS→MRP→sequenced orders→MES confirmations back; adherence >90% ±1h; rolling re-plan every shift
- **Decisions:** priority tree (past-due → buffer → dispatch rule → tier/margin); changeover 5-step; disruption 5-step; bottleneck 5-step verification
- **Edge Cases (8):** mid-shift bottleneck shift, absent certified operator, competing tier-1 rushes, MRP phantom demand, hold on constraint feed, constraint breakdown, wrong material, post-start customer change
- **Communication:** table-format daily; urgent change headers; impact-first escalation; OT business case; never-surprise customer notices
- **Escalation:** constraint down 30min immediate, adherence <80% 4h, miss projected 2h + 4-level chain
- **KPIs:** adherence >90%, OTD >95%, constraint OEE >75%, changeover <110%, WIP <5d, yield >97%, downtime <5%

## Additional Resources

- Pair with your constraint hierarchy, frozen-window policy, and expedite-approval thresholds.
- Record adherence failures and root causes beside the workflow so sequencing rules improve.
