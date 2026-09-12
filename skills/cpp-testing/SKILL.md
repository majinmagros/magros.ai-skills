---
name: cpp-testing
description: "Use when use only when writing/updating/fixing C++ tests, configuring GoogleTest/CTest, diagnosing failing or flaky tests, or adding coverage/sanitizers. Triggers on \"cpp-testing\", \"cpp testing\", \"testing\"."
metadata:
  origin: ECC
---

# C++ Testing (Agent Skill)

Agent-focused testing workflow for modern C++ (C++17/20) using GoogleTest/GoogleMock with CMake/CTest.

## When to Use

- Writing new C++ tests or fixing existing tests
- Designing unit/integration test coverage for C++ components
- Adding test coverage, CI gating, or regression protection
- Configuring CMake/CTest workflows for consistent execution
- Investigating test failures or flaky behavior
- Enabling sanitizers for memory/race diagnostics

### When NOT to Use

- Implementing new product features without test changes
- Large-scale refactors unrelated to test coverage or failures
- Performance tuning without test regressions to validate
- Non-C++ projects or non-test tasks

## Core Concepts

- **TDD loop**: red → green → refactor (tests first, minimal fix, then cleanups).
- **Isolation**: prefer dependency injection and fakes over global state.
- **Test layout**: `tests/unit`, `tests/integration`, `tests/testdata`.
- **Mocks vs fakes**: mock for interactions, fake for stateful behavior.
- **CTest discovery**: use `gtest_discover_tests()` for stable test discovery.
- **CI signal**: run subset first, then full suite with `--output-on-failure`.

## TDD Workflow

Follow the RED → GREEN → REFACTOR loop:

1. **RED**: write a failing test that captures the new behavior
2. **GREEN**: implement the smallest change to pass
3. **REFACTOR**: clean up while tests stay green

```cpp
// tests/add_test.cpp
#include <gtest/gtest.h>

int Add(int a, int b); // Provided by production code.

TEST(AddTest, AddsTwoNumbers) { // RED
  EXPECT_EQ(Add(2, 3), 5);
}

// src/add.cpp
int Add(int a, int b) { // GREEN
  return a + b;
}

// REFACTOR: simplify/rename once tests pass
```

## Code Examples

### Basic Unit Test (gtest)