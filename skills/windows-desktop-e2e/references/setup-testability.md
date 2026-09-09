# Setup & Testability — UIA, prerequisites, stable AutomationIds per framework

## UIA quality by framework

| Framework | AutomationId | Reliability | Notes |
|-----------|-------------|-------------|-------|
| WPF | 5/5 | Excellent | `x:Name` maps directly to AutomationId |
| WinForms | 4/5 | Good | `AccessibleName` = AutomationId |
| UWP / WinUI 3 | 5/5 | Excellent | Full Microsoft support |
| Qt 6.x | 5/5 | Excellent | Accessibility enabled by default; class names change to `Qt6*` |
| Qt 5.15+ | 4/5 | Good | Improved Accessibility module |
| Qt 5.7–5.14 | 3/5 | Fair | Needs `QT_ACCESSIBILITY=1`; objectName manual |
| Win32 / MFC | 3/5 | Fair | Control IDs accessible; text matching common |

```
Your test (Python)
    └── pywinauto (UIA backend)
        └── Windows UI Automation API   ← built into Windows, framework-agnostic
            └── App's UIA provider      ← each framework ships its own
                └── Running .exe
```

## Prerequisites

```bash
# Python 3.8+, Windows only
pip install pywinauto pytest pytest-html Pillow pytest-timeout
# Optional: screen recording — install ffmpeg and add to PATH
```

```python
from pywinauto import Desktop
Desktop(backend="uia").windows()  # lists all top-level windows
```

Install **Accessibility Insights for Windows** (free, Microsoft) — DevTools equivalent for inspecting the UIA tree before writing tests.

## Stable AutomationIds (highest-ROI step — do before writing tests)

### WPF

```xml
<!-- XAML: x:Name becomes AutomationId automatically -->
<TextBox x:Name="usernameInput" />
<PasswordBox x:Name="passwordInput" />
<Button x:Name="btnLogin" Content="Login" />
<TextBlock x:Name="lblError" />
```

### WinForms

```csharp
// Set in designer or code
usernameInput.AccessibleName = "usernameInput";
passwordInput.AccessibleName = "passwordInput";
btnLogin.AccessibleName = "btnLogin";
lblError.AccessibleName = "lblError";
```

### Win32 / MFC

```cpp
// Control resource IDs in .rc file are exposed as AutomationId strings
// IDC_EDIT_USERNAME -> AutomationId "1001"
// Prefer SetWindowText for Name; add IAccessible for richer support
```

### Qt — see `qt-guide.md`
