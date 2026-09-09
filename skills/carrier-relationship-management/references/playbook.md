# Playbook — Carrier Relationship Management

Conhecimento operacional: rate negotiation, scorecarding, portfolio strategy, RFP, market intelligence, FMCSA vetting, decision frameworks, edge cases, comunicação, escalação, KPIs.

## Core Knowledge

### Rate Negotiation Fundamentals

Negotiate components independently — bundling hides overpayment:

- **Base linehaul:** Per-mile/flat dock-to-dock. TL: benchmark DAT/Greenscreens lane rates. LTL: discount off published tariff (70-85% mid-volume). Lane-by-lane — competitive Chicago–Dallas ≠ Atlanta–LA.
- **Fuel surcharge (FSC):** Tied to DOE diesel average. Negotiate the TABLE (base trigger, increment e.g. $0.01/mi per $0.05 diesel, index lag weekly/monthly), not just current rate. Low linehaul + aggressive FSC can beat higher linehaul + standard FSC.
- **Accessorials:** Detention $50-100/hr after 2h free (negotiate free time aggressively — #1 invoice dispute source). Liftgate $75-150, residential $75-125, inside $100+, limited access $50-100, appointments $0-50. LTL reweigh/reclass $25-75, cubic surcharges.
- **Minimums:** TL ~$800 <200mi. LTL $75-150/shipment. Negotiate short-haul minimums separately.
- **Contract vs spot:** Contract 6-12mo (predictability + commitment). Spot ±10-30% by market. Healthy: 75-85% contract, 15-25% spot. >30% spot = routing guide failing.

### Carrier Scorecarding (5 metrics, not 20)

- **OTD:** Agreed-window delivery %. Target ≥95%, red <90%. Measure pickup AND delivery separately (98% pickup + 88% delivery = linehaul/terminal problem).
- **Tender acceptance:** Accepted e-tenders %. Primary target ≥90%, red <80%. <75% on contract lane = rate below market → renegotiate/reallocate.
- **Claims ratio:** Claim $ / freight spend. Target <0.5%, red >1.0%. Separate frequency vs severity (fifty $1K claims = systemic; one $50K = incident).
- **Invoice accuracy:** Matching contracted rate, no correction. Target ≥97%, red <93%. <90% → corrective action (testing or broken billing, both cost audit labor).
- **Tender-to-pickup time:** Acceptance→pickup hours. Target ≤2h FTL. Late pickups after acceptance = "soft rejecting" (holding load while shopping freight).

### Portfolio Strategy

- **Asset vs brokers:** Asset = certainty, accountability, less pricing flex. Brokers = flex + coverage, counterparty risk (double-brokering, quality variance, payment chains). Typical: 60-70% asset, 20-30% broker, 5-15% niche/specialty.
- **Routing guide:** 3-deep for lanes >2 loads/wk (primary 80%+ acceptance, secondary overflow, tertiary = price ceiling broker). <2/wk: 2-deep or regional broker.
- **Density vs concentration:** Enough volume per carrier per lane to matter (2/wk beats 2/mo). Never >40% of a lane with one carrier. Top-20 lanes: ≥3 active carriers.
- **Small carriers (10-50 trucks):** Better service, flex pricing, real relationships. Tradeoffs: thin tech/insurance, peak limits. Best for consistent mid-volume lanes.

### RFP Process (8-12 weeks)

- **Pre-RFP:** 12mo shipment data. Flag underperforming + above-market lanes (DAT/Greenscreens/Chainalytics). Set cost/service/diversity targets.
- **Design:** Lane detail (zips, volume, equipment, handling), transit expectations, accessorials, payment, insurance, weighted criteria. Lane-by-lane bids — portfolio bids hide cross-subsidy.
- **Evaluation:** Cost 40-50%, service history 25-30%, capacity 15-20%, fit 10-15%. +3% rate with 97% OTD/95% acceptance beats cheapest with 85%/70% — failures cost more than the delta.
- **Award:** Waves (primary first). 2-3wk operationalization. 30-day parallel overlap. Clean cutover.

### Market Intelligence

- **DAT/Greenscreens:** DAT = direction (spot + contract benchmarks). Greenscreens = carrier-specific leverage. Both beat negotiating blind.
- **Cycles:** 18-36mo peak-to-peak. Indicators: DAT load-to-truck (>6:1 tight), OTRI (>10% carrier leverage), Class 8 orders (capacity +6-12mo lead).
- **Seasonality:** Produce Apr-Jul (reefer SE/West). Retail peak Oct-Jan (dry van national). Month/quarter-end volume spikes. Award contracts in transitions, not peaks/troughs.

### FMCSA Compliance Vetting (quarterly)

- **Authority:** Active MC/FF via SAFER. 12mo+ stale "authorized" may = inactive. "Property" authority ≠ household goods.
- **Insurance:** $750K FMCSA minimum general ($1M hazmat, $5M HHG). Require $1M from all — $750K doesn't cover serious accidents. Verify via FMCSA Insurance tab, not carrier PDFs.
- **Safety rating:** Never Unsatisfactory. Conditional = case-by-case. Most carriers unrated → use CSA BASICs (Unsafe Driving, HOS, Vehicle Maintenance); top-25% worst on Unsafe Driving = liability.
- **Broker bond:** $75K surety active. Revoked/reduced = financial distress. Plus contingent cargo insurance check.

## Decision Frameworks

### Carrier Selection for New Lanes

1. **Incumbent covers it?** Negotiate first — new carrier = $500-1,500 onboarding + overhead. Trade new-lane volume for existing-lane concession.
2. **No incumbent:** 3-5 candidates. >500mi: asset carriers domiciled <100mi from origin. <300mi: regional/dedicated. <1/wk: regional broker.
3. **Evaluate:** FMCSA check + 12mo lane-specific history (not network avg) + DAT benchmark + total cost (linehaul+FSC+accessorials).
4. **30-day trial** at contract rates. KPIs: OTD ≥93%, acceptance ≥85%, invoice ≥95%. No 12-mo lock without validation.

### Consolidate vs Diversify

- **Consolidate:** >3 carriers on <5 loads/wk lane; stretched mgmt resources; need strategic-partner depth; loose market.
- **Diversify:** One carrier >40% critical lane; rejections >15%; entering peak; financial distress signals (late driver pay, insurance lapses, CDL posting spikes).

### Spot vs Contract

- **Stay contract:** Spread <10%; consistent volume; tightening capacity; critical tight-window lanes.
- **Go spot:** Spot >15% below contract (soft market); irregular <1/wk; one-time surge; contract carrier effectively spot-pricing you (chronic rejections).
- **Renegotiate:** Spread vs DAT >15% for 60+ days; acceptance <75% for 30d; material volume change either direction.

### Carrier Exit Criteria (after failed corrective action)

OTD <85% 60d; acceptance <70% 30d silent; claims >2% 90d; authority/insurance revoked or Unsatisfactory; invoice <88% 90d post-notice; double-brokering proven; financial distress evidence.

## Key Edge Cases

1. **Hurricane capacity squeeze:** Spot triples. Pre-positioned regionals + unaffected corridors + multi-load rate ceilings (not any-rate panic).
2. **Double-brokering discovery:** Don't accept undeparted load. In-transit: document + demand written explanation in 24h.
3. **40% volume loss:** Renegotiate proactively. Carriers discovering shortfall at invoice = trust destroyed.
4. **Financial distress early signs:** Delayed settlements, underwriter churn, bond drops, Carrier411 spikes. Reduce exposure incrementally, don't wait.
5. **Niche partner acquired by mega-fleet:** Expect disruption, repricing, lost account mgmt. Secure alternates pre-transition.
6. **FSC manipulation:** Model total cost at $3.50/$4.00/$4.50 diesel to expose low-base + aggressive-table tactics.
7. **Detention >5% of billing:** Root cause is usually shipper facility ops, not carrier overcharge. Fix operations first or lose the carrier.

## Communication Patterns

- **Opening:** Data, not demands. "DAT 90d avg $2.15/mi, our contract $2.45 — let's discuss alignment." Never "your rate is too high."
- **Counters:** Acknowledge their side ("driver pay is real"). Meet middle on base, push harder on accessorials/FSC table.
- **Annual reviews:** Partnership framing. Share forecasts, lane changes; ask what ops help carriers (dock times, scheduling, drop-trailers). Easy-driver shippers get better rates.
- **Positive reviews:** Specific + reward. "97% OTD Chicago–Dallas saved ~$45K expedites; raising allocation 60%→75%."
- **Corrective reviews:** Data + scorecard + specific gaps + 30/60/90 plan + consequence ("<92% OTD at 60d → shift 50% volume").

## Escalation Protocols

| Trigger | Action | Timeline |
|---|---|---|
| Acceptance <70% 2wk | Notify procurement, carrier call | 48 hours |
| Spot >30% lane budget | Review guide, source carriers | 1 week |
| Authority/insurance lapse | Suspend tendering, notify ops | 1 hour |
| One carrier >50% critical lane | Qualify secondary | 2 weeks |
| Claims >1.5% 60d | Formal performance review | 1 week |
| Rate variance >20% DAT, 5+ lanes | Renegotiate / mini-bid | 2 weeks |
| Driver shortage/service disruption | Activate backups, monitor up | 4 hours |
| Double-brokering confirmed | Suspend, compliance review | 2 hours |

**Chain:** Analyst → Manager (48h) → Director (1wk) → VP Supply Chain (persistent or >$100K exposure)

## Performance Indicators

| Metric | Target | Red Flag |
|---|---|---|
| Contract vs DAT benchmark | ±8% | >15% either way |
| Routing guide compliance | ≥85% | <70% |
| Primary tender acceptance | ≥90% | <80% |
| Portfolio OTD (weighted) | ≥95% | <90% |
| Claims ratio | <0.5% spend | >1.0% |
| Invoice accuracy | ≥97% | <93% |
| Spot % | <20% | >30% |
| RFP cycle (launch→implement) | ≤12wk | >16wk |
