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
    if items is None:
        items = []
    items.append(item)
    return items

# Bad: Checking type with type()
if type(obj) == list:
    process(obj)

# Good: Use isinstance
if isinstance(obj, list):
    process(obj)

# Bad: Comparing to None with ==
if value == None:
    process()

# Good: Use is
if value is None:
    process()

# Bad: from module import *
from os.path import *

# Good: Explicit imports
from os.path import join, exists

# Bad: Bare except
try:
    risky_operation()
except:
    pass

# Good: Specific exception
try:
    risky_operation()
except SpecificError as e:
    logger.error(f"Operation failed: {e}")
```

## Referências

- `references/core-principles.md` — legibilidade, EAFP
- `references/type-hints.md` — annotations, TypeVar, Protocol
- `references/error-handling.md` — chaining, hierarquia
- `references/context-managers.md` — resources, custom CMs
- `references/comprehensions.md` — list/dict/set, generators
- `references/dataclasses.md` — dataclasses, validacao, named tuples
- `references/decorators.md` — function, parametrizados, classe
- `references/concurrency.md` — threading, multiprocessing, async
- `references/packaging.md` — layout, imports, `__init__.py`
- `references/performance.md` — `__slots__`, join, StringIO
- `references/tooling.md` — format, lint, mypy, pyproject

__Remember__: Python code should be readable, explicit, and follow the principle of least surprise. When in doubt, prioritize clarity over cleverness.
