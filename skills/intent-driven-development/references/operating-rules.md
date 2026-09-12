# Intent-Driven Development — Operating rules

1. Inspect the available repository, documentation, issue, design, and test context before
   asking for technical facts that can be discovered locally.
2. Do not infer product or business constraints from code. Business rules, compliance and
   regulatory obligations, contractual SLAs, pricing, data-retention policy, prioritization,
   and target users cannot be read from a repository. Treat them as unknown until the user
   supplies them or an authoritative product artifact (PRD, contract, policy document) states
   them. Record them as assumptions flagged for confirmation, never as discovered facts. The
   repository tells you how the system behaves today, not what the business requires it to do.
3. Ask only questions whose answers are required and cannot be safely inferred. Group short,
   related questions when that saves unnecessary turns.
4. Do not block implementation by default. When the user has asked to implement a sufficiently
   clear change, record key assumptions and acceptance criteria briefly, then proceed or hand
   them to the implementation workflow.
5. Require explicit user confirmation before proceeding only when an unresolved decision could
   create material security exposure, data loss, irreversible migration, contractual/API
   breakage, meaningful cost, or destructive external action.
6. Do not write an acceptance document into a repository, alter project files, create a branch,
   commit, or invoke another skill unless the user requests it or the active repository
   workflow explicitly requires it.
7. Treat automated tests as evidence, not truth. Prefer automation when reliable and
   proportionate; allow manual UX, accessibility, security, legal, or operational verification
   where automation cannot establish the outcome.
8. Never include real secrets, credentials, tokens, private keys, personal data, or sensitive
   production payloads in acceptance criteria, fixtures, examples, or saved artifacts. Use
   redacted or synthetic values.
9. Do not run destructive tests, migrations, security probes, load tests, paid external calls,
   or operations against production/live data without explicit authorization and an identified
   safe environment.
10. When an acceptance criterion cannot be satisfied due to an architectural, platform, or
    external constraint discovered during implementation, do not silently drop or workaround it.
    Update the affected criterion (mark it `[revised]`, state the constraint, and adjust scope or
    verification method), increment the revision number, and re-present only the changed criteria
    to the user before continuing. Require explicit confirmation only if the revision changes a
    blocking decision or materially reduces safety or correctness guarantees.
