---
name: stripe-webhook-handler
description: Use when integrating Stripe webhooks — payment_intent, charge, customer events, signature verification (stripe-signature), raw body, idempotency, replay protection, ngrok tunnelling, Stripe CLI. Covers Express/Fastify/Next.js pattern. Triggers on "stripe webhook", "stripe signature", "webhook secret", "payment_intent succeeded", "stripe ngrok", "constructEvent", "handle Stripe event".
metadata:
  origin: ECC
  module: operator-workflows
  cost: medium
  stability: stable
  defaultInstall: false
---

# Skill: stripe-webhook-handler — Stripe Webhook com Verificação e Idempotência

Baseado no vídeo Pavan Adhav `0ZSFOAyb5Og / -Pz6rEVuw9Q / zPDh4OSuBTU` + validação oficial `/stripe/stripe-node` + `/stripe/stripe-cli`.

## Validação Oficial (2026-09-01)

| Claim | Status | Fonte |
|---|---|---|
| `stripe.webhooks.constructEvent(payload, header, secret)` verifica assinatura com `stripe-signature` + raw body | ✅ | `/stripe/stripe-node` → `Webhooks.ts:verifyHeader` + `examples/webhook-signing/express/main.ts` |
| `express.raw({type:'application/json'})` obrigatório no endpoint `/webhook` (não usar `express.json()` antes) | ✅ | `examples/webhook-signing/express/main.ts` — middleware condicional `if (req.originalUrl==='/webhook') next()` |
| `generateTestHeaderString` para testes unitários | ✅ | `test/Webhook.spec.ts` + `examples/webhook-signing/test/main.ts` |
| Stripe CLI `stripe listen --forward-to localhost:3000/webhook` para dev sem ngrok | ✅ | `/stripe/stripe-cli` |

---

## Quando usar

- Integrar Stripe PaymentIntent/Charge/Customer/Subscription via webhook
- Precisa verificar assinatura (`stripe-signature`) e rejeitar spoof
- Evitar processamento duplicado (idempotency + replay)
- Dev local sem IP público (ngrok ou `stripe listen`)
- Next.js Route Handler / Fastify plugin / Express

---

## Regras de Ouro (não quebrar)

1. **Raw body obrigatório** — `express.json()` consome o body e quebra a assinatura. Use `express.raw({type:'application/json'})` *só* no `/webhook`.
2. **Header: `stripe-signature`** — nunca `authorization`. `const sig = req.headers['stripe-signature']`
3. **Tolerance padrão 300s** — `constructEvent(..., tolerance=300)`. Não aumente sem motivo.
4. **Responda 2xx rápido** — reconheça (`{received:true}`) antes de processar pesado (fila/worker). Stripe re-tenta em 5xx/timeout.
5. **Idempotência** — trate `event.id` como chave única (`UNIQUE` no DB). Webhooks podem chegar duplicados.
6. **Replay protection** — `verifyHeader` já checa `t:timestamp` vs `tolerance`. Não desative.

---

## Pipeline (4 passos)

```
Stripe Event → [1. Raw Body + Header] → [2. constructEvent] → [3. Idempotency Check] → [4. Handler por event.type] → 200 {received:true}
                                    ↓ falha
                              400 Webhook Error (não re-tentar)
```

---

## 1. Servidor Express (padrão validado)

```ts
// server.ts — padrão oficial /stripe/stripe-node examples/webhook-signing/express
import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const app = express();

// JSON para todas as rotas EXCETO /webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') return next();
  express.json()(req, res, next);
});

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Idempotency: event.id já processado? (ver seção 3)
  // ...

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log(`💰 PI ${pi.id} ${pi.amount_received} ${pi.currency}`);
      // TODO: fulfillOrder(pi)
      break;
    }
    case 'charge.succeeded': {
      const ch = event.data.object as Stripe.Charge;
      console.log(`💵 Charge ${ch.id}`);
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      // assinatura
      break;
    default:
      console.warn(`Unhandled ${event.type}`);
  }

  res.json({ received: true });
});

app.listen(3000);
```

**Variantes:**

- **Fastify:** `fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, ...)` + `request.rawBody`
- **Next.js Route Handler:** `export async function POST(req: Request) { const buf=await req.arrayBuffer(); const sig=req.headers.get('stripe-signature')!; stripe.webhooks.constructEvent(Buffer.from(buf), sig, secret) }`
- **Edge (Vercel):** desative `bodyParser` (`export const config={api:{bodyParser:false}}` para Pages Router).

Ver `references/express-fastify-next.md` para snippets completos.

---

## 2. Idempotência + Replay (Postgres exemplo)

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

---

## 3. Dev Local — 2 opções

### A) Stripe CLI (recomendado, sem ngrok)

```bash
stripe login
stripe listen --forward-to localhost:3000/webhook
# Copie o whsec_... que aparece e ponha em STRIPE_WEBHOOK_SECRET
stripe trigger payment_intent.succeeded
# Logs em tempo real: no mesmo terminal
stripe events list --limit 3
```

Vantagem: não precisa conta ngrok, assinatura já é do listening session, funciona offline-replay.

### B) ngrok (quando precisa URL pública)

```bash
ngrok http 3000
# Forwarding https://abc123.ngrok-free.app -> http://localhost:3000
# Stripe Dashboard → Developers → Webhooks → Add endpoint → https://abc123.ngrok-free.app/webhook
# Copie Signing secret whsec_...
stripe trigger payment_intent.succeeded  # ainda funciona
```

Ver `references/local-dev.md`.

---

## 4. Testes (unitário sem rede)

```ts
// webhook.test.ts
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_...');

const payload = JSON.stringify({ id: 'evt_test', object: 'event' });
const secret = 'whsec_test';

const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
const event = stripe.webhooks.constructEvent(payload, header, secret);
// expect(event.id) === 'evt_test'

// Teste negativo: secret errado deve lançar
expect(() => stripe.webhooks.constructEvent(payload, header, 'whsec_wrong')).toThrow();
```

Para teste E2E real (HTTP):

```ts
// conforme examples/webhook-signing/test/main.ts
const sig = stripe.webhooks.generateTestHeaderString({ payload: rawBody.toString(), secret });
await fetch('http://localhost:3000/webhook', {
  method: 'POST',
  headers: { 'Stripe-Signature': sig, 'Content-Type': 'application/json' },
  body: rawBody,
});
```

---

## Eventos mais usados (subset)

| event.type | Quando |
|---|---|
| `payment_intent.succeeded` | Pagamento capturado |
| `payment_intent.payment_failed` | Falhou |
| `charge.succeeded` / `charge.failed` / `charge.refunded` | Charge |
| `checkout.session.completed` | Checkout |
| `customer.created/updated/deleted` | Cliente |
| `customer.subscription.*` | Assinatura |
| `invoice.paid / invoice.payment_failed` | Fatura |

Sempre faça `switch` com `default: warn` + log, para detectar novos tipos sem quebrar.

---

## Checklist de Produção (antes de ir live)

- [ ] `STRIPE_WEBHOOK_SECRET` vem de secrets manager (não hardcoded)
- [ ] Endpoint responde < 3s com 2xx antes de trabalho pesado (ou use fila/worker)
- [ ] `event.id` com UNIQUE constraint
- [ ] Logs com `event.id`, `event.type`, `livemode`
- [ ] Dashboard Stripe: endpoint em modo `live` apontando para domínio canônico (não ngrok)
- [ ] `tolerance` não alterado sem justificativa
- [ ] TLS válido (Let's Encrypt) — Stripe rejeita http
- [ ] Monitoramento de 4xx (assinatura inválida = secret errado ou body parse errado)

---

## Referências

- `references/express-fastify-next.md` — snippets por framework
- `references/idempotency-postgres.md` — tabela + helper
- `references/local-dev.md` — Stripe CLI vs ngrok
- `references/testing.md` — generateTestHeaderString

## Scripts

- `scripts/scaffold-webhook.ts` — gera `src/webhook/handler.ts` + teste
- `scripts/verify-env.ts` — checa `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
