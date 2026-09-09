# Foundations — Null Safety, Immutable State, Async, Widgets

## 1. Null Safety Fundamentals

### Prefer Patterns Over Bang Operator

```dart
// BAD — crashes at runtime if null
final name = user!.name;

// GOOD — provide fallback
final name = user?.name ?? 'Unknown';

// GOOD — Dart 3 pattern matching (preferred for complex cases)
final display = switch (user) {
  User(:final name, :final email) => '$name <$email>',
  null => 'Guest',
};

// GOOD — guard early return
String getUserName(User? user) {
  if (user == null) return 'Unknown';
  return user.name; // promoted to non-null after check
}
```

### Avoid `late` Overuse

```dart
// BAD — defers null error to runtime
late String userId;

// GOOD — nullable with explicit initialization
String? userId;

// OK — use late only when initialization is guaranteed before first access
// (e.g., in initState() before any widget interaction)
late final AnimationController _controller;

@override
void initState() {
  super.initState();
  _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 300));
}
```

## 2. Immutable State

### Sealed Classes for State Hierarchies

```dart
sealed class UserState {}

final class UserInitial extends UserState {}

final class UserLoading extends UserState {}

final class UserLoaded extends UserState {
  const UserLoaded(this.user);
  final User user;
}

final class UserError extends UserState {
  const UserError(this.message);
  final String message;
}

// Exhaustive switch — compiler enforces all branches
Widget buildFrom(UserState state) => switch (state) {
  UserInitial() => const SizedBox.shrink(),
  UserLoading() => const CircularProgressIndicator(),
  UserLoaded(:final user) => UserCard(user: user),
  UserError(:final message) => ErrorText(message),
};
```

### Freezed for Boilerplate-Free Immutability

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    required String id,
    required String name,
    required String email,
    @Default(false) bool isAdmin,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}

// Usage
final user = User(id: '1', name: 'Alice', email: 'alice@example.com');
final updated = user.copyWith(name: 'Alice Smith'); // immutable update
final json = user.toJson();
final fromJson = User.fromJson(json);
```

## 3. Async Composition

### Structured Concurrency with Future.wait

```dart
Future<DashboardData> loadDashboard(UserRepository users, OrderRepository orders) async {
  // Run concurrently — don't await sequentially
  final (userList, orderList) = await (
    users.getAll(),
    orders.getRecent(),
  ).wait; // Dart 3 record destructuring + Future.wait extension

  return DashboardData(users: userList, orders: orderList);
}
```

### Stream Patterns

```dart
// Repository exposes reactive streams for live data
Stream<List<Item>> watchCartItems() => _db
    .watchTable('cart_items')
    .map((rows) => rows.map(Item.fromRow).toList());

// In widget layer — declarative, no manual subscription
StreamBuilder<List<Item>>(
  stream: cartRepository.watchCartItems(),
  builder: (context, snapshot) => switch (snapshot) {
    AsyncSnapshot(connectionState: ConnectionState.waiting) =>
        const CircularProgressIndicator(),
    AsyncSnapshot(:final error?) => ErrorWidget(error.toString()),
    AsyncSnapshot(:final data?) => CartList(items: data),
    _ => const SizedBox.shrink(),
  },
)
```

### BuildContext After Await

```dart
// CRITICAL — always check mounted after any await in StatefulWidget
Future<void> _handleSubmit() async {
  setState(() => _isLoading = true);
  try {
    await authService.login(_email, _password);
    if (!mounted) return; // ← guard before using context
    context.go('/home');
  } on AuthException catch (e) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
  } finally {
    if (mounted) setState(() => _isLoading = false);
  }
}
```

## 4. Widget Architecture

### Extract to Classes, Not Methods

```dart
// BAD — private method returning widget, prevents optimization
Widget _buildHeader() {
  return Container(
    padding: const EdgeInsets.all(16),
    child: Text(title, style: Theme.of(context).textTheme.headlineMedium),
  );
}

// GOOD — separate widget class, enables const, element reuse
class _PageHeader extends StatelessWidget {
  const _PageHeader(this.title);
  final String title;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Text(title, style: Theme.of(context).textTheme.headlineMedium),
    );
  }
}
```

### const Propagation

```dart
// BAD — new instances every rebuild
child: Padding(
  padding: EdgeInsets.all(16.0),       // not const
  child: Icon(Icons.home, size: 24.0), // not const
)

// GOOD — const stops rebuild propagation
child: const Padding(
  padding: EdgeInsets.all(16.0),
  child: Icon(Icons.home, size: 24.0),
)
```

### Scoped Rebuilds

```dart
// BAD — entire page rebuilds on every counter change
class CounterPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider); // rebuilds everything
    return Scaffold(
      body: Column(children: [
        const ExpensiveHeader(), // unnecessarily rebuilt
        Text('$count'),
        const ExpensiveFooter(), // unnecessarily rebuilt
      ]),
    );
  }
}

// GOOD — isolate the rebuilding part
class CounterPage extends StatelessWidget {
  const CounterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Column(children: [
        ExpensiveHeader(),        // never rebuilt (const)
        _CounterDisplay(),        // only this rebuilds
        ExpensiveFooter(),        // never rebuilt (const)
      ]),
    );
  }
}

class _CounterDisplay extends ConsumerWidget {
  const _CounterDisplay();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return Text('$count');
  }
}
```
