import fs from 'fs'; import path from 'path';
const out = process.argv[2] || 'src/webhook/handler.ts';
const content = `import express from 'express';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const secret = process.env.STRIPE_WEBHOOK_SECRET!;
export const webhookRouter = express.Router();
webhookRouter.post('/', express.raw({type:'application/json'}), (req,res)=>{
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(req.body, sig, secret); }
  catch(e:any){ return res.status(400).send(\`Webhook Error: \${e.message}\`); }
  res.json({received:true});
});
`;
fs.mkdirSync(path.dirname(out),{recursive:true}); fs.writeFileSync(out,content); console.log('wrote',out);
