# Testing and Gradle Dependencies

## In-Memory Database for Tests

```kotlin
class UserRepositoryTest : FunSpec({
    lateinit var database: Database
    lateinit var repository: UserRepository

    beforeSpec {
        database = Database.connect(
            url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;MODE=PostgreSQL",
            driver = "org.h2.Driver",
        )
        transaction(database) {
            SchemaUtils.create(UsersTable)
        }
        repository = ExposedUserRepository(database)
    }

    beforeTest {
        transaction(database) {
            UsersTable.deleteAll()
        }
    }

    test("create and find user") {
        val user = repository.create(CreateUserRequest("Alice", "alice@example.com"))

        user.name shouldBe "Alice"
        user.email shouldBe "alice@example.com"

        val found = repository.findById(user.id)
        found shouldBe user
    }

    test("findByEmail returns null for unknown email") {
        val result = repository.findByEmail("unknown@example.com")
        result.shouldBeNull()
    }

    test("pagination works correctly") {
        repeat(25) { i ->
            repository.create(CreateUserRequest("User $i", "user$i@example.com"))
        }

        val page1 = repository.findAll(page = 1, limit = 10)
        page1.data shouldHaveSize 10
        page1.total shouldBe 25
        page1.hasNext shouldBe true

        val page3 = repository.findAll(page = 3, limit = 10)
        page3.data shouldHaveSize 5
        page3.hasNext shouldBe false
    }
})
```

## Gradle Dependencies

```kotlin
// build.gradle.kts
dependencies {
    // Exposed
    implementation("org.jetbrains.exposed:exposed-core:1.0.0")
    implementation("org.jetbrains.exposed:exposed-dao:1.0.0")
    implementation("org.jetbrains.exposed:exposed-jdbc:1.0.0")
    implementation("org.jetbrains.exposed:exposed-kotlin-datetime:1.0.0")
    implementation("org.jetbrains.exposed:exposed-json:1.0.0")

    // Database driver
    implementation("org.postgresql:postgresql:42.7.5")

    // Connection pooling
    implementation("com.zaxxer:HikariCP:6.2.1")

    // Migrations
    implementation("org.flywaydb:flyway-core:10.22.0")
    implementation("org.flywaydb:flyway-database-postgresql:10.22.0")

    // Testing
    testImplementation("com.h2database:h2:2.3.232")
}
```
