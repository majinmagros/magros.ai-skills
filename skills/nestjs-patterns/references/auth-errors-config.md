# Auth, Errors, Config, Persistence

## Auth, Guards, Request Context

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin/report')
getAdminReport(@Req() req: AuthenticatedRequest) {
  return this.reportService.getForUser(req.user.id);
}
```

Keep auth strategies/guards module-local unless truly shared. Coarse rules in guards, resource-specific authorization in services. Prefer explicit authenticated-request types.

## Exception Filters and Error Shape

```ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        path: request.url,
        error: exception.getResponse(),
      });
    }

    return response.status(500).json({
      path: request.url,
      error: 'Internal server error',
    });
  }
}
```

One consistent error envelope. Throw framework exceptions for expected client errors; log and wrap unexpected failures centrally.

## Config and Environment Validation

```ts
ConfigModule.forRoot({
  isGlobal: true,
  load: [configuration],
  validate: validateEnv,
});
```

Validate env at boot, not lazily. Keep config behind typed helpers/services. Split dev/staging/prod in config factories, not branches in feature code.

## Persistence and Transactions

- Repository/ORM code behind providers speaking domain language.
- For Prisma/TypeORM, isolate transactional workflows in services owning the unit of work.
- Controllers never coordinate multi-step writes directly.
