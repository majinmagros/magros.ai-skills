# AI Regression Testing — Bug-check workflow

## Custom Command Definition

```markdown
<!-- .claude/commands/bug-check.md -->
# Bug Check

## Step 1: Automated Tests (mandatory, cannot skip)

Run these commands FIRST before any code review:

    npm run test       # Vitest test suite
    npm run build      # TypeScript type check + build

- If tests fail → report as highest priority bug
- If build fails → report type errors as highest priority
- Only proceed to Step 2 if both pass

## Step 2: Code Review (AI review)

1. Sandbox / production path consistency
2. API response shape matches frontend expectations
3. SELECT clause completeness
4. Error handling with rollback
5. Optimistic update race conditions

## Step 3: For each bug fixed, propose a regression test
```

## The Workflow

```
User: "バグチェックして" (or "/bug-check")
  │
  ├─ Step 1: npm run test
  │   ├─ FAIL → Bug found mechanically (no AI judgment needed)
  │   └─ PASS → Continue
  │
  ├─ Step 2: npm run build
  │   ├─ FAIL → Type error found mechanically
  │   └─ PASS → Continue
  │
  ├─ Step 3: AI code review (with known blind spots in mind)
  │   └─ Findings reported
  │
  └─ Step 4: For each fix, write a regression test
      └─ Next bug-check catches if fix breaks
```
