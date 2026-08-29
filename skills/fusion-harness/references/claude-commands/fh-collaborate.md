---
name: fh-collaborate
description: Architect plans → builders execute → architect integrates
---
# /fh collaborate

Full collaboration workflow: Architect creates plan, builders execute in parallel, architect integrates.

**Usage:**
```
/fh collaborate <goal>
/fh collaborate --variant feature-build "Build user authentication with OAuth2"
```

**Examples:**
```
/fh collaborate "Build a REST API for user management with CRUD operations"
/fh collaborate "Refactor the payment module to use event sourcing"
/fh collaborate --variant pr-review "Review PR #234"
```

**Workflow:**
1. **Architect** creates task plan with dependencies (T1, T2, T3...)
2. **Builders** execute assigned tasks in parallel (respecting dependencies)
3. **Architect** integrates results, validates, produces final deliverable
4. **State** saved to `.fusion-harness/state/`

**Cost tracking:** Real-time cost per model, per task, per workflow.

!`python3 .fusion-harness/scripts/fh-collaborate.py $ARGUMENTS`