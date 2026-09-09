# API Security + File Uploads — Rate Limiting, Sanctum vs Passport, CORS, Uploads

## Rate Limiting

```php
// App/Providers/RouteServiceProvider
protected function configureRateLimiting(): void
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    RateLimiter::for('auth', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip())
            ->response(function () {
                return response()->json([
                    'message' => 'Too many login attempts. Try again in 1 minute.',
                ], 429);
            });
    });

    RateLimiter::for('uploads', function (Request $request) {
        return Limit::perHour(10)->by($request->user()?->id ?? $request->ip())
            ->response(function () {
                return response()->json([
                    'message' => 'Upload limit reached. Try again later.',
                ], 429);
            });
    });
}

// Route usage
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::apiResource('posts', PostController::class);
});

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:auth');
```

## API Authentication — Sanctum vs Passport

```php
// Sanctum (recommended for most apps — simple, first-party, SPA)
// config/sanctum.php
'expiration' => 60 * 24, // Tokens expire after 24 hours
'model' => User::class,

// Issuing scoped tokens
$token = $user->createToken('client-name', [
    'posts:read',
    'posts:write',
])->plainTextToken;

// Middleware scoping
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/posts', [PostController::class, 'index'])
        ->middleware('abilities:posts:read');

    Route::post('/posts', [PostController::class, 'store'])
        ->middleware('abilities:posts:write');
});

// Passport (OAuth2 — for third-party clients or complex auth flows)
// Install: composer require laravel/passport
Passport::tokensExpireIn(now()->addDays(15));
Passport::refreshTokensExpireIn(now()->addDays(30));
Passport::personalAccessTokensExpireIn(now()->addMonths(6));
```

## CORS Configuration

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', '')), // Whitelist specific origins
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['X-Total-Count', 'X-Pagination-Page'],
    'max_age' => 0,
    'supports_credentials' => true, // Required for Sanctum SPA auth
];

// NEVER: Allow all origins in production unless absolutely necessary
// 'allowed_origins' => ['*'], // Only for truly public APIs
```

## File Upload Security

### Validation

```php
public function rules(): array
{
    return [
        'document' => [
            'required',
            'file',
            'mimes:pdf,doc,docx,xls,xlsx', // Whitelist specific MIME types
            'max:10240', // 10MB
            'extensions:pdf,doc,docx,xls,xlsx', // Verify extension matches MIME
        ],
        'avatar' => [
            'nullable',
            'image', // Ensures it's a valid image
            'mimes:jpg,jpeg,png,webp',
            'max:2048',
            'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000',
        ],
    ];
}
```

### Secure Storage

```php
// Store files outside public directory
$path = $request->file('document')->store('documents', 'local');
// Never use 'public' disk for sensitive documents

// Use signed URLs for temporary file access
use Illuminate\Support\Facades\Storage;

public function download(Request $request, string $path)
{
    // Generate temporary signed URL (expires in 15 minutes)
    $url = Storage::temporaryUrl($path, now()->addMinutes(15));

    // Validate user has permission
    $this->authorize('download', $path);

    return redirect($url);
}

// Storage configuration for cloud with encryption
// config/filesystems.php
's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION'),
    'bucket' => env('AWS_BUCKET'),
    'url' => env('AWS_URL'),
    'endpoint' => env('AWS_ENDPOINT'),
    'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
    'throw' => false,
    'server_side_encryption' => 'AES256', // Encrypt at rest
],
```
