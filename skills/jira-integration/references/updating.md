## Updating Tickets

### When to Update

| Workflow Step | Jira Update |
|---|---|
| Start work | Transition to "In Progress" |
| Tests written | Comment with test coverage summary |
| Branch created | Comment with branch name |
| PR/MR created | Comment with link, link issue |
| Tests passing | Comment with results summary |
| PR/MR merged | Transition to "Done" or "In Review" |

### Comment Templates

**Starting Work:**
```
Starting implementation for this ticket.
Branch: feat/PROJ-1234-feature-name
```

**Tests Implemented:**
```
Automated tests implemented:

Unit Tests:
- [test file 1] — [what it covers]
- [test file 2] — [what it covers]

Integration Tests:
- [test file] — [endpoints/flows covered]

All tests passing locally. Coverage: XX%
```

**PR Created:**
```
Pull request created:
[PR Title](https://github.com/org/repo/pull/XXX)

Ready for review.
```

**Work Complete:**
```
Implementation complete.

PR merged: [link]
Test results: All passing (X/Y)
Coverage: XX%
```
