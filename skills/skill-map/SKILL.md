---
name: skill-map
description: Use when the user needs one entrypoint to navigate a large skill set — find the right skill by intent, compare similar skills, and choose keep / merge / cut / load paths before doing work.
metadata:
  origin: ECC
---

# Skill Map

Use this skill to route a request to the right existing skill fast.

## When to Activate

- the user says the skills repo feels too big or messy
- the user wants one index for all skills
- the user asks which skill fits a task
- the user wants to compare similar skills before creating a new one
- the user wants to know whether a new skill already exists in another form

## Process

1. Identify the user intent in one line.
2. Search for existing skills with the same job.
3. Compare overlap by scope, trigger, and output.
4. Return one of:
   - `use existing skill`
   - `merge into existing skill`
   - `new skill needed`
5. If new skill is needed, name the missing gap in one sentence.

## Output Shape

- best matching skill(s)
- nearest overlap
- recommendation
- gap, if any

## Anti-Overlap

- Not `skill-stocktake`: that skill audits quality of installed skills.
- Not `config-gc`: that skill cleans dead config and stale entries.
- Not `strategic-compact`: that skill suggests when to compact context.
