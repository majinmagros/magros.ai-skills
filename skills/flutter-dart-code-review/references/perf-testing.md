# Flutter Review — Performance e testing

## 5. Performance

### Unnecessary rebuilds:
- [ ] `setState()` not called at root widget level — localize state changes
- [ ] `const` widgets used to stop rebuild propagation
- [ ] `RepaintBoundary` used around complex subtrees that repaint independently
- [ ] `AnimatedBuilder` child parameter used for subtrees independent of animation

### Expensive operations in build():
- [ ] No sorting, filtering, or mapping large collections in `build()` — compute in state management layer
- [ ] No regex compilation in `build()`
- [ ] `MediaQuery.of(context)` usage is specific (e.g., `MediaQuery.sizeOf(context)`)

### Image optimization:
- [ ] Network images use caching (any caching solution appropriate for the project)
- [ ] Appropriate image resolution for target device (no loading 4K images for thumbnails)
- [ ] `Image.asset` with `cacheWidth`/`cacheHeight` to decode at display size
- [ ] Placeholder and error widgets provided for network images

### Lazy loading:
- [ ] `ListView.builder` / `GridView.builder` used instead of `ListView(children: [...])` for large or dynamic lists (concrete constructors are fine for small, static lists)
- [ ] Pagination implemented for large data sets
- [ ] Deferred loading (`deferred as`) used for heavy libraries in web builds

### Other:
- [ ] `Opacity` widget avoided in animations — use `AnimatedOpacity` or `FadeTransition`
- [ ] Clipping avoided in animations — pre-clip images
- [ ] `operator ==` not overridden on widgets — use `const` constructors instead
- [ ] Intrinsic dimension widgets (`IntrinsicHeight`, `IntrinsicWidth`) used sparingly (extra layout pass)

## 6. Testing

### Test types and expectations:
- [ ] **Unit tests**: Cover all business logic (state managers, repositories, utility functions)
- [ ] **Widget tests**: Cover individual widget behavior, interactions, and visual output
- [ ] **Integration tests**: Cover critical user flows end-to-end
- [ ] **Golden tests**: Pixel-perfect comparisons for design-critical UI components

### Coverage targets:
- [ ] Aim for 80%+ line coverage on business logic
- [ ] All state transitions have corresponding tests (loading → success, loading → error, retry, etc.)
- [ ] Edge cases tested: empty states, error states, loading states, boundary values

### Test isolation:
- [ ] External dependencies (API clients, databases, services) are mocked or faked
- [ ] Each test file tests exactly one class/unit
- [ ] Tests verify behavior, not implementation details
- [ ] Stubs define only the behavior needed for each test (minimal stubbing)
- [ ] No shared mutable state between test cases

### Widget test quality:
- [ ] `pumpWidget` and `pump` used correctly for async operations
- [ ] `find.byType`, `find.text`, `find.byKey` used appropriately
- [ ] No flaky tests depending on timing — use `pumpAndSettle` or explicit `pump(Duration)`
- [ ] Tests run in CI and failures block merges
