---
name: scientific-pkg-gget
description: "Use when gget CLI and Python workflow for quick genomic database queries, sequence lookup, BLAST-style searches, enrichment checks, and reproducible bioinformatics evidence logs. Triggers on \"scientific-pkg-gget\", \"scientific pkg gget\", \"gget\"."
metadata:
  origin: community
---

# gget

Use this skill when a task needs quick bioinformatics lookup across genomic
reference databases with the `gget` CLI or Python package.

## When to Use

- Finding Ensembl IDs, gene metadata, transcript details, or sequences.
- Running quick BLAST or BLAT lookups without building a full local pipeline.
- Fetching reference genome links and annotations from Ensembl.
- Querying protein structure, pathway, cancer, expression, or disease-association
  modules through a single interface.
- Creating a reproducible first-pass evidence log before moving to heavier
  tools such as Biopython, Snakemake, Nextflow, BLAST+, or database-specific
  clients.

Use a dedicated workflow instead of `gget` when the task requires regulated
clinical interpretation, high-throughput production pipelines, or fine-grained
control over database versions and local indexes.

## Installation

Use a clean Python environment.

```bash
python -m venv .venv
. .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install --upgrade gget
gget --help
```

If `uv` is available:

```bash
uv venv
. .venv/bin/activate
uv pip install gget
```

Before relying on an older environment, upgrade `gget` and re-check the module
docs. The upstream databases queried by `gget` change over time.

## Basic Patterns

CLI shape:

```bash
gget <module> [arguments] [options]
```

Python shape:

```python
import gget

result = gget.search(["BRCA1"], species="human")
print(result)