# Install Plan, Router, Verify

## 4. Build the Install Plan

Translate the classification into action:

- DAILY skills -> install or keep in `.claude/skills/`
- DAILY commands -> keep as explicit shims only if still useful
- DAILY rules -> install only matching language sets
- DAILY hooks/scripts -> keep only compatible ones
- LIBRARY surfaces -> keep accessible through search or `skill-library`

If the repo already uses selective installs, update that plan instead of creating another system.

## 5. Create the Optional Library Router

If the project wants a searchable library surface, create:

- `.claude/skills/skill-library/SKILL.md`

That router should contain:

- a short explanation of DAILY vs LIBRARY
- grouped trigger keywords
- where the library references live

Do not duplicate every skill body inside the router.

## 6. Verify the Result

After the plan is applied, verify:

- every DAILY file exists where expected
- stale language rules were not left active
- incompatible hooks were not installed
- the resulting install actually matches the repo stack

Return a compact report with:

- DAILY count
- LIBRARY count
- removed stale surfaces
- open questions

## Outputs (in Order)

1. DAILY inventory
2. LIBRARY inventory
3. install plan
4. verification report
5. optional `skill-library` router if the project wants one

## Handoffs

If the next step is interactive installation or repair, hand off to:

- `configure-ecc`

If the next step is overlap cleanup or catalog review, hand off to:

- `skill-stocktake`

If the next step is broader context trimming, hand off to:

- `strategic-compact`

## Output Format

Return the result in this order:

```text
STACK
- language/framework/runtime summary

DAILY
- always-loaded items with evidence

LIBRARY
- searchable/reference items with evidence

INSTALL PLAN
- what should be installed, removed, or routed

VERIFICATION
- checks run and remaining gaps
```
