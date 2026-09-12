---
name: clickhouse-io
description: "Use when clickHouse database patterns, query optimization, analytics, and data engineering best practices for high-performance analytical workloads. Triggers on \"clickhouse-io\", \"clickhouse io\"."
metadata:
  origin: ECC
---

# ClickHouse Analytics Patterns

Column-oriented OLAP patterns: table design, query optimization, ingestion, materialized views, analytics queries. Detalhes em `references/`.

## When to Activate

- Designing ClickHouse table schemas (MergeTree engine selection)
- Writing analytical queries (aggregations, window functions, joins)
- Optimizing query performance (partition pruning, projections, materialized views)
- Ingesting large volumes of data (batch inserts, Kafka integration)
- Migrating from PostgreSQL/MySQL to ClickHouse for analytics
- Implementing real-time dashboards or time-series analytics

## Core Rules

Design tables for your query patterns, batch inserts, materialized views for real-time aggregations. Filter indexed columns first; batch, never loop single inserts.

```sql
CREATE TABLE markets_analytics (
    date Date, market_id String, volume UInt64
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, market_id);
```

## References

- `references/table-design.md` — MergeTree, ReplacingMergeTree, AggregatingMergeTree
- `references/query-optimization.md` — filtering, aggregations, quantile, window functions
- `references/ingestion.md` — bulk/streaming inserts, ETL, CDC from PostgreSQL
- `references/views-monitoring.md` — materialized views, slow-query log, table sizes
- `references/analytics-queries.md` — time series, retention, funnel, cohorts

## Checklist

- [ ] Partition by time (month/day); avoid partition explosion
- [ ] ORDER BY filtered columns first; high cardinality first
- [ ] Smallest types (`UInt32` vs `UInt64`); `LowCardinality` strings; `Enum` categoricals
- [ ] No `SELECT *`, no `FINAL`, denormalize instead of JOINs
- [ ] Batch inserts only — never single inserts in a loop
- [ ] Track slow-query log, disk usage, merge operations
