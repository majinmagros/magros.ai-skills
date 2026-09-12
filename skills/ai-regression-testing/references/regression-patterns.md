# AI Regression Testing — Common patterns

## Pattern 1: Sandbox/Production Path Mismatch

**Frequency**: Most common (observed in 3 out of 4 regressions)

```typescript
// FAIL: AI adds field to production path only
if (isSandboxMode()) {
  return { data: { id, email, name } };  // Missing new field
}
// Production path
return { data: { id, email, name, notification_settings } };

// PASS: Both paths must return the same shape
if (isSandboxMode()) {
  return { data: { id, email, name, notification_settings: null } };
}
return { data: { id, email, name, notification_settings } };
```

**Test to catch it**:

```typescript
it("sandbox and production return same fields", async () => {
  // In test env, sandbox mode is forced ON
  const res = await GET(createTestRequest("/api/user/profile"));
  const { json } = await parseResponse(res);

  for (const field of REQUIRED_FIELDS) {
    expect(json.data).toHaveProperty(field);
  }
});
```

## Pattern 2: SELECT Clause Omission

**Frequency**: Common with Supabase/Prisma when adding new columns

```typescript
// FAIL: New column added to response but not to SELECT
const { data } = await supabase
  .from("users")
  .select("id, email, name")  // notification_settings not here
  .single();

return { data: { ...data, notification_settings: data.notification_settings } };
// → notification_settings is always undefined

// PASS: Use SELECT * or explicitly include new columns
const { data } = await supabase
  .from("users")
  .select("*")
  .single();
```

## Pattern 3: Error State Leakage

**Frequency**: Moderate — when adding error handling to existing components

```typescript
// FAIL: Error state set but old data not cleared
catch (err) {
  setError("Failed to load");
  // reservations still shows data from previous tab!
}

// PASS: Clear related state on error
catch (err) {
  setReservations([]);  // Clear stale data
  setError("Failed to load");
}
```

## Pattern 4: Optimistic Update Without Proper Rollback

```typescript
// FAIL: No rollback on failure
const handleRemove = async (id: string) => {
  setItems(prev => prev.filter(i => i.id !== id));
  await fetch(`/api/items/${id}`, { method: "DELETE" });
  // If API fails, item is gone from UI but still in DB
};

// PASS: Capture previous state and rollback on failure
const handleRemove = async (id: string) => {
  const prevItems = [...items];
  setItems(prev => prev.filter(i => i.id !== id));
  try {
    const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("API error");
  } catch {
    setItems(prevItems);  // Rollback
    alert("削除に失敗しました");
  }
};
```

## Strategy: Test Where Bugs Were Found

Don't aim for 100% coverage. Instead:

```
Bug found in /api/user/profile     → Write test for profile API
Bug found in /api/user/messages    → Write test for messages API
Bug found in /api/user/favorites   → Write test for favorites API
No bug in /api/user/notifications  → Don't write test (yet)
```

**Why this works with AI development:**

1. AI tends to make the **same category of mistake** repeatedly
2. Bugs cluster in complex areas (auth, multi-path logic, state management)
3. Once tested, that exact regression **cannot happen again**
4. Test count grows organically with bug fixes — no wasted effort
