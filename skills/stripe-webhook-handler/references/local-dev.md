# Local dev — Stripe CLI vs ngrok

## A) Stripe CLI (recomendado, sem ngrok)

```bash
stripe login
stripe listen --forward-to localhost:3000/webhook
# Copie o whsec_... que aparece e ponha em STRIPE_WEBHOOK_SECRET
stripe trigger payment_intent.succeeded
# Logs em tempo real: no mesmo terminal
stripe events list --limit 3
```

Vantagem: não precisa conta ngrok, assinatura já é do listening session, funciona offline-replay.

## B) ngrok (quando precisa URL pública)

```bash
ngrok http 3000
# Forwarding https://abc123.ngrok-free.app -> http://localhost:3000
# Stripe Dashboard → Developers → Webhooks → Add endpoint → https://abc123.ngrok-free.app/webhook
# Copie Signing secret whsec_...
stripe trigger payment_intent.succeeded  # ainda funciona
```
