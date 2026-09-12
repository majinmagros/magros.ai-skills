# Flutter Review — Widgets e state management

## 3. Widget Best Practices

### Widget decomposition:
- [ ] No single widget with a `build()` method exceeding ~80-100 lines
- [ ] Widgets split by encapsulation AND by how they change (rebuild boundaries)
- [ ] Private `_build*()` helper methods that return widgets are extracted to separate widget classes (enables element reuse, const propagation, and framework optimizations)
- [ ] Stateless widgets preferred over Stateful where no mutable local state is needed
- [ ] Extracted widgets are in separate files when reusable

### Const usage:
- [ ] `const` constructors used wherever possible — prevents unnecessary rebuilds
- [ ] `const` literals for collections that don't change (`const []`, `const {}`)
- [ ] Constructor is declared `const` when all fields are final

### Key usage:
- [ ] `ValueKey` used in lists/grids to preserve state across reorders
- [ ] `GlobalKey` used sparingly — only when accessing state across the tree is truly needed
- [ ] `UniqueKey` avoided in `build()` — it forces rebuild every frame
- [ ] `ObjectKey` used when identity is based on a data object rather than a single value

### Theming & design system:
- [ ] Colors come from `Theme.of(context).colorScheme` — no hardcoded `Colors.red` or hex values
- [ ] Text styles come from `Theme.of(context).textTheme` — no inline `TextStyle` with raw font sizes
- [ ] Dark mode compatibility verified — no assumptions about light background
- [ ] Spacing and sizing use consistent design tokens or constants, not magic numbers

### Build method complexity:
- [ ] No network calls, file I/O, or heavy computation in `build()`
- [ ] No `Future.then()` or `async` work in `build()`
- [ ] No subscription creation (`.listen()`) in `build()`
- [ ] `setState()` localized to smallest possible subtree

## 4. State Management (Library-Agnostic)

Principles for all solutions (BLoC, Riverpod, Provider, GetX, MobX, Signals, ValueNotifier, etc.).

### Architecture:
- [ ] Business logic lives outside the widget layer — in a state management component (BLoC, Notifier, Controller, Store, ViewModel, etc.)
- [ ] State managers receive dependencies via injection, not by constructing them internally
- [ ] A service or repository layer abstracts data sources — widgets and state managers should not call APIs or databases directly
- [ ] State managers have a single responsibility — no "god" managers handling unrelated concerns
- [ ] Cross-component dependencies follow the solution's conventions:
  - In **Riverpod**: providers depending on providers via `ref.watch` is expected — flag only circular or overly tangled chains
  - In **BLoC**: blocs should not directly depend on other blocs — prefer shared repositories or presentation-layer coordination
  - In other solutions: follow the documented conventions for inter-component communication

### Immutability & value equality (for immutable-state solutions: BLoC, Riverpod, Redux):
- [ ] State objects are immutable — new instances created via `copyWith()` or constructors, never mutated in-place
- [ ] State classes implement `==` and `hashCode` properly (all fields included in comparison)
- [ ] Mechanism is consistent across the project — manual override, `Equatable`, `freezed`, Dart records, or other
- [ ] Collections inside state objects are not exposed as raw mutable `List`/`Map`

### Reactivity discipline (for reactive-mutation solutions: MobX, GetX, Signals):
- [ ] State is only mutated through the solution's reactive API (`@action` in MobX, `.value` on signals, `.obs` in GetX) — direct field mutation bypasses change tracking
- [ ] Derived values use the solution's computed mechanism rather than being stored redundantly
- [ ] Reactions and disposers are properly cleaned up (`ReactionDisposer` in MobX, effect cleanup in Signals)

### State shape design:
- [ ] Mutually exclusive states use sealed types, union variants, or the solution's built-in async state type (e.g. Riverpod's `AsyncValue`) — not boolean flags (`isLoading`, `isError`, `hasData`)
- [ ] Every async operation models loading, success, and error as distinct states
- [ ] All state variants are handled exhaustively in UI — no silently ignored cases
- [ ] Error states carry error information for display; loading states don't carry stale data
- [ ] Nullable data is not used as a loading indicator — states are explicit

### Rebuild optimization:
- [ ] State consumer widgets (Builder, Consumer, Observer, Obx, Watch, etc.) scoped as narrow as possible
- [ ] Selectors used to rebuild only when specific fields change — not on every state emission
- [ ] `const` widgets used to stop rebuild propagation through the tree
- [ ] Computed/derived state is calculated reactively, not stored redundantly

### Subscriptions & disposal:
- [ ] All manual subscriptions (`.listen()`) are cancelled in `dispose()` / `close()`
- [ ] Stream controllers are closed when no longer needed
- [ ] Timers are cancelled in disposal lifecycle
- [ ] Framework-managed lifecycle is preferred over manual subscription (declarative builders over `.listen()`)
- [ ] `mounted` check before `setState` in async callbacks
- [ ] `BuildContext` not used after `await` without checking `context.mounted` (Flutter 3.7+) — stale context causes crashes
- [ ] No navigation, dialogs, or scaffold messages after async gaps without verifying the widget is still mounted
- [ ] `BuildContext` never stored in singletons, state managers, or static fields

### Local vs global state:
- [ ] Ephemeral UI state (checkbox, slider, animation) uses local state (`setState`, `ValueNotifier`)
- [ ] Shared state is lifted only as high as needed — not over-globalized
- [ ] Feature-scoped state is properly disposed when the feature is no longer active

## State Management Quick Reference

Maps universal principles to popular solutions. Use to adapt review rules to the project's solution.

| Principle | BLoC/Cubit | Riverpod | Provider | GetX | MobX | Signals | Built-in |
|-----------|-----------|----------|----------|------|------|---------|----------|
| State container | `Bloc`/`Cubit` | `Notifier`/`AsyncNotifier` | `ChangeNotifier` | `GetxController` | `Store` | `signal()` | `StatefulWidget` |
| UI consumer | `BlocBuilder` | `ConsumerWidget` | `Consumer` | `Obx`/`GetBuilder` | `Observer` | `Watch` | `setState` |
| Selector | `BlocSelector`/`buildWhen` | `ref.watch(p.select(...))` | `Selector` | N/A | computed | `computed()` | N/A |
| Side effects | `BlocListener` | `ref.listen` | `Consumer` callback | `ever()`/`once()` | `reaction` | `effect()` | callbacks |
| Disposal | auto via `BlocProvider` | `.autoDispose` | auto via `Provider` | `onClose()` | `ReactionDisposer` | manual | `dispose()` |
| Testing | `blocTest()` | `ProviderContainer` | `ChangeNotifier` directly | `Get.put` in test | store directly | signal directly | widget test |
