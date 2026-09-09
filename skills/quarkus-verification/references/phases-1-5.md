# Phases 1–5 — Build, Static Analysis, Tests, Security, Native

## Phase 1: Build

```bash
# Maven
mvn clean verify -DskipTests

# Gradle
./gradlew clean assemble -x test
```

If build fails, stop and fix compilation errors.

## Phase 2: Static Analysis

### Checkstyle, PMD, SpotBugs (Maven)

```bash
mvn checkstyle:check pmd:check spotbugs:check
```

### SonarQube (if configured)

```bash
mvn sonar:sonar \
  -Dsonar.projectKey=my-quarkus-project \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=${SONAR_TOKEN}
```

### Common Issues to Address

- Unused imports or variables
- Complex methods (high cyclomatic complexity)
- Potential null pointer dereferences
- Security issues flagged by SpotBugs

## Phase 3: Tests + Coverage

```bash
# Run all tests
mvn clean test

# Generate coverage report
mvn jacoco:report

# Enforce coverage threshold (80%)
mvn jacoco:check

# Or with Gradle
./gradlew test jacocoTestReport jacocoTestCoverageVerification
```

### Test Categories

#### Unit Tests
Test service logic with mocked dependencies:

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
  @Mock UserRepository userRepository;
  @InjectMocks UserService userService;

  @Test
  void createUser_validInput_returnsUser() {
    var dto = new CreateUserDto("Alice", "alice@example.com");

    // Panache persist() is void — use doNothing + verify
    doNothing().when(userRepository).persist(any(User.class));

    User result = userService.create(dto);

    assertThat(result.name).isEqualTo("Alice");
    verify(userRepository).persist(any(User.class));
  }
}
```

#### Integration Tests
Test with real database (Testcontainers):

```java
@QuarkusTest
@QuarkusTestResource(PostgresTestResource.class)
class UserRepositoryIntegrationTest {

  @Inject
  UserRepository userRepository;

  @Test
  @Transactional
  void findByEmail_existingUser_returnsUser() {
    User user = new User();
    user.name = "Alice";
    user.email = "alice@example.com";
    userRepository.persist(user);

    Optional<User> found = userRepository.findByEmail("alice@example.com");

    assertThat(found).isPresent();
    assertThat(found.get().name).isEqualTo("Alice");
  }
}
```

#### API Tests
Test REST endpoints with REST Assured:

```java
@QuarkusTest
class UserResourceTest {

  @Test
  void createUser_validInput_returns201() {
    given()
        .contentType(ContentType.JSON)
        .body("""
            {"name": "Alice", "email": "alice@example.com"}
            """)
        .when().post("/api/users")
        .then()
        .statusCode(201)
        .body("name", equalTo("Alice"));
  }

  @Test
  void createUser_invalidEmail_returns400() {
    given()
        .contentType(ContentType.JSON)
        .body("""
            {"name": "Alice", "email": "invalid"}
            """)
        .when().post("/api/users")
        .then()
        .statusCode(400);
  }
}
```

### Coverage Report

Check `target/site/jacoco/index.html` for detailed coverage:
- Overall line coverage (target: 80%+)
- Branch coverage (target: 70%+)
- Identify uncovered critical paths

## Phase 4: Security Scanning

### Dependency Vulnerabilities (Maven)

```bash
mvn org.owasp:dependency-check-maven:check
```

Review `target/dependency-check-report.html` for CVEs.

### Quarkus Security Audit

```bash
# Check vulnerable extensions
mvn quarkus:audit

# List all extensions
mvn quarkus:list-extensions
```

### OWASP ZAP (API Security Testing)

```bash
docker run -t owasp/zap2docker-stable zap-api-scan.py \
  -t http://localhost:8080/q/openapi \
  -f openapi
```

### Common Security Checks

- [ ] All secrets in environment variables (not in code)
- [ ] Input validation on all endpoints
- [ ] Authentication/authorization configured
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Passwords hashed with BCrypt
- [ ] SQL injection protection (parameterized queries)
- [ ] Rate limiting on public endpoints

## Phase 5: Native Compilation

Test GraalVM native image compatibility:

```bash
# Build native executable
mvn package -Dnative

# Or with container
mvn package -Dnative -Dquarkus.native.container-build=true

# Test native executable
./target/*-runner

# Run basic smoke tests
curl http://localhost:8080/q/health/live
curl http://localhost:8080/q/health/ready
```

### Native Image Troubleshooting

Common issues:
- **Reflection**: Add reflection config for dynamic classes
- **Resources**: Include resources with `quarkus.native.resources.includes`
- **JNI**: Register JNI classes if using native libraries

Example reflection config:
```java
@RegisterForReflection(targets = {MyDynamicClass.class})
public class ReflectionConfiguration {}
```
