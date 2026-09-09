# Eloquent Security — Mass Assignment, SQL Injection, Casting, Models

## Mass Assignment Protection

```php
// BAD: $guarded = [] allows ALL columns to be mass-assigned
// NEVER use $guarded = [] in production

// GOOD: Whitelist fillable attributes
final class User extends Authenticatable
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'avatar',
    ];
    // NEVER add 'role', 'is_admin', 'is_verified' here
}

// GOOD: Explicitly control which fields can be filled in requests
public function store(StoreUserRequest $request): RedirectResponse
{
    $user = User::create($request->safe()->only([
        'name', 'email', 'phone', 'avatar'
    ]));
    // $request->safe() uses validated data only
    // $request->only() is NOT safe on its own without validation rules
}

// BAD: Creating a user with request data directly
User::create($request->all()); // VULNERABLE to mass assignment!

// BETTER: Use DTOs for creation
$user = User::create($request->validated()); // Only validated fields
```

## SQL Injection Prevention

```php
// GOOD: Eloquent automatically parameterizes queries
User::where('email', $userInput)->first();
User::whereRaw('email = ?', [$userInput])->first();

// GOOD: Query Builder also parameterizes
DB::table('users')->where('email', $userInput)->first();
DB::select('SELECT * FROM users WHERE email = ?', [$userInput]);

// BAD: Raw string interpolation
DB::select("SELECT * FROM users WHERE email = '{$userInput}'"); // VULNERABLE!
User::whereRaw("email = '{$userInput}'")->first(); // VULNERABLE!

// BAD: whereRaw/orderByRaw with unescaped input
User::orderByRaw($userInput); // VULNERABLE!
User::groupByRaw($userInput); // VULNERABLE!

// BAD: DB::statement with concatenation
DB::statement("INSERT INTO users (email) VALUES ('{$userInput}')"); // VULNERABLE!
```

## Attribute Casting

```php
final class User extends Authenticatable
{
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_admin' => 'boolean', // Cast to boolean prevents string injection
        'settings' => 'array', // Automatically json_encode/json_decode
        'metadata' => 'encrypted:array', // Laravel 11+ encrypted casting
        'password' => 'hashed', // Laravel 10+ auto-hashes on set
    ];
}
```

## Model Security

```php
final class User extends Authenticatable
{
    // Hide sensitive attributes from JSON/API responses
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    // Append only safe computed attributes
    protected $appends = ['full_name']; // safe
    // NEVER append sensitive computed data
}

final class Post extends Model
{
    // Global scope to filter soft deleted records
    use SoftDeletes;

    // Prevent N+1 by restricting lazy loading (optional strict mode)
    // AppServiceProvider::boot()
    // Model::preventLazyLoading(!app()->isProduction());
}
```
