---
name: cpp-coding-standards
description: C++ coding standards based on the C++ Core Guidelines (isocpp.github.io). Use when writing, reviewing, or refactoring C++ code to enforce modern, safe, and idiomatic practices. Only for C++ — not for C or other languages. Triggers on "cpp-coding-standards", "cpp coding standards", "c++ standards".
metadata:
  origin: ECC
---

# C++ Coding Standards (C++ Core Guidelines)

Comprehensive coding standards for modern C++ (C++17/20/23) derived from the [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines). Enforces type safety, resource safety, immutability, and clarity.

## When to Use

- Writing new C++ code (classes, functions, templates)
- Reviewing or refactoring existing C++ code
- Making architectural decisions in C++ projects
- Enforcing consistent style across a C++ codebase
- Choosing between language features (e.g., `enum` vs `enum class`, raw pointer vs smart pointer)

### When NOT to Use

- Non-C++ projects
- Legacy C codebases that cannot adopt modern C++ features
- Embedded/bare-metal contexts where specific guidelines conflict with hardware constraints (adapt selectively)

## Cross-Cutting Principles

Prefer compile-time safety over runtime checks: types, `const`, and RAII carry intent so the compiler enforces it. Details per area live in `references/`.

## Contents

| Topic | Reference |
|---|---|
| Philosophy, interfaces (P, I) | `references/philosophy-interfaces.md` |
| Functions (F) | `references/functions.md` |
| Classes (C) | `references/classes.md` |
| Resources, RAII (R) | `references/resources.md` |
| Expressions, init (ES) | `references/expressions.md` |
| Errors, const (E, Con) | `references/errors-const.md` |
| Concurrency, templates (CP, T) | `references/concurrency-templates.md` |
| Stdlib, enums, files, perf | `references/library-misc.md` |

## Example

```cpp
// Rule of Zero: no custom dtor/copy/move needed
class Widget {
    std::string name_;
    std::unique_ptr<Engine> engine_;
public:
    explicit Widget(std::string name)
        : name_(std::move(name)), engine_(std::make_unique<Engine>()) {}
};
```

## Quick Reference Checklist

Before marking C++ work complete:

- [ ] No raw `new`/`delete` -- use smart pointers or RAII (R.11)
- [ ] Objects initialized at declaration (ES.20)
- [ ] Variables are `const`/`constexpr` by default (Con.1, ES.25)
- [ ] Member functions are `const` where possible (Con.2)
- [ ] `enum class` instead of plain `enum` (Enum.3)
- [ ] `nullptr` instead of `0`/`NULL` (ES.47)