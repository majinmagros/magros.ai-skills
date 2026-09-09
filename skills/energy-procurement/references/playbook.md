# Playbook — Energy Procurement

Conhecimento operacional: bill anatomy, procurement strategies, demand charges, renewables, load profiling, market structures, sustainability, risk, decision frameworks, edge cases, comunicação, escalação, KPIs.

## Core Knowledge

### Pricing Structures and Utility Bill Anatomy

- **Energy charges (40–55%):** Flat, TOU, or RTP. Competitively procurable in deregulated markets.
- **Demand charges (20–40% manufacturing):** Highest 15-min kW × $8–$25/kW. One bad interval = $5K–$15K/month.
- **Capacity charges (PJM/ISO-NE/NYISO):** Your PLC share from prior-year system peaks (1–5 summer hours). Cutting load in those hours trims next-year charges 15–30% — highest-ROI DR opportunity.
- **T&D:** Regulated, largely non-bypassable (you pay distribution even with on-site generation).
- **Riders/surcharges:** RES compliance, decommissioning, transition charges. Rate cases add $0.005–$0.015/kWh — track PUC proceedings.

### Procurement Strategies

- **Fixed-price (12–36mo):** Budget certainty at 5–12% premium over forwards (supplier absorbs price/volume/basis risk). Best when predictability > minimization.
- **Index/variable:** Wholesale + $0.002–$0.006/kWh adder. Lowest long-run average, full spike exposure (ERCOT Uri: $9,000/MWh; 5 MW peak → $1.5M+ in a week). Needs active risk management + variance-tolerant culture.
- **Block-and-index:** 60–80% baseload fixed, variable floats. Blocks must match load shape (3 MW 24/7 baseload + 2 MW on-peak variable).
- **Layered:** Tranches over 12–24mo (e.g., 25% quarterly for 2027 delivery). Dollar-cost averaging — eliminates "locked at the top" risk. Single most effective technique.
- **RFP:** 5–8 REPs, 36mo interval data, load factor, accounts, expirations, sustainability reqs. Evaluate total cost + credit quality (S&P/Moody's — bankruptcy → default service at tariff) + flexibility + value-add (DR, reporting, intel).

### Demand Charge Management

- **Peak ID:** Top 10 monthly 15-min intervals; 6–8 usually share a root cause (6–9 AM simultaneous startups).
- **Load shifting:** 500 kW on-peak→off-peak = $5K–$12.5K/month demand savings alone.
- **Batteries:** 500kW/2MWh = $800K–$1.2M installed; $7.5K/mo at $15/kW (9–13yr simple payback). Stack TOU arbitrage + capacity tag + DR → 5–7yr.
- **DR programs:** PJM Economic DR (LMP for curtailed load), ERCOT ERS (standby + energy). 1 MW curtailment = $15K–$80K/yr.
- **Ratchet clauses:** Billed demand ≥ 60–80% of prior-11mo peak. One 6 MW accident vs 4 MW normal at 80% ratchet = +$200K/yr from a single 15-min interval. Always check tariff first.

### Renewable Energy Procurement

- **Physical PPA (10–25yr):** Direct with generator, energy + RECs. Manage basis risk (node vs load zone), curtailment, shape risk.
- **VPPA (CfD):** Fixed strike (e.g., $35/MWh) vs settlement price. Financial instrument — may need CFO/treasury, ISDA, mark-to-market. Physical supply unchanged.
- **RECs:** 1 REC = 1 MWh attributes. National wind $1–5, solar $5–15, regional $20–60. Cheap but weak additionality (GHG Scope 2 scrutiny).
- **On-site:** Rooftop/ground solar $0.04–$0.08/kWh, CHP. Cuts T&D exposure + capacity tags. Risks: net metering changes, interconnection costs, leases. Compare total value, not just energy.

### Load Profiling

- **Base vs variable:** Base 24/7 (refrigeration, servers, continuous mfg). Load factor = avg/peak. >0.75 flat (round-the-clock blocks); <0.50 spiky (shaped products, peak shaving ROI).
- **By system (mfg typical):** HVAC 25–35%, motors 30–45%, compressed air 10–15%, lighting 5–10%, process heat 5–15%. Biggest peak contributor ≠ biggest consumer (compressed air worst peak-to-average).

### Market Structures

- **Regulated (~35% US C&I load):** Single utility, PUC rates. Optimize via tariff switching, demand mgmt, on-site gen only.
- **Deregulated ISOs:** PJM, ERCOT (isolated), CAISO, NYISO, ISO-NE, MISO, SPP. Different capacity/pricing rules each.
- **LMP = Energy + Congestion + Loss.** Congestion adds $5–$30/MWh in constrained zones. Drives VPPA basis risk.

### Sustainability Reporting

- **Scope 2 dual reporting:** Location-based (eGRID avg) + market-based (your procurement). RE100/SBTi focus on market-based.
- **RE100:** 100% renewable commitment, annual reporting. Instruments: physical/VPPA RECs, green tariffs, unbundled RECs (tightening), on-site.
- **CDP/SBTi:** Procurement feeds CDP C8. 10+yr fossil-heavy locks can conflict with SBTi trajectories.

### Risk Management

- **Hedges:** Layered primary; swaps/options/heat-rate calls for specific exposures. $50/MWh puts at $2–5 premium cap index tail risk.
- **Mix:** Most sophisticated buyers land 60–80% hedged / 20–40% index (profile-dependent).
- **Weather:** ±15% colder winter → +25–40% gas cost. Most manage via reserves, not derivatives.
- **Regulatory:** Rate cases, capacity reform, carbon pricing, net metering shifts can reprice strategy mid-contract.

## Decision Frameworks

### Procurement Strategy Selection

1. **Budget variance tolerance?** >5% triggers review → lean fixed. Absorbs 15–20% → index/hybrid viable.
2. **Price cycle position?** Forwards bottom-third of 5yr → lock more fixed. Top-third → keep index. Uncertain → layer.
3. **Tenor?** 12mo: fixed/index matters little. 36mo+: fixed premium compounds → hybrid/layered.
4. **Load factor?** >0.75 → flat blocks. <0.50 → shaped/TOU products.

### PPA Evaluation (10–25yr commitment)

1. **Economics:** Strike vs forward curve full term (a $35 PPA in-the-money today can go underwater on regional overbuild).
2. **Basis risk:** Generator node vs load zone — demand 5+yr historical basis data ($3–$12/MWh spreads common).
3. **Curtailment:** ERCOT wind 3–8%/yr, CAISO solar 5–12% spring. Settlement on generated volumes penalizes you — negotiate caps.
4. **Credit:** $50M notional VPPA may need $5–10M LC. Factor LC cost in.

### Demand Charge Mitigation ROI

Stack: demand charges + capacity tag (next delivery year) + TOU arbitrage + DR revenue. Payback <5yr justified; 5–8 marginal; >8 no (unless sustainability-mandated).

### Market Timing

Never call the bottom. Bottom-quartile forwards → accelerate tranches. Top-quartile → decelerate, roll index. Watch: generation adds/retirements, gas pipeline constraints, capacity auction results.

## Key Edge Cases

1. **ERCOT extreme weather (Uri):** Never unhedged into winter without cap/hedge.
2. **VPPA congestion basis:** West Texas wind vs Houston load = persistent −$3–12/MWh settlements.
3. **Ratchet trap:** One 15-min spike → 11mo elevated billing (+$200K/yr example).
4. **Mid-contract rate case:** Fixed supply ≠ fixed delivery; $0.012/kWh adder = $150K/yr on 12 MW.
5. **Negative LMP:** High-wind/solar intervals → surprise payments under some PPA structures.
6. **Solar cannibalizing DR:** PV cuts average but not peak → lower DR baseline → less curtailment revenue.
7. **PLC surprise:** Backup-gen runs/heat-wave production during coincident peaks → +20–40% capacity charges next year.
8. **Re-regulation risk:** Voided competitive contracts → tariff reversion, possibly costlier.

## Communication Patterns

- **RFP:** Professional, data-rich. Full interval data + load profiles (accurate modeling = lower risk premiums).
- **Renewal:** Relationship + volume first. "...terms reflecting market conditions and our growing portfolio."
- **Price challenge:** Cite curve data. "ICE 2027 forwards $42 AEP Dayton; your $48 = 14% premium — what's driving the spread?"
- **Finance:** Budget/variance/risk language. "75% certainty, worst-case ±$400K on $12M budget."
- **Sustainability:** Scope 2 mapping. "50,000 MWh bundled RECs = 35% of RE100 target."
- **Operations:** Requirements-first. "Cut 400 kW summer afternoons — three options, no production impact."

## Escalation Protocols

| Trigger | Action | Timeline |
|---|---|---|
| Wholesale >2× budget 5+ days | Notify finance, evaluate hedges, emergency fixed | 24 hours |
| Supplier downgraded < IG | Review termination, replacement options | 48 hours |
| Rate case >+10% proposed | Engage counsel, consider intervention | 1 week |
| Peak >ratchet +15% | Root-cause with ops, model impact | 24 hours |
| PPA REC shortfall >10% | Default notice, replacement RECs | 5 business days |
| PLC +20% YoY | Analyze peaks, model impact, response plan | 2 weeks |
| Contract enforceability threat | Legal, force majeure review | 48 hours |
| Grid emergency/blackouts | Emergency curtailment, ops coord, insurance docs | Immediate |

**Chain:** Analyst → Manager (24h) → Director (48h) → VP Finance/CFO (>$500K or >5yr commitment)

## Performance Indicators

| Metric | Target | Red Flag |
|---|---|---|
| Avg cost vs budget | ±5% | >10% |
| Cost vs market benchmark | Within 3% | >8% premium |
| Demand charges % of bill | <25% (mfg) | >35% |
| Peak vs prior yr (weather-norm) | Flat/declining | >10% up |
| Renewable % (market Scope 2) | On RE100 trajectory | >15% behind |
| Renewal lead time | Signed ≥90d pre-expiry | <30d |
| Capacity tag trend | Flat/declining | >15% YoY |
| Budget forecast accuracy | ±7% | >12% miss |
