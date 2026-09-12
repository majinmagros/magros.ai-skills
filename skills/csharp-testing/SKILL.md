---
name: csharp-testing
description: "Use when c# and .NET testing patterns with xUnit, FluentAssertions, mocking, integration tests, and test organization best practices. Only for C#/.NET — not for other languages. Triggers on \"csharp-testing\", \"csharp testing\", \"testing\"."
metadata:
  origin: ECC
---

# C# Testing Patterns

Comprehensive testing patterns for .NET applications using xUnit, FluentAssertions, and modern testing practices.

## When to Activate

- Writing new tests for C# code
- Reviewing test quality and coverage
- Setting up test infrastructure for .NET projects
- Debugging flaky or slow tests

## Test Framework Stack

| Tool | Purpose |
|---|---|
| **xUnit** | Test framework (preferred for .NET) |
| **FluentAssertions** | Readable assertion syntax |
| **NSubstitute** or **Moq** | Mocking dependencies |
| **Testcontainers** | Real infrastructure in integration tests |
| **WebApplicationFactory** | ASP.NET Core integration tests |
| **Bogus** | Realistic test data generation |

## Unit Test Structure

### Arrange-Act-Assert

```csharp
public sealed class OrderServiceTests
{
    private readonly IOrderRepository _repository = Substitute.For<IOrderRepository>();
    private readonly ILogger<OrderService> _logger = Substitute.For<ILogger<OrderService>>();
    private readonly OrderService _sut;

    public OrderServiceTests()
    {
        _sut = new OrderService(_repository, _logger);
    }

    [Fact]
    public async Task PlaceOrderAsync_ReturnsSuccess_WhenRequestIsValid()
    {
        // Arrange
        var request = new CreateOrderRequest
        {
            CustomerId = "cust-123",
            Items = [new OrderItem("SKU-001", 2, 29.99m)]
        };

        // Act
        var result = await _sut.PlaceOrderAsync(request, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value!.CustomerId.Should().Be("cust-123");
    }

    [Fact]