## MCP Tools Reference

When the `mcp-atlassian` MCP server is configured, these tools are available:

| Tool | Purpose | Example |
|------|---------|---------|
| `jira_search` | JQL queries | `project = PROJ AND status = "In Progress"` |
| `jira_get_issue` | Fetch full issue details by key | `PROJ-1234` |
| `jira_create_issue` | Create issues (Task, Bug, Story, Epic) | New bug report |
| `jira_update_issue` | Update fields (summary, description, assignee) | Change assignee |
| `jira_transition_issue` | Change status | Move to "In Review" |
| `jira_add_comment` | Add comments | Progress update |
| `jira_get_sprint_issues` | List issues in a sprint | Active sprint review |
| `jira_create_issue_link` | Link issues (Blocks, Relates to) | Dependency tracking |
| `jira_get_issue_development_info` | See linked PRs, branches, commits | Dev context |

> **Tip:** Always call `jira_get_transitions` before transitioning — transition IDs vary per project workflow.

## Direct REST API Reference

### Fetch a Ticket

```bash
jira_curl \
  -H "Content-Type: application/json" \
  "$JIRA_URL/rest/api/3/issue/PROJ-1234" | jq '{
    key: .key,
    summary: .fields.summary,
    status: .fields.status.name,
    priority: .fields.priority.name,
    type: .fields.issuetype.name,
    assignee: .fields.assignee.displayName,
    labels: .fields.labels,
    description: .fields.description
  }'
```

### Fetch Comments

```bash
jira_curl \
  -H "Content-Type: application/json" \
  "$JIRA_URL/rest/api/3/issue/PROJ-1234?fields=comment" | jq '.fields.comment.comments[] | {
    author: .author.displayName,
    created: .created[:10],
    body: .body
  }'
```

### Add a Comment

```bash
jira_curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "version": 1,
      "type": "doc",
      "content": [{
        "type": "paragraph",
        "content": [{"type": "text", "text": "Your comment here"}]
      }]
    }
  }' \
  "$JIRA_URL/rest/api/3/issue/PROJ-1234/comment"
```

### Transition a Ticket

```bash
# 1. Get available transitions
jira_curl \
  "$JIRA_URL/rest/api/3/issue/PROJ-1234/transitions" | jq '.transitions[] | {id, name: .name}'

# 2. Execute transition (replace TRANSITION_ID)
jira_curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"transition": {"id": "TRANSITION_ID"}}' \
  "$JIRA_URL/rest/api/3/issue/PROJ-1234/transitions"
```

### Search with JQL

```bash
jira_curl -G \
  --data-urlencode "jql=project = PROJ AND status = 'In Progress'" \
  "$JIRA_URL/rest/api/3/search"
```
