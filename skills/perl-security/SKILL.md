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
| HTTP headers | CSP, X-Frame-Options, HSTS |
| Dependencies | Pinned versions, audited modules |
| Regex safety | No nested quantifiers, anchored patterns |
| Error messages | No stack traces or paths leaked to users |

## Anti-Patterns

```perl
# 1. Two-arg open with user data (command injection)
open my $fh, $user_input;               # CRITICAL vulnerability

# 2. String-form system (shell injection)
system("convert $user_file output.png"); # CRITICAL vulnerability

# 3. SQL string interpolation
$dbh->do("DELETE FROM users WHERE id = $id");  # SQLi

# 4. eval with user input (code injection)
eval $user_code;                         # Remote code execution

# 5. Trusting $ENV without sanitizing
my $path = $ENV{UPLOAD_DIR};             # Could be manipulated
system("ls $path");                      # Double vulnerability

# 6. Disabling taint without validation
($input) = $input =~ /(.*)/s;           # Lazy untaint — defeats purpose

# 7. Raw user data in HTML
print "<div>Welcome, $username!</div>";  # XSS

# 8. Unvalidated redirects
print $cgi->redirect($user_url);         # Open redirect
```

## Referências

- `references/taint-mode.md` — `-T`, untainting
- `references/input-validation.md` — allowlist, limites
- `references/safe-regex.md` — ReDoS
- `references/safe-file-ops.md` — open 3-arg, TOCTOU, traversal
- `references/safe-process.md` — list-form system/exec
- `references/sql-injection.md` — placeholders, allowlists, ORM
- `references/web-security.md` — XSS, CSRF, sessoes
- `references/security-tooling.md` — perlcritic, CI

**Remember**: Perl's flexibility is powerful but requires discipline. Use taint mode for web-facing code, validate all input with allowlists, use DBI placeholders for every query, and encode all output for its context. Defense in depth — never rely on a single layer.
