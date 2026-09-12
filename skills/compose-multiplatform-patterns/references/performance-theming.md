# Compose Multiplatform — Performance, Theming, Anti-Patterns

## Stable Types for Skippable Recomposition

Mark classes as `@Stable` or `@Immutable` when all properties are stable:

```kotlin
@Immutable
data class ItemUiModel(
    val id: String,
    val title: String,
    val description: String,
    val progress: Float
)
```

## Use `key()` and Lazy Lists Correctly

```kotlin
LazyColumn {
    items(
        items = items,
        key = { it.id }  // Stable keys enable item reuse and animations
    ) { item ->
        ItemRow(item = item)
    }
}
```

## Defer Reads with `derivedStateOf`

```kotlin
val listState = rememberLazyListState()
val showScrollToTop by remember {
    derivedStateOf { listState.firstVisibleItemIndex > 5 }
}
```

## Avoid Allocations in Recomposition

```kotlin
// BAD — new lambda and list every recomposition
items.filter { it.isActive }.forEach { ActiveItem(it, onClick = { handle(it) }) }

// GOOD — key each item so callbacks stay attached to the right row
val activeItems = remember(items) { items.filter { it.isActive } }
activeItems.forEach { item ->
    key(item.id) {
        ActiveItem(item, onClick = { handle(item) })
    }
}
```

## Material 3 Dynamic Theming

```kotlin
@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            if (darkTheme) dynamicDarkColorScheme(LocalContext.current)
            else dynamicLightColorScheme(LocalContext.current)
        }
        darkTheme -> darkColorScheme()
        else -> lightColorScheme()
    }

    MaterialTheme(colorScheme = colorScheme, content = content)
}
```

## Anti-Patterns to Avoid

- Using `mutableStateOf` in ViewModels when `MutableStateFlow` with `collectAsStateWithLifecycle` is safer for lifecycle
- Passing `NavController` deep into composables — pass lambda callbacks instead
- Heavy computation inside `@Composable` functions — move to ViewModel or `remember {}`
- Using `LaunchedEffect(Unit)` as a substitute for ViewModel init — it re-runs on configuration change in some setups
- Creating new object instances in composable parameters — causes unnecessary recomposition

## References

See skill: `android-clean-architecture` for module structure and layering.
See skill: `kotlin-coroutines-flows` for coroutine and Flow patterns.
