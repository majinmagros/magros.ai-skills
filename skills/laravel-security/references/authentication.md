# Authentication — Sanctum, Passwords, Sessions

## Sanctum (API Token Authentication)

```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ',' . parse_url(env('APP_URL'), PHP_URL_HOST) : ''
)));

'expiration' => 60 * 24, // Token expiration in minutes (null = never)
'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

// Issuing tokens with abilities
$token = $user->createToken('api-token', ['read', 'write'])->plainTextToken;

// Validate abilities on routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/orders', function () {
        // User must have 'read' ability
        abort_unless(Auth::user()->tokenCan('read'), 403);
        // ...
    })->middleware('abilities:read');

    Route::post('/orders', function () {
        // User must have 'write' ability
        abort_unless(Auth::user()->tokenCan('write'), 403);
        // ...
    })->middleware('abilities:write');
});
```

## Password Security

```php
// config/hashing.php
// Default is bcrypt. Argon2id is stronger.
'bcrypt' => [
    'rounds' => env('BCRYPT_ROUNDS', 12), // Increase for stronger hashing
],

'argon' => [
    'memory' => 65536,
    'threads' => 4,
    'time' => 4,
],

// Password validation in RegisterRequest
public function rules(): array
{
    return [
        'password' => [
            'required',
            'confirmed',
            Password::min(12)
                ->letters()
                ->mixedCase()
                ->numbers()
                ->symbols()
                ->uncompromised(), // Checks haveibeenpwned
        ],
    ];
}

// Rate limit login attempts
// App\Http\Controllers\Auth\AuthenticatedSessionController
protected function authenticated(Request $request, $user)
{
    if ($user->wasRecentlyLockedOut()) {
        // Notify user of suspicious login
        $user->notify(new SuspiciousLoginNotification($request->ip()));
    }
}
```

## Session Management

```php
// config/session.php
'driver' => env('SESSION_DRIVER', 'database'), // database/redis > file
'lifetime' => env('SESSION_LIFETIME', 120),
'expire_on_close' => env('SESSION_EXPIRE_ON_CLOSE', false),
'encrypt' => env('SESSION_ENCRYPT', false),

// Regenerate session on login
// App\Http\Controllers\Auth\AuthenticatedSessionController
public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();
    $request->session()->regenerate(); // CRITICAL: prevents session fixation
    return redirect()->intended(RouteServiceProvider::HOME);
}

// Invalidate session on logout
public function destroy(Request $request): RedirectResponse
{
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
}
```
