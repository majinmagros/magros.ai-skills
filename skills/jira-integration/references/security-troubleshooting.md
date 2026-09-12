## Security Guidelines

- **Never hardcode** Jira API tokens in source code or skill files
- **Always use** environment variables or a secrets manager
- **Add `.env`** to `.gitignore` in every project
- **Rotate tokens** immediately if exposed in git history
- **Use least-privilege** API tokens scoped to required projects
- **Validate** that credentials are set before making API calls — fail fast with a clear message

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Invalid or expired API token | Regenerate at id.atlassian.com |
| `403 Forbidden` | Token lacks project permissions | Check token scopes and project access |
| `404 Not Found` | Wrong ticket key or base URL | Verify `JIRA_URL` and ticket key |
| `spawn uvx ENOENT` | IDE cannot find `uvx` on PATH | Use full path (e.g., `~/.local/bin/uvx`) or set PATH in `~/.zprofile` |
| Connection timeout | Network/VPN issue | Check VPN connection and firewall rules |

## Best Practices

- Update Jira as you go, not all at once at the end
- Keep comments concise but informative
- Link rather than copy — point to PRs, test reports, and dashboards
- Use @mentions if you need input from others
- Check linked issues to understand full feature scope before starting
- If acceptance criteria are vague, ask for clarification before writing code
