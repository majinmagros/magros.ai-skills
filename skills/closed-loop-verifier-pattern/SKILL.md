---
name: closed-loop-verifier-pattern
description: Use when implementing closed-loop agent verification — deployed app behaving for real user is the ONLY signal that closes the loop; runtime verifiers (TestSprite, Playwright, Puppeteer) drive live app like real user; mocks prove nothing; screenshot-driven failure detection; automatic patch + rerun. Triggers on "closed loop verifier", "deployed app verification", "runtime verification", "not mocks", "real user testing", "screenshot driven testing", "green on mocks proves nothing".
metadata:
  origin: ECC
  source_docs:
    - https://github.com/testsprite/testsprite-cli
    - https://playwright.dev
    - https://pptr.dev
  video_source: "EIiXhCaZ4rw - I Mathematically CALCULATED the worth of Codex & Claude Code PLANS (AI Code King)"
  related_skills:
    - testsprite-cli-integration
    - loop-design-check
    - verification-loop
    - gan-style-harness
    - agent-guardrails
    - outcome-rubric-verification
---

# Skill: closed-loop-verifier-pattern — O Único Sinal que Fecha o Loop

Padrão fundamental: **"A green run on the agent's own machine proves nothing. The one signal that actually closes the loop: the deployed thing behaving for a real user."** — AI Code King

Runtime verifiers (TestSprite, Playwright, Puppeteer) drive o **app deployed como usuário real** (não mocks), capturam screenshot de falha, permitem patch automático + rerun.

## Quando usar

- Você tem **agent loops** que precisam de verificação real (não mocks)
- Quer provar que **checkout flow, forms, navigation, auth** funcionam de verdade
- Precisa de **screenshot-driven debugging**: ver exatamente o que usuário vê
- Quer **auto-patch + rerun** quando verifier detecta falha
- Está construindo **gan-harness** com verificação de runtime
- Precisa eliminar "green on mocks, broken in prod"

## Quando NÃO usar

- Testes unitários/integração tradicionais → use pytest/Jest/Vitest
- Visual regression only → use Playwright/Percy/Chromatic
- Load/performance testing → use k6/Locust
- Mock-based testing é suficiente → use testing library padrão
- Verificação design-time → use `verification-loop`, `loop-design-check`

---

## Conceito Central: Mocks vs Real User

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE PROBLEM                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Agent Loop (Traditional):                                       │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │ Generate │───▶│  Test   │───▶│  Pass   │───▶│ Deploy  │      │
│  │  Code   │    │ (Mocks) │    │ (Green) │    │  💥     │      │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘      │
│       │                                                    │      │
│       │ "Green on mocks proves nothing"                     │      │
│       ▼                                                    ▼      │
│                                                                  │
│  Agent Loop (Closed-Loop):                                       │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │ Generate │───▶│ Deploy  │───▶│ Verify  │───▶│  PASS   │      │
│  │  Code   │    │ (Real)  │    │ (Real)  │    │ (Real)  │      │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘      │
│       │            │            │            │                   │
│       │            │            │            └─ Screenshot      │
│       │            │            │               if FAIL         │
│       │            │            └─ TestSprite/Playwright        │
│       │            │               drives live app               │
│       │            └─ Real deployment                            │
│       └─ Code changes                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Arquitetura do Padrão

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
    """
    Base class para runtime verifiers.
    Drive deployed app like real user.
    """
    
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

class ClosedLoopAgent:
    """
    Agent com closed-loop verification.
    """
    
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
        """
        Executa closed loop: generate -> deploy -> verify -> patch -> repeat.
        """
        previous_failures = []
        
        for attempt in range(self.max_retries):
            # 1. GENERATE: Agent produces code (informed by previous failures)
            code = self.generator(task, previous_failures)
            
            # 2. DEPLOY: Deploy to real environment
            deployment_url = self.deployer(code)
            
            # 3. VERIFY: Runtime verifier drives live app
            test_spec = self._build_test_spec(task)
            outcome = self.verifier.verify(deployment_url, test_spec)
            
            if outcome.result == VerificationResult.PASS:
                return {
                    "success": True,
                    "code": code,
                    "deployment_url": deployment_url,
                    "attempts": attempt + 1,
                    "verification": outcome
                }
            
            # 4. FAILED: Capture failure for next iteration
            previous_failures.append(outcome)
            
            # Log for debugging
            print(f"❌ Attempt {attempt + 1} failed:")
            print(f"   Screenshot: {outcome.screenshot_path}")
            print(f"   Error: {outcome.error_details}")
        
        return {
            "success": False,
            "attempts": self.max_retries,
            "failures": previous_failures,
            "last_deployment_url": deployment_url
        }
    
    def _build_test_spec(self, task: "TaskSpec") -> TestSpec:
        """Build test spec from task."""
        # Could be predefined per task type
        return TestSpec(
            name=task.name,
            url_path=task.url_path or "/",
            steps=task.test_steps or [],
            assertions=task.assertions or []
        )


@dataclass
class TaskSpec:
    name: str
    description: str
    url_path: Optional[str] = None
    test_steps: Optional[List[dict]] = None
    assertions: Optional[List[dict]] = None
```

---

## Verifiers Concretos

### TestSprite Verifier

```python
class TestSpriteVerifier(RuntimeVerifier):
    """TestSprite CLI wrapper."""
    
    def __init__(self, project_path: str, test_script: str = "test:e2e"):
        self.project_path = project_path
        self.test_script = test_script
    
    def get_name(self) -> str:
        return "TestSprite"
    
    def verify(self, deployment_url: str, test_spec: TestSpec) -> VerificationOutcome:
        import subprocess, time, os, re
        from pathlib import Path
        
        start = time.time()
        
        env = {
            **os.environ,
            "TEST_URL": deployment_url,
            "HEADLESS": "true"
        }
        
        result = subprocess.run(
            ["testsprite", "run", self.test_script],
            cwd=self.project_path,
            env=env,
            capture_output=True,
            text=True,
            timeout=300
        )
        
        duration = int((time.time() - start) * 1000)
        
        screenshot = self._extract_screenshot(result.stdout, result.stderr)
        
        return VerificationOutcome(
            result=VerificationResult.PASS if result.returncode == 0 else VerificationResult.FAIL,
            screenshot_path=screenshot,
            error_details=result.stderr if result.returncode != 0 else None,
            test_output=result.stdout,
            duration_ms=duration
        )
    
    def _extract_screenshot(self, stdout: str, stderr: str) -> Optional[str]:
        import re
        patterns = [
            r"screenshot[:\s]+([^\s]+\.png)",
            r"Screenshot saved to[:\s]+([^\s]+)",
        ]
        for pattern in patterns:
            match = re.search(pattern, stdout + stderr, re.IGNORECASE)
            if match:
                return match.group(1)
        return None
```

### Playwright Verifier

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
        
        env = {
            **os.environ,
            "TEST_URL": deployment_url,
            "HEADLESS": "true"
        }
        
        result = subprocess.run(
            ["npx", "playwright", "test", self.test_file, "--reporter=json"],
            env=env,
            capture_output=True,
            text=True,
            timeout=300
        )
        
        duration = int((time.time() - start) * 1000)
        
        # Parse JSON output for screenshot
        screenshot = self._extract_screenshot(result.stdout)
        
        return VerificationOutcome(
            result=VerificationResult.PASS if result.returncode == 0 else VerificationResult.FAIL,
            screenshot_path=screenshot,
            error_details=result.stderr if result.returncode != 0 else None,
            test_output=result.stdout,
            duration_ms=duration
        )
    
    def _extract_screenshot(self, stdout: str) -> Optional[str]:
        import json, re
        try:
            # Playwright JSON reporter includes screenshot paths
            data = json.loads(stdout)
            for suite in data.get("suites", []):
                for test in suite.get("tests", []):
                    for result in test.get("results", []):
                        if "attachments" in result:
                            for att in result["attachments"]:
                                if att["contentType"] == "image/png":
                                    return att["path"]
        except:
            pass
        return None
```

---

## Test Specs por Tipo de Task

```python
# Predefined test specs para tasks comuns
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

---

## Integração com GAN Harness

```bash
# Use closed-loop verifier no gan-harness
/gan-build "build checkout flow" \
  --eval-mode testsprite \
  --eval-config testsprite.config.json \
  --max-iterations 5 \
  --pass-threshold 1.0
```

```json
// testsprite.config.json para closed-loop
{
  "verifier": "testsprite",
  "mode": "closed-loop",
  "deployment": {
    "type": "vercel",
    "previewUrl": "auto"
  },
  "testSpecs": ["checkout_flow", "auth_flow"],
  "onFail": {
    "captureScreenshot": true,
    "autoPatch": true,
    "maxRetries": 3
  }
}
```

---

## Anti-Patterns vs Closed-Loop Pattern

| ❌ Anti-Pattern | ✅ Closed-Loop Pattern |
|---|---|
| Unit tests com mocks | **Drive live deployed app** |
| "Green on my machine" | **Screenshot do que usuário vê** |
| Agent auto-avalia | **Verifier independente (runtime)** |
| Falha silenciosa | **Screenshot + error details → patch** |
| Retry sem feedback visual | **Patch baseado no que usuário vê** |
| Deploy sem verificação | **Verify IS the deployment gate** |

---

## Integração com Skills Existentes

| Skill | Como Complementa |
|---|---|
| `testsprite-cli-integration` | Implementação concreta do verifier |
| `loop-design-check` | Closed-loop = **feedback gate** (judgment layer) |
| `verification-loop` | Verification-loop = design-time; closed-loop = runtime |
| `gan-style-harness` | `--eval-mode testsprite` para closed-loop |
| `agent-guardrails` | Closed-loop = guardrail de **runtime behavior** |
| `outcome-rubric-verification` | Outcome = rubric; closed-loop = behavioral verification |

---

## Referências

- Video: `EIiXhCaZ4rw.en.dedup.txt` — linhas 60-77, 78-93
- Key quote: "The verifier I use is open source, the TestSprite CLI. The agent calls it mid-build and it drives the live app like a real user would, not mocks. The actual deployed thing, when it broke that checkout flow again, it didn't just say failed. It handed back a screenshot of exactly what the user would have seen. The dead button, frozen, the agent read. That patched it, reran. I wasn't in the loop for any of it. That's what a closed loop actually feels like. Not a bigger brain, a stricter referee."
- TestSprite: https://github.com/testsprite/testsprite-cli
- Playwright: https://playwright.dev