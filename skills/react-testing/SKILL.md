---
name: react-testing
description: "Use when writing or fixing tests for React components, hooks, or pages with Testing Library, Vitest/Jest, MSW, and axe. Triggers on \"react-testing\", \"react testing\", \"testing\"."
metadata:
  origin: ECC
---

# React Testing

Behavior-focused React component, hook, and page tests. Detalhes em `references/`.

## When to Activate

- Writing tests for React components, custom hooks, or pages
- Adding test coverage to legacy untested components
- Migrating from Enzyme or class-component-era patterns to React Testing Library
- Setting up Vitest or Jest for a new React project
- Mocking HTTP requests in tests
- Asserting accessibility violations

## Core Principles

1. **Test behavior, not internals** — visible output and side effects, never state/props/render counts
2. **Accessible queries first** — `getByRole` > semantic > `getByTestId` (last resort)
3. **`userEvent` over `fireEvent`** — `setup()` once per test, always `await`
4. **Async via `findBy`/`waitFor`** — never `setTimeout` + assertion
5. **MSW at the network layer** — `onUnhandledRequest: "error"`, per-test `server.use` overrides

## Example

```tsx
test("submits the form", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<UserForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("Email"), "user@example.com");
  await user.click(screen.getByRole("button", { name: /save/i }));

  expect(onSubmit).toHaveBeenCalledWith({ email: "user@example.com" });
});
```

## References

- `references/queries-interaction.md` — runner choice, query priority, `userEvent`, async patterns
- `references/network-providers.md` — MSW setup/override, provider wrapping, hook testing
- `references/a11y-snapshots-e2e.md` — axe, snapshot limits, Playwright/Cypress boundary, coverage, anti-patterns
- `references/tdd-commands-examples.md` — TDD workflow, test commands, related, full examples

## Checklist

- [ ] Queries by role/label, `getByTestId` only as escape hatch
- [ ] Providers wrapped once in `test-utils`; QueryClient `retry: false`
- [ ] MSW `onUnhandledRequest: "error"`; no unmocked network passes silently
- [ ] axe green on interactive components; no DOM snapshots
- [ ] RTL for logic, Playwright CT for browser APIs, E2E for multi-page flows
