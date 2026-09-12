---
name: scientific-db-uspto-database
description: "Use when uSPTO patent and trademark data workflow for official record lookup, PatentSearch queries, TSDR checks, assignment data, and reproducible IP research logs. Triggers on \"scientific-db-uspto-database\", \"scientific db uspto database\", \"database\"."
metadata:
  origin: community
---

# USPTO Database

Use this skill when a task needs official United States patent or trademark
records from USPTO systems.

## When to Use

- Searching granted patents or pre-grant publications.
- Checking patent application status, file-wrapper data, assignments, or
  public prosecution history.
- Looking up trademark status, documents, or assignment history.
- Building reproducible prior-art, portfolio, or IP landscape research logs.
- Comparing USPTO records with secondary tools such as Google Patents,
  Lens.org, Semantic Scholar, or company patent pages.

Do not use this skill to give legal advice. Treat it as a data-gathering and
record-verification workflow.

## Source Selection

Prefer official USPTO or USPTO-supported surfaces first:

- Open Data Portal (ODP): current home for migrated USPTO datasets and APIs.
- Patent File Wrapper: public patent application bibliographic data and file
  wrapper records.
- PatentSearch API: PatentsView search API for granted patents and pre-grant
  publication datasets.
- TSDR Data API: trademark status and document retrieval.
- Patent and Trademark Assignment Search: ownership transfer records.
- PTAB data in ODP: Patent Trial and Appeal Board proceedings.

Use secondary sources only as convenience indexes. When the answer matters,
cross-check the official record.

## Authentication and Secrets

Many USPTO API flows require an API key. Store keys in environment variables or
a secret manager, never in committed files or pasted transcripts.

Common environment names:

```bash
export USPTO_API_KEY="..."
export PATENTSVIEW_API_KEY="..."
```

For PatentSearch, send the key with the `X-Api-Key` header. For TSDR, follow
the current USPTO API Manager instructions and rate-limit guidance.

## PatentSearch Workflow

Use PatentSearch for broad patent and pre-grant publication search when the
question is about trends, inventors, assignees, classifications, dates, or
portfolio slices.

Workflow:

1. Identify the endpoint from the current PatentSearch reference or Swagger UI.