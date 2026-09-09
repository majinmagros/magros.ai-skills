# Ops — Production Config, Dependencies, Queues, Logging

## Production Configuration

```php
// config/app.php
'env' => env('APP_ENV', 'production'),
'debug' => (bool) env('APP_DEBUG', false), // CRITICAL: Never true in production
'key' => env('APP_KEY'), // Must be set: php artisan key:generate

// config/session.php
'secure' => env('SESSION_SECURE_COOKIE', true),
'http_only' => true,
'same_site' => 'lax',

// Verify APP_KEY is set at boot
// bootstrap/app.php or a service provider
if (empty(config('app.key'))) {
    throw new RuntimeException('APP_KEY is not set. Run: php artisan key:generate');
}
```

```bash
# NEVER commit .env to version control
# .gitignore already includes .env by default

# Use .env.example with placeholders instead
DB_PASSWORD=
APP_KEY=
SANCTUM_TOKEN_PREFIX=

# Validate required variables at boot
// In AppServiceProvider::boot()
$requiredKeys = ['app.key', 'database.connections.mysql.database', 'database.connections.mysql.username'];
foreach ($requiredKeys as $key) {
    if (empty(config($key))) {
        throw new RuntimeException("Missing required config key: {$key}");
    }
}
```

### HTTPS Enforcement

```php
// AppServiceProvider::boot() or middleware
if (app()->environment('production')) {
    URL::forceScheme('https');
    request()->server->set('HTTPS', 'on');
}

// config/app.php for trusted proxies (load balancers)
// Use specific IP ranges — * trusts all, allowing X-Forwarded-* spoofing
// AWS: '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'
'trusted_proxies' => ['10.0.0.0/8', '172.16.0.0/12'],

// Force HTTPS in production via middleware
// app/Http/Middleware/ForceHttps.php
public function handle($request, Closure $next)
{
    if (!$request->secure() && app()->environment('production')) {
        return redirect()->secure($request->getRequestUri());
    }
    return $next($request);
}
```

## Dependencies and Secrets

```bash
# Always audit dependencies in CI
composer audit

# Pin major versions in composer.json
"laravel/framework": "^11.0",
"spatie/laravel-permission": "^6.0"

# Check for abandoned packages
composer why-not

# Keep lock file in version control (it pins exact versions)
# Run `composer update` deliberately, never in CI/CD
```

```bash
# .env file (NEVER commit)
# .gitignore includes .env by default

APP_KEY=base64:abc123...
DB_PASSWORD=secure_password
STRIPE_KEY=sk_live_...
SANCTUM_TOKEN_PREFIX=myapp_

# For production: Use a secret manager
# Deploy with: env $(aws secretsmanager get-secret-value --secret-id prod/db | jq ...) php artisan serve

# Validate secrets at boot (AppServiceProvider::boot)
$secrets = ['services.stripe.key', 'services.stripe.webhook_secret'];
foreach ($secrets as $key) {
    if (empty(config($key))) {
        Log::critical("Missing secret: {$key}");
    }
}
```

## Queue Security

```php
// Define a named rate limiter (typically in AppServiceProvider::boot())
RateLimiter::for('payments', fn () => Limit::perMinute(5));
```

```php
// Encrypt sensitive job data by implementing the interface
final class ProcessPaymentJob implements ShouldQueue, ShouldBeEncrypted
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly string $paymentIntentId, // Public IDs are fine
        private readonly string $cardFingerprint, // Encrypted via ShouldBeEncrypted
    ) {}

    public function handle(): void
    {
        // Process payment
    }

    // Limit retries and delay between attempts
    public function retryUntil(): Carbon
    {
        return now()->addMinutes(5);
    }

    // Rate limit how many jobs of this type can run
    public function middleware(): array
    {
        return [
            new RateLimited('payments'),
        ];
    }
}
```

## Logging Security Events

```php
// config/logging.php
'channels' => [
    'security' => [
        'driver' => 'single',
        'path' => storage_path('logs/security.log'),
        'level' => 'warning',
    ],
],

// Audit log helper
final class SecurityLogger
{
    public static function log(string $event, array $context = []): void
    {
        Log::channel('security')->warning($event, array_merge([
            'user_id' => Auth::id(),
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
            'timestamp' => now()->toIso8601String(),
        ], $context));
    }
}

// Usage
SecurityLogger::log('failed_login_attempt', ['email' => $email]);
SecurityLogger::log('password_change');
SecurityLogger::log('role_change', ['target_user' => $targetId, 'new_role' => 'admin']);
SecurityLogger::log('suspicious_activity', ['reason' => 'multiple_attempts_from_different_ips']);
```
