---
name: perl-security
description: "Use when comprehensive Perl security covering taint mode, input validation, safe process execution, DBI parameterized queries, web security (XSS/SQLi/CSRF), and perlcritic security policies. Only for Perl — not for other languages. Triggers on \"perl-security\", \"perl security\", \"security\"."
metadata:
  origin: ECC
---

# Perl Security Patterns

Comprehensive security guidelines for Perl applications covering input validation, injection prevention, and secure coding practices.

## When to Activate

- Handling user input in Perl applications
- Building Perl web applications (CGI, Mojolicious, Dancer2, Catalyst)
- Reviewing Perl code for security vulnerabilities
- Performing file operations with user-supplied paths
- Executing system commands from Perl
- Writing DBI database queries

## When NOT to Use

- Other languages (use `django-security`, `laravel-security`, `security-review`, etc.)
- General Perl idioms (use `perl-patterns`)
- Automated SaaS scanning (use `vibe-security-scanner`)

## How It Works

Start with taint-aware input boundaries, then move outward: validate and untaint inputs, keep filesystem and process execution constrained, and use parameterized DBI queries everywhere. The examples below show the safe defaults this skill expects you to apply before shipping Perl code that touches user input, the shell, or the network.

## Contents

| Topic | Reference |
|---|---|
| Taint mode (`-T`, untainting) | `references/taint-mode.md` |
| Input validation (allowlist, length) | `references/input-validation.md` |
| Safe regex (ReDoS prevention) | `references/safe-regex.md` |
| Safe file ops (three-arg open, TOCTOU) | `references/safe-file-ops.md` |
| Safe process execution (list-form) | `references/safe-process.md` |
| SQL injection (DBI placeholders, ORM) | `references/sql-injection.md` |
| Web security (XSS, CSRF, sessions) | `references/web-security.md` |
| Tooling (perlcritic policies, CI) | `references/security-tooling.md` |

## Output Encoding

Always encode output for its context: `HTML::Entities::encode_entities()` for HTML, `URI::Escape::uri_escape_utf8()` for URLs, `JSON::MaybeXS::encode_json()` for JSON.

## CPAN Module Security

- **Pin versions** in cpanfile: `requires 'DBI', '== 1.643';`
- **Prefer maintained modules**: Check MetaCPAN for recent releases
- **Minimize dependencies**: Each dependency is an attack surface

## Quick Security Checklist

| Check | What to Verify |
|---|---|
| Taint mode | `-T` flag on CGI/web scripts |
| Input validation | Allowlist patterns, length limits |
| File operations | Three-arg open, path traversal checks |
| Process execution | List-form system, no shell interpolation |
| SQL queries | DBI placeholders, never interpolate |
| HTML output | `encode_entities()`, template auto-escape |
| CSRF tokens | Generated, verified on state-changing requests |
| Session config | Secure, HttpOnly, SameSite cookies |