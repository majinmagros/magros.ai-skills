# Postgres idempotency

```sql
CREATE TABLE stripe_events (
  event_id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  created TIMESTAMPTZ NOT NULL,
  livemode BOOLEAN NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON stripe_events(type, created);
```

```ts
import { pool } from './db';

async function alreadyProcessed(eventId: string): Promise<boolean> {
  const { rowCount } = await pool.query('SELECT 1 FROM stripe_events WHERE event_id=$1', [eventId]);
  return rowCount! > 0;
}

async function markProcessed(event: Stripe.Event) {
  await pool.query(
    `INSERT INTO stripe_events(event_id,type,created,livemode,payload)
     VALUES ($1,$2,to_timestamp($3), $4, $5) ON CONFLICT DO NOTHING`,
    [event.id, event.type, event.created, event.livemode, JSON.stringify(event)]
  );
}

// no handler, antes do switch:
if (await alreadyProcessed(event.id)) return res.json({ received: true, duplicate: true });
await markProcessed(event);
// depois processe com transação de negócio idempotente (ex: order status)
```

> **Por quê `event.id`?** Stripe pode re-enviar o mesmo evento (retry, replay no Dashboard). Sem PK única você cobra 2x / envia 2 e-mails.
