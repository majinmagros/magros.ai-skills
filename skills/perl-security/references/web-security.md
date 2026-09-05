# Web Security

## XSS Prevention

```perl
use v5.36;
use HTML::Entities qw(encode_entities);
use URI::Escape qw(uri_escape_utf8);

# Good: Encode output for HTML context
sub safe_html($user_input) {
    return encode_entities($user_input);
}

# Good: Encode for URL context
sub safe_url_param($value) {
    return uri_escape_utf8($value);
}

# Good: Encode for JSON context
use JSON::MaybeXS qw(encode_json);
sub safe_json($data) {
    return encode_json($data);  # Handles escaping
}

# Template auto-escaping (Mojolicious)
# <%= $user_input %>   — auto-escaped (safe)
# <%== $raw_html %>    — raw output (dangerous, use only for trusted content)

# Template auto-escaping (Template Toolkit)
# [% user_input | html %]  — explicit HTML encoding

# Bad: Raw output in HTML
sub bad_html($input) {
    print "<div>$input</div>";  # XSS if $input contains <script>
}
```

## CSRF Protection

```perl
use v5.36;
use Crypt::URandom qw(urandom);
use MIME::Base64 qw(encode_base64url);

sub generate_csrf_token() {
    return encode_base64url(urandom(32));
}
```

Use constant-time comparison when verifying tokens. Most web frameworks (Mojolicious, Dancer2, Catalyst) provide built-in CSRF protection — prefer those over hand-rolled solutions.

## Session and Header Security

```perl
use v5.36;

# Mojolicious session + headers
$app->secrets(['long-random-secret-rotated-regularly']);
$app->sessions->secure(1);          # HTTPS only
$app->sessions->samesite('Lax');

$app->hook(after_dispatch => sub ($c) {
    $c->res->headers->header('X-Content-Type-Options' => 'nosniff');
    $c->res->headers->header('X-Frame-Options'        => 'DENY');
    $c->res->headers->header('Content-Security-Policy' => "default-src 'self'");
    $c->res->headers->header('Strict-Transport-Security' => 'max-age=31536000; includeSubDomains');
});
```
