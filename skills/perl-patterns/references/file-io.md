# File I/O

## Three-Argument Open

```perl
use v5.36;

# Good: Three-arg open with autodie (core module, eliminates 'or die')
use autodie;

sub read_file($path) {
    open my $fh, '<:encoding(UTF-8)', $path;
    local $/;
    my $content = <$fh>;
    close $fh;
    return $content;
}

# Bad: Two-arg open (shell injection risk, see perl-security)
open FH, $path;            # NEVER do this
open FH, "< $path";        # Still bad — user data in mode string
```

## Path::Tiny for File Operations

```perl
use v5.36;
use Path::Tiny;

my $file = path('config', 'app.json');
my $content = $file->slurp_utf8;
$file->spew_utf8($new_content);

# Iterate directory
for my $child (path('src')->children(qr/\.pl$/)) {
    say $child->basename;
}
```
