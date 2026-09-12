# Mocking, Integration, Organization

## Mocking Dependencies

### Function Stubs (Preferred)

```fsharp
let createTestDeps () =
    let mutable savedOrders = []
    { FindOrder = fun id -> task { return Map.tryFind id testData }
      SaveOrder = fun order -> task { savedOrders <- order :: savedOrders }
      SendNotification = fun _ -> Task.CompletedTask }

[<Fact>]
let ``PlaceOrder saves the confirmed order`` () = task {
    let mutable saved = []
    let deps =
        { createTestDeps () with
            SaveOrder = fun order -> task { saved <- order :: saved } }

    let! _ = OrderService.placeOrder deps validRequest

    test <@ saved.Length = 1 @>
}
```

### NSubstitute for .NET Interfaces

```fsharp
open NSubstitute

[<Fact>]
let ``calls repository with correct ID`` () = task {
    let repo = Substitute.For<IOrderRepository>()
    repo.FindByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
        .Returns(Task.FromResult(Some testOrder))

    let service = OrderService(repo)
    let! _ = service.GetOrder(testOrder.Id, CancellationToken.None)

    do! repo.Received(1).FindByIdAsync(testOrder.Id, Arg.Any<CancellationToken>())
}
```

## ASP.NET Core Integration Tests

```fsharp
type OrderApiTests (factory: WebApplicationFactory<Program>) =
    interface IClassFixture<WebApplicationFactory<Program>>

    let client =
        factory.WithWebHostBuilder(fun builder ->
            builder.ConfigureServices(fun services ->
                services.RemoveAll<DbContextOptions<AppDbContext>>() |> ignore
                services.AddDbContext<AppDbContext>(fun options ->
                    options.UseInMemoryDatabase("TestDb") |> ignore) |> ignore))
            .CreateClient()

    [<Fact>]
    member _.``GET order returns 404 when not found`` () = task {
        let! response = client.GetAsync($"/api/orders/{Guid.NewGuid()}")
        test <@ response.StatusCode = HttpStatusCode.NotFound @>
    }
```

## Test Organization

```
tests/
  MyApp.Tests/
    Unit/
      OrderServiceTests.fs
      PaymentServiceTests.fs
    Integration/
      OrderApiTests.fs
      OrderRepositoryTests.fs
    Properties/
      OrderPropertyTests.fs
    Helpers/
      TestData.fs
      TestDeps.fs
```

## Common Anti-Patterns

| Anti-Pattern | Fix |
|---|---|
| Testing implementation details | Test behavior and outcomes |
| Mutable shared test state | Fresh state per test |
| `Thread.Sleep` in async tests | Use `Task.Delay` with timeout, or polling helpers |
| Asserting on `sprintf` output | Assert on typed values and pattern matches |
| Ignoring `CancellationToken` | Always pass and verify cancellation |
| Skipping property-based tests | Use FsCheck for any function with clear invariants |

## Running Tests

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific project
dotnet test tests/MyApp.Tests/

# Filter by test name
dotnet test --filter "FullyQualifiedName~OrderService"

# Watch mode during development
dotnet watch test --project tests/MyApp.Tests/
```

## Related Skills

- `dotnet-patterns` - Idiomatic .NET patterns, dependency injection, and architecture
- `csharp-testing` - C# testing patterns (shared infrastructure like WebApplicationFactory and Testcontainers applies to F# too)
