---
name: ito-trade-planner
description: "Use when build a non-advisory prediction-market trade planning worksheet for Itô or venue workflows. Use to inspect venues, underliers, constraints, order prerequisites, and manual execution steps without placing trades or recommending positions. Triggers on \"ito-trade-planner\", \"ito trade planner\", \"planner\"."
metadata:
  origin: ECC
---

# Itô Trade Planner

Use this skill when a user wants a structured worksheet for a prediction-market
idea, basket adjustment, venue comparison, or manual execution plan.

The skill is intentionally non-executing. It produces indicative, non-executable
checklists and parameter tables the user can review manually.

## Guardrails

- Do not say a trade is good, bad, optimal, or recommended.
- Do not provide investment advice or position sizing advice.
- Do not place, cancel, route, or sign orders.
- Do not request private keys, seed phrases, exchange passwords, or wallet
  credentials.
- Require a separate workflow and explicit user approval before moving from
  research to execution-capable tooling. This approval does not authorize this
  skill to execute anything.
- If execution is requested, stop after the worksheet without invoking, calling,
  or opening an execution-capable tool or venue.

## Read-Only API And Authentication Boundary

The canonical developer surface is `https://itomarkets.com/api/v1`. Use only
authenticated `GET` endpoints requiring `baskets:read` or `markets:read`, either
with HTTPS and `Authorization: Bearer $ITO_API_KEY` or the official
`ito-markets` Python SDK. Trading is not part of this API.

On first use, check for an already configured key with exactly `baskets:read` and
`markets:read` without printing it. Least-privilege public keys use the `bkt_*`
form and are operator-issued; the dashboard's **Settings -> Keys & credentials**
flow issues a broader `ito_*` automation key. Do not create or rotate that broader
key merely to unblock this skill. If a scoped key is unavailable, report the
read-only API route as blocked and continue with clearly labeled public or user-
supplied inputs. Key issuance creates persistent access and needs confirmation in
the controlling harness. After the user or operator stores the one-time value
securely, return control to the originating agent and run one minimal
`GET /baskets` auth probe. This API does not use device authorization or device
login; do not invent a verification-code handoff.

The `ecc ito` bridge is a separate compute-procurement surface. Do not use
`ecc ito login`, `ecc ito find`, or its MCP tools for prediction-market data or
trade planning. Never print, log, persist, or place `ITO_API_KEY` in arguments,
reports, screenshots, tracked files, or chat. Retrieve only the minimum field at
runtime and keep it in process memory.

Mark API observations indicative. Use `GET /baskets`,
`GET /baskets/{basket_id}`, `GET /baskets/{basket_id}/price`,
`GET /baskets/{basket_id}/underlyers`, `GET /markets/search`, and
`GET /markets/{market_id}` as needed. Do not use write or backtest submission
endpoints for a trade-planning worksheet.

## Planning Workflow

1. Restate the user's idea as a neutral hypothesis.
2. Identify markets, venues, underliers, resolution rules, fees, and data
   freshness constraints.
3. If the user requested live Itô data, make the smallest authenticated read and