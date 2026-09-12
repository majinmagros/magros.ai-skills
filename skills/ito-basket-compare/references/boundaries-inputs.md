# Boundaries and Inputs

Requests like "compare this basket with my research", "basket vs watchlist", "gap analysis", "find conflicts and stale assumptions". Read-only; never recommends or executes a trade.

## Non-Negotiable Boundaries

- Do not advise buy, sell, hold, hedge, lever, allocate, or size.
- Do not prepare or submit an order, trade, purchase, reservation, or RFQ.
- Do not run `ecc ito find`: despite its name, it submits an authenticated RFQ.
- Do not claim `ecc ito status` returns basket data; it reads RFQ/procurement status. Do not use `ecc ito evals` for comparison.
- Do not use private documents, financial context, memory, or account data unless the user explicitly identifies the source.
- Never print, echo, log, persist, or expose keys, tokens, or secrets — never in arguments, files, or chat.
- If an operation could change external state, stop with `UNSUPPORTED_OPERATION`. Later confirmation cannot turn this into an execution skill.

## Inputs and Provenance

Accept a pasted basket or an explicitly authorized read-only source. Minimum basket input: stable `basket_id` or label plus one or more underliers (`underlier_id`, label, event/claim, weight/probability). Request missing material instead of searching private stores broadly.

Record provenance for every input:

- `source_type`: `user_provided`, `public`, or `ito_authenticated`
- `source_uri`: non-secret URL/identifier, or `null` for pasted material
- `retrieved_at`: UTC RFC 3339 retrieval time
- `as_of`: source observation/publication time, or `null` when unknown
- `freshness_status`: `fresh`, `stale`, or `unknown`

Never label anonymous product data `ito_authenticated`; use `public`.
