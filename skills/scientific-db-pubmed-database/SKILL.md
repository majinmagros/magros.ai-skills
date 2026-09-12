---
name: scientific-db-pubmed-database
description: "Use when direct PubMed and NCBI E-utilities search workflows for biomedical literature, MeSH queries, PMID lookup, citation retrieval, and API-backed literature monitoring. Triggers on \"scientific-db-pubmed-database\", \"scientific db pubmed database\", \"database\"."
metadata:
  origin: community
---

# PubMed Database

Use this skill when a task needs biomedical literature from PubMed rather than
general web search.

## When to Use

- Searching MEDLINE or life-sciences literature.
- Building PubMed queries with MeSH terms, field tags, dates, or article types.
- Looking up PMIDs, abstracts, publication metadata, or related citations.
- Running systematic-review search passes that need repeatable search strings.
- Using NCBI E-utilities directly from Python, shell, or another HTTP client.

## Query Construction

Start with the research question, split it into concepts, then combine concepts
with Boolean operators.

```text
concept_1 AND concept_2 AND filter
synonym_a OR synonym_b
NOT exclusion_term
```

Useful PubMed field tags:

- `[ti]`: title
- `[ab]`: abstract
- `[tiab]`: title or abstract
- `[au]`: author
- `[ta]`: journal title abbreviation
- `[mh]`: MeSH term
- `[majr]`: major MeSH topic
- `[pt]`: publication type
- `[dp]`: date of publication
- `[la]`: language

Examples:

```text
diabetes mellitus[mh] AND treatment[tiab] AND systematic review[pt] AND 2023:2026[dp]
(metformin[nm] OR insulin[nm]) AND diabetes mellitus, type 2[mh] AND randomized controlled trial[pt]
smith ja[au] AND cancer[tiab] AND 2026[dp] AND english[la]
```

## MeSH and Subheadings

Prefer MeSH when the concept has a stable controlled-vocabulary term. Combine
MeSH with title/abstract terms when the topic is new or terminology varies.

Correct subheading syntax puts the subheading before the field tag:

```text
diabetes mellitus, type 2/drug therapy[mh]
cardiovascular diseases/prevention & control[mh]
```

Use `[majr]` only when the topic must be central to the paper. It can improve