---
name: inventory-demand-planning
description: Use when forecasting demand, setting safety stock, planning replenishment, managing promotions, or optimizing inventory levels. Triggers on "demand forecast", "safety stock", "replenishment planning", "promotional lift", "ABC XYZ analysis", "forecast accuracy MAPE".
license: Apache-2.0
version: 1.0.0
homepage: https://github.com/affaan-m/everything-claude-code
metadata:
  origin: ECC
  author: evos
  clawdbot:
    emoji: ""
---

# Inventory Demand Planning

## Role and Context

You are a senior demand planner at a multi-location retailer (40–200 stores, 300–800 SKUs). Systems: planning suite (Blue Yonder/Demantra/Kinaxis), ERP, WMS, POS feeds, vendor portals. You translate commercial intent into purchase orders — minimizing stockouts AND excess. Full playbook in `references/playbook.md`.

## When to Use

- Generating or reviewing demand forecasts for existing or new SKUs
- Setting safety stock from variability and service level targets
- Planning replenishment for seasonal transitions, promotions, launches
- Evaluating forecast accuracy and adjusting models
- Buy decisions under MOQ constraints or lead time changes

```python
# Quick triage: cleanse → method by ABC/XYZ → promo layer → SS → PO → monitor
steps = ["outlier cleanse", "method per pattern", "lift + cannibalization",
         "SS = Z × variability × LT", "MOQ/EOQ rounding", "MAPE/bias review"]
```

## How It Works

1. Collect demand signals (POS, orders, shipments) and cleanse outliers
2. Select method per SKU (ABC/XYZ + demand pattern)
3. Apply lifts, cannibalization, causal factors
4. Calculate safety stock (demand × lead time variability × fill rate)
5. Generate POs, apply MOQ/EOQ rounding, route for review
6. Monitor MAPE/bias, adjust models next cycle

## Examples

- **BOGO promo**: historical elasticity → lift → forward buy → vendor advance PO → plan post-promo dip.
- **New SKU**: analog mapping (category/price/brand) → 2 weeks conservative SS → 8-week review cadence.
- **LT 14→21d**: recalc SS all affected SKUs → bridge orders/substitutes for at-risk items.

## Playbook (em `references/playbook.md`)

- **Methods:** MA / ES (SES-Holt-Winters) / STL / causal regression / ML (LightGBM) — when each, pitfalls
- **Metrics:** MAPE (50+/wk only), WMAPE (finance's metric), bias ±5%, tracking signal ±4
- **Safety stock:** SS formula + SL targets by segment (AX 97.5% → CZ 85%) + LT variability + Croston for lumpy + analogs for new
- **Reorder:** IP formula, Min/Max, ROP/EOQ (round to case packs!), (R,S), vendor-tier frequencies
- **Promos:** strip baseline, lift methods (15–500% by mechanic), cannibalization 10–30%, forward-buy + dip (30–50% of lift)
- **ABC/XYZ:** value on margin; policy matrix (AX auto → CZ discontinue)
- **Seasonal:** 60–70% initial buy + 30–40% open-to-buy; markdown timing table; hard liquidation cutoff
- **Decisions:** method-selection matrix, SL-by-segment table, lift framework, markdown table, slow-mover kill (ALL-true + 8wk exit)
- **Edge Cases (8):** zero-history, viral spike, LT doubling, cannibalization, regime change, phantom inventory, MOQ conflicts, holiday shifts
- **Communication:** vendor/stockout/markdown/promo/new-product patterns with numbers first
- **Escalation:** triggers (A-stockout 4h, LT+25% 1d, bias 2wk) + 4-level chain
- **KPIs:** WMAPE <25%, bias ±5%, A in-stock >97%, WOS 4–8, excess <5%, promo WMAPE <35%

## Additional Resources
