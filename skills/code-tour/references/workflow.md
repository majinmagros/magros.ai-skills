# Workflow

## When NOT to Use

| Instead of code-tour | Use |
| --- | --- |
| A one-off explanation in chat is enough | answer directly |
| The user wants prose docs, not a `.tour` artifact | `documentation-lookup` or repo docs editing |
| The task is implementation or refactoring | do the implementation work |
| The task is broad codebase onboarding without a tour artifact | `codebase-onboarding` |

## 1. Discover

Explore the repo before writing anything:

- README and package/app entry points
- folder structure
- relevant config files
- the changed files if the tour is PR-focused

Do not start writing steps before you understand the shape of the code.

## 2. Infer the reader

Decide the persona and depth from the request.

| Request shape | Persona | Suggested depth |
| --- | --- | --- |
| "onboarding", "new joiner" | `new-joiner` | 9-13 steps |
| "quick tour", "vibe check" | `vibecoder` | 5-8 steps |
| "architecture" | `architect` | 14-18 steps |
| "tour this PR" | `pr-reviewer` | 7-11 steps |
| "why did this break" | `rca-investigator` | 7-11 steps |
| "security review" | `security-reviewer` | 7-11 steps |
| "explain how this feature works" | `feature-explainer` | 7-11 steps |
| "debug this path" | `bug-fixer` | 7-11 steps |

## 3. Read and verify anchors

Every file path and line anchor must be real:

- confirm the file exists
- confirm the line numbers are in range
- if using a selection, verify the exact block
- if the file is volatile, prefer a pattern-based anchor

Never guess line numbers.

## 4. Write the `.tour`

Write to:

```text
.tours/<persona>-<focus>.tour
```

Keep the path deterministic and readable.

## 5. Validate

Before finishing:

- every referenced path exists
- every line or selection is valid
- the first step is anchored to a real file or directory
- the `ref` points at a branch or commit that actually has every file the tour references (see below)
- the tour tells a coherent story rather than listing files

# The `ref` Field

`ref` ties the tour to a git branch or commit. It matters more than it looks: when `ref` is not the branch the reader has checked out, CodeTour opens each step's file from that revision in git, not from the files on disk. If a file is not in that revision, the step will not open — the reader sees *"The editor could not be opened because the file was not found"* even though the file is sitting right there. The tour and its comments still show, so the real cause is easy to miss.

Pick `ref` by tour type:

| Tour type | Set `ref` to |
| --- | --- |
| PR tour | the PR branch — never the base branch |
| Onboarding / architecture | the branch the reader will be on (often `main`), or leave it out |
| Not sure | leave `ref` out, so CodeTour reads files straight from disk |

The PR case is the common trap: a PR usually adds new files, and new files do not exist on the base branch yet. Point `ref` at the base (e.g. `develop`) and every step on a new file fails to open.

Before finishing, confirm each step's file actually exists at the `ref` you chose.
