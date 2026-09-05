# Core Principles

## 1. Use `v5.36` Pragma

A single `use v5.36` replaces the old boilerplate and enables strict, warnings, and subroutine signatures.

```perl
# Good: Modern preamble
use v5.36;

sub greet($name) {
    say "Hello, $name!";
}

# Bad: Legacy boilerplate
use strict;
use warnings;
use feature 'say', 'signatures';
no warnings 'experimental::signatures';

sub greet {
    my ($name) = @_;
    say "Hello, $name!";
}
```

## 2. Subroutine Signatures

Use signatures for clarity and automatic arity checking.

```perl
use v5.36;

# Good: Signatures with defaults
sub connect_db($host, $port = 5432, $timeout = 30) {
    # $host is required, others have defaults
    return DBI->connect("dbi:Pg:host=$host;port=$port", undef, undef, {
        RaiseError => 1,
        PrintError => 0,
    });
}

# Good: Slurpy parameter for variable args
sub log_message($level, @details) {
    say "[$level] " . join(' ', @details);
}

# Bad: Manual argument unpacking
sub connect_db {
    my ($host, $port, $timeout) = @_;
    $port    //= 5432;
    $timeout //= 30;
    # ...
}
```

## 3. Context Sensitivity

Understand scalar vs list context — a core Perl concept.

```perl
use v5.36;

my @items = (1, 2, 3, 4, 5);

my @copy  = @items;            # List context: all elements
my $count = @items;            # Scalar context: count (5)
say "Items: " . scalar @items; # Force scalar context
```

## 4. Postfix Dereferencing

Use postfix dereference syntax for readability with nested structures.

```perl
use v5.36;

my $data = {
    users => [
        { name => 'Alice', roles => ['admin', 'user'] },
        { name => 'Bob',   roles => ['user'] },
    ],
};

# Good: Postfix dereferencing
my @users = $data->{users}->@*;
my @roles = $data->{users}[0]{roles}->@*;
my %first = $data->{users}[0]->%*;

# Bad: Circumfix dereferencing (harder to read in chains)
my @users = @{ $data->{users} };
my @roles = @{ $data->{users}[0]{roles} };
```

## 5. The `isa` Operator (5.32+)

Infix type-check — replaces `blessed($o) && $o->isa('X')`.

```perl
use v5.36;
if ($obj isa 'My::Class') { $obj->do_something }
```
