# Playbook — Inventory Demand Planning

Conhecimento operacional: forecasting methods, accuracy metrics, safety stock, reorder logic, promos, ABC/XYZ, seasonal, decision frameworks, edge cases, comunicação, escalação, KPIs.

## Core Knowledge

### Forecasting Methods and When to Use Each

- **Moving Averages (simple, weighted, trailing):** Stable-demand, low-variability items. 4-week SMA for staples; weighted for slight drift. Never on seasonal items — lags trend by half the window.
- **Exponential Smoothing (SES/Holt/Holt-Winters):** SES (alpha 0.1–0.3) for stationary noisy demand. Holt's adds trend. Holt-Winters adds seasonality — workhorse for 52-week/12-month cycles. High alpha (>0.3) chases noise; low alpha (<0.1) too slow. Optimize on holdout, never on fitting data.
- **Seasonal Decomposition (STL, classical, X-13ARIMA-SEATS):** Isolate trend/seasonal/residual. STL robust to outliers. Use when seasonal patterns shift YoY, when de-seasonalizing before another model, or for promo lift on clean baseline.
- **Causal/Regression:** External drivers (price elasticity, promos, weather, competitors, events). Promo flags must encode depth, display, circular, cross-category. Pitfall: overfitting sparse promo history — regularize (Lasso/Ridge), validate out-of-time.
- **ML (GBM, neural nets):** Justified with 1,000+ SKUs × 2+ years weekly + external regressors + ML team. LightGBM/XGBoost beats simpler methods 10–20% WAPE on promo/intermittent items. Requires monitoring — quarterly retraining minimum.

### Forecast Accuracy Metrics

- **MAPE:** Breaks on low-volume items. Use only for items averaging 50+ units/week.
- **WMAPE:** Sum |errors| / sum actuals. Prevents low-volume dominance. The metric finance cares about (dollars).
- **Bias:** Mean signed error. Positive = overstock risk, negative = stockout risk. Healthy < ±5%; > ±10% = structural problem.
- **Tracking Signal:** Cumulative error / MAD. Exceeding ±4 = model drifted, intervene (re-parameterize or switch).

### Safety Stock Calculation

Textbook: `SS = Z × σ_d × √(LT + RP)` — works only for normal, stationary demand.

- **Service Levels:** 95% (Z=1.65) standard A-items. 99% (Z=2.33) critical/A+ where stockout cost dwarfs holding. 90% (Z=1.28) C-items. 95%→99% nearly doubles SS — quantify investment first.
- **Lead Time Variability:** `SS = Z × √(LT_avg × σ_d² + d_avg² × σ_LT²)`. Vendors with LT CV > 0.3 need 40–60% higher SS than demand-only formula.
- **Lumpy/Intermittent:** Normal SS fails with many zero periods. Croston's (interval + size separate), bootstrapped distribution for SS.
- **New Products:** Analog profiling (3–5 similar items at same lifecycle) + 20–30% buffer first 8 weeks, taper as history accumulates.

### Reorder Logic

- **Inventory Position:** `IP = On-Hand + On-Order − Backorders − Committed`. Never reorder on on-hand alone.
- **Min/Max:** Min = avg demand during LT + SS. Max = Min + EOQ. Order up to Max at Min. Doesn't adapt without manual adjustment.
- **ROP/EOQ:** ROP = avg demand during LT + SS. EOQ = √(2DS/H). Round to case packs/layers/pallets — "perfect" EOQ of 847 means nothing in cases of 24.
- **Periodic Review (R,S):** Review every R, order up to S. For fixed vendor days. R = delivery schedule; S = avg demand during (R+LT) + SS.
- **Vendor Tier Frequencies:** A-vendors weekly, B bi-weekly, C monthly.

### Promotional Planning

- **Signal Distortion:** Strip promo volume from history before fitting baseline. Keep separate multiplicative lift layer.
- **Lift Estimation:** (1) YoY promoted vs non-promoted. (2) Cross-elasticity (depth, display, media). (3) Analog lift. Typical: TPR-only 15–40%, TPR+display+circular 80–200%, doorbuster 300–500%+.
- **Cannibalization:** 10–30% of lifted volume for close substitutes. Ignore cross-category unless traffic driver.
- **Forward-Buy:** Deep promos on long-shelf-life items create 2–4 week dips. Perishables ~no dip.
- **Post-Promo Dip:** 1–3 weeks below baseline, 30–50% of incremental lift, concentrated week 1. Missing it → excess + markdowns.

### ABC/XYZ Classification

- **ABC (Value, on margin not revenue):** A = top 20% SKUs → 80% margin. B = next 30% → 15%. C = bottom 50% → 5%.
- **XYZ (Predictability, de-seasonalized/de-promoted CV):** X < 0.5, Y 0.5–1.0, Z > 1.0.
- **Policy Matrix:** AX = automated + tight SS. AZ = human review every cycle. CX = automated + generous review. CZ = discontinue/make-to-order candidates.

### Seasonal Transition Management

- **Buy Timing:** Commit 12–20 weeks ahead. 60–70% initial buy, 30–40% open-to-buy reserve on early sell-through.
- **Markdown Timing:** Below 60% of plan at season midpoint → start. Early shallow (20–30%) recovers more than late deep (50–70%). Each week of delay costs 3–5pp margin.
- **Liquidation:** Hard cutoff 2–3 weeks before next season's product. Outlet/liquidator/donation. Don't hold seasonal into next year.

## Decision Frameworks

### Forecast Method Selection

| Demand Pattern | Primary Method | Fallback | Review Trigger |
|---|---|---|---|
| Stable, high-volume | Weighted MA (4–8wk) | SES | WMAPE > 25% 4wk |
| Trending | Holt's double ES | Linear regression 26wk | Tracking signal ±4 |
| Seasonal | Holt-Winters (mult/add) | STL + SES residual | Season correlation < 0.7 |
| Intermittent (>30% zeros) | Croston / SBA | Bootstrap intervals | Interval shift > 30% |
| Promotion-driven | Causal regression (baseline + lift) | Analog lift + baseline | Post-promo miss > 40% |
| New product (0–12wk) | Analog profile + lifecycle curve | Category avg decay to actual | Own-data WMAPE < analog WMAPE |
| Event-driven | Regression + regressors | Manual override documented | Correlation < 0.6 or error >30% ×2 events |

### Safety Stock Service Levels

| Segment | SL | Z | Rationale |
|---|---|---|---|
| AX | 97.5% | 1.96 | Value justifies; low variability keeps SS moderate |
| AY | 95% | 1.65 | Standard; higher SL too expensive |
| AZ | 92–95% | 1.41–1.65 | Erratic → high SL astronomical; add expediting |
| BX/BY | 95% | 1.65 | Standard |
| BZ | 90% | 1.28 | Accept some stockout risk |
| CX/CY | 90–92% | 1.28–1.41 | Low value, low investment |
| CZ | 85% | 1.04 | Discontinue candidate; minimal investment |

### Promotional Lift Decision

1. Own-item history? → recency-weighted lift (50/30/20 last 3 promos).
2. Same category promoted? → analog lift adjusted for price/brand tier.
3. New category/type? → category-average −20% + wider SS buffer.
4. Cross-category? → traffic driver separate; default halo 0.15.
5. Always model post-promo dip: 40% of lift, 60/30/10 across 3 weeks.

### Markdown Timing

| Sell-Through at Midpoint | Action | Margin Recovery |
|---|---|---|
| ≥ 80% | Hold; reorder if WOS < 3 | Full |
| 60–79% | 20–25% markdown, no reorder | 70–80% |
| 40–59% | 30–40% now, cancel open POs | 50–65% |
| < 40% | 50%+, liquidation, post-mortem | 30–45% |

### Slow-Mover Kill (quarterly, ALL must be true)

WOS > 26 at current rate; last-13wk velocity < 50% of first-13wk; no promo in 8wk; no contractual obligation; substitute exists. → 30% off 4wk → 50%/liquidation → hard exit 8wk from first markdown.

## Key Edge Cases

1. **Zero-history launch:** Analog match on price/category/brand/demo (not just type). 60% initial buy + weekly auto-replenish triggers.
2. **Viral spike (500–2,000%):** Don't chase (4–8wk LTs). Allocate existing stock, anti-hoarding rules, revise baseline only if sustained 4+ weeks.
3. **LT doubling overnight:** Recalc SS immediately, emergency delta order, partial shipments, secondary suppliers, warn merchandising on service dip.
4. **Unplanned cannibalization:** Monitor daily POS for pattern breaks, manual override down, defer inbound if possible.
5. **Regime change:** Tracking signal ±4 two periods → re-select model (reformulation, packaging, competitor moves fail old models silently).
6. **Phantom inventory:** Service drops despite "adequate" on-hand → cycle count anything with impossible stockouts.
7. **MOQ conflicts:** EOQ 150 vs MOQ 500 → consolidate vendor dollars, negotiate MOQ, or accept overage if cheaper than alternative.
8. **Holiday shifts:** Easter Mar↔Apr breaks WoW comps → align to "weeks relative to holiday".

## Communication Patterns

- **Vendor reorder:** Transactional. "PO #XXXX for delivery week MM/DD per agreed schedule."
- **LT escalation:** Firm + quantified. "LT 14→22 days over 8 weeks, X stockouts. Corrective plan by [date]."
- **Stockout alert:** Customer impact first + revenue at risk + recommended action (expedite/reallocate/substitute).
- **Markdown to merch:** Margin-impact framed ("pace requires action to meet targets"), never "we overbought".
- **Promo forecast:** Baseline + lift + dip separately, assumptions + confidence ("Baseline 500/wk, lift 180%, dip −35% 2wk, ±25%").
- **New product assumptions:** Document everything for post-mortem audit.

## Escalation Protocols

| Trigger | Action | Timeline |
|---|---|---|
| A-item stockout projected <7d | Alert planning manager + merchant | 4 hours |
| Vendor LT increase >25% | Notify SC director; recalc open POs | 1 business day |
| Promo miss >40% | Post-promo debrief + vendor | 1 week post-promo |
| Excess >26 WOS on A/B | Markdown recommendation to VP | 1 week |
| Bias >±10% 4wk | Model review + re-parameterize | 2 weeks |
| New product <40% plan at 4wk | Assortment review | 1 week |
| Category SL <90% | RCA + corrective plan | 48 hours |

**Chain:** Planner → Manager (24h) → Director (48h) → VP (72h+ or enterprise A-item stockout)

## Performance Indicators

| Metric | Target | Red Flag |
|---|---|---|
| WMAPE | < 25% | > 35% |
| Forecast bias | ±5% | > ±10% 4+wk |
| In-stock (A-items) | > 97% | < 94% |
| In-stock (all) | > 95% | < 92% |
| Weeks of supply | 4–8 | > 12 or < 3 |
| Excess (>26 WOS) | < 5% SKUs | > 10% |
| Dead stock (0 sales 13+wk) | < 2% | > 5% |
| Vendor PO fill rate | > 95% | < 90% |
| Promo WMAPE | < 35% | > 50% |
