## Mocking with NSubstitute

```csharp
[Fact]
public async Task GetOrderAsync_ReturnsNull_WhenNotFound()
{
    // Arrange
    var orderId = Guid.NewGuid();
    _repository.FindByIdAsync(orderId, Arg.Any<CancellationToken>())
        .Returns((Order?)null);

    // Act
    var result = await _sut.GetOrderAsync(orderId, CancellationToken.None);

    // Assert
    result.Should().BeNull();
}

[Fact]
public async Task PlaceOrderAsync_PersistsOrder()
{
    // Arrange
    var request = ValidOrderRequest();

    // Act
    await _sut.PlaceOrderAsync(request, CancellationToken.None);

    // Assert — verify the repository was called
    await _repository.Received(1).AddAsync(
        Arg.Is<Order>(o => o.CustomerId == request.CustomerId),
        Arg.Any<CancellationToken>());
}
```
