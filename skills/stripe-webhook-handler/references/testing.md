# Testing with generateTestHeaderString

## Unitário sem rede

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

## E2E real (HTTP)

```ts
// conforme examples/webhook-signing/test/main.ts
const sig = stripe.webhooks.generateTestHeaderString({ payload: rawBody.toString(), secret });
await fetch('http://localhost:3000/webhook', {
  method: 'POST',
  headers: { 'Stripe-Signature': sig, 'Content-Type': 'application/json' },
  body: rawBody,
});
```

## Checklist de Produção (antes de ir live)

- [ ] `STRIPE_WEBHOOK_SECRET` vem de secrets manager (não hardcoded)
- [ ] Endpoint responde < 3s com 2xx antes de trabalho pesado (ou use fila/worker)
- [ ] `event.id` com UNIQUE constraint
- [ ] Logs com `event.id`, `event.type`, `livemode`
- [ ] Dashboard Stripe: endpoint em modo `live` apontando para domínio canônico (não ngrok)
- [ ] `tolerance` não alterado sem justificativa
- [ ] TLS válido (Let's Encrypt) — Stripe rejeita http
- [ ] Monitoramento de 4xx (assinatura inválida = secret errado ou body parse errado)

## Scripts

- `scripts/scaffold-webhook.ts` — gera `src/webhook/handler.ts` + teste
- `scripts/verify-env.ts` — checa `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
