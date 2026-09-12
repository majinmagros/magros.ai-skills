---
name: compose-multiplatform-patterns
description: "Use when compose Multiplatform and Jetpack Compose patterns for KMP projects — state management, navigation, theming, performance, and platform-specific UI. Triggers on \"compose-multiplatform-patterns\", \"compose multiplatform patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Compose Multiplatform Patterns

Patterns for building shared UI across Android, iOS, Desktop, and Web using Compose Multiplatform and Jetpack Compose. Covers state management, navigation, theming, and performance.

## When to Activate

- Building Compose UI (Jetpack Compose or Compose Multiplatform)
- Managing UI state with ViewModels and Compose state
- Implementing navigation in KMP or Android projects
- Designing reusable composables and design systems
- Optimizing recomposition and rendering performance

## State Management

### ViewModel + Single State Object

Use a single data class for screen state. Expose it as `StateFlow` and collect in Compose:

```kotlin
data class ItemListState(
    val items: List<Item> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val searchQuery: String = ""
)

class ItemListViewModel(
    private val getItems: GetItemsUseCase
) : ViewModel() {
    private val _state = MutableStateFlow(ItemListState())
    val state: StateFlow<ItemListState> = _state.asStateFlow()

    fun onSearch(query: String) {
        _state.update { it.copy(searchQuery = query) }
        loadItems(query)
    }

    private fun loadItems(query: String) {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            getItems(query).fold(
                onSuccess = { items -> _state.update { it.copy(items = items, isLoading = false) } },
                onFailure = { e -> _state.update { it.copy(error = e.message, isLoading = false) } }
            )
        }
    }
}
```

### Collecting State in Compose

```kotlin
@Composable
fun ItemListScreen(viewModel: ItemListViewModel = koinViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    ItemListContent(
        state = state,