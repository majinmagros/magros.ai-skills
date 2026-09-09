---
name: perl-testing
description: "Use when perl testing patterns using Test2::V0, Test::More, prove runner, mocking, coverage with Devel::Cover, and TDD methodology. Triggers on \"perl-testing\", \"perl testing\", \"testing\"."
metadata:
  origin: ECC
---

# Perl Testing Patterns

Comprehensive testing strategies for Perl applications using Test2::V0, Test::More, prove, and TDD methodology. Code in `references/`.

## When to Activate

- Writing new Perl code (follow TDD: red, green, refactor)
- Designing test suites for Perl modules or applications
- Reviewing Perl test coverage
- Setting up Perl testing infrastructure
- Migrating tests from Test::More to Test2::V0
- Debugging failing Perl tests

## Workflow (resumo)

**TDD red-green-refactor** (`tdd-testmore.md`): failing subtest → minimal `Moo` impl → `prove -lv`. **Test::More**: `is/isnt/ok/is_deeply/like/isa_ok/can_ok` + `done_testing`; `SKIP:` conditional + `TODO:` expected failures. **Test2::V0** (`test2.md`): hash/array/bag builders (`etc()`, `DNE()`), cleaner subtests, `dies`/`lives`/`warns` exception testing. **prove** (`prove-fixtures.md`): `t/` layout (00-load, unit/, integration/, lib/, fixtures/), `-lvr -j8`, `--state=failed`, `.proverc`, JUnit for CI; tempdir fixtures + `t/lib` helpers; `Test::MockModule` (auto-restores on scope exit — never bare monkey-patch). **Coverage** (`coverage.md`): `cover -test`, HTML report, CI gate at 80%, in-memory SQLite integration tests.

```bash
prove -lr -j8 t/                                   # tudo, paralelo
cover -test && cover -report html                  # cobertura
```

## Best Practices

**DO:** TDD red-green-refactor · Test2::V0 for new code · subtests for grouping/isolation · mock boundaries (network/DB/FS) · always `prove -l` · clear names (`'user login with invalid password fails'`) · edge cases (empty/undef/zero/boundary) · 80%+ coverage on business logic · fast tests (mock I/O, in-memory DBs.

**DON'T:** test internals (behavior/output only) · share state between subtests · skip `done_testing` · over-mock (boundaries only) · Test::More for new projects · ignore failures · test CPAN modules · brittle over-specific string matching.

## Quick Reference

| Task | Command / Pattern |
|---|---|
| Run all tests | `prove -lr t/` |
| Run one test verbose | `prove -lv t/unit/user.t` |
| Parallel test run | `prove -lr -j8 t/` |
| Coverage report | `cover -test && cover -report html` |
| Test equality | `is($got, $expected, 'label')` |
| Deep comparison | `is($got, hash { field k => 'v'; etc() }, 'label')` |
| Test exception | `like(dies { ... }, qr/msg/, 'label')` |
| Test no exception | `ok(lives { ... }, 'label')` |
| Mock a method | `Test::MockModule->new('Pkg')->mock(m => sub { ... })` |
| Skip tests | `SKIP: { skip 'reason', $count unless $cond; ... }` |
| TODO tests | `TODO: { local $TODO = 'reason'; ... }` |

## Common Pitfalls

- **Forgetting `done_testing`** — silent bugs if test code is skipped; always end with it
- **Missing `-l` flag** — `Can't locate MyApp/User.pm in @INC`; always `prove -l`
- **Over-mocking** — mock the dependency, not the code under test
- **Test pollution** — `my` inside subtests, never `our`

**Remember**: Tests are your safety net. Keep them fast, focused, and independent. Use Test2::V0 for new projects, prove for running, and Devel::Cover for accountability.
