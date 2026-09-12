# Change Protocol, Anti-Patterns, Best Practices

## Contract Change Protocol

Never change implementation first and update the contract afterward.

1. Propose the consumer need and compatibility impact.
2. Change the canonical artifact.
3. Review the contract diff with affected consumers and the provider.
4. Regenerate types, clients, or fixtures.
5. Update provider and consumer implementations.
6. Run consumer and provider verification.
7. Merge only when all affected sides agree on the new contract.

For an additive change, verify that old consumers continue to work. For a
breaking change, use the repository's versioning or migration policy rather
than silently repurposing an existing field.

## Anti-Patterns

### FAIL: Provider-Owned Guesswork

```typescript
// Database shape leaks directly to consumers.
return database.query("select * from orders");
```

The storage model now controls the public interface, including accidental
renames and fields the consumer never requested.

### FAIL: Duplicate Sources of Truth

```text
wiki payload example
frontend interface
backend serializer
mock JSON
```

If each copy can change independently, none is authoritative.

### FAIL: Compile-Time Types as the Only Proof

A cast can hide incompatible runtime data:

```typescript
return databaseRow as unknown as OrderSummary;
```

Verify serialized responses, not only local type declarations.

### FAIL: Private Field Changes

Renaming `userName` to `user_name` in one implementation without changing and
reviewing the contract is a breaking change, even if that implementation's
tests remain green.

### FAIL: Contract After Implementation

Generating the contract only after both sides finish records what happened; it
does not coordinate parallel work or prevent drift.

## Best Practices

- Keep one canonical artifact per boundary.
- Design from consumer jobs, then map provider internals at the boundary.
- Make identifiers, nullability, enums, and errors explicit.
- Generate types and mocks where the ecosystem supports it.
- Test real serialized provider output, including alternate paths.
- Treat a contract diff as a cross-team change requiring affected-owner review.
- Prefer a small compatible addition over a speculative general schema.
- Delete handwritten copies once generated or derived versions exist.

## Related Skills

- `api-design` - resource, response, error, pagination, and versioning design
- `ai-regression-testing` - regression tests for response-shape and path drift
- `backend-patterns` - provider-side API and service architecture
- `frontend-patterns` - consumer-side data access and UI integration
- `tdd-workflow` - test-first implementation discipline
