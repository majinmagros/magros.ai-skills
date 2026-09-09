# Playbook — Returns & Reverse Logistics

Conhecimento operacional: policy logic, grading A-D, disposition economics, fraud (7 patterns), vendor recovery, warranty, routing matrix, fraud scoring, RTV ROI, exception logic, edge cases, comunicação, escalação, KPIs.

## Core Knowledge

### Returns Policy Logic

- **Standard window:** 30 days general merchandise; electronics 15 days; perishables non-returnable; furniture/mattresses 30-90 days. Holiday extended (Nov 1–Dec 31 → returnable through Jan 31, surge mid-January).
- **Condition:** Original packaging, accessories, no use beyond reasonable inspection. "Reasonable inspection" is where disputes live.
- **Receipt/proof:** POS lookup (card/loyalty/phone) replaced paper. Gift receipts = exchange/store credit at purchase price, never cash. No-receipt: capped ($50-75/txn, 3 per 12mo), refunded at lowest recent price.
- **Restocking fees:** Opened electronics 15%, special-order 20-25%, bulky items. Waived for defects/fulfilment errors. Waiving $45 on $300/28%-margin costs more than it appears.
- **Cross-channel (BORIS):** Refund at original purchase price, not current shelf price. Flag for return-to-DC vs store inventory.
- **International:** Duty drawback needs re-export proof (3-5y window). Offer "returnless refund" when shipping > 40% of product value.
- **Exceptions:** Price-match, beyond-window remorse, out-of-warranty defects, loyalty-tier overrides — judgment frameworks, not rigid rules.

### Inspection and Grading

Speed vs accuracy tension (30s visual vs 5min functional).

- **Grade A (Like New):** Packaging intact, accessories, no use, passes functional. Recovery 85-100%. Inspect 45-90s.
- **Grade B (Good):** Minor wear, packaging damaged, accessories present, functional. Open box/renewed 60-80%. Repack $2-5. Inspect 90-180s.
- **Grade C (Fair):** Visible wear, missing <$10% accessories. Secondary channels 30-50%. Refurb if cost < 20% of recovered value.
- **Grade D (Salvage):** Non-functional/heavily damaged. Parts 5-15% or recycle/destroy.

Category notes: electronics need functional test (+2-4min). Apparel: stains/odour/stretch/tags (arm's-length sniff + UV). Opened cosmetics/personal care: almost never restockable (health regs).

### Disposition Decision Trees

- **Restock as new:** Grade A only, complete packaging, functional/safety tested. Relabelling risks FTC "used as new". Best high-margin ($3-8 restock trivial).
- **Open box:** Grade A damaged packaging or Grade B. Repack $5-15 justified by margin delta. Sweet spot: electronics/small appliances.
- **Refurbish:** Viable when cost < 40% of refurbished price AND channel exists. Needs station, spares, re-test.
- **Liquidate:** Grade C / unjustified B. Pallet auctions, wholesalers, regional. Recovery 5-20%. Never mix categories in a pallet (sells at lowest-category rate).
- **Donate:** Deductible at FMV. Beats liquidation when FMV > recovery AND tax liability suffices. Protect brand (no discount-channel leakage).
- **Destroy:** Recalls, counterfeits, regulatory disposal (batteries/WEEE/hazmat), brand-protection goods. Certificate of destruction required.

### Fraud Detection ($24B+/yr US, frictionless for legit customers)

- **Wardrobing:** Wear-and-return. Indicators: holiday/event clustering, deodorant/makeup residue, inconsistent creasing. Counter: black-light, RFID tags (missing tag = worn).
- **Receipt fraud:** Found/stolen/fabricated receipts for cash. Counter: ID for cash refunds, match payment method, cap no-receipt per ID.
- **Swap fraud:** Counterfeit/cheaper/broken item in purchased packaging. Counter: serial verification, weight check ±5%, detailed high-value inspection.
- **Serial returners:** >30% rate or >$5K/yr. Segment: reason consistency, condition, net LTV. $50K purchases/$18K returns ($32K net) beats $15K/zero.
- **Bracketing:** Multiple sizes planned returns. Address via fit tech, free exchanges, education — not punishment.
- **Price arbitrage:** Promo buy → full-price credit elsewhere. Refund = actual purchase price always. Cross-channel = primary vector.
- **ORC:** Coordinated multi-store/identity theft-and-return. Indicators: multi-ID same address, high-shrink categories, geo clustering. → LP team.

### Vendor Recovery

- **RTV:** Defectives within vendor window. Accumulate to $200-500 minimums, get RMA number, ship to designated facility, track credit. Failure mode: letting eligible product sit past 90-day claim windows.
- **Defect claims:** Rate exceeds 2-5% threshold → formal claim with photos/notes/complaint data. Data quality determines recovery.
- **Chargebacks:** Vendor-caused (wrong item, mislabel, packaging) → full cost incl. shipping + labor. Needs published compliance program.
- **Credit vs replacement vs write-off:** Solvent/responsive → credit. Overseas/difficult → replacement. <$200 + critical supplier → write off, note for next negotiation.

### Warranty Management

- **Warranty vs return:** Return = reverse purchase (30d, any reason). Warranty = defect in coverage period (90d-lifetime). Different systems/policies/financials.
- **Manufacturer vs retailer:** Retailer owns return window; manufacturer owns warranty. Grey zone: recurring "lemon" failures — customer wants refund, manufacturer offers repair.
- **Extended warranties:** 30-60% margins at POS. Claims handled by provider (often 3rd party); retailer facilitates. Customers conflate the three coverages.

## Decision Frameworks

### Disposition Routing by Category and Condition

| Category | Grade A | Grade B | Grade C | Grade D |
|---|---|---|---|---|
| Consumer Electronics | Restock (test first) | Open box / Renewed | Refurb if ROI > 40%, else liquidate | Parts / e-waste |
| Apparel | Restock if tags on | Repackage / outlet | Liquidate by weight | Textile recycling |
| Home & Furniture | Restock | Open box discount | Liquidate local | Donate / destroy |
| Health & Beauty | Restock if sealed | Destroy | Destroy | Destroy |
| Books & Media | Restock | Restock discount | Liquidate | Recycle |
| Sporting Goods | Restock | Open box | Refurb if cost < 25% | Parts / donate |
| Toys & Games | Restock if sealed | Open box | Liquidate | Donate if safe |

### Fraud Scoring Model (0-100; review 65+, hold 80+)

| Signal | Points | Notes |
|---|---|---|
| Return rate > 30% (12mo) | +15 | Adjusted for category |
| Returned <48h after delivery | +5 | May be bracketing |
| High-value electronics, serial mismatch | +40 | Near-certain swap |
| Reason changed initiation→receipt | +10 | Inconsistency |
| Multiple returns same week | +10 | Cumulative |
| Different return vs shipping address | +10 | Gifts excluded |
| Weight differs > 5% | +25 | Swap / missing parts |
| Account < 30 days old | +10 | New account risk |
| No-receipt return | +15 | Receipt fraud risk |
| High-shrink category | +5 | Electronics/cosmetics/designer |

### Vendor Recovery ROI

`(Expected credit × collection probability) > (labor + shipping + relationship cost)`. Rules: >$500 always pursue (works at 50% probability). $200-500 if functional RTV + batchable. <$200 batch to threshold or offset next PO. Overseas: $1,000 minimum, +30% processing time.

### Return Policy Exception Logic (in order)

1. **Defective?** → accept regardless of window/condition.
2. **Top-10% LTV customer?** → accept; retention math favours it.
3. **Reasonable to neutral observer?** (Nov coat in March yes; June swimsuit in December less so).
4. **Disposition outcome?** Grade A restockable = minimal cost → grant. Grade C+ = real margin cost.
5. **Precedent risk?** Documented one-offs rarely create precedent; publicised (social) ones always do.

## Key Edge Cases

1. **Firmware-wiped high-value return:** Factory-reset + 6mo battery cycles = extensively used, not "defective". Grade beyond software state.
2. **Hazmat improper packaging:** Accepting = regulatory liability; refusing = CX problem. Can't go via standard parcel.
3. **Cross-border duty:** Drawback needs docs customer lacks; shipping may exceed value.
4. **Influencer bulk return:** 20+ items post-content, within policy. Restock compounding (unboxing shows exact items).
5. **Modified-product warranty:** Customer upgrade (RAM) + unrelated defect (screen). Modification may/may not void that claim.
6. **High-value serial returner:** $80K spend, 42% returns. Banning loses profit; accepting encourages. Segment beyond rate.
7. **Recalled product return:** Follows recall programme, NOT returns programme. Mixing = liability + reporting errors.
8. **Gift receipt, price rose $30:** Policy = purchase price refund. Customer anchors on shelf price.

## Communication Patterns

- **Refund confirmation:** Warm, efficient. Amount + timeline first.
- **Denial:** Empathetic, clear. Specific policy + alternatives (exchange/credit/warranty) + escalation. Never zero options.
- **Fraud hold:** Neutral. "Additional time to process" — never say "fraud/investigation". Give timeline. Document indicators internally.
- **Restocking fee:** Transparent. What it covers + net refund confirmed upfront.
- **Vendor RTV:** Professional, evidence-based. Defect data + photos + volumes + agreement section.

**Templates:** RMA approval (`Return Approved — Order #{id}` + RMA + instructions + timeline + conditions); refund confirmation (amount first); fraud hold ("reviewing, update in [X] days").

## Escalation Protocols

| Trigger | Action | Timeline |
|---|---|---|
| Single item > $5,000 | Supervisor approval | Before processing |
| Fraud score ≥ 80 | Hold, fraud review team | Immediately |
| Chargeback filed simultaneously | Halt, coordinate payments | 1 hour |
| Recalled product | Recall coordinator, not standard flow | Immediately |
| Vendor defect rate > 5% SKU | Notify merch + vendor mgmt | 24 hours |
| 3rd exception same customer 12mo | Manager review | Before processing |
| Suspected counterfeit | Pull, photograph, LP + brand protection | Immediately |
| Regulated product (pharma/hazmat/device) | Compliance team | Immediately |

**Chain:** Associate → Lead (2h) → Manager (8h) → Director (24h) → VP (48h+ or >$25K single item)

## Performance Indicators

| Metric | Target | Red Flag |
|---|---|---|
| Processing time (receipt→refund) | < 48h | > 96h |
| Inspection accuracy (audit agreement) | > 95% | < 88% |
| Restock rate | > 45% | < 30% |
| Fraud detection rate | > 80% | < 60% |
| False positive rate | < 3% | > 8% |
| Vendor recovery ($ recovered/eligible) | > 70% | < 45% |
| Post-return CSAT | > 4.2/5.0 | < 3.5/5.0 |
| Cost per return | < $8.00 | > $15.00 |
