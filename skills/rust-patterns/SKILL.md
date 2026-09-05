---
name: rust-patterns
description: "Use when idiomatic Rust patterns, ownership, error handling, traits, concurrency, and best practices for building safe, performant applications. Only for Rust — not for other languages. Triggers on \"rust-patterns\", \"rust patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Rust Development Patterns

Idiomatic Rust patterns and best practices for building safe, performant, and maintainable applications.

## When to Use

- Writing new Rust code
- Reviewing Rust code
- Refactoring existing Rust code
- Designing crate structure and module layout

## When NOT to Use

- Other languages (use `golang-patterns`, `python-patterns`, `kotlin-patterns`, etc.)
- Rust test strategy specifically (use `rust-testing`)

## How It Works

This skill enforces idiomatic Rust conventions across six key areas: ownership and borrowing to prevent data races at compile time, `Result`/`?` error propagation with `thiserror` for libraries and `anyhow` for applications, enums and exhaustive pattern matching to make illegal states unrepresentable, traits and generics for zero-cost abstraction, safe concurrency via `Arc<Mutex<T>>`, channels, and async/await, and minimal `pub` surfaces organized by domain.

## Contents

| Topic | Reference |
|---|---|
| Ownership, borrowing, `Cow` | `references/ownership.md` |
| Error handling (`Result`, `?`, thiserror/anyhow, `Option`) | `references/error-handling.md` |
| Enums and exhaustive matching | `references/enums.md` |
| Traits, generics, newtype | `references/traits-generics.md` |
| Structs and builder pattern | `references/structs.md` |
| Iterators and closures | `references/iterators.md` |
| Concurrency and async (Tokio) | `references/concurrency.md` |
| Unsafe guidelines | `references/unsafe-code.md` |
| Modules and crate layout | `references/modules.md` |
| Cargo tooling commands | `references/tooling.md` |
| Anti-patterns | `references/anti-patterns.md` |

## Example

```rust
// Good: Propagate errors with context
use anyhow::{Context, Result};

fn load_config(path: &str) -> Result<Config> {
    let content = std::fs::read_to_string(path)
        .with_context(|| format!("failed to read config from {path}"))?;
    Ok(toml::from_str(&content)?)
}
```

## Quick Reference: Rust Idioms

| Idiom | Description |
|-------|-------------|
| Borrow, don't clone | Pass `&T` instead of cloning unless ownership is needed |
| Make illegal states unrepresentable | Use enums to model valid states only |
| `?` over `unwrap()` | Propagate errors, never panic in library/production code |
| Parse, don't validate | Convert unstructured data to typed structs at the boundary |
| Newtype for type safety | Wrap primitives in newtypes to prevent argument swaps |
| Prefer iterators over loops | Declarative chains are clearer and often faster |
| Minimal `pub` surface | Use `pub(crate)` for internal APIs |

## Referências

- `references/ownership.md` — ownership, borrowing, `Cow`
- `references/error-handling.md` — `Result`, `Option`, thiserror/anyhow
- `references/enums.md` — estados como enums, matching exaustivo
- `references/traits-generics.md` — generics, trait objects, newtype
- `references/structs.md` — builder pattern
- `references/iterators.md` — chains, `collect()`
- `references/concurrency.md` — threads, channels, Tokio
- `references/unsafe-code.md` — quando unsafe é aceitável
- `references/modules.md` — layout por domínio, visibilidade
- `references/tooling.md` — comandos cargo
- `references/anti-patterns.md` — o que evitar

**Remember**: If it compiles, it's probably correct — but only if you avoid `unwrap()`, minimize `unsafe`, and let the type system work for you.
