# Expressions and Statements

## Key Rules

| Rule | Summary |
|------|---------|
| **ES.5** | Keep scopes small |
| **ES.20** | Always initialize an object |
| **ES.23** | Prefer `{}` initializer syntax |
| **ES.25** | Declare objects `const` or `constexpr` unless modification is intended |
| **ES.28** | Use lambdas for complex initialization of `const` variables |
| **ES.45** | Avoid magic constants; use symbolic constants |
| **ES.46** | Avoid narrowing/lossy arithmetic conversions |
| **ES.47** | Use `nullptr` rather than `0` or `NULL` |
| **ES.48** | Avoid casts |
| **ES.50** | Don't cast away `const` |

## Initialization

```cpp
// ES.20 + ES.23 + ES.25: Always initialize, prefer {}, default to const
const int max_retries{3};
const std::string name{"widget"};
const std::vector<int> primes{2, 3, 5, 7, 11};

// ES.28: Lambda for complex const initialization
const auto config = [&] {
    Config c;
    c.timeout = std::chrono::seconds{30};
    c.retries = max_retries;
    c.verbose = debug_mode;
    return c;
}();
```

## Anti-Patterns

- Uninitialized variables (ES.20)
- Using `0` or `NULL` as pointer (ES.47 -- use `nullptr`)
- C-style casts (ES.48 -- use `static_cast`, `const_cast`, etc.)
- Casting away `const` (ES.50)
- Magic numbers without named constants (ES.45)
- Mixing signed and unsigned arithmetic (ES.100)
- Reusing names in nested scopes (ES.12)
