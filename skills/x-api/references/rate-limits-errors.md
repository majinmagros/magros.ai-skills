# Rate Limits, Errors, Security

> Drift-prone: endpoints, tiers, quotas, and write permissions change frequently. Verify current developer docs and account access before quoting limits or implementing a flow.

## Rate Limits

Limits vary by endpoint, auth method, and account tier, and change over time. Always check current docs, read `x-rate-limit-remaining` / `x-rate-limit-reset` at runtime, and back off automatically.

```python
import time

remaining = int(resp.headers.get("x-rate-limit-remaining", 0))
if remaining < 5:
    reset = int(resp.headers.get("x-rate-limit-reset", 0))
    wait = max(0, reset - int(time.time()))
    print(f"Rate limit approaching. Resets in {wait}s")
```

## Error Handling

```python
resp = oauth.post("https://api.x.com/2/tweets", json={"text": content})
if resp.status_code == 201:
    return resp.json()["data"]["id"]
elif resp.status_code == 429:
    reset = int(resp.headers["x-rate-limit-reset"])
    raise Exception(f"Rate limited. Resets at {reset}")
elif resp.status_code == 403:
    raise Exception(f"Forbidden: {resp.json().get('detail', 'check permissions')}")
else:
    raise Exception(f"X API error {resp.status_code}: {resp.text}")
```

## Security

- Never hardcode tokens. Use environment variables or `.env` files.
- Never commit `.env` files. Add to `.gitignore`.
- Rotate tokens if exposed. Regenerate at developer.x.com.
- Use read-only tokens when write access is not needed.
- Store OAuth secrets securely — not in source code or logs.
