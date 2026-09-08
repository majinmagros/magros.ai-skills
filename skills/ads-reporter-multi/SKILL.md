---
name: ads-reporter-multi
description: "Use when reporting across multiple ad accounts: aggregate spend, CPA/ROAS, and frequency into one comparative HTML view with keyword-DM funnel events. Triggers on \"multi-ads report\", \"CPA ROAS report\", \"compare ad accounts\", \"keyword DM\". Non-triggers: day-to-day operation of a single account (use ads-operator). Outcome: a comparative multi-account HTML report with keyword-DM funnel events."
metadata:
  origin: ECC
---

# Ads Reporter Multi

One HTML report across many ad accounts: spend, CPA/ROAS, frequency, and
keyword-DM funnel events side by side. Read-only aggregation first; any
account change stays behind an approval gate.

## When To Activate

- The user says multi-ads report, compare accounts, CPA/ROAS overview, or
  keyword DM funnel.
- Data spans two or more accounts or clients.
- Output must be a shareable HTML page, not chat text.
- DM automation is keyword-triggered with UTM and pixel, not a paid chat
  tool.

## Workflow

1. Connect read-only: register each account with read scope, list
   campaigns, and confirm currency and timezone per account.
2. Pull metrics: for a fixed window, fetch spend, impressions, clicks,
   conversions, CPA/ROAS, and frequency per campaign.
3. Normalize: convert currencies when needed, align date windows, and
   flag thin data before comparing.
4. Add funnel events: join keyword-DM triggers (keyword -> DM sent ->
   click with UTM -> pixel event) to the matching campaign rows.
5. Render HTML: one comparative table plus per-account cards with
   thumbnails, top/worst rows, and frequency warnings.
6. Review deltas: mark movers (up/down vs prior window) and attach one
   hypothesis per mover. No silent numbers.
7. Approval gate: any proposed account change from the report needs human
   approval before execution; the report itself never mutates accounts.
8. Archive: save the HTML plus the raw pull per window for trend history.

## Keyword-DM Rule

- A comment or message containing the keyword triggers one DM with the
  tracked link (UTM). Dedupe by user, log opt-outs, and fire the pixel
  event on click. This replaces the paid chat tool with a scripted flow.

## Anti-Patterns

- Comparing accounts across different windows or currencies.
- Reporting CPA/ROAS on thin data with no flag.
- Letting the reporter mutate accounts directly.
- Keyword-DM with no dedupe, no opt-out, and no UTM.
- Chat-only summaries with no archived HTML.
- Frequency blindness: scaling spend while frequency burns the audience.

## Relations

- `ads-operator`: account audits and approved mutations.
- `dashboard-builder`: dashboard structure for operator questions.
- `data-throughput-accelerator`: fast multi-account pulls done right.
- `ads-creative-factory`: creative batches that feed this report.

## Sources

- Meta Marketing API (insights, campaigns): https://developers.facebook.com/docs/marketing-api/
- Google Ads API docs (account and reporting basics): https://developers.google.com/google-ads/api/docs/start
- Multi-account HTML layout and keyword-DM-as-ManyChat-replacement from
  the source video are author measurement, not verified benchmarks.
