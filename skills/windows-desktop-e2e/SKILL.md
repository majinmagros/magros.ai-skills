---
name: windows-desktop-e2e
description: "Use when e2E testing for Windows native desktop apps (WPF, WinForms, Win32/MFC, Qt) using pywinauto and Windows UI Automation. Triggers on \"windows-desktop-e2e\", \"windows desktop e2e\"."
metadata:
  origin: ECC
---

# Windows Desktop E2E Testing

E2E for Windows native desktop apps via **pywinauto** + Windows UI Automation (UIA): WPF, WinForms, Win32/MFC, Qt 5.x/6.x. Test harness in `scripts/`, guides in `references/`.

## When to Activate

- Writing or running E2E tests for a Windows native desktop application
- Setting up a desktop GUI test suite from scratch
- Diagnosing flaky or failing desktop automation tests

### When NOT to Use

- Web applications → use `e2e-testing` (Playwright)
- Electron / CEF / WebView2 → browser automation, not UIA
- Mobile apps → UI Automator / XCUITest
- Unit/integration tests without a running GUI

## Core Concepts

UIA stack: your test (Python) → pywinauto (UIA backend) → Windows UI Automation API → app's UIA provider → running .exe. Reliability: WPF 5/5 (`x:Name` = AutomationId), WinForms 4/5 (`AccessibleName`), WinUI 5/5, Qt 6 5/5, Qt 5.15+ 4/5, Qt 5.7–5.14 3/5 (needs `QT_ACCESSIBILITY=1`), Win32/MFC 3/5.

```bash
pip install pywinauto pytest pytest-html Pillow pytest-timeout  # Python 3.8+, Windows
```

Rule #1: give every interactive control a stable **AutomationId** before writing tests (`references/setup-testability.md` per framework + Qt guide in `references/qt-guide.md`).

## Harness (`scripts/`)

```
tests/
├── conftest.py / conftest_isolated.py  # basic fixture / Tier-1 isolated fixture
├── pytest.ini · config.py              # env-driven config, smoke/flaky markers, HTML report
├── pages/base_page.py                  # by_id/by_name/by_class, waits, click/type/get_text, screenshot
└── pages/login_page.py                 # example page object
```

- **Locators:** AutomationId > Name > ClassName+index > XPath. Explore with `win.print_control_identifiers()` or Accessibility Insights.
- **Waits:** `wait_visible` / `wait_gone` / `wait_window` / `wait_until(fn)` — never `time.sleep()` as primary sync.
- **Artifacts:** `page.screenshot(name)`, fullscreen via pyautogui, ffmpeg recording; opt-in per-step trace (`E2E_TRACE=1`, redacts text by default — see `scripts/trace_patch.py`).
- **Flaky fixes:** `wait_visible` over sleep; `set_focus()`; wait out animations; `wait_window` for dialogs; Qt5 `set_edit_text` falls back to keyboard (built into `type_text`); `win.restore()` if minimised; quarantine with `skip` + issue link.
- **Isolation tiers** (`references/isolation-ci.md`): T1 tmp env redirect (default) → T2 Job Object (`scripts/job_object.py`) → T3 Windows Sandbox (nightly). Plus `pytest-timeout` + orphan reaping.
- **CI:** `windows-latest` runner, build app, `pytest` with HTML+JUnit, upload artifacts (`references/isolation-ci.md`) — `APP_PATH`/`APP_TITLE` via env.
- **Screenshot fallback** (`references/screenshot-mode.md`): template matching + DPI pinning + `debug_match` — UIA first, always.

```bash
# All / smoke / single file / flake hunt
pytest tests/ -v
pytest tests/ -m smoke -v
APP_PATH="C:\build\Release\MyApp.exe" APP_TITLE="MyApp" pytest tests/ -v
pip install pytest-repeat && pytest tests/test_login.py --count=5 -v
```

## Anti-Patterns (resumo)

Fixed `sleep` → condition wait · class+index as primary → AutomationId · pixel asserts → content/state asserts · session-scoped app fixture → function-scoped fresh process.

## Related Skills

- `e2e-testing` — Playwright E2E for web applications
- `cpp-testing` — C++ unit/integration testing with GoogleTest
- `cpp-coding-standards` — C++ code style and patterns
