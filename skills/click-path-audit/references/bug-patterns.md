# Bug Patterns Checklist

Check each touchpoint against all six patterns.

## Pattern 1: Sequential Undo

```
handler() {
  setState_A(true)     // sets X = true
  setState_B(null)     // side effect: resets X = false
}
// Result: X is false. First call was pointless.
```

## Pattern 2: Async Race

```
handler() {
  fetchA().then(() => setState({ loading: false }))
  fetchB().then(() => setState({ loading: true }))
}
// Result: final loading state depends on which resolves first
```

## Pattern 3: Stale Closure

```
const [count, setCount] = useState(0)
const handler = useCallback(() => {
  setCount(count + 1)  // captures stale count
  setCount(count + 1)  // same stale count — increments by 1, not 2
}, [count])
```

## Pattern 4: Missing State Transition

- Button says "Save" but handler only validates, never actually saves
- Button says "Delete" but handler sets a flag without calling the API
- Button says "Send" but the API endpoint is removed/broken

## Pattern 5: Conditional Dead Path

```
handler() {
  if (someState) {        // someState is ALWAYS false at this point
    doTheActualThing()    // never reached
  }
}
```

## Pattern 6: useEffect Interference

```
// Button sets stateX = true
// A useEffect watches stateX and resets it to false
// User sees nothing happen
```
