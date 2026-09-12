---
name: python-patterns
description: "Use when pythonic idioms, PEP 8 standards, type hints, and best practices for building robust, efficient, and maintainable Python applications. Only for Python — not for other languages. Triggers on \"python-patterns\", \"python patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Python Development Patterns

Idiomatic Python patterns and best practices for building robust, efficient, and maintainable applications.

## When to Activate

- Writing new Python code
- Reviewing Python code
- Refactoring existing Python code
- Designing Python packages/modules

## When NOT to Use

- Other languages (use `golang-patterns`, `rust-patterns`, etc.)
- Python test strategy specifically (use `python-testing`)
- Django/FastAPI specifics (use `django-patterns`, `fastapi-patterns`)

## Contents

| Topic | Reference |
|---|---|
| Core principles (readability, explicit, EAFP) | `references/core-principles.md` |
| Type hints (annotations, TypeVar, Protocol) | `references/type-hints.md` |
| Error handling (chaining, hierarchy) | `references/error-handling.md` |
| Context managers | `references/context-managers.md` |
| Comprehensions and generators | `references/comprehensions.md` |
| Dataclasses and named tuples | `references/dataclasses.md` |
| Decorators | `references/decorators.md` |
| Concurrency (threading, multiprocessing, async) | `references/concurrency.md` |
| Package organization and imports | `references/packaging.md` |
| Memory and performance | `references/performance.md` |
| Tooling (format, lint, mypy, pyproject) | `references/tooling.md` |

## Quick Reference: Python Idioms

| Idiom | Description |
|-------|-------------|
| EAFP | Easier to Ask Forgiveness than Permission |
| Context managers | Use `with` for resource management |
| List comprehensions | For simple transformations |
| Generators | For lazy evaluation and large datasets |
| Type hints | Annotate function signatures |
| Dataclasses | For data containers with auto-generated methods |
| `__slots__` | For memory optimization |
| f-strings | For string formatting (Python 3.6+) |
| `pathlib.Path` | For path operations (Python 3.4+) |
| `enumerate` | For index-element pairs in loops |

## Anti-Patterns to Avoid

```python
# Bad: Mutable default arguments
def append_to(item, items=[]):
    items.append(item)
    return items

# Good: Use None and create new list
def append_to(item, items=None):