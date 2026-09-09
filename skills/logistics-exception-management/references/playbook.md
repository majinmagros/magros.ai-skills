# Playbook — Logistics Exception Management

Conhecimento operacional: taxonomy (11 tipos), comportamento por modal, claims (Carmack), sazonalidade, fraude, frameworks de decisão, edge cases, comunicação, escalação, KPIs.

## Core Knowledge

### Exception Taxonomy

- **Delay:** ~40% of exceptions. Subtypes: weather, mechanical, capacity, customs, consignee reschedule. Key: carrier-fault vs force majeure.
- **Damage (visible):** Noted on POD. Photograph immediately. Never accept "driver left before inspection."
- **Damage (concealed):** Found post-delivery. File within 5 days (industry standard). Burden shifts to shipper — need packaging integrity evidence.
- **Damage (temperature):** Needs continuous recorder data (Sensitech/Emerson) + pre-trip records. Carriers claim "loaded warm."
- **Shortage:** Count at tailgate — never sign clean BOL if off. Driver vs warehouse conflicts. OS&D report required.
- **Overage:** Often cross-shipment from another consignee. Trace it — somebody is short.
- **Refused:** Damaged, late (perishable), wrong product, no PO, dock conflict. Non-carrier-fault refusal → storage + return freight owed.
- **Misdelivered:** Full carrier liability. Recover fast (deterioration/consumption).
- **Lost (full):** Trace at 24h past ETA (FTL), 48h (LTL). Formal tracer via OS&D dept.
- **Lost (partial):** Cross-dock losses at LTL terminals. Serial tracking for high-value.
- **Contaminated:** Chemicals/odors/incompatible freight. Regulatory implications (food/pharma).

### Carrier Behaviour by Mode

- **LTL** (FedEx Freight, XPO, Estes): 2-4 terminal touches each = risk. Large process-driven claims depts. 30-60 day resolution. Terminal mgr authority ~$2,500.
- **FTL** (asset + brokers): Dock-to-dock, damage usually load/unload. Brokers add layer — always get actual carrier's MC number.
- **Parcel** (UPS/FedEx/USPS): Automated portals, strict docs. Default liability very low ($100 UPS) — buy coverage at shipping.
- **Intermodal:** Multi-handoff. Damage in rail transit (impacts) or chassis swap. BOL chain allocates rail vs dray liability.
- **Ocean:** Hague-Visby/COGSA. $500/package limit unless declared. Seal integrity is everything. Destination surveyor.
- **Air:** Montreal Convention. 14-day damage notice, 21-day delay. Weight-based limits unless declared. Fastest resolution.

### Claims Process Fundamentals

- **Carmack (US domestic surface):** Carrier liable for actual loss/damage except act of God/enemy/shipper/authority/inherent vice. Shipper proves: good condition at tender + damaged/short arrival + amount.
- **Deadline:** 9 months from delivery (49 USC § 14706). Miss = time-barred regardless of merit.
- **Docs:** Original BOL (clean tender), delivery receipt (exception), invoice (value), inspection report, photos, repair/replacement quotes, packaging specs.
- **Carrier clock:** 30 days to acknowledge, 120 days to pay/decline. Declined → 2 years to sue from decline date.

### Seasonal and Cyclical Patterns

- **Peak (Oct-Jan):** Exceptions +30-50%. Strained networks, extended transit, slow claims. Buffer commitments.
- **Produce (Apr-Sep):** Temp exceptions spike. Reefer tight. Pre-cooling critical.
- **Hurricane (Jun-Nov):** Gulf/East Coast. Force majeure up. Reroute within 4-6h of track updates.
- **Month/quarter end:** Volume rush, rejections spike, double-brokering up, quality down.
- **Driver shortage:** Worst Q4 + post-regulation (ELD, clearinghouse). Spot spikes, service drops.

### Fraud and Red Flags

- **Staged damages:** Patterns inconsistent with mode; repeat consignee locations.
- **Address manipulation:** Post-pickup redirects. High-value electronics vector.
- **Systematic shortages:** Consistent 1-2 units across shipments = terminal/transit pilferage.
- **Double-brokering:** BOL carrier ≠ arriving truck; driver can't name dispatcher; mismatched insurance cert.

## Decision Frameworks

### Severity Classification (3 axes, take highest)

**Financial:** L1 <$1K no expedite → L2 $1-5K → L3 $5-25K/penalty risk → L4 $25-100K/contract risk → L5 >$100K/regulatory-safety.
**Customer:** Standard = no elevate. Key w/ SLA risk +1. Enterprise w/ penalties +2. Production line/launch at risk = auto L4+.
**Time:** Buffer = no elevate. <48h no alternative +1. Same/next-day critical = auto L4+.

### Eat-the-Cost vs Fight-the-Claim

- **<$500 + strong relationship:** Absorb ($150-250 internal processing = negative ROI). Log for scorecard.
- **$500–2,500:** Standard process. Accept partials >70%.
- **$2,500–10,000:** Full process. Escalate at 30 days. Account mgr involved. Reject <80%.
- **>$10,000:** VP awareness, dedicated handler, independent inspection. Reject <90%. Legal if denied.
- **Any amount + 3rd+ in 30d same carrier:** Treat as performance issue, not dollars.

### Priority Sequencing (multi-exception)

1. Safety/regulatory (pharma reefer, hazmat)
2. Production shutdown risk (10-50x multiplier)
3. Perishable shelf < 48h
4. Highest financial impact × customer tier
5. Oldest unresolved (prevent SLA aging)

## Key Edge Cases

1. **Pharma reefer temp dispute:** Carrier set-point vs your logger. Demand continuous download — never accept single-point reading.
2. **Consignee-caused damage, clean POD:** Driver's contemporaneous forklift notes = best defense. Without them, concealed claim likely sticks.
3. **72h scan gap, high-value:** Call origin/destination terminals for physical trailer/bay location before loss protocol.
4. **Customs hold:** Documentation (fixable) vs compliance (maybe unfixable). Carrier-code errors vs shipper-invoice errors = different paths.
5. **Partial BOL deliveries:** Running tally; don't file shortage until all partials reconcile.
6. **Broker insolvency mid-shipment:** Carrier has lien. Establish paid-status fast; negotiate release directly.
7. **Concealed damage at end customer:** Chain-of-custody docs determine loss bearer.
8. **Retroactive weather surcharge:** Check force majeure + FSC clauses — contract may not allow it.

## Communication Patterns

- **Routine, good relationship:** Collaborative. "Delay on PRO# X — updated ETA? Customer asking."
- **Significant, neutral:** Professional + documented. Facts, BOL/PRO, need + deadline.
- **Major/pattern, strained:** Formal. CC mgmt, contract terms, deadlines. "Per Section 4.2..."
- **Customer delay:** Proactive, honest, solution-first. Never blame carrier by name.
- **Customer damage/loss:** Empathetic, action-first. Lead with resolution (replacement/credit).

**Templates:** Carrier inquiry (`Exception Notice — PRO#/BOL#` + need + deadline); customer update (known + doing + revised timeline + contact); management escalation (`ESCALATION: ... — {days} Days` + timeline + impact + expected resolution).

## Escalation Protocols

| Trigger | Action | Timeline |
|---|---|---|
| Value > $25,000 | Notify VP Supply Chain | 1 hour |
| Enterprise customer | Dedicated handler + account team | 2 hours |
| Carrier non-response | Escalate to account manager | 4 hours |
| 3+ same carrier 30d | Performance review + procurement | 1 week |
| Fraud indicators | Compliance + halt standard flow | Immediately |
| Temp excursion regulated | Quality/regulatory team | 30 minutes |
| No scan, high-value >$50K | Trace + security | 24 hours |
| Denial > $10,000 | Legal review | 48 hours |

**Chain:** Analyst → Lead (4h) → Manager (24h) → Director (48h) → VP (72h+ or L5)

## Performance Indicators

| Metric | Target | Red Flag |
|---|---|---|
| Mean resolution time | < 72h | > 120h |
| First-contact resolution | > 40% | < 25% |
| Claims recovery rate | > 75% | < 50% |
| Post-exception CSAT | > 4.0/5.0 | < 3.5/5.0 |
| Exception rate /1,000 | < 25 | > 40 |
| Filing timeliness | 100% <30d | Any >60d |
| Repeat (same carrier/lane) | < 10% | > 20% |
| Aged >30d | < 5% | > 15% |
