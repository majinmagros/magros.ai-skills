# Express / Fastify / Next.js patterns

Baseado no vídeo Pavan Adhav `0ZSFOAyb5Og / -Pz6rEVuw9Q / zPDh4OSuBTU` + validação oficial `/stripe/stripe-node` + `/stripe/stripe-cli`.

## Validação Oficial (2026-09-01)

| Claim | Status | Fonte |
|---|---|---|
| `stripe.webhooks.constructEvent(payload, header, secret)` verifica assinatura com `stripe-signature` + raw body | ✅ | `/stripe/stripe-node` → `Webhooks.ts:verifyHeader` + `examples/webhook-signing/express/main.ts` |
| `express.raw({type:'application/json'})` obrigatório no endpoint `/webhook` (não usar `express.json()` antes) | ✅ | `examples/webhook-signing/express/main.ts` — middleware condicional `if (req.originalUrl==='/webhook') next()` |
| `generateTestHeaderString` para testes unitários | ✅ | `test/Webhook.spec.ts` + `examples/webhook-signing/test/main.ts` |
| Stripe CLI `stripe listen --forward-to localhost:3000/webhook` para dev sem ngrok | ✅ | `/stripe/stripe-cli` |

## Pipeline (4 passos)

```
Stripe Event → [1. Raw Body + Header] → [2. constructEvent] → [3. Idempotency Check] → [4. Handler por event.type] → 200 {received:true}
                                    ↓ falha
                              400 Webhook Error (não re-tentar)
```

## Servidor Express (padrão validado)

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

  // Idempotency: event.id já processado? (ver idempotency-postgres.md)
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

## Variantes

- **Fastify:** `fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, ...)` + `request.rawBody`
- **Next.js Route Handler:** `export async function POST(req: Request) { const buf=await req.arrayBuffer(); const sig=req.headers.get('stripe-signature')!; stripe.webhooks.constructEvent(Buffer.from(buf), sig, secret) }`
- **Edge (Vercel):** desative `bodyParser` (`export const config={api:{bodyParser:false}}` para Pages Router).

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
