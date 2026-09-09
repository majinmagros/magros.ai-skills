# Playbook — Production Scheduling

Conhecimento operacional: fundamentals, changeover, bottlenecks, disruptions, labor, OEE, ERP/MES, decision frameworks, edge cases, comunicação, escalação, KPIs.

## Core Knowledge

### Scheduling Fundamentals

- **Forward vs. backward:** Forward = from material availability → earliest completion. Backward = from due date → latest start (default, preserves flexibility, minimizes WIP). Switch to forward when backward shows latest start already past (expedite from today).
- **Finite vs. infinite capacity:** MRP = infinite capacity (flags overloads for manual resolution). FCS respects machines, shifts, maintenance, tooling. Never trust MRP schedule as executable. MRP = *what*; FCS = *when*.
- **DBR/TOC:** Drum = constraint (highest load/available ratio, >85%). Buffer = time buffer (not inventory) protecting constraint from starvation. Rope = release limited to constraint rate. A minute lost at the constraint is a minute lost plant-wide.
- **JIT sequencing (heijunka):** Level sequence to smooth component consumption. 3:2:1 ratio/shift → A-B-A-C-A-B, not AAA-BB-C. Prevents end-of-shift crunch.
- **Where MRP breaks:** Fixed lead times, infinite capacity, perfect BOMs. Fails on queue-dependent LTs, competing orders, sequence-dependent setups, yield losses. Scheduler compensates all four.

### Changeover Optimization

- **SMED:** Phase 1 document + classify internal/external. Phase 2 convert internal→external (pre-stage, pre-heat, pre-mix). Phase 3 streamline internal (quick-release, standard heights, colour-coded). Phase 4 eliminate adjustments (poka-yoke, first-piece jigs). Typical: 40–60% reduction from Phases 1–2.
- **Colour/size sequencing:** Light→dark, small→large, simple→complex. 5-min flush vs 30-min purge. Capture in setup matrix.
- **Campaign vs. mixed-model:** Campaigns = fewer changeovers, more WIP/LT. Mixed = more changeovers, lower WIP/LT. Long/expensive changeovers (>60min, >$500) → campaigns. Fast (<15min) or short-LT demand → mixed.
- **Three-way tension:** Changeover cost vs carrying cost vs delivery. Crossover where marginal changeover cost = marginal carrying cost. Compute, don't guess.

### Bottleneck Management

- **True constraint vs WIP pile:** WIP can pile from batch-dumping, shared-resource queues, or bad rules. True constraint = highest required/available hours ratio. Test: would +1h capacity here raise plant output?
- **Buffer management:** Buffer ≈ 50% of constraint operation LT. Green (<33% consumed) ok; yellow (33–67%) expedite upstream; red (>67%) management + possible overtime. Persistent yellow = degrading upstream reliability.
- **Subordination:** Schedule non-constraints to serve the constraint. 100% utilization at non-constraint with 85% constraint = pure WIP, zero throughput gain.
- **Shifting bottlenecks:** Constraint moves with mix, degradation, staffing (day vs night shift). Monitor utilization weekly by mix; reassign the drum per shift.

### Disruption Response

- **Breakdowns:** (1) repair ETA, (2) is it the constraint?, (3) constraint → $/hour loss + contingency (OT/alternate/subcontract/re-sequence to margin). Non-constraint → check buffer (green = do nothing; yellow/red = expedite alternates).
- **Material shortages:** Substitutes, alternate BOMs, partial builds/kitting. Escalate purchasing. Pull forward jobs not needing the short material.
- **Quality holds:** Held batch is invisible — re-run schedule excluding it. Replace via safety stock, alternate WIP, or expedited batch.
- **Absenteeism:** Cross-training matrix. Missing operator on constraint → best backup. Non-constraint → check buffer before pulling backups.
- **Re-sequencing:** (1) protect constraint uptime, (2) protect commitments by tier/penalty, (3) minimize new changeover cost, (4) level labor. Communicate in 30min, lock ≥4h.

### Labor Management

- **Shift patterns:** 3×8, 2×12, 4×10. 12h shifts: fewer handovers, more hours-10–12 errors. No critical inspections/complex changeovers in last 2h of 12h shifts.
- **Skill matrices:** Operator × work centre × level (trainee/qualified/expert). Scheduling feasibility depends on it; carry labor as a constraint.
- **Cross-training ROI:** Each extra certified constraint operator cuts starvation risk. Constraint at $5K/h throughput, 8% absenteeism: 2 vs 4 qualified operators = $200K+/yr expected difference.
- **Union rules:** Seniority OT, rest periods (8–10h), reassignment limits = hard constraints. Grievances cost more than the production saved.

### OEE

OEE = Availability × Performance × Quality. World-class 85%+; typical discrete 55–65%.

- **Availability:** (Planned − Downtime)/Planned. Unplanned < 5% target. TEEP (all calendar time) for cross-plant/capacity comparisons.
- **Performance:** (Ideal cycle × pieces)/operating time. Track actual vs standard per job. Causes: feed, tooling, sensors, hesitation.
- **Quality:** Good/total. First-pass yield <95% at constraint directly cuts capacity. +2% yield at constraint = +2% capacity.

### ERP/MES Interaction

- **Flow:** Sales/forecast → MPS → MRP (planned orders + materials) → scheduler sequences → releases to MES → MES confirmations/scrap/labor back to ERP.
- **Work orders:** Carry routing (ops, centres, setup/run times), BOM, due date. Scheduler assigns time slots respecting capacity, materials, dependencies (op20 after op10).
- **Plan adherence:** >90% jobs starting within ±1h = healthy. Persistent gaps = wrong parameters or ignored sequence.
- **Rolling re-plan:** Every shift compare scheduled vs actual, re-sequence horizon, publish. A schedule the floor ignores has ceased to function.

## Decision Frameworks

### Job Priority Sequencing

1. Past-due / will-miss → first, ordered by penalty exposure (contractual > reputational > KPI).
2. Constraint-feeding with yellow/red buffer → next (prevent starvation).
3. Remainder by mix: high-variety short-run → EDD (min max lateness); long-run few products → SPT (min flow/WIP); mixed sequence-dependent → setup-aware EDD (swap if saves >30min setup without due-date miss).
4. Tie-break: customer tier, then margin.

### Changeover Sequence Optimization

1. Build setup matrix (A→B, B→A... time + cost incl. labor/scrap/lost output).
2. Hard constraints first (allergen, hazmat — not optimizable).
3. Nearest-neighbour baseline from current product.
4. 2-opt swaps if total time drops without due-date miss.
5. Validate vs due dates — compliance trumps optimization.

### Disruption Re-Sequencing

1. Impact window + is-it-constraint?
2. Freeze in-process / <2h-to-start jobs.
3. Re-sequence unfrozen by priority framework.
4. Communicate in 30 minutes to all affected.
5. Stability lock ≥4h (or next shift) barring new disruption.

### Bottleneck Identification

1. Utilization reports, trailing 2 weeks, by shift.
2. Rank load/available ratio — top = suspected constraint.
3. Causal verify: +1h capacity → +output?
4. Check shifting (by shift/week → per-shift drums).
5. Exclude artificial constraints (upstream batch-dumping victims — fix release rate).

## Key Edge Cases

1. **Mid-shift bottleneck shift:** Mix moves constraint machining→assembly by 10 AM. Needs real-time monitoring + intra-shift re-sequence authority.
2. **Certified operator absent (regulated):** Line cannot legally run. Cross-train matrix, certified OT if permitted, or shut down + reroute non-regulated work.
3. **Competing tier-1 rush orders:** Satisfying one delays the other. Scheduler frames tradeoff; management decides (penalty/strategic value).
4. **MRP phantom demand (BOM error):** Cross-ref MRP demand vs sales/forecast. Flag and hold — don't schedule phantom demand.
5. **Quality hold on constraint-feeding WIP:** Starvation tomorrow unless replacement WIP expedited or alternate routing used.
6. **Constraint breakdown:** Most damaging disruption. Immediate maintenance, alternate routing, notify at-risk customers.
7. **Wrong material mid-run:** Quarantine, pull forward different-alloy jobs, escalate purchasing for emergency replacement.
8. **Customer change after start:** Assess sunk cost, rework feasibility, shared-resource impact. Partial hold may beat scrap-restart.

## Communication Patterns

- **Daily publication:** Table format (sequence, times, lines, operators). Floor doesn't read paragraphs.
- **Change notice:** Urgent header, reason, affected jobs, new sequence/timing, effective time.
- **Disruption escalation:** Impact magnitude first (constraint hours lost, orders at risk), then cause, response, decision needed.
- **Overtime request:** Business case (OT cost vs missed-delivery cost) + union compliance. "4h voluntary OT, 3 CNC ops, Sat AM. Cost $1,200. At-risk revenue $45,000."
- **Customer delay notice:** Never surprise. New ETA + root cause (no internal blame) + recovery plan.
- **Maintenance coordination:** Window + justification + deferral risk. "Line 3 Tue 06:00–10:00, avoids Thu peak. Deferral risks unplanned breakdown — vibration trending caution."

## Escalation Protocols

| Trigger | Action | Timeline |
|---|---|---|
| Constraint down > 30min unplanned | Alert prod + maintenance mgrs | Immediate |
| Adherence < 80% a shift | RCA with supervisor | 4 hours |
| Order projected to miss commit | Notify sales/CS with revised ETA | 2 hours |
| OT > 20% over weekly budget | Escalate to plant mgr + cost-benefit | 1 business day |
| Constraint OEE < 65% 3 shifts | Focused improvement event | 1 week |
| Constraint yield < 93% | Joint review with quality | 24 hours |
| MRP load > capacity +15% next wk | Capacity meeting | 2 days prior |

**Chain:** Scheduler → Production Manager/Superintendent (30min constraint, 4h non-constraint) → Plant Manager (2h customer-impacting) → VP Ops (same day multi-customer/safety)

## Performance Indicators

| Metric | Target | Red Flag |
|---|---|---|
| Schedule adherence (±1h) | > 90% | < 80% |
| On-time delivery | > 95% | < 90% |
| OEE at constraint | > 75% | < 65% |
| Changeover vs standard | < 110% | > 130% |
| WIP days | < 5 | > 8 |
| Constraint utilization | > 85% | < 75% |
| First-pass yield at constraint | > 97% | < 93% |
| Unplanned downtime | < 5% | > 10% |
| Labor utilization | 80–90% | < 70% or > 95% |
