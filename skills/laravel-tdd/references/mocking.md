# Mocking and Fakes

## HTTP Fake

```php
use Illuminate\Support\Facades\Http;

public function test_it_handles_successful_payment(): void
{
    Http::fake([
        'api.stripe.com/*' => Http::response(['id' => 'pi_123', 'status' => 'succeeded'], 200),
    ]);

    $result = (new PaymentService())->charge(2999);
    $this->assertTrue($result->success);
}

public function test_it_handles_gateway_failure(): void
{
    Http::fake([
        'api.stripe.com/*' => Http::response(['error' => 'card_declined'], 402),
    ]);

    $this->expectException(PaymentFailedException::class);
    (new PaymentService())->charge(2999);
}

public function test_it_retries_on_timeout(): void
{
    Http::fake([
        'api.stripe.com/*' => Http::sequence()
            ->pushStatus(408)
            ->pushStatus(200),
    ]);

    $this->assertTrue((new PaymentService())->charge(2999)->success);
}
```

## Mail Fake

```php
Mail::fake();

$order->sendConfirmation();

Mail::assertSent(OrderConfirmation::class, function ($mail) use ($order) {
    return $mail->hasTo($order->user->email);
});
```

## Notification Fake

```php
Notification::fake();

$user->notify(new WelcomeUser());

Notification::assertSentTo($user, WelcomeUser::class);
```

## Queue Fake

```php
Queue::fake();

ProcessImage::dispatch($product);

Queue::assertPushed(ProcessImage::class, function ($job) use ($product) {
    return $job->product->id === $product->id;
});
```

## Storage Fake

```php
Storage::fake('public');

$file = UploadedFile::fake()->image('photo.jpg', 200, 200);

$response = $this->actingAs($user)->post('/avatar', [
    'avatar' => $file,
]);

$response->assertSessionHasNoErrors();
Storage::disk('public')->assertExists('avatars/' . $file->hashName());
```

## Event Fake

```php
Event::fake();

$order->markAsShipped();

Event::assertDispatched(OrderShipped::class, function ($event) use ($order) {
    return $event->order->id === $order->id;
});
```

## Artisan Command Tests

```php
public function test_it_sends_newsletters(): void
{
    Mail::fake();
    User::factory()->count(5)->create(['subscribed' => true]);

    $this->artisan('newsletter:send')
        ->expectsOutput('Sending newsletter to 5 subscribers...')
        ->assertExitCode(0);

    Mail::assertSent(NewsletterMail::class, 5);
}

public function test_it_handles_no_subscribers(): void
{
    $this->artisan('newsletter:send')
        ->expectsOutput('No subscribers found.')
        ->assertExitCode(0);
}
```
