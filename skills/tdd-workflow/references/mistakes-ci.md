# Mistakes and Continuous Testing

## FAIL: WRONG: Testing Implementation Details
```typescript
// Don't test internal state
expect(component.state.count).toBe(5)
```

## PASS: CORRECT: Test User-Visible Behavior
```typescript
// Test what users see
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

## FAIL: WRONG: Brittle Selectors
```typescript
// Breaks easily
await page.click('.css-class-xyz')
```

## PASS: CORRECT: Semantic Selectors
```typescript
// Resilient to changes
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

## FAIL: WRONG: No Test Isolation
```typescript
// Tests depend on each other
test('creates user', () => { /* ... */ })
test('updates same user', () => { /* depends on previous test */ })
```

## PASS: CORRECT: Independent Tests
```typescript
// Each test sets up its own data
test('creates user', () => {
  const user = createTestUser()
  // Test logic
})

test('updates user', () => {
  const user = createTestUser()
  // Update logic
})
```

## Continuous Testing

## Watch Mode During Development
```bash
<test-watch>
# Tests run automatically on file changes
```

## Pre-Commit Hook
```bash
# Runs before every commit
<test> && <lint>
```

## CI/CD Integration
```yaml
# GitHub Actions
- name: Run Tests
  run: <coverage>
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```
