# Transactions and Connection Pools

## Transactions

Keep transactions short and lock rows in a consistent order:

```sql
START TRANSACTION;

SELECT id, balance
FROM accounts
WHERE id IN (?, ?)
ORDER BY id
FOR UPDATE;

UPDATE accounts SET balance = balance - ? WHERE id = ?;
UPDATE accounts SET balance = balance + ? WHERE id = ?;

COMMIT;
```

Deadlock and lock-wait checklist:

- Lock rows in a deterministic order across code paths.
- Do external API calls before opening the transaction, not inside it.
- Add indexes for predicates used in `UPDATE`, `DELETE`, and locking reads.
- On deadlock, roll back and retry the whole transaction with a bounded retry
  budget.
- Capture `SHOW ENGINE INNODB STATUS\G` soon after a deadlock; it is overwritten
  by later events.

Queue-style worker claim:

```sql
START TRANSACTION;

SELECT id
FROM jobs
WHERE status = 'pending'
ORDER BY created_at
LIMIT 1
FOR UPDATE SKIP LOCKED;

UPDATE jobs
SET status = 'processing', started_at = CURRENT_TIMESTAMP
WHERE id = ?;

COMMIT;
```

Use `SKIP LOCKED` only for queue-like workloads where skipping a locked row is
acceptable. It is not a replacement for normal transactional consistency.

## Connection Pools

SQLAlchemy example:

```python
from sqlalchemy import create_engine

engine = create_engine(
    "mysql+mysqlconnector://app:secret@db.internal/app",
    pool_size=10,
    max_overflow=5,
    pool_timeout=30,
    pool_recycle=240,
    pool_pre_ping=True,
    connect_args={"connect_timeout": 5},
)
```

Node.js `mysql2` example:

```javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 30000,
});

const [rows] = await pool.execute(
  'SELECT id, total FROM orders WHERE account_id = ? LIMIT 50',
  [accountId],
);
```

Keep application pool recycling below the server `wait_timeout`. If the server
uses `wait_timeout = 300`, a `pool_recycle` around 240 seconds is coherent;
`pool_pre_ping` still helps recover from network and failover events.
