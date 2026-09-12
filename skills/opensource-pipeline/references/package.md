# /opensource package PROJECT

Run packager independently. Ask for "License?" and "Description?", then:

```
Agent(
  subagent_type="opensource-packager",
  prompt="Package: {resolved_path} ..."
)
```

# Packager Outputs

1. CLAUDE.md (commands, architecture, key files)
2. setup.sh (one-command bootstrap, make executable)
3. README.md (or enhance existing)
4. LICENSE
5. CONTRIBUTING.md
6. .github/ISSUE_TEMPLATE/ (bug_report.md, feature_request.md)

# Anti-Patterns

- **Never** push to GitHub without user approval
- **Never** skip the sanitizer — it is the safety gate
- **Never** proceed after a sanitizer FAIL without fixing all critical findings
- **Never** leave `.env`, `*.pem`, or `credentials.json` in the staging directory

# Best Practices

- Always run the full pipeline (fork → sanitize → package) for new releases
- The staging directory persists until explicitly cleaned up — use it for review
- Re-run the sanitizer after any manual fixes before publishing
- Parameterize secrets rather than deleting them — preserve project functionality

# Related Skills

See `security-review` for secret detection patterns used by the sanitizer.
