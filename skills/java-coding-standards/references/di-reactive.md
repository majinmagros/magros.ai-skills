# Dependency Injection and Reactive Patterns

## Dependency Injection

```java
// PASS: [SPRING] Constructor injection (preferred over @Autowired on fields)
@Service
public class MarketService {
  private final MarketRepository marketRepository;

  public MarketService(MarketRepository marketRepository) {
    this.marketRepository = marketRepository;
  }
}

// PASS: [QUARKUS] Constructor injection
@ApplicationScoped
public class MarketService {
  private final MarketRepository marketRepository;

  @Inject
  public MarketService(MarketRepository marketRepository) {
    this.marketRepository = marketRepository;
  }
}

// PASS: [QUARKUS] Package-private field injection (acceptable in Quarkus — avoids proxy issues)
@ApplicationScoped
public class MarketService {
  @Inject
  MarketRepository marketRepository;
}

// FAIL: [SPRING] Field injection with @Autowired
@Autowired
private MarketRepository marketRepository; // use constructor injection

// FAIL: [QUARKUS] @Singleton when interception or lazy init is needed
@Singleton // non-proxyable — use @ApplicationScoped instead
public class MarketService {}
```

## Reactive Patterns [QUARKUS]

```java
// PASS: Return Uni/Multi from reactive endpoints
@GET
@Path("/{slug}")
public Uni<Market> findBySlug(@PathParam("slug") String slug) {
  return Market.find("slug", slug)
      .<Market>firstResult()
      .onItem().ifNull().failWith(() -> new MarketNotFoundException(slug));
}

// PASS: Non-blocking pipeline composition
public Uni<OrderConfirmation> placeOrder(OrderRequest req) {
  return validateOrder(req)
      .chain(valid -> persistOrder(valid))
      .chain(order -> notifyFulfillment(order));
}

// FAIL: Blocking call inside a Uni/Multi pipeline
public Uni<Market> find(String slug) {
  Market m = Market.find("slug", slug).firstResult(); // BLOCKING — breaks event loop
  return Uni.createFrom().item(m);
}

// FAIL: Subscribing more than once to a shared Uni
Uni<Market> shared = fetchMarket(slug);
shared.subscribe().with(m -> log(m));
shared.subscribe().with(m -> cache(m)); // double subscribe — use Uni.memoize()
```
