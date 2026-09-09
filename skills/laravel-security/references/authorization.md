# Authorization — Gates, Policies, Middleware

## Gates

```php
// App\Providers\AuthServiceProvider
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::define('update-post', function (User $user, Post $post): bool {
        return $user->id === $post->user_id;
    });

    Gate::define('publish-post', function (User $user): bool {
        return $user->role === 'editor' || $user->role === 'admin';
    });

    // Using before() for super-admin override
    Gate::before(function (User $user, string $ability): ?bool {
        if ($user->role === 'super-admin') {
            return true; // Grants all abilities
        }
        return null; // Fall through to normal checks
    });
}

// Usage in controllers
public function update(Request $request, Post $post): RedirectResponse
{
    Gate::authorize('update-post', $post);
    // Or: $this->authorize('update-post', $post);
    // Or: abort_unless(Auth::user()->can('update-post', $post), 403);
    // ...
}
```

## Policies

```php
// App\Policies\PostPolicy
class PostPolicy
{
    use HandlesAuthorization;

    public function viewAny(?User $user): bool
    {
        return true; // Public listing
    }

    public function view(?User $user, Post $post): bool
    {
        return $post->is_published || ($user && $user->id === $post->user_id);
    }

    public function create(User $user): bool
    {
        return $user->hasVerifiedEmail(); // Must verify email first
    }

    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id && $post->created_at->diffInDays(now()) <= 30;
    }

    public function restore(User $user, Post $post): bool
    {
        return $user->role === 'admin';
    }

    public function forceDelete(User $user, Post $post): bool
    {
        return $user->role === 'super-admin';
    }
}

// Register in AuthServiceProvider
protected $policies = [
    Post::class => PostPolicy::class,
];

// Controller usage
public function show(Post $post): View
{
    $this->authorize('view', $post);
    return view('posts.show', compact('post'));
}

// Blade usage
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Edit</a>
@endcan

@cannot('update', $post)
    <span>You cannot edit this post</span>
@endcannot
```

## Middleware Authorization

```php
// Using middleware in routes
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->middleware('can:update,post');

Route::get('/posts/create', [PostController::class, 'create'])
    ->middleware('can:create,App\Models\Post');

// Custom authorization middleware
// app/Http/Middleware/CheckRole.php
class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): mixed
    {
        if (!$request->user() || $request->user()->role !== $role) {
            abort(403, 'Unauthorized. This area requires role: ' . $role);
        }
        return $next($request);
    }
}

// Register in Kernel
protected $routeMiddleware = [
    'role' => \App\Http\Middleware\CheckRole::class,
];

// Route usage
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index']);
});
```
