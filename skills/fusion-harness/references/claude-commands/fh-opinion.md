---
name: fh-opinion
description: Query all builder models + architect synthesis on a question
---
# /fh opinion

Query multiple models for their opinion on a technical question, with cost/latency tracking.

**Usage:**
```
/fh opinion <question>
/fh opinion --only-builders <question>
/fh opinion --builders Flux,Drift <question>
```

**Examples:**
```
/fh opinion "What's the best way to implement rate limiting in a distributed system?"
/fh opinion "Should we use Redis or PostgreSQL for session storage?"
/fh opinion --only-builders "Quick take: TypeScript vs Python for new microservice"
```

!`python3 .fusion-harness/scripts/fh-opinion.py $ARGUMENTS`