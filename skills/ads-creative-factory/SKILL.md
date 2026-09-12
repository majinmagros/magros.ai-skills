---
name: ads-creative-factory
description: "Use when producing ad creatives at volume: research angles, Ogilvy-style copy, Meta Ads Library checks, carousel builds, Meta publish with UTM, and HTML report. Triggers on \"ad creatives\", \"creative factory\", \"carousel ads\", \"publish meta ads\". Non-triggers: copy only with no production publish or report (use marketing-campaign). Outcome: a batch of published creatives with UTM plus a multi-ad HTML report."
metadata:
  origin: ECC
---

# Ads Creative Factory

Folders plus skills that close the loop: research -> copy -> creative ->
publish with UTM -> report. Copy alone is not the output; published ads
with tracking plus a report are.

## When To Activate

- The user says produce creatives, build carousels, publish to Meta, or
  run the full marketing process in folders.
- Output must include tracked publish (UTM) and a readable report.
- Angles must be grounded in SEO data and Ads Library research.
- Volume matters: batches of variants, not one-off posts.

## Workflow

1. Set up folders: one folder per stage (research, copy, creative,
   publish, report). Each folder has its own checklist and done rule.
2. Research: pull search demand for the offer, list competitor angles
   from the Meta Ads Library, and pick 3 angles to test.
3. Write copy: short Ogilvy-style variants per angle (headline, primary
   text, CTA). One promise per variant; cut the rest.
4. Build creatives: render statics and carousels from templates with a
   headless browser script. Fixed sizes, safe zones, and brand tokens.
5. Review gate: human picks keep, fix, or drop per creative. Only
   approved items advance to publish.
6. Publish with UTM: push approved creatives to Meta with campaign, ad
   set, and ad naming plus UTM on every link. Record IDs back to files.
7. Report: generate one HTML page with spend-to-date hooks, creative
   thumbnails, angles, UTM links, and status per ad.
8. Iterate: pause losers, vary winners (hook, image, CTA), and log the
   hypothesis per change for the next batch.

## Tracking Rule

- Every outbound link carries UTM (source, medium, campaign, content).
  No UTM = no publish. Pixel events are verified before spend scales.

## Anti-Patterns

- Copy with no publish and no report -> work that cannot be measured.
- Publishing without UTM -> unattributable traffic.
- Ripping competitor creatives instead of researching angles.
- One variant per angle -> no test, no learning.
- Skipping the human review gate before spend.
- Mixing naming conventions across batches.

## Relations

- `marketing-campaign`: copy and positioning; this skill adds production.
- `content-engine`: platform-native copy systems feeding the factory.
- `autopilot-content-factory`: autopilot posting after approval.
- `ads-operator`: account ops and hypothesis log for live campaigns.

## Sources

- Meta Ads Library (angle research): https://www.facebook.com/ads/library/
- Meta Marketing API (campaign structure): https://developers.facebook.com/docs/marketing-api/