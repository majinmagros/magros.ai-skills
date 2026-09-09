# Isolation Tiers + CI — Filesystem, Job Object, Windows Sandbox, GitHub Actions

Three tiers — use the lightest that satisfies your needs. Tier 1 code lives in `scripts/conftest_isolated.py`; Tier 2 in `scripts/job_object.py`.

| Tier | Isolation | Setup cost | Works on CI | Use when |
|------|-----------|-----------|-------------|----------|
| 1 — `tmp_path` env redirect | Filesystem | Zero | Always | Default for all tests |
| 2 — Job Object | Process tree | Low | Always | Prevent child-process escape |
| 3 — Windows Sandbox | Full OS | Medium | Needs Pro/Enterprise image | Nightly clean-room runs |

## Tier 1 — Filesystem Isolation (default, always use)

Each test gets its own `APPDATA` / `LOCALAPPDATA` / `TEMP` via `subprocess.Popen` + `Application.connect()`. pytest's `tmp_path` handles cleanup. See `scripts/conftest_isolated.py`.

## Tier 2 — Windows Job Object (process-lifetime containment)

Attach the process to a Job Object so it is **automatically terminated** when the fixture's job handle is GC'd. Also prevents child processes escaping cleanup. See `scripts/job_object.py`.

> **Scope:** Job Objects do NOT virtualize filesystem or block network. File-write/network isolation needs AppContainer, Firewall rules, or Tier 3. Tier 2 = process-lifetime + child containment only.

## Tier 3 — Windows Sandbox (CI full-OS isolation)

Clean Windows image per run (no leftover registry/GPU state). **Requires:** Windows 10/11 Pro/Enterprise + virtualization.

Create `e2e-sandbox.wsb` in project root:

```xml
<Configuration>
  <MappedFolders>
    <!-- App binary (read-only) -->
    <MappedFolder>
      <HostFolder>C:\path\to\your\build\Release</HostFolder>
      <SandboxFolder>C:\app</SandboxFolder>
      <ReadOnly>true</ReadOnly>
    </MappedFolder>
    <!-- Test suite (read-write for artifacts) -->
    <MappedFolder>
      <HostFolder>C:\path\to\your\e2e_test</HostFolder>
      <SandboxFolder>C:\e2e_test</SandboxFolder>
      <ReadOnly>false</ReadOnly>
    </MappedFolder>
  </MappedFolders>
  <LogonCommand>
    <!-- Sandbox starts with no Python: install silently, then run -->
    <Command>powershell -Command "
      winget install --id Python.Python.3.11 --silent --accept-package-agreements;
      $env:PATH += ';' + $env:LOCALAPPDATA + '\Programs\Python\Python311\Scripts';
      cd C:\e2e_test;
      pip install -r requirements.txt;
      pytest tests\ -v
    "</Command>
  </LogonCommand>
</Configuration>
```

Launch: `WindowsSandbox.exe e2e-sandbox.wsb`. pywinauto + app both run **inside** the sandbox; artifacts return via mapped folder.

## Prevent Hanging Tests

`pytest-timeout`: `timeout = 60`, `timeout_method = thread` in `pytest.ini` (see `scripts/pytest.ini`). Note: `thread` cannot kill Qt subprocesses on Windows — add `atexit.register(lambda: [p.kill() for p in psutil.Process().children(recursive=True)])` in `conftest.py` to reap orphans.

## CI/CD — GitHub Actions

```yaml
# .github/workflows/e2e-desktop.yml
name: Desktop E2E
on: [push, pull_request]

jobs:
  e2e:
    runs-on: windows-latest   # real GUI environment, no Xvfb needed
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }

      - name: Install deps
        run: pip install pywinauto pytest pytest-html Pillow

      - name: Build app
        run: cmake --build build --config Release  # adjust to your build system

      - name: Run E2E
        env:
          APP_PATH: ${{ github.workspace }}\build\Release\MyApp.exe
          APP_TITLE: "My Application"
          CI: "true"
        run: pytest tests/ --html=artifacts/report.html --self-contained-html --junitxml=artifacts/results.xml -v

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: e2e-artifacts
          path: artifacts/
          retention-days: 14
```
