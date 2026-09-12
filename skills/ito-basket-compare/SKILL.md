---
name: ito-basket-compare
description: "Use when comparing Ito prediction-market baskets against research, watchlists, or notes read-only. Triggers on \"ito-basket-compare\", \"ito basket compare\", \"compare\"."
metadata:
  origin: ECC
---

# Ito Basket Compare

Read-only gap analysis: basket vs user-supplied context, no advice or execution. Detalhes em `references/`.

## When to Activate

- Comparing a basket with research, watchlist, or thesis
- Running gap analysis: matches, conflicts, stale assumptions
- Checking basket underliers against user-provided context
- Validating provenance and freshness before discussion
- Producing a research-question checklist from comparison

## Core Principles

1. **Read-only always** — no advice, orders, RFQs, or state changes
2. **Explicit sources only** — pasted or user-selected; record provenance
3. **Public first** — anonymous bootstrap routes; keyed reads only for missing fields
4. **Deterministic match** — exact ID then exact text; never fuzzy as proof
5. **Fail blocked** — `AUTH_*`/`TIMEOUT`/`STALE` codes; never mock live data

## Example

```bash
curl "https://itomarkets.com/api/baskets/bootstrap?stream=1"
# Require 200 + contractVersion ito.public_basket_read.v1 + baskets[]
```

## References

- `references/boundaries-inputs.md` — non-negotiables, minimum inputs, provenance fields
- `references/product-sources.md` — anonymous routes, keyed API scopes, SDK, selection rule
- `references/auth-handoff.md` — validation-only auth, login handoff, resume protocol
- `references/normalization-output.md` — normalization, failure codes, Markdown/JSON contract

## Checklist

- [ ] No buy/sell/hold language; no `ecc ito find` executed
- [ ] Every input has source_type, URIs, timestamps, freshness
- [ ] Contract version verified; no credentials on public routes
- [ ] Matches/conflicts/missing/stale sorted and source-backed
- [ ] Ends with the exact informational disclaimer
