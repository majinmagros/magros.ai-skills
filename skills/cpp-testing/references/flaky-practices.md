# Flaky Guardrails, Practices, Pitfalls, Fuzzing

## Flaky Tests Guardrails

- Never use `sleep` for synchronization; use condition variables or latches.
- Make temp directories unique per test and always clean them.
- Avoid real time, network, or filesystem dependencies in unit tests.
- Use deterministic seeds for randomized inputs.

## Best Practices

### DO

- Keep tests deterministic and isolated
- Prefer dependency injection over globals
- Use `ASSERT_*` for preconditions, `EXPECT_*` for multiple checks
- Separate unit vs integration tests in CTest labels or directories
- Run sanitizers in CI for memory and race detection

### DON'T

- Don't depend on real time or network in unit tests
- Don't use sleeps as synchronization when a condition variable can be used
- Don't over-mock simple value objects
- Don't use brittle string matching for non-critical logs

### Common Pitfalls

- **Using fixed temp paths** → Generate unique temp directories per test and clean them.
- **Relying on wall clock time** → Inject a clock or use fake time sources.
- **Flaky concurrency tests** → Use condition variables/latches and bounded waits.
- **Hidden global state** → Reset global state in fixtures or remove globals.
- **Over-mocking** → Prefer fakes for stateful behavior and only mock interactions.
- **Missing sanitizer runs** → Add ASan/UBSan/TSan builds in CI.
- **Coverage on debug-only builds** → Ensure coverage targets use consistent flags.

## Optional Appendix: Fuzzing / Property Testing

Only use if the project already supports LLVM/libFuzzer or a property-testing library.

- **libFuzzer**: best for pure functions with minimal I/O.
- **RapidCheck**: property-based tests to validate invariants.

Minimal libFuzzer harness (pseudocode: replace ParseConfig):

```cpp
#include <cstddef>
#include <cstdint>
#include <string>

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    std::string input(reinterpret_cast<const char *>(data), size);
    // ParseConfig(input); // project function
    return 0;
}
```

## Alternatives to GoogleTest

- **Catch2**: header-only, expressive matchers
- **doctest**: lightweight, minimal compile overhead
