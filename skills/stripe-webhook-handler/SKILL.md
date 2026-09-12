---
name: stripe-webhook-handler
description: "Use when integrating Stripe webhooks — payment_intent, charge, customer events, signature verification (stripe-signature), raw body, idempotency, replay protection, ngrok tunnelling, Stripe CLI. Covers Express/Fastify/Next.js pattern. Triggers on \"stripe webhook\", \"stripe signature\", \"webhook secret\", \"payment_intent succeeded\", \"stripe ngrok\", \"constructEvent\", \"handle Stripe event\"."
metadata:
  origin: ECC
---

# Stripe Webhook Handler

Stripe webhooks with signature verification and idempotency for Express/Fastify/Next.js. Detalhes em `references/`.

## When to Activate

- Integrating Stripe PaymentIntent/Charge/Customer/Subscription via webhook
- Verifying `stripe-signature` and rejecting spoofed events
- Avoiding duplicate processing (idempotency + replay protection)
- Local dev without public IP (Stripe CLI or ngrok)
- Testing webhooks without network access

## Core Principles

1. **Raw body only on `/webhook`** — `express.json()` before it breaks the signature
2. **Verify `stripe-signature`** — tolerance 300s, never disable the replay check
3. **2xx fast** — acknowledge `{received:true}` first, heavy work in queue/worker
4. **Idempotency on `event.id`** — UNIQUE constraint; Stripe retries duplicates
5. **Secrets from manager** — never hardcode `STRIPE_WEBHOOK_SECRET`

## Example

```ts
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    // idempotency check on event.id, then switch (event.type) ...
    res.json({ received: true });
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

## References

- `references/express-fastify-next.md` — validation table, pipeline, server + variants, event table
- `references/idempotency-postgres.md` — table + alreadyProcessed/markProcessed helpers
- `references/local-dev.md` — Stripe CLI vs ngrok
- `references/testing.md` — generateTestHeaderString tests + production checklist + scripts

## Checklist

- [ ] `express.raw` only on `/webhook`, header is `stripe-signature`
- [ ] `event.id` UNIQUE; duplicate returns 2xx without reprocessing
- [ ] Responds 2xx < 3s; heavy work async
- [ ] Live endpoint on canonical HTTPS domain, `tolerance` untouched
- [ ] 4xx monitored (wrong secret or body parsed before verify)
