const need=['STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET'];
const miss=need.filter(k=>!process.env[k]); if(miss.length){console.error('Missing',miss.join(','));process.exit(1);} console.log('ok',need.join(','));
