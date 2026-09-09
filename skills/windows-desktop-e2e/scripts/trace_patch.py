# trace_patch.py — Per-step trace mixin for BasePage (opt-in via E2E_TRACE=1).
# Captures a PNG + JSONL record per action. Off by default; enable only when
# reproducing a flaky case. DO NOT set E2E_TRACE_INCLUDE_TEXT=1 on tests that
# type credentials/PII. Overhead ~50-200ms/action + PNGs on disk.
# Extraído de SKILL.md (2026-09-09).
#
# Enable:
#   E2E_TRACE=1 pytest tests/test_login.py -v
#   E2E_TRACE=1 E2E_TRACE_INCLUDE_TEXT=1 pytest ...   # text included (no secrets!)
import os, json, time

TRACE_ENABLED      = os.environ.get("E2E_TRACE") == "1"
TRACE_INCLUDE_TEXT = os.environ.get("E2E_TRACE_INCLUDE_TEXT") == "1"

class TraceMixin:
    _step = 0

    def _trace(self, action, spec=None, text=None):
        if not TRACE_ENABLED:
            return
        TraceMixin._step += 1
        idx = f"{TraceMixin._step:03d}"
        os.makedirs(ARTIFACT_DIR, exist_ok=True)
        try:
            self.window.capture_as_image().save(
                os.path.join(ARTIFACT_DIR, f"step_{idx}_{action}.png"))
        except Exception:
            pass  # capture failure must not break the test
        rec = {
            "ts": time.time(), "step": TraceMixin._step, "action": action,
            "locator": getattr(spec, "criteria", None),
            "text": text if TRACE_INCLUDE_TEXT else ("<redacted>" if text else None),
        }
        with open(os.path.join(ARTIFACT_DIR, "trace.jsonl"), "a") as f:
            f.write(json.dumps(rec) + "\n")

    def click(self, spec):
        self.wait_visible(spec); self._trace("click_before", spec)
        spec.click_input();      self._trace("click_after",  spec)

    def type_text(self, spec, text):
        self.wait_visible(spec); self._trace("type_before", spec, text)
        # ... existing set_edit_text / keyboard fallback ...
        self._trace("type_after", spec)

# Caveats: clear artifact dir before reruns; per-worker dirs for parallel runs;
# raw pywinauto calls outside BasePage are not traced.
