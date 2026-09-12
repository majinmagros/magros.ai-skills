---
name: scientific-thinking-literature-review
description: "Use when systematic literature-review workflow for academic, biomedical, technical, and scientific topics, including search planning, source screening, synthesis, citation checks, and evidence logging. Triggers on \"scientific-thinking-literature-review\", \"scientific thinking literature review\", \"review\"."
metadata:
  origin: community
---

# Literature Review

Use this skill when the task is to find, screen, synthesize, and cite a body of
academic or technical literature.

## When to Use

- Building a systematic, scoping, or narrative literature review.
- Synthesizing the state of the art for a research question.
- Finding gaps, contradictions, or future-work directions.
- Preparing citation-backed background sections for papers or reports.
- Comparing evidence across peer-reviewed papers, preprints, patents, and
  technical reports.

## Review Types

- **Narrative review**: broad synthesis; useful for orientation.
- **Scoping review**: maps concepts, methods, and evidence gaps.
- **Systematic review**: predefined protocol, reproducible search, explicit
  screening and exclusion.
- **Meta-analysis**: systematic review plus quantitative effect aggregation.

Ask the user which level of rigor is needed. If unspecified, default to a
scoping review for exploratory work and a systematic review for publication or
clinical claims.

## Workflow

### 1. Define the Question

Convert the prompt into a searchable research question.

For clinical or biomedical work, use PICO:

- Population
- Intervention or exposure
- Comparator
- Outcome

For technical work, use:

- system or domain
- method or intervention
- comparison baseline
- evaluation metric

### 2. Plan the Search

Create a search protocol before collecting sources:

- databases to search
- date range
- languages
- publication types
- inclusion criteria
- exclusion criteria
- exact search strings
