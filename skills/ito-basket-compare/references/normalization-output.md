# Normalization, Failure, Output Contract

## Deterministic Normalization

Same normalized input + same comparison time = same output.

1. Copy inputs; never mutate. NFKC + trim + collapse whitespace; case-fold only for matching. Preserve display text.
2. UTC RFC 3339 timestamps. Missing/unparseable `as_of` → `null`/`unknown`; never substitute now. Reject non-finite numbers and probabilities outside `[0,1]`. Do not infer weights.
3. Dedup exact normalized `underlier_id` only; on disagreement keep first after provenance ordering + add conflict. Sort underliers by `underlier_id`, then label; sources by `source_type`, `source_uri`, `as_of`, `retrieved_at` (`null` last).
4. Freshness: user threshold or 24h (market/basket) / 30d (notes/research). `as_of` vs comparison time: older = `stale`, within = `fresh`, absent = `unknown`. State the threshold.
5. Match exact stable ID first, then exact normalized claim/event text — never fuzzy as proof. `match` (same claim/direction, compatible horizon), `conflict` (opposing/incompatible/duplicate-ID inconsistency), `missing` (no target evidence), `stale` (relevant evidence outside threshold).
6. Keep mixed-source disagreement visible. Sort results by `underlier_id`, then evidence `source_uri`. Explicit `null` for unknown scalars, `[]` for no findings.

## Recovery and Safe Failure

- Bad fields: `INVALID_INPUT` (no sensitive echo).
- Missing/expired credentials for a concrete source: `AUTH_REQUIRED` (+ handoff); `AUTH_REVOKED` only on confirmed revocation; 403/scope = `AUTH_FORBIDDEN`, no retry/scope broadening. Generic 401 ≠ revocation.
- Timeout/network/5xx/malformed: `SOURCE_TIMEOUT`; one read-only retry if deadline permits; never swap in mock/stale as live.
- 429: honor valid `Retry-After` within deadline, else `SOURCE_TIMEOUT`. No infinite loops.
- Required stale data: `STALE_SOURCE` as blocked unless user explicitly accepts displayed timestamps (keep `stale` status).
- Unsupported CLI/tool or state change: `UNSUPPORTED_OPERATION`.
- Partial: `status: blocked`, source-backed arrays only, `incomplete: true`. Never present as complete.

## Output Contract

Markdown order: basket summary, target, provenance/freshness, matches, conflicts/stale, missing context, action checklist (research questions only). Structured JSON with stable key order, no extra keys:

```json
{
  "schema_version": "1.0",
  "status": "ok",
  "comparison_time": "2026-01-01T00:00:00Z",
  "basket": {"basket_id": "example", "label": "Example", "underliers": []},
  "target": {"label": "Research notes", "source_type": "user_provided"},
  "sources": [],
  "freshness_thresholds": {"market_hours": 24, "research_days": 30},
  "matches": [],
  "conflicts": [],
  "stale_assumptions": [],
  "missing_context": [],
  "checklist": [],
  "disclaimer": "This comparison is informational and not investment or trading advice."
}
```

Blocked output: same leading key order, `status: blocked`, `incomplete: true`, `error: {code, message, retryable}`, `resume: {originating_agent, completed_steps}`, disclaimer. Codes: `AUTH_REQUIRED`, `AUTH_REVOKED`, `AUTH_FORBIDDEN`, `SOURCE_TIMEOUT`, `STALE_SOURCE`, `INVALID_INPUT`, `UNSUPPORTED_OPERATION`.

Always end human-readable output with exactly:

```text
This comparison is informational and not investment or trading advice.
```
