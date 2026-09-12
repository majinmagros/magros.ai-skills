## Stage 2: Mutual Ranking

For each scored target, analyze the user's social graph to find the warmest path.

### Ranking Model

1. Pull user's X following list and LinkedIn connections
2. For each high-signal target, check for shared connections
3. Apply the `social-graph-ranker` model to score bridge value
4. Rank mutuals by:

| Factor | Weight |
|--------|--------|
| Number of connections to targets | 40% — highest weight, most connections = highest rank |
| Mutual's current role/company | 20% — decision maker vs individual contributor |
| Mutual's location | 15% — same city = easier intro |
| Industry alignment | 15% — same vertical = natural intro |
| Mutual's X handle / LinkedIn | 10% — identifiability for outreach |

Canonical rule:

```text
Use social-graph-ranker when the user wants the graph math itself,
the bridge ranking as a standalone report, or explicit decay-model tuning.
```

Inside this skill, use the same weighted bridge model:

```text
B(m) = Σ_{t ∈ T} w(t) · λ^(d(m,t) - 1)
R(m) = B_ext(m) · (1 + β · engagement(m))
```

Interpretation:
- Tier 1: high `R(m)` and direct bridge paths -> warm intro asks
- Tier 2: medium `R(m)` and one-hop bridge paths -> conditional intro asks
- Tier 3: no viable bridge -> direct cold outreach using the same lead record

### Output Format

```

If the user explicitly wants the ranking engine broken out, the math visualized, or the network scored outside the full lead workflow, run `social-graph-ranker` as a standalone pass first and feed the result back into this pipeline.
MUTUAL RANKING REPORT
=====================

#1  @mutual_handle (Score: 92)
    Name: Jane Smith
    Role: Partner @ Acme Ventures
    Location: San Francisco
    Connections to targets: 7
    Connected to: @target1, @target2, @target3, @target4, @target5, @target6, @target7
    Best intro path: Jane invested in Target1's company

#2  @mutual_handle2 (Score: 85)
    ...
```

## Stage 3: Warm Path Discovery

For each target, find the shortest introduction chain:

```
You ──[follows]──> Mutual A ──[invested in]──> Target Company
You ──[follows]──> Mutual B ──[co-founded with]──> Target Person
You ──[met at]──> Event ──[also attended]──> Target Person
```

### Path Types (ordered by warmth)
1. **Direct mutual** — You both follow/know the same person
2. **Portfolio connection** — Mutual invested in or advises target's company
3. **Co-worker/alumni** — Mutual worked at same company or attended same school
4. **Event overlap** — Both attended same conference/program
5. **Content engagement** — Target engaged with mutual's content or vice versa
