---
name: perl-patterns
description: "Use when modern Perl 5.36+ idioms, best practices, and conventions for building robust, maintainable Perl applications. Only for Perl — not for other languages. Triggers on \"perl-patterns\", \"perl patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Modern Perl Development Patterns

Idiomatic Perl 5.36+ patterns and best practices for building robust, maintainable applications.

## When to Activate

- Writing new Perl code or modules
- Reviewing Perl code for idiom compliance
- Refactoring legacy Perl to modern standards
- Designing Perl module architecture
- Migrating pre-5.36 code to modern Perl

## When NOT to Use

- Other languages (use `python-patterns`, `golang-patterns`, etc.)
- Perl security review specifically (use `perl-security`)

## How It Works

Apply these patterns as a bias toward modern Perl 5.36+ defaults: signatures, explicit modules, focused error handling, and testable boundaries. The examples below are meant to be copied as starting points, then tightened for the actual app, dependency stack, and deployment model in front of you.

## Contents

| Topic | Reference |
|---|---|
| Core principles (pragma, signatures, context, deref, `isa`) | `references/core-principles.md` |
| Error handling (eval/die, Try::Tiny, try/catch) | `references/error-handling.md` |
| Modern OO (Moo, roles, native class) | `references/modern-oo.md` |
| Regular expressions | `references/regex.md` |
| Data structures and references | `references/data-structures.md` |
| File I/O (three-arg open, Path::Tiny) | `references/file-io.md` |
| Module organization and Exporter | `references/modules.md` |
| Tooling (perltidy, perlcritic, carton) | `references/tooling.md` |

## Quick Reference: Modern Perl Idioms

| Legacy Pattern | Modern Replacement |
|---|---|
| `use strict; use warnings;` | `use v5.36;` |
| `my ($x, $y) = @_;` | `sub foo($x, $y) { ... }` |
| `@{ $ref }` | `$ref->@*` |
| `%{ $ref }` | `$ref->%*` |
| `open FH, "< $file"` | `open my $fh, '<:encoding(UTF-8)', $file` |
| `blessed hashref` | `Moo` class with types |
| `$1, $2, $3` | `$+{name}` (named captures) |
| `eval { }; if ($@)` | `Try::Tiny` or native `try/catch` (5.40+) |
| `BEGIN { require Exporter; }` | `use Exporter 'import';` |
| Manual file ops | `Path::Tiny` |
| `blessed($o) && $o->isa('X')` | `$o isa 'X'` (5.32+) |
| `builtin::true / false` | `use builtin 'true', 'false';` (5.36+, experimental) |

## Anti-Patterns

```perl
# 1. Two-arg open (security risk)
open FH, $filename;                     # NEVER

# 2. Indirect object syntax (ambiguous parsing)
my $obj = new Foo(bar => 1);            # Bad
my $obj = Foo->new(bar => 1);           # Good

# 3. Excessive reliance on $_
map { process($_) } grep { validate($_) } @items;  # Hard to follow
my @valid = grep { validate($_) } @items;           # Better: break it up
my @results = map { process($_) } @valid;

# 4. Disabling strict refs
no strict 'refs';                        # Almost always wrong
${"My::Package::$var"} = $value;         # Use a hash instead

# 5. Global variables as configuration
our $TIMEOUT = 30;                       # Bad: mutable global
use constant TIMEOUT => 30;              # Better: constant
# Best: Moo attribute with default

# 6. String eval for module loading
eval "require $module";                  # Bad: code injection risk
eval "use $module";                      # Bad
use Module::Runtime 'require_module';    # Good: safe module loading
require_module($module);
```

## Referências

- `references/core-principles.md` — pragma, signatures, contexto
- `references/error-handling.md` — eval/die, Try::Tiny, try/catch
- `references/modern-oo.md` — Moo, roles, class nativa
- `references/regex.md` — named captures, precompiled
- `references/data-structures.md` — referencias, slices
- `references/file-io.md` — open 3-arg, Path::Tiny
- `references/modules.md` — layout, Exporter
- `references/tooling.md` — perltidy, perlcritic, carton

**Remember**: Modern Perl is clean, readable, and safe. Let `use v5.36` handle the boilerplate, use Moo for objects, and prefer CPAN's battle-tested modules over hand-rolled solutions.
