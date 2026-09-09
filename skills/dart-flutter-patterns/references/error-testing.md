# Error Handling + Testing Quick Reference

## 9. Error Handling Architecture

```dart
// Global error capture — set up in main()
void main() {
  FlutterError.onError = (details) {
    FlutterError.presentError(details);
    crashlytics.recordFlutterFatalError(details);
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    crashlytics.recordError(error, stack, fatal: true);
    return true;
  };

  runApp(const App());
}

// Custom ErrorWidget for production
class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    ErrorWidget.builder = (details) => ProductionErrorWidget(details);
    return MaterialApp.router(routerConfig: router);
  }
}
```

## 10. Testing Quick Reference

```dart
// Unit test — use case
test('GetUserUseCase returns null for missing user', () async {
  final repo = FakeUserRepository();
  final useCase = GetUserUseCase(repo);
  expect(await useCase('missing-id'), isNull);
});

// BLoC test
blocTest<AuthCubit, AuthState>(
  'emits loading then error on failed login',
  build: () => AuthCubit(FakeAuthService(throwsOn: 'login')),
  act: (cubit) => cubit.login('user@test.com', 'wrong'),
  expect: () => [const AuthState.loading(), isA<AuthError>()],
);

// Widget test
testWidgets('CartBadge shows item count', (tester) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: [cartNotifierProvider.overrideWith(() => FakeCartNotifier(count: 3))],
      child: const MaterialApp(home: CartBadge()),
    ),
  );
  expect(find.text('3'), findsOneWidget);
});
```

Rule: fakes over mocks.
