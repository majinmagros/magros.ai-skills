# Scope Control and Integration

This audit is expensive. Scope it appropriately:

- **Full app audit:** launching or after major refactor. Launch parallel agents per page.
- **Single page audit:** after building a new page or a user-reported broken button.
- **Store-focused audit:** after modifying a Zustand store — audit all consumers of the changed actions.

## Recommended Agent Split for Full App

```
Agent 1: Map ALL state stores (state-stores.md) — shared context for all others
Agent 2: Dashboard (Tasks, Notes, Journal, Ideas)
Agent 3: Chat (DanteChatColumn, JustChatPage)
Agent 4: Emails (ThreadList, DraftArea, EmailsPage)
Agent 5: Projects (ProjectsPage, ProjectOverviewTab, NewProjectWizard)
Agent 6: CRM (all sub-tabs)
Agent 7: Profile, Settings, Vault, Notifications
Agent 8: Management Suite (all pages)
```

Agent 1 MUST complete first. Its output is input for all other agents.

## When NOT to Use

- API-level bugs (wrong response shape, missing endpoint) — use systematic-debugging
- Styling/layout issues — visual inspection
- Performance issues — profiling tools

## Integration with Other Skills

- Run AFTER `/superpowers:systematic-debugging` (which finds the other 54 bug types)
- Run BEFORE `/superpowers:verification-before-completion` (which verifies fixes work)
- Feeds into `/superpowers:test-driven-development` — every bug found here should get a test
