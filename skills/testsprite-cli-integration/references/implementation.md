# Implementation — TestSprite CLI como Runtime Verifier

Wrapper Python (`TestSpriteVerifier` + `ClosedLoopAgent`) e exemplos de test specs. Setup e uso resumido no `SKILL.md`.

## TestSpriteVerifier + ClosedLoopAgent

```python
import subprocess
from dataclasses import dataclass
from typing import Optional
from pathlib import Path

@dataclass
class TestSpriteResult:
    passed: bool
    screenshot_path: Optional[str]
    error_details: Optional[str]
    test_output: str

class TestSpriteVerifier:
    """Wrapper para TestSprite CLI como verifier de runtime."""

    def __init__(self, project_path: str, test_script: str = "test:e2e"):
        self.project_path = Path(project_path)
        self.test_script = test_script

    def verify(self, deployment_url: str) -> TestSpriteResult:
        """Executa TestSprite contra URL deployed. Retorna screenshot se falhar."""
        import os
        env = {**os.environ, "TEST_URL": deployment_url, "HEADLESS": "true"}

        result = subprocess.run(
            ["testsprite", "run", self.test_script],
            cwd=self.project_path,
            env=env,
            capture_output=True,
            text=True,
            timeout=300  # 5 min timeout
        )

        screenshot = self._extract_screenshot(result.stdout, result.stderr)

        return TestSpriteResult(
            passed=result.returncode == 0,
            screenshot_path=screenshot,
            error_details=result.stderr if result.returncode != 0 else None,
            test_output=result.stdout
        )

    def _extract_screenshot(self, stdout: str, stderr: str) -> Optional[str]:
        """Extract screenshot path from TestSprite output."""
        import re
        patterns = [
            r"screenshot[:\s]+([^\s]+\.png)",
            r"Screenshot saved to[:\s]+([^\s]+)",
            r"failed.*screenshot[:\s]+([^\s]+)"
        ]
        for pattern in patterns:
            match = re.search(pattern, stdout + stderr, re.IGNORECASE)
            if match:
                return match.group(1)
        return None


class ClosedLoopAgent:
    """Agent com closed-loop verification via TestSprite."""

    def __init__(self, verifier: TestSpriteVerifier, max_retries: int = 3):
        self.verifier = verifier
        self.max_retries = max_retries
        self.iteration = 0

    def run_task(self, task: str, deployment_url: str) -> dict:
        """Executa task → verifica com TestSprite → patch se falhar → rerun."""
        for attempt in range(self.max_retries):
            self.iteration += 1

            # 1. Agent executa task (generate code, make changes)
            self._execute_agent_task(task)

            # 2. Deploy (your deployment logic)
            self._deploy()

            # 3. VERIFY with TestSprite (THE signal that closes the loop)
            result = self.verifier.verify(deployment_url)

            if result.passed:
                return {"success": True, "iterations": self.iteration, "final_url": deployment_url}

            # 4-5. FAILED → patch baseado no screenshot + error
            if attempt < self.max_retries - 1:
                self._patch_from_failure(result)

        return {
            "success": False,
            "iterations": self.max_retries,
            "last_error": result.error_details,
            "last_screenshot": result.screenshot_path
        }

    def _execute_agent_task(self, task: str):
        """Your agent task execution logic."""
        # Example: claude -p "Fix the checkout flow" --output-format json
        pass

    def _deploy(self):
        """Your deployment logic (vercel deploy, netlify deploy, etc.)."""
        pass

    def _patch_from_failure(self, result: TestSpriteResult):
        """Agent analyzes screenshot + error and creates fix."""
        patch_prompt = f"""
The deployed app failed verification. Here's what the real user sees:

SCREENSHOT: {result.screenshot_path}
ERROR: {result.error_details}
TEST OUTPUT: {result.test_output}

Analyze the screenshot and error. The issue is likely:
- Dead button (click handler not attached)
- Form not submitting (missing preventDefault, wrong endpoint)
- Navigation broken (router mismatch)
- Race condition (async not awaited)

Create a minimal fix. Do not refactor - only fix the specific failure.
"""
        # Call your agent with this prompt
        pass
```

## GAN Harness — eval-mode testsprite

```bash
/gan-build "build checkout flow" \
  --eval-mode testsprite \
  --eval-config testsprite.config.json \
  --max-iterations 5 \
  --pass-threshold 1.0  # TestSprite: pass/fail binário
```

```json
// testsprite.config.json
{
  "testScript": "test:e2e",
  "projectPath": ".",
  "deployment": { "type": "vercel", "previewUrl": "auto" },
  "verifier": { "captureScreenshotOnFail": true, "headless": true, "timeout": 300000 }
}
```

## Test Specs (exemplos)

```javascript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@testsprite/testsprite';

test('checkout flow works for real user', async ({ page }) => {
  await page.goto('/product/123');
  await page.click('[data-testid="add-to-cart"]');   // real click, not mock
  await page.click('[data-testid="cart-link"]');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="address"]', '123 Main St');
  await page.fill('[name="card"]', '4242 4242 4242 4242');
  await page.click('[data-testid="submit-order"]');  // real form submit
  await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();

  const errors = [];
  page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()));
  expect(errors).toHaveLength(0);
});

test('form validation works', async ({ page }) => {
  await page.goto('/checkout');
  await page.click('[data-testid="submit-order"]');
  await expect(page.locator('[data-testid="email-error"]')).toContainText('required');
  await expect(page.locator('[data-testid="address-error"]')).toContainText('required');
});
```
