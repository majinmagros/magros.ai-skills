# Kotest Matchers and MockK

## Kotest Matchers

### Core Matchers

```kotlin
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.*
import io.kotest.matchers.collections.*
import io.kotest.matchers.nulls.*

// Equality
result shouldBe expected
result shouldNotBe unexpected

// Strings
name shouldStartWith "Al"
name shouldEndWith "ice"
name shouldContain "lic"
name shouldMatch Regex("[A-Z][a-z]+")
name.shouldBeBlank()

// Collections
list shouldContain "item"
list shouldHaveSize 3
list.shouldBeSorted()
list.shouldContainAll("a", "b", "c")
list.shouldBeEmpty()

// Nulls
result.shouldNotBeNull()
result.shouldBeNull()

// Types
result.shouldBeInstanceOf<User>()

// Numbers
count shouldBeGreaterThan 0
price shouldBeInRange 1.0..100.0

// Exceptions
shouldThrow<IllegalArgumentException> {
    validateAge(-1)
}.message shouldBe "Age must be positive"

shouldNotThrow<Exception> {
    validateAge(25)
}
```

### Custom Matchers

```kotlin
fun beActiveUser() = object : Matcher<User> {
    override fun test(value: User) = MatcherResult(
        value.isActive && value.lastLogin != null,
        { "User ${value.id} should be active with a last login" },
        { "User ${value.id} should not be active" },
    )
}

// Usage
user should beActiveUser()
```

## MockK

### Basic Mocking

```kotlin
class UserServiceTest : FunSpec({
    val repository = mockk<UserRepository>()
    val logger = mockk<Logger>(relaxed = true) // Relaxed: returns defaults
    val service = UserService(repository, logger)

    beforeTest {
        clearMocks(repository, logger)
    }

    test("findUser delegates to repository") {
        val expected = User(id = "1", name = "Alice")
        every { repository.findById("1") } returns expected

        val result = service.findUser("1")

        result shouldBe expected
        verify(exactly = 1) { repository.findById("1") }
    }

    test("findUser returns null for unknown id") {
        every { repository.findById(any()) } returns null

        val result = service.findUser("unknown")

        result.shouldBeNull()
    }
})
```

### Coroutine Mocking

```kotlin
class AsyncUserServiceTest : FunSpec({
    val repository = mockk<UserRepository>()
    val service = UserService(repository)

    test("getUser suspending function") {
        coEvery { repository.findById("1") } returns User(id = "1", name = "Alice")

        val result = service.getUser("1")

        result.name shouldBe "Alice"
        coVerify { repository.findById("1") }
    }

    test("getUser with delay") {
        coEvery { repository.findById("1") } coAnswers {
            delay(100) // Simulate async work
            User(id = "1", name = "Alice")
        }

        val result = service.getUser("1")
        result.name shouldBe "Alice"
    }
})
```

### Argument Capture

```kotlin
test("save captures the user argument") {
    val slot = slot<User>()
    coEvery { repository.save(capture(slot)) } returns Unit

    service.createUser(CreateUserRequest("Alice", "alice@example.com"))

    slot.captured.name shouldBe "Alice"
    slot.captured.email shouldBe "alice@example.com"
    slot.captured.id.shouldNotBeNull()
}
```

### Spy and Partial Mocking

```kotlin
test("spy on real object") {
    val realService = UserService(repository)
    val spy = spyk(realService)

    every { spy.generateId() } returns "fixed-id"

    spy.createUser(request)

    verify { spy.generateId() } // Overridden
    // Other methods use real implementation
}
```
