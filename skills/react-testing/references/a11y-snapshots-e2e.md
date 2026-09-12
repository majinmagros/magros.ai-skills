# Accessibility, Snapshots, E2E Boundary and Coverage

## Accessibility Assertions

```tsx
import { axe, toHaveNoViolations } from "jest-axe"; // or vitest-axe
expect.extend(toHaveNoViolations);

test("UserCard has no a11y violations", async () => {
  const { container } = render(<UserCard user={mockUser} />);
  expect(await axe(container)).toHaveNoViolations();
});
```

Run axe in component tests for every interactive component. Catches:

- Missing labels on form inputs
- Invalid ARIA usage
- Poor color contrast (limited — JSDOM has no real CSS engine, so this works for inline styles only; visual contrast belongs in Playwright)
- Missing alt text on images
- Heading order violations

Cross-link: [skills/accessibility/SKILL.md](../accessibility/SKILL.md) for the broader a11y testing playbook.

## When NOT to Use Snapshot Tests

Snapshots of rendered output:

- Break on every styling change
- Get rubber-stamped during review
- Test implementation detail (DOM structure), not behavior

Acceptable snapshot uses:

- Pure data serialization functions (`formatInvoice(invoice)` -> stable string)
- Generated config files (e.g., webpack config output)

For visual regression on components, use Playwright/Cypress screenshots or Percy/Chromatic — actual visual diffs, not DOM strings.

## When to Reach for Playwright / Cypress

JSDOM (used by Vitest/Jest) cannot:

- Render real layout (flexbox, grid, viewport queries)
- Run native browser animation, CSS transitions
- Test scrolling behavior, drag-and-drop, paste from clipboard
- Handle iframes, popups, downloads, cross-origin flows
- Run real network in a controlled environment with full DevTools support

For any of those, use Playwright Component Testing (component test in real browser) or full E2E. See [e2e-testing skill](../e2e-testing/SKILL.md).

Decision boundary:

- A hook, a presentational component, a form with logic -> RTL
- A component whose layout matters or that uses browser APIs not in JSDOM -> Playwright CT
- A full user flow across multiple pages -> Playwright/Cypress E2E

## Coverage Targets

| Layer | Target |
|---|---|
| Pure utilities | >=90% |
| Custom hooks | >=85% |
| Presentational components | >=80% — behavior, not lines |
| Container components | >=70% — golden paths + error states |
| Pages | E2E covered separately; smoke test minimum |

Configure via `vitest.config.ts` / `jest.config.js`:

```ts
// vitest.config.ts
test: {
  coverage: {
    provider: "v8",
    reporter: ["text", "html", "lcov"],
    thresholds: {
      lines: 80,
      functions: 80,
      branches: 70,
      statements: 80,
    },
  },
}
```

## Anti-Patterns

- `container.querySelector("...")` — bypasses accessibility queries, lets tests pass when real users would fail
- Asserting on number of renders — implementation detail
- `jest.mock("react", ...)` — never mock React. Refactor the component instead
- Mocking child components by default — tests the integration, not isolation. Mock only when the child has heavy side effects
- Ignoring `act()` warnings — they signal real bugs (state update after unmount, missing async wrapping)
- Sharing mutable state across tests — flakes when test order changes
- Tests that pass with `it.skip()` removed — your test does not actually assert what you think
