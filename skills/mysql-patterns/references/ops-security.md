# Diagnostics, Replication, Security, Config and Anti-Patterns

## Diagnostics

Useful first-pass commands:

```sql
SHOW FULL PROCESSLIST;
SHOW ENGINE INNODB STATUS\G;
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';
```

Enable the slow log in a controlled environment:

```sql
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
SET GLOBAL log_queries_not_using_indexes = 'ON';
```

Use `EXPLAIN ANALYZE` only when it is safe to execute the query. It runs the
statement and can be expensive on production-sized data.

## Replication

Read replicas can lag. Do not route read-your-own-write paths, checkout flows,
permission checks, or idempotency-key reads to a replica immediately after a
write.

```sql
-- MySQL legacy terminology, still common in existing fleets
SHOW SLAVE STATUS\G;

-- Newer terminology where supported
SHOW REPLICA STATUS\G;
```

Check the engine/version before standardizing on one command. Monitor replica
SQL thread health, IO thread health, and lag, not just whether the TCP
connection is alive.

## Security

```sql
CREATE USER 'app'@'%' IDENTIFIED BY 'use-a-secret-manager';
GRANT SELECT, INSERT, UPDATE, DELETE ON appdb.* TO 'app'@'%';

ALTER USER 'app'@'%' REQUIRE SSL;

SELECT user, host
FROM mysql.user
WHERE user = '';

DROP USER IF EXISTS ''@'localhost';
DROP USER IF EXISTS ''@'%';
```

Security review points:

- Do not grant `ALL PRIVILEGES` or `*.*` to application users.
- Require TLS for application users when traffic crosses hosts or networks.
- Store credentials in the platform secret manager, not in examples, scripts, or
  repository files.
- Separate migration/admin users from runtime application users.
- Audit public network exposure and bind addresses before tuning performance.

## Configuration

Example starting point for a dedicated database host:

```ini
[mysqld]
innodb_buffer_pool_size = 4G
innodb_flush_log_at_trx_commit = 1
sync_binlog = 1

max_connections = 300
thread_cache_size = 50

wait_timeout = 300
interactive_timeout = 300
innodb_lock_wait_timeout = 10

slow_query_log = ON
long_query_time = 1
log_queries_not_using_indexes = ON

log_bin = mysql-bin
binlog_format = ROW
binlog_expire_logs_seconds = 604800
```

Treat configuration values as a prompt for review, not a universal preset. Size
memory, connections, log retention, and durability settings from workload,
hardware, backup policy, and recovery objectives.

## Anti-Patterns

| Anti-Pattern | Risk | Better Pattern |
| --- | --- | --- |
| `SELECT *` in hot paths | Over-fetching and brittle clients | Select explicit columns |
| Deep `OFFSET` pagination | Linear scans and slow pages | Keyset pagination |
| No index on foreign-key joins | Slow joins and lock-heavy deletes | Index FK columns intentionally |
| Long transactions | Lock waits and large undo history | Commit small units of work |
| Direct DML against `mysql.user` | Grant-table corruption risk | Use `CREATE USER`, `ALTER USER`, `DROP USER` |
| Application user with admin grants | High blast radius | Least-privilege runtime user |
| Pool recycle above `wait_timeout` | Stale pooled connections | Recycle below timeout and pre-ping |
| Replica reads after writes | Stale user-facing state | Pin read-after-write flows to primary |

## Output Expectations

When this skill is used for review, return:

1. Engine/version assumptions.
2. Highest-risk correctness, lock, security, and migration issues.
3. Exact SQL or code changes for the safe path.
4. Validation plan: `EXPLAIN`, migration dry run, lock/deadlock check, and
   rollback criteria.
5. Any MySQL/MariaDB syntax differences that affect the recommendation.

## Related

- Skill: `postgres-patterns` - PostgreSQL-specific schema and query patterns
- Skill: `database-migrations` - migration planning and rollout safety
- Skill: `backend-patterns` - API and service-layer patterns
- Skill: `security-review` - secret handling, auth, and least privilege
- Agent: `database-reviewer` - broader database review workflow
