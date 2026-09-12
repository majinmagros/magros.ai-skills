## Guard Clauses

```csharp
// Good: Early returns with clear validation
public async Task<ProcessResult> ProcessPaymentAsync(
    PaymentRequest request,
    CancellationToken cancellationToken)
{
    ArgumentNullException.ThrowIfNull(request);

    if (request.Amount <= 0)
        throw new ArgumentOutOfRangeException(nameof(request.Amount), "Amount must be positive");

    if (string.IsNullOrWhiteSpace(request.Currency))
        throw new ArgumentException("Currency is required", nameof(request.Currency));

    // Happy path continues here without nesting
    var gateway = _gatewayFactory.Create(request.Currency);
    return await gateway.ChargeAsync(request, cancellationToken);
}
```

## Anti-Patterns to Avoid

| Anti-Pattern | Fix |
|---|---|
| `async void` methods | Return `Task` (except event handlers) |
| `.Result` or `.Wait()` | Use `await` |
| `catch (Exception) { }` | Handle or rethrow with context |
| `new Service()` in constructors | Use constructor injection |
| `public` fields | Use properties with appropriate accessors |
| `dynamic` in business logic | Use generics or explicit types |
| Mutable `static` state | Use DI scoping or `ConcurrentDictionary` |
| `string.Format` in loops | Use `StringBuilder` or interpolated string handlers |
