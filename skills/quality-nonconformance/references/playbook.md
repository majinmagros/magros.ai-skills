# Playbook — Quality & Non-Conformance Management

Conhecimento operacional: NCR lifecycle, RCA, CAPA, SPC, incoming inspection, supplier quality, frameworks regulatórios, COQ, decision frameworks, edge cases, comunicação, escalação, KPIs.

## Core Knowledge

### NCR Lifecycle

- **Identification:** Anyone can initiate. Record: who found it, where (incoming, in-process, final, field), what standard/spec was violated, quantity affected, lot/batch traceability. Tag or quarantine nonconforming material immediately — no exceptions. Physical segregation with red-tag or hold-tag in a designated MRB area. Electronic hold in ERP to prevent inadvertent shipment.
- **Documentation:** NCR number assigned per your QMS numbering scheme. Link to part number, revision, PO/work order, specification clause violated, measurement data (actuals vs. tolerances), photographs, and inspector ID. For FDA-regulated products, records must satisfy 21 CFR 820.90; for automotive, IATF 16949 §8.7.
- **Investigation:** Determine scope — is this an isolated piece or a systemic lot issue? Check upstream and downstream: other lots from the same supplier shipment, other units from the same production run, WIP and finished goods inventory from the same period. Containment actions must happen before root cause analysis begins.
- **Disposition via MRB (Material Review Board):** Quality, engineering, and manufacturing representatives. For aerospace (AS9100), the customer may need to participate.
  - **Use-as-is:** Part does not meet drawing but is functionally acceptable. Requires engineering justification. In aerospace, requires customer approval per AS9100 §8.7.1. Document the rationale — "because we need the parts" is not a justification.
  - **Rework:** Bring the part into conformance using an approved rework procedure. Documented instruction, re-inspection to original spec. Track rework costs.
  - **Repair:** Part will not fully meet spec but will be made functional. Requires engineering disposition and often customer concession. Different from rework — repair accepts a permanent deviation.
  - **Return to Vendor (RTV):** Issue SCAR/CAR. Debit memo or replacement PO. Track supplier response timelines. Update supplier scorecard.
  - **Scrap:** Document quantity, cost, lot traceability, authorized approval. For serialized/safety-critical parts, witness destruction.

### Root Cause Analysis

- **5 Whys:** Simple, effective for straightforward failures. Assumes single linear chain. Each "why" must be verified with data, not opinion.
- **Ishikawa (Fishbone):** 6M framework (Man, Machine, Material, Method, Measurement, Mother Nature). Brainstorming framework, not RCA by itself — hypotheses need verification.
- **Fault Tree Analysis (FTA):** Top-down, deductive, AND/OR gates. Quantitative with failure rate data. Expected in aerospace (AS9100) and medical devices (ISO 14971). Most rigorous, resource-intensive.
- **8D Methodology:** D0 symptom/emergency → D1 team → D2 problem definition (IS/IS-NOT) → D3 containment → D4 root cause → D5 corrective action → D6 implementation → D7 prevention → D8 recognition. Automotive OEMs expect 8D for significant supplier issues.
- **Red flags you stopped at symptoms:** "root cause" contains "error" (human error is never a root cause); corrective action is "retrain the operator" (weakest action); root cause restates the problem.

### CAPA System

- **Initiation:** Triggers: repeat NCs (same mode 3+), customer complaints, audit findings, field failures, SPC signals, regulatory observations. Over-initiating dilutes resources; under-initiating creates findings.
- **Corrective vs. Preventive:** Corrective addresses existing NC + recurrence. Preventive addresses potential NC (trends, risk, near-miss). FDA expects both.
- **Writing Effective CAPAs:** Specific, measurable, addressing verified root cause. Bad: "Improve inspection procedures." Good: "Add torque verification at Station 12 with calibrated wrench (±2%), traveler WI-4401 Rev C, effective 2025-04-15." Owner + target date + evidence required.
- **Verification vs. Validation:** Verification = action implemented as planned. Validation = action prevented recurrence (zero defects over 90 days production data). FDA expects both; closing at verification alone is a common finding.
- **Closure Criteria:** Objective evidence of implementation AND effectiveness. Minimum: 90 days production data, 3 lots, or one audit cycle. Document effectiveness data.
- **Regulatory Expectations:** FDA 21 CFR 820.100/820.90/820.198; IATF 16949 §10.2.3-10.2.6; AS9100 §10.2; ISO 13485 §8.5.2-8.5.3.

### Statistical Process Control (SPC)

- **Chart Selection:** X-bar/R (subgroups n=2-10); X-bar/S (n>10); I-MR (n=1, batch/destructive); p-chart (proportion, variable n); np-chart (count, fixed n); c-chart (defects/unit, fixed area); u-chart (defects/unit, variable area).
- **Capability:** Cp = potential (spread vs spec); Cpk = actual (centered); Pp/Ppk = long-term. Cp=2.0 but Cpk=0.8 → fix the mean. IATF: Cpk ≥ 1.33 established, Ppk ≥ 1.67 new.
- **Western Electric Rules:** R1: one point beyond 3σ (act now). R2: nine consecutive one side. R3: six trending. R4: fourteen alternating. R2-4 = systematic cause, investigate before out-of-spec.
- **Over-Adjustment:** Reacting to common-cause variation increases variation (tampering). Adjust only on special-cause signals.
- **Common vs. Special Cause:** Common = inherent, needs fundamental change. Special = assignable event (worn tool, new lot, untrained operator). SPC detects special causes fast.

### Incoming Inspection

- **AQL (ANSI/ASQ Z1.4 / ISO 2859-1):** Level II standard. Tightened after 2 of 5 rejected; reduced after 10 accepted + stable. Critical: AQL 0. Major: 1.0-2.5. Minor: 2.5-6.5.
- **LTPD:** Defect level designed to reject. AQL protects producer, LTPD protects consumer.
- **Skip-Lot:** After 10+ accepted lots at normal, inspect every 2nd/3rd/5th. Revert on any rejection. Formal criteria required.
- **CoC Reliance:** New supplier = always inspect. Qualified = CoC + reduced verification. Critical/safety = always inspect. CoC reliance needs documented agreement + periodic audits.

### Supplier Quality Management

- **Audits:** Process (observe/interview/sample), system (QMS compliance), product (characteristics). Risk-based schedule: high annually, medium biennially, low every 3 years + cause-based.
- **Scorecards:** PPM, OTD, SCAR response time, SCAR effectiveness (recurrence), lot acceptance. Weight by impact. Share quarterly.
- **CARs/SCARs:** 8D expected. 10 business days initial response, 30 days full plan. Follow up effectiveness.
- **ASL:** Entry = qualification (FAI, capability, audit). Maintenance = scorecard thresholds. Removal needs cross-functional agreement + transition plan.
- **Develop vs. Switch:** Develop when unique capability, high switching cost, strong relationship, addressable gaps. Switch when unwilling, deteriorating trend despite CARs, or better qualified alternatives.

### Regulatory Frameworks

- **FDA 21 CFR 820:** 820.90 (NC product), 820.100 (CAPA), 820.198 (complaints), 820.250 (statistics).
- **IATF 16949:** Control plans, PPAP, MSA, 8D, special characteristics, customer notification for changes.
- **AS9100:** Product safety, counterfeit prevention, configuration management, FAI (AS9102), key characteristics, customer approval for use-as-is.
- **ISO 13485:** Risk management (ISO 14971), traceability, design controls.
- **Control Plans:** Characteristics, methods, frequencies, sample sizes, reaction plans, owners per step. Living document.

### Cost of Quality (Juran)

- **Prevention (5-10% COQ):** Training, validation, design reviews, qualification, SPC, poka-yoke. $1 here returns $10-$100.
- **Appraisal (20-25%):** Inspection, testing, calibration, audits.
- **Internal failure (25-40%):** Scrap, rework, re-inspection, MRB, delays, investigation labor.
- **External failure (25-40%):** Returns, warranty, field service, recalls, regulatory, liability, reputation.

## Decision Frameworks

### NCR Disposition Decision Logic

1. **Safety/regulatory critical** → no use-as-is. Rework to full conformance or scrap. No exceptions without formal risk assessment (+ regulatory notification where required).
2. **Customer-specific requirements** → contact customer for concession before disposing.
3. **Functional impact** → no impact + within MRB authority → use-as-is with justification. Impact → rework or scrap.
4. **Reworkability** → rework if approvable process. If rework cost > 60% of replacement → scrap.
5. **Supplier accountability** → RTV with SCAR. Exception: production can't wait → use-as-is/rework with cost recovery.

### RCA Method Selection

- **Single-event, simple chain:** 5 Whys (1-2h).
- **Single-event, multiple categories:** Ishikawa + 5 Whys on likely branches (4-8h).
- **Recurring, process-related:** 8D full team (20-40h).
- **Safety-critical/high-severity:** FTA quantitative (40-80h; required aerospace/medical).
- **Customer-mandated:** Whatever customer requires (usually 8D).

### CAPA Effectiveness Verification

1. **Implementation evidence:** Updated WI with revision, installed fixture with validation, modified inspection plan with effective date.
2. **Monitoring data:** 90 days production, 3 lots, or one audit cycle — whichever is most meaningful.
3. **Recurrence check:** Zero recurrences in monitoring period. Recurrence = reopen, don't open a new CAPA for the same issue.
4. **Leading indicators:** Related metrics improved (process PPM, complaint rate)?

### Inspection Level Adjustment

| Condition | Action |
|---|---|
| New supplier, first 5 lots | Tightened (Level III or 100%) |
| 10+ accepted at normal | Qualify reduced/skip-lot |
| 1 rejected under reduced | Revert to normal immediately |
| 2 of 5 rejected under normal | Switch to tightened |
| 5 accepted under tightened | Revert to normal |
| 10 rejected under tightened | Suspend supplier; escalate |
| Customer complaint traced to incoming | Revert to tightened regardless |

### Supplier Corrective Action Escalation

| Stage | Trigger | Action | Timeline |
|---|---|---|---|
| L1: SCAR issued | 1 significant NC or 3+ minor in 90d | Formal SCAR, 8D response | 10d response, 30d plan |
| L2: Watch | No response / ineffective action | Increased inspection, probation, procurement notified | 60d to improve |
| L3: Controlled shipping | Continued failures on watch | Inspection data per shipment or 3rd-party sort at supplier expense | 90d sustained improvement |
| L4: New source | No improvement | Qualify alternate; reduce allocation | 3-12 months |
| L5: ASL removal | Failure/unwillingness | Formal removal; transition all parts | Complete transition first |

## Key Edge Cases

1. **Field failure with no internal detection:** Don't question customer data first — check whether your inspection covers the actual failure mode. Field failures expose test coverage gaps.
2. **Falsified CoCs:** Quarantine ALL supplier material incl. WIP/finished goods. Regulatory reportable (aerospace counterfeit, possibly medical). Scale of containment drives response.
3. **In-control SPC but rising complaints:** Your spec isn't tight enough for the customer's process. Collaborate on true functional requirement.
4. **NC on shipped product:** Extend containment to customer stock/WIP/their customers. Safety-critical = immediate notification.
5. **CAPA addressed symptom:** Recurrence after closure → RCA was insufficient ("operator error" + "retrain"). Restart RCA assuming first investigation failed.
6. **Multiple root causes:** Use Ishikawa/FTA, not 5 Whys. Fix ALL contributing causes.
7. **Intermittent, unreproducible defect:** Cannot reproduce ≠ doesn't exist. Increase sampling; correlate environment (shift, temp, humidity, vibration); Gauge R&R nested studies.
8. **NC found during regulatory audit:** Acknowledge, document, investigate formally. Robust response > pretending anomaly.

## Communication Patterns

- **Routine NCR, internal:** Direct + factual. "NCR-2025-0412: lot 4471 part 7832-A, OD 12.52mm vs 12.45±0.05 spec. 18/50 out. Quarantined MRB Bay 3."
- **Significant NCR, management:** Impact first (production, customer risk, $), then details.
- **SCAR to supplier:** Professional, specific, documented. Nonconformance + spec + impact + format + timeline.
- **Customer notification:** What you know → containment done → customer actions → resolution timeline. Transparency builds trust.
- **Regulatory response:** Factual, accountable, per expected format (e.g., FDA 483 response). Acknowledge, investigate, correct, evidence.

**Templates:** NCR notification (`NCR-{n}: {part} — {defect}` + findings/spec/qty/containment/scope); SCAR (`SCAR-{n}: PO# {po} — response by {date}` + data/impact/format); Customer notification (containment + traceability + actions + timeline + QE contact).

## Escalation Protocols

| Trigger | Action | Timeline |
|---|---|---|
| Safety-critical NC | Notify VP Quality + Regulatory | 1 hour |
| Field failure / complaint | Dedicated investigator + account team | 4 hours |
| Repeat NCR (3+ same mode) | Mandatory CAPA + management review | 24 hours |
| Falsified documentation | Quarantine all material + legal/regulatory | Immediately |
| NC on shipped product | Customer notification protocol | 4 hours |
| External audit finding | Management review + response plan | 48 hours |
| CAPA overdue > 30 days | Escalate to Quality Director | 1 week |
| NCR backlog > 50 open | Process + resource review | 1 week |

**Chain:** QE → Supervisor (4h) → Manager (24h) → Director (48h) → VP Quality (72h+ or any safety event)

## Performance Indicators

| Metric | Target | Red Flag |
|---|---|---|
| NCR closure time (median) | < 15 business days | > 30 days |
| CAPA on-time closure | > 90% | < 75% |
| CAPA effectiveness (no recurrence) | > 85% | < 70% |
| Supplier PPM (incoming) | < 500 PPM | > 2,000 PPM |
| Cost of quality (% revenue) | < 3% | > 5% |
| Internal defect rate | < 1,000 PPM | > 5,000 PPM |
| Customer complaints (per 1M) | < 50 | > 200 |
| Aged NCRs (>30d) | < 10% | > 25% |
