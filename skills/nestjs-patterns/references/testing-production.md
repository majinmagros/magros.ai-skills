# Testing and Production Defaults

```ts
describe('UsersController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });
});
```

- Unit test providers in isolation with mocked dependencies.
- Request-level tests for guards, validation pipes, and exception filters.
- Reuse the same global pipes/filters in tests as in production.

## Production Defaults

- Structured logging and request correlation ids.
- Terminate on invalid env/config instead of booting partially.
- Async provider init for DB/cache clients with explicit health checks.
- Background jobs and event consumers in their own modules, not HTTP controllers.
- Rate limiting, auth, and audit logging explicit for public endpoints.
