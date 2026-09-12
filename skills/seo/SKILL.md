---
name: seo
description: Audit, plan, and implement SEO improvements across technical SEO, on-page optimization, structured data, Core Web Vitals, and content strategy. Use when the user wants better search visibility, SEO remediation, schema markup, sitemap/robots work, or keyword mapping.
metadata:
  origin: ECC
---

# SEO

Improve search visibility through technical correctness, performance, and content relevance, not gimmicks.

## When to Use

Use this skill when:
- auditing crawlability, indexability, canonicals, or redirects
- improving title tags, meta descriptions, and heading structure
- adding or validating structured data
- improving Core Web Vitals
- doing keyword research and mapping keywords to URLs
- planning internal linking or sitemap / robots changes

## How It Works

### Principles

1. Fix technical blockers before content optimization.
2. One page should have one clear primary search intent.
3. Prefer long-term quality signals over manipulative patterns.
4. Mobile-first assumptions matter because indexing is mobile-first.
5. Recommendations should be page-specific and implementable.

### Technical SEO checklist

#### Crawlability

- `robots.txt` should allow important pages and block low-value surfaces
- no important page should be unintentionally `noindex`
- important pages should be reachable within a shallow click depth
- avoid redirect chains longer than two hops
- canonical tags should be self-consistent and non-looping

#### Indexability

- preferred URL format should be consistent
- multilingual pages need correct hreflang if used
- sitemaps should reflect the intended public surface
- no duplicate URLs should compete without canonical control

#### Performance

- LCP < 2.5s
- INP < 200ms
- CLS < 0.1
- common fixes: preload hero assets, reduce render-blocking work, reserve layout space, trim heavy JS

#### Structured data

- homepage: organization or business schema where appropriate
- editorial pages: `Article` / `BlogPosting`
- product pages: `Product` and `Offer`
- interior pages: `BreadcrumbList`
- Q&A sections: `FAQPage` only when the content truly matches

### On-page rules
