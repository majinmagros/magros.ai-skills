---
name: prospeccao-maps-freelance
description: "Use when prospecting local businesses for freelance web work via Maps search: find listings with no site or weak mobile presence, run automated audits, and send proposals. Triggers on \"maps prospecting\", \"freelance clients\", \"local business audit\", \"sell websites\". Non-triggers: outbound via social or email lists only (use lead-intelligence). Outcome: a ranked prospect list with audit evidence plus proposal and deploy plan."
metadata:
  origin: ECC
---

# Prospeccao Maps Freelance

Find local businesses with weak web presence, prove it with an automated
audit, and pitch a fixed-price landing page plus care plan. Built for
beginners selling simple sites, not agencies.

## When To Activate

- The user says find freelance clients, prospect local businesses, audit
  sites, or sell landing pages.
- The channel is Maps search (niche + neighborhood), not social scraping.
- The offer is a simple fast site plus optional recurring care.
- The stack is HTML/CSS/JS or a light framework with cheap hosting.

## Workflow

1. Pick one niche and one area (for example dentist + district). One
   niche per run keeps the pitch and portfolio relevant.
2. Collect listings: search Maps for the niche, page through results, and
   record name, category, rating count, phone, and site link if present.
3. Flag weak presence: no site, broken site, slow load, broken mobile
   layout, or no WhatsApp contact path. Only flagged listings advance.
4. Run the audit: check SEO basics (title, meta, headings), performance
   (load time, image weight), mobile (viewport, tap targets, overflow),
   and contact path (click-to-chat, form, phone link). Save evidence per
   item with a screenshot.
5. Score and rank: score each prospect 0-100 on impact (visibility gap)
   times ease (simple business, single decision maker). Work top-down.
6. Build the pitch: one page per prospect with 3 findings, 3 screenshots,
   the proposed fix, price, and deadline. Keep it to one screen.
7. Price and close: fixed landing price in a public band (see pricing
   note), plus optional monthly care (updates, backup, small changes).
   Ask for a yes/no on one package, not an open negotiation.
8. Deliver and reuse: deploy, measure before/after, and file the result
   under the same niche as portfolio for the next run.

## Pricing Note

- Landing-page bands and recurring care figures from the source video
  (low hundreds to low thousands plus monthly care) are author
  measurement from one market at one time, not a rate card. Set your own
  band from local costs before quoting.

## Deploy Rule

- Default to a free-tier static host for simple landings; use shared
  hosting plus a registered domain only when the client needs email, CMS,
  or server-side features. Record host, domain, and renewal dates.

## Anti-Patterns

- Pitching without audit evidence -> generic spam.
- Mixing niches in one run -> weak portfolio reuse.
- Promising rankings or lead counts you cannot control.
- Selling a stack you cannot debug when it breaks.
- No contract, no 50 percent upfront, no renewal dates.
- Scraping at abusive speed or ignoring Maps API terms.

## Relations

- `lead-intelligence`: social and list-based prospecting without Maps.
- `data-scraper-agent`: scheduled collection and enrichment patterns.
- `seo`: audit checklist for titles, metadata, and structure.
- `deployment-patterns`: hosting, domain, and deploy options.

## Sources

- Google Maps Places API docs: https://developers.google.com/maps/documentation/places/web-service
- Vercel docs (static deploy): https://vercel.com/docs
- Google SEO starter guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Niche workflow, price bands, and Maps prospecting claims from the
  source video are author measurement, not verified benchmarks.
