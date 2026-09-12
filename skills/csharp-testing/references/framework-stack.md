Comprehensive testing patterns for .NET applications using xUnit, FluentAssertions, and modern testing practices.

## Test Framework Stack

| Tool | Purpose |
|---|---|
| **xUnit** | Test framework (preferred for .NET) |
| **FluentAssertions** | Readable assertion syntax |
| **NSubstitute** or **Moq** | Mocking dependencies |
| **Testcontainers** | Real infrastructure in integration tests |
| **WebApplicationFactory** | ASP.NET Core integration tests |
| **Bogus** | Realistic test data generation |

## Running Tests

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific project
dotnet test tests/MyApp.UnitTests/

# Filter by test name
dotnet test --filter "FullyQualifiedName~OrderService"

# Watch mode during development
dotnet watch test --project tests/MyApp.UnitTests/
```
