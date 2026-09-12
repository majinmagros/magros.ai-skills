# Product-Data Sources

ECC's CLI/MCP exposes no basket-read command: CLI supports `login`, validation-only `auth`, `find`, `status`, `evals`; MCP exposes `ito_auth`, `ito_find`, `ito_status`. Authentication proves identity only, not basket-data availability. Prefer documented public routes; otherwise ask for paste/export or a documented keyed read with minimum scope.

## Anonymous Routes (No Key)

Rate-limited GET routes at `https://itomarkets.com`: `/api/baskets/bootstrap`, `/api/baskets/{basket_id}/bootstrap`, `/api/markets/hot`. Valid live reads without a private key.

Verified catalog source: `GET https://itomarkets.com/api/baskets/bootstrap?stream=1`. Detail: `GET https://itomarkets.com/api/baskets/{basket_id}/bootstrap?stream=1`. Require HTTP 200, `contractVersion: ito.public_basket_read.v1`, parseable `generated_at`. Catalog requires `baskets` array; detail requires `basket`, `underlyers`, `charts`, `metrics`, `commentary`. Record URL, response `Date`, `generated_at`, `Cache-Control`, `Age`, `Last-Modified`, `x-ito-edge-cache`. Edge `stale` marker = stale provenance. No credentials here, no cross-origin redirects, no silent contract-version changes.

## Keyed Developer API

At `https://itomarkets.com/api/v1`: public API key only as `Authorization: Bearer <key>` to that exact HTTPS origin. `GET /baskets`, `GET /baskets/{basket_id}` + GET-only children require `baskets:read`. `GET /markets/search`, `GET /markets/{market_id}` + GET-only children require `markets:read`. Never substitute write scopes, dashboard keys, cookies, or compute device credentials.

## Python SDK

Package `ito-markets`, imported as `ito`, for typed reads. Record installed version; verify method, response type, origin, scope. Do not install/upgrade without confirmation.

## Source Selection

Use anonymous routes when they supply basket, underliers, and quote fields. Use SDK/keyed API only for a documented field absent from public data. Validate the contract first; record endpoint, `Date`, observation timestamp, access mode, SDK version, cache headers.
