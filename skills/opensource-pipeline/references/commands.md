# Commands

| Command | Action |
|---------|--------|
| `/opensource fork PROJECT` | Full pipeline: fork + sanitize + package |
| `/opensource verify PROJECT` | Run sanitizer on existing repo |
| `/opensource package PROJECT` | Generate CLAUDE.md + setup.sh + README |
| `/opensource list` | Show all staged projects |
| `/opensource status PROJECT` | Show reports for a staged project |

## /opensource list

```bash
ls -d $HOME/opensource-staging/*/
```

Show each project with pipeline progress (FORK_REPORT.md, SANITIZATION_REPORT.md, CLAUDE.md presence).

## /opensource status PROJECT

```bash
cat $HOME/opensource-staging/${PROJECT}/SANITIZATION_REPORT.md
cat $HOME/opensource-staging/${PROJECT}/FORK_REPORT.md
```

# Staging Layout

```
$HOME/opensource-staging/
  my-project/
    FORK_REPORT.md           # From forker agent
    SANITIZATION_REPORT.md   # From sanitizer agent
    CLAUDE.md                # From packager agent
    setup.sh                 # From packager agent
    README.md                # From packager agent
    .env.example             # From forker agent
    ...                      # Sanitized project files
```
