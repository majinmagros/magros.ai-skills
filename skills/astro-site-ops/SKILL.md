---
name: astro-site-ops
description: "Use when scaffolding or operating Astro content sites with components, Markdown collections, bulk publishing, Cloudflare deploy, and PageSpeed checks. Triggers on \"astro site\", \"astro deploy\", \"content collections\", \"cloudflare pages\", \"pagespeed\". Non-triggers: answer-engine citation tracking (use aeo-geo-visibility), generic deploy with no Astro involved (use deployment-patterns). Outcome: a shippable Astro site with typed collections, bulk posts, green build, and live Cloudflare URL."
metadata:
  origin: ECC
---

# Astro Site Ops

Scaffold and operate small Astro content sites: components over copy-paste
HTML, typed Markdown collections, bulk post publishing, and Cloudflare
deploy with a PageSpeed gate. Fixes the scale pain of pure-HTML sites
(duplication across pages) by migrating to components + collections.

## When To Activate

- The user says Astro, content collections, Astro + Cloudflare, or migrate
  HTML site to Astro.
- The task is a blog, docs set, or marketing site with repeated layouts.
- The task needs bulk publishing (many posts in one batch) plus deploy.
- A pure-HTML site is duplicating header, footer, or cards per page.

## Workflow

1. Scaffold: create the Astro project, set `src/pages`, `src/components`,
   `src/layouts`, and a base layout with header, footer, and meta slots.
2. Model content: define one collection per content type in
   `src/content.config.ts` with a strict schema (title, date, slug,
   description, tags). Reject untyped Markdown folders.
3. Migrate: convert each duplicated HTML page into a layout + component
   composition. No duplicated header/footer markup may remain.
4. Bulk publish: add posts as Markdown files matching the schema, run type
   check plus build, and fix every schema error before deploy. Throughput
   numbers such as posts-per-30-minutes are author measurement, not a
   benchmark - measure on your own machine.
5. Wire deploy: connect the repo to Cloudflare (build command
   `npm run build`, output directory `dist`), enable preview deploys for
   pull requests.
6. Gate on speed: run a local Lighthouse/PageSpeed pass on the top 3
   templates (home, post, listing). Fix blocking assets, oversized images,
   and render-blocking scripts until scores pass the agreed threshold.
7. Ship: merge, verify the production URL, and record build + speed numbers
   in the run log.

## Anti-Patterns

- Copy-paste HTML per page instead of components + layouts.
- Untyped Markdown folders with ad-hoc frontmatter keys.
- Deploying without a green local build and type check.
- Skipping the speed gate and shipping heavy images or fonts.
- Mixing SSR adapter config into a purely static site (or vice versa).

## Relations

- `seo`: classic SEO (meta, sitemap, robots) on top of the Astro output.
- `deployment-patterns`: generic build and deploy discipline behind step 5.
- `frontend-patterns`: component structure and UI conventions for step 3.
- `aeo-geo-visibility`: use after the site ships, to get cited by answers.

## Sources

- Astro content collections (schema, loaders, querying):
  https://docs.astro.build/en/guides/content-collections
- Deploy an Astro site to Cloudflare Pages (build command, output dir):
  https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- Astro Cloudflare deploy guide (adapter, SSR vs static):
  https://docs.astro.build/en/guides/deploy/cloudflare
- Bulk-publish throughput and PageSpeed anecdotes from video `YNsnYbAVrE0`
  are author measurement, not benchmarks - do not quote as facts.
