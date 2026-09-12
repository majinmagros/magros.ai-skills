---
name: opensource-pipeline
description: "Use when open-source pipeline: fork, sanitize, and package private projects for safe public release. Chains 3 agents (forker, sanitizer, packager). Triggers on \"opensource-pipeline\", \"/opensource\", \"open source this\", \"make this public\"."
metadata:
  origin: ECC
---

# Open-Source Pipeline

Fork → Sanitize → Package: safe public release of private projects. Detalhes em `references/`.

## When to Activate

- User says "open source this project" or "make this public"
- Preparing a private repo for public release
- Stripping secrets before pushing to GitHub
- Verifying (`/opensource verify`) or packaging (`/opensource package`) only
- Listing staged projects or checking pipeline status

## Core Principles

1. **Never skip the sanitizer** — it is the safety gate
2. **Never push without user approval**
3. **FAIL blocks publish** — fix all criticals, max 3 rescans then manual
4. **Parameterize secrets** — `.env.example`, preserve functionality
5. **Stage persists** — `$HOME/opensource-staging/` until cleaned up

## Example

```bash
# /opensource fork my-project  →  fork + sanitize + package
# /opensource verify my-project → sanitizer only (6 scan categories)
ls -d $HOME/opensource-staging/*/
```

## References

- `references/commands.md` — fork|verify|package|list|status + staging layout
- `references/fork.md` — full fork protocol: params, forker, review, publish
- `references/sanitize.md` — 6 scan categories + FAIL policy
- `references/package.md` — packager outputs, anti-patterns, practices

## Checklist

- [ ] License + org/repo + description confirmed with user
- [ ] Sanitizer PASS (or PASS WITH WARNINGS) before packaging
- [ ] No `.env`, `*.pem`, `credentials.json` in staging
- [ ] CLAUDE.md + setup.sh (executable) + README + LICENSE generated
- [ ] GitHub creation only after explicit approval
