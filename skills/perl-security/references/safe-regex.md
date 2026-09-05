# Safe Regular Expressions

## ReDoS Prevention

Catastrophic backtracking occurs with nested quantifiers on overlapping patterns.

```perl
use v5.36;

# Bad: Vulnerable to ReDoS (exponential backtracking)
my $bad_re = qr/^(a+)+$/;           # Nested quantifiers
my $bad_re2 = qr/^([a-zA-Z]+)*$/;   # Nested quantifiers on class
my $bad_re3 = qr/^(.*?,){10,}$/;    # Repeated greedy/lazy combo

# Good: Rewrite without nesting
my $good_re = qr/^a+$/;             # Single quantifier
my $good_re2 = qr/^[a-zA-Z]+$/;     # Single quantifier on class

# Good: Use possessive quantifiers or atomic groups to prevent backtracking
my $safe_re = qr/^[a-zA-Z]++$/;             # Possessive (5.10+)
my $safe_re2 = qr/^(?>a+)$/;                # Atomic group

# Good: Enforce timeout on untrusted patterns
use POSIX qw(alarm);
sub safe_match($string, $pattern, $timeout = 2) {
    my $matched;
    eval {
        local $SIG{ALRM} = sub { die "Regex timeout\n" };
        alarm($timeout);
        $matched = $string =~ $pattern;
        alarm(0);
    };
    alarm(0);
    die $@ if $@;
    return $matched;
}
```
