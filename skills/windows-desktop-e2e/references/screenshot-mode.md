# Screenshot Mode (Fallback) — Template matching when UIA can't see a control

Use only for genuinely unreachable controls (self-drawn, third-party, game engine). Always try UIA first.

```bash
pip install pyautogui Pillow opencv-python
```

```python
import pyautogui, cv2, numpy as np
from PIL import Image

def find_image_on_screen(template_path, confidence=0.85):
    """Locate a template image on screen. Returns (x, y) center or None."""
    screen   = np.array(pyautogui.screenshot())
    template = np.array(Image.open(template_path))
    result   = cv2.matchTemplate(
        cv2.cvtColor(screen, cv2.COLOR_RGB2BGR),
        cv2.cvtColor(template, cv2.COLOR_RGB2BGR),
        cv2.TM_CCOEFF_NORMED,
    )
    _, max_val, _, max_loc = cv2.minMaxLoc(result)
    if max_val >= confidence:
        h, w = template.shape[:2]
        return max_loc[0] + w // 2, max_loc[1] + h // 2
    return None

def click_image(template_path, confidence=0.85):
    pos = find_image_on_screen(template_path, confidence)
    if pos is None:
        raise RuntimeError(f"Image not found on screen: {template_path}")
    pyautogui.click(*pos)
```

## DPI / Scaling Rules (screenshot mode only)

1. **Capture templates at the same scale as the target machine.** Don't rescue mismatches with `PIL.Image.resize` — `cv2.matchTemplate` is fragile against resampling artefacts.
2. **Pin CI display scaling.** On `windows-latest`: `Set-DisplayResolution 1920 1080 -Force`, disable per-monitor DPI scaling.
3. **Record scale per artefact.** Write `GetDpiForWindow(hwnd) / 96` to `artifacts/<test>/metadata.json`.

> Process-level DPI awareness (`SetProcessDpiAwarenessContext`) **can conflict with Qt's own DPI handling**. Prefer "same-scale templates + CI pin".

## Debugging Match Confidence

Diagnosis-only — do not call from test code:

```python
def debug_match(template_path, out="artifacts/match_debug.png", confidence=0.85):
    """Draw best-match rectangle + score on current screen."""
    import os, cv2, pyautogui, numpy as np
    screen = np.array(pyautogui.screenshot())[:, :, ::-1]
    tpl    = cv2.imread(template_path)
    if tpl is None:
        raise RuntimeError(f"Template unreadable: {template_path}")
    res    = cv2.matchTemplate(screen, tpl, cv2.TM_CCOEFF_NORMED)
    _, mv, _, ml = cv2.minMaxLoc(res)
    h, w   = tpl.shape[:2]
    colour = (0, 255, 0) if mv >= confidence else (0, 0, 255)
    cv2.rectangle(screen, ml, (ml[0]+w, ml[1]+h), colour, 2)
    cv2.putText(screen, f"score={mv:.3f} thr={confidence}",
                (ml[0], max(20, ml[1]-6)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, colour, 2)
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    cv2.imwrite(out, screen)
    return mv
```

**Use sparingly** — breaks on DPI changes, theme switches, partial occlusion.
