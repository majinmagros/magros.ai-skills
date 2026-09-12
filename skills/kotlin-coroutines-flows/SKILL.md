---
name: kotlin-coroutines-flows
description: "Use when kotlin Coroutines and Flow patterns for Android and KMP — structured concurrency, Flow operators, StateFlow, error handling, and testing. Triggers on \"kotlin-coroutines-flows\", \"kotlin coroutines flows\", \"flows\"."
metadata:
  origin: ECC
---

# Kotlin Coroutines & Flows

Structured concurrency, Flow-based reactive streams, and coroutine testing for Android and KMP. Detalhes em `references/`.

## When to Activate

- Writing async code with Kotlin coroutines
- Using Flow, StateFlow, or SharedFlow for reactive data
- Handling concurrent operations (parallel loading, debounce, retry)
- Testing coroutines and Flows
- Managing coroutine scopes and cancellation

## Core Principles

1. **Structured concurrency only** — `viewModelScope`/`LaunchedEffect`, never `GlobalScope`
2. **Parallel via `coroutineScope` + `async`** — `supervisorScope` when siblings must survive
3. **StateFlow for UI state** — `WhileSubscribed(5_000)`; SharedFlow for one-time events
4. **Right dispatcher per job** — Default for CPU, IO for JVM/Android IO, Main for UI
5. **Cooperative cancellation** — `ensureActive()` in loops, `try/finally` for cleanup

## Example

```kotlin
suspend fun loadDashboard(): Dashboard = coroutineScope {
    val items = async { itemRepository.getRecent() }
    val stats = async { statsRepository.getToday() }
    Dashboard(items = items.await(), stats = stats.await())
}
```

## References

- `references/structured-concurrency.md` — scope hierarchy, parallel decomposition, supervisorScope
- `references/flows.md` — cold Flow, StateFlow, combine, operators, SharedFlow events
- `references/dispatchers-cancellation.md` — dispatchers, KMP notes, cooperative cancellation
- `references/testing.md` — Turbine, TestDispatcher, fakes, anti-patterns, related skills

## Checklist

- [ ] No `GlobalScope`; every launch tied to a lifecycle scope
- [ ] UI state is StateFlow with `WhileSubscribed`; events are SharedFlow
- [ ] Immutable copies in `_state.update`, never caught `CancellationException`
- [ ] Tests use `runTest` + Turbine/`advanceUntilIdle` with fake repositories
- [ ] KMP code avoids JVM-only `Dispatchers.IO`
