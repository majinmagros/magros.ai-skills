---
name: fh-debate
description: Multi-round structured debate between models on a thesis
---
# /fh debate

Structured multi-round debate between builder models on a controversial thesis.

**Usage:**
```
/fh debate <thesis>
/fh debate --rounds 5 <thesis>
/fh debate --builders Flux,Drift,Local <thesis>
```

**Examples:**
```
/fh debate "Microservices are better than monoliths for teams < 10"
/fh debate "We should rewrite the auth service in Rust"
/fh debate --rounds 5 "GraphQL is overrated for internal APIs"
```

**Process:**
1. Round 1: Each model states position + confidence
2. Rounds 2-N: Models refute/agree with each other
3. Final: Each model gives closing statement
4. Consensus detection (unanimous stance)

!`python3 .fusion-harness/scripts/fh-debate.py $ARGUMENTS`