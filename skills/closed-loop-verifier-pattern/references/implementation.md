# Implementation — Closed-Loop Verifier Pattern

`RuntimeVerifier` ABC, `ClosedLoopAgent`, verifiers concretos (TestSprite, Playwright) e test specs prontas. Conceito e diagrama no `SKILL.md`.

## Base: RuntimeVerifier + ClosedLoopAgent

```python
from dataclasses import dataclass
from typing import Optional, List, Callable
from enum import Enum
from abc import ABC, abstractmethod

class VerificationResult(Enum):
    PASS = "pass"
    FAIL = "fail"
    ERROR = "error"

@dataclass
class VerificationOutcome:
    result: VerificationResult
    screenshot_path: Optional[str]
    error_details: Optional[str]
    test_output: str
    duration_ms: int

class RuntimeVerifier(ABC):
    """Base class para runtime verifiers. Drive deployed app like real user."""

    @abstractmethod
    def verify(self, deployment_url: str, test_spec: "TestSpec") -> VerificationOutcome:
        pass

    @abstractmethod
    def get_name(self) -> str:
        pass

@dataclass
class TestSpec:
    """Especificação do que testar."""
    name: str
    url_path: str
    steps: List[dict]  # [{"action": "click", "selector": "..."}, ...]
    assertions: List[dict]  # [{"type": "visible", "selector": "..."}, ...]
    timeout_ms: int = 30000

@dataclass
class TaskSpec:
    name: str
    description: str
    url_path: Optional[str] = None
    test_steps: Optional[List[dict]] = None
    assertions: Optional[List[dict]] = None

class ClosedLoopAgent:
    """Agent com closed-loop verification."""

    def __init__(
        self,
        verifier: RuntimeVerifier,
        generator: Callable[["TaskSpec", List[VerificationOutcome]], str],
        deployer: Callable[[str], str],  # code -> deployment_url
        max_retries: int = 3
    ):
        self.verifier = verifier
        self.generator = generator
        self.deployer = deployer
        self.max_retries = max_retries

    def run(self, task: "TaskSpec") -> dict:
        """Closed loop: generate -> deploy -> verify -> patch -> repeat."""
        previous_failures = []

        for attempt in range(self.max_retries):
            # 1. GENERATE (informed by previous failures)
            code = self.generator(task, previous_failures)

            # 2. DEPLOY to real environment
            deployment_url = self.deployer(code)

            # 3. VERIFY: runtime verifier drives live app
            outcome = self.verifier.verify(
                deployment_url, self._build_test_spec(task)
            )

            if outcome.result == VerificationResult.PASS:
                return {"success": True, "code": code,
                        "deployment_url": deployment_url,
                        "attempts": attempt + 1, "verification": outcome}

            # 4. FAILED: capture failure for next iteration
            previous_failures.append(outcome)
            print(f"Attempt {attempt + 1} failed: {outcome.screenshot_path} | {outcome.error_details}")

        return {"success": False, "attempts": self.max_retries,
                "failures": previous_failures, "last_deployment_url": deployment_url}

    def _build_test_spec(self, task: "TaskSpec") -> TestSpec:
        return TestSpec(
            name=task.name,
            url_path=task.url_path or "/",
            steps=task.test_steps or [],
            assertions=task.assertions or []
        )
```

## TestSpriteVerifier

```python
class TestSpriteVerifier(RuntimeVerifier):
    """TestSprite CLI wrapper."""

    def __init__(self, project_path: str, test_script: str = "test:e2e"):
        self.project_path = project_path
        self.test_script = test_script

    def get_name(self) -> str:
        return "TestSprite"

    def verify(self, deployment_url: str, test_spec: TestSpec) -> VerificationOutcome:
        import subprocess, time, os

        start = time.time()
        env = {**os.environ, "TEST_URL": deployment_url, "HEADLESS": "true"}

        result = subprocess.run(
            ["testsprite", "run", self.test_script],
            cwd=self.project_path, env=env,
            capture_output=True, text=True, timeout=300
        )

        return VerificationOutcome(
            result=VerificationResult.PASS if result.returncode == 0 else VerificationResult.FAIL,
            screenshot_path=self._extract_screenshot(result.stdout, result.stderr),
            error_details=result.stderr if result.returncode != 0 else None,
            test_output=result.stdout,
            duration_ms=int((time.time() - start) * 1000)
        )

    def _extract_screenshot(self, stdout: str, stderr: str) -> Optional[str]:
        import re
        for pattern in [r"screenshot[:\s]+([^\s]+\.png)",
                        r"Screenshot saved to[:\s]+([^\s]+)"]:
            match = re.search(pattern, stdout + stderr, re.IGNORECASE)
            if match:
                return match.group(1)
        return None
```

## PlaywrightVerifier

```python
class PlaywrightVerifier(RuntimeVerifier):
    """Playwright wrapper para runtime verification."""

    def __init__(self, test_file: str = "tests/e2e/runtime.spec.ts"):
        self.test_file = test_file

    def get_name(self) -> str:
        return "Playwright"

    def verify(self, deployment_url: str, test_spec: TestSpec) -> VerificationOutcome:
        import subprocess, time, os

        start = time.time()
        env = {**os.environ, "TEST_URL": deployment_url, "HEADLESS": "true"}

        result = subprocess.run(
            ["npx", "playwright", "test", self.test_file, "--reporter=json"],
            env=env, capture_output=True, text=True, timeout=300
        )

        return VerificationOutcome(
            result=VerificationResult.PASS if result.returncode == 0 else VerificationResult.FAIL,
            screenshot_path=self._extract_screenshot(result.stdout),
            error_details=result.stderr if result.returncode != 0 else None,
            test_output=result.stdout,
            duration_ms=int((time.time() - start) * 1000)
        )

    def _extract_screenshot(self, stdout: str) -> Optional[str]:
        import json
        try:
            data = json.loads(stdout)
            for suite in data.get("suites", []):
                for test in suite.get("tests", []):
                    for res in test.get("results", []):
                        for att in res.get("attachments", []):
                            if att["contentType"] == "image/png":
                                return att["path"]
        except Exception:
            pass
        return None
```

## Test Specs Prontas

```python
CHECKOUT_FLOW_TEST = TestSpec(
    name="checkout_flow",
    url_path="/checkout",
    steps=[
        {"action": "goto", "url": "/product/123"},
        {"action": "click", "selector": "[data-testid='add-to-cart']"},
        {"action": "click", "selector": "[data-testid='cart-link']"},
        {"action": "fill", "selector": "[name='email']", "value": "test@example.com"},
        {"action": "fill", "selector": "[name='address']", "value": "123 Main St"},
        {"action": "fill", "selector": "[name='card']", "value": "4242424242424242"},
        {"action": "click", "selector": "[data-testid='submit-order']"},
    ],
    assertions=[
        {"type": "visible", "selector": "[data-testid='order-confirmation']"},
        {"type": "not_visible", "selector": ".error"},
        {"type": "network_idle"},
    ]
)

AUTH_FLOW_TEST = TestSpec(
    name="auth_flow",
    url_path="/login",
    steps=[
        {"action": "goto", "url": "/login"},
        {"action": "fill", "selector": "[name='email']", "value": "user@example.com"},
        {"action": "fill", "selector": "[name='password']", "value": "secure123"},
        {"action": "click", "selector": "[data-testid='login-submit']"},
    ],
    assertions=[
        {"type": "url_contains", "value": "/dashboard"},
        {"type": "visible", "selector": "[data-testid='user-menu']"},
    ]
)

FORM_SUBMISSION_TEST = TestSpec(
    name="form_submission",
    url_path="/contact",
    steps=[
        {"action": "goto", "url": "/contact"},
        {"action": "fill", "selector": "[name='name']", "value": "Test User"},
        {"action": "fill", "selector": "[name='message']", "value": "Hello world"},
        {"action": "click", "selector": "[type='submit']"},
    ],
    assertions=[
        {"type": "visible", "selector": "[data-testid='success-message']"},
        {"type": "not_visible", "selector": ".field-error"},
    ]
)
```

## GAN Harness Config

```bash
/gan-build "build checkout flow" \
  --eval-mode testsprite \
  --eval-config testsprite.config.json \
  --max-iterations 5 \
  --pass-threshold 1.0
```

```json
{
  "verifier": "testsprite",
  "mode": "closed-loop",
  "deployment": { "type": "vercel", "previewUrl": "auto" },
  "testSpecs": ["checkout_flow", "auth_flow"],
  "onFail": { "captureScreenshot": true, "autoPatch": true, "maxRetries": 3 }
}
```
