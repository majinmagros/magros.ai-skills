---
name: site-clone-migration
description: "Use when cloning any existing website into a new stack with Claude Code: extract screenshots plus HTML/fonts/colors, download assets, rebuild section by section with parallel agents, and verify with visual diff. Triggers on \"clone website\", \"site clone\", \"wordpress migration\", \"restack site\". Non-triggers: designing a new site from scratch (use cloud-design-prototyping). Outcome: a Next/React plus Tailwind plus TS repo that matches the source layout section by section."
metadata:
  origin: ECC
---

# Site Clone Migration

Clone any site into a clean, owned stack: extract the source, rebuild it
section by section with parallel agents, verify with visual diff, and ship
a Next/React + Tailwind + TS repo. Includes a WordPress -> repo exit path.

## When To Activate

- The user says clone this site, copy this layout, restack, migrate from
  WordPress, or rebuild a page pixel by pixel.
- There is a live URL to reproduce plus a target stack (Next or React with
  Tailwind and TS).
- A visual check is required before calling the clone done.
- The source uses WordPress and the goal is a code repo instead.

## Non-Goals

- No brand-new design work; this reproduces an existing layout.
- No content scraping for republishing third-party copy or images without
  rights; get permission or replace assets first.

## Workflow

1. Capture the source: for each route, save full-page screenshots (desktop
   plus mobile), HTML, computed fonts, color tokens, and spacing scale.
   Record the URL, viewport, and date per capture.
2. Inventory assets: list images, fonts, icons, and videos. Download only
   licensed or replaceable files into a local vendor folder with a manifest
   (source URL -> local path -> license note).
3. Define sections: split the page into sections (header, hero, proof,
   pricing, FAQ, footer). One section = one work unit with its own
   acceptance screenshot.
4. Rebuild in parallel: assign one agent per section against the new stack
   (Next or React + Tailwind + TS). Shared tokens (colors, type, spacing)
   are frozen before agents start.
5. Visual diff: compare each rebuilt section against its source screenshot
   side by side. Log mismatches (layout, type, spacing, color) and fix in
   the section owner only.
6. Responsive pass: re-run the diff at mobile width. Fix overflow, tap
   targets, and type scale before merging sections.
7. WordPress exit (when needed): map posts, pages, and media to repo
   content files, redirect old slugs, and verify every migrated URL returns
   200 in the new app.
8. Ship gate: full-page diff plus link check plus build pass. No merge
   while any section diff is open.

## Section Acceptance

- Layout matches at desktop and mobile widths.
- Fonts, colors, and spacing use shared tokens, not hard-coded values.
- Images load from the local vendor folder, not hotlinked.
- Links and forms resolve; no dead routes.

## Anti-Patterns

- Copying third-party text, images, or fonts without rights.
- One giant agent rebuilding the whole page at once -> slow and blurry.
- Skipping the token freeze -> every section drifts to its own palette.