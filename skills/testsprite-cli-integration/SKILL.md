---
name: testsprite-cli-integration
description: Use when integrating TestSprite CLI as runtime verifier for closed-loop agents — deployed app vs mocks, screenshot-driven failure detection, automatic patch + rerun. Triggers on "testsprite", "testsprite cli", "closed loop verifier", "deployed app verification", "screenshot driven testing", "real user testing", "not mocks".
metadata:
  origin: ECC
  source_docs:
    - https://github.com/testsprite/testsprite-cli
    - https://www.npmjs.com/package/@testsprite/testsprite-cli
  video_source: "EIiXhCaZ4rw - I Mathematically CALCULATED the worth of Codex & Claude Code PLANS (AI Code King)"
  related_skills:
    - loop-design-check
    - verification-loop
    - gan-style-harness
    - agent-guardrails
    - outcome-rubric-verification
---

# Skill: testsprite-cli-integration — Runtime Verifier para Closed Loops

Integração do **TestSprite CLI** (open source, Apache 2.0) como **verifier de runtime** para loops closed-loop: o agent chama mid-build, TestSprite drive o **app deployed como usuário real** (não mocks), captura screenshot de falha, patch + rerun automático.

> **"A green run on the agent's own machine proves nothing. The one signal that actually closes the loop: the deployed thing behaving for a real user."** — AI Code King

## Quando usar

- Você tem **agent loops** que precisam de verificação real (não mocks)
- Quer **closed-loop verification**: deployed app behaving = único sinal que fecha loop
- Precisa de **screenshot-driven debugging**: ver exatamente o que usuário vê
- Quer **auto-patch + rerun** quando verifier detecta falha
- Está construindo **gan-harness** com `--eval-mode testsprite`
- Precisa provar que **checkout flow, forms, navigation** funcionam de verdade

## Quando NÃO usar

- Testes unitários/integração tradicionais → use pytest/Jest/Vitest
- Visual regression only → use Playwright/Percy/Chromatic
- Load/performance testing → use k6/Locust
- Mock-based testing é suficiente → use testing library padrão

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| TestSprite CLI existe: `npm install -g @testsprite/testsprite-cli` | ✅ | npm registry |
| `testsprite setup` + API key do dashboard | ✅ | docs testsprite |
| `testsprite auth status` verifica conexão | ✅ | docs testsprite |
| Agent chama mid-build, drive live app como usuário real | ✅ | Video + docs |
| Captura screenshot de falha (dead button, frozen) | ✅ | Video demonstration |
| Patch automático + rerun | ✅ | Video demonstration |
| Open source Apache 2.0 | ✅ | GitHub repo |
| Node 20.19+, 22.13+, 24+ required | ✅ | docs |

---

## Instalação e Setup

```bash
# Requisitos
node --version  # >= 20.19 || >= 22.13 || >= 24

# Instalação
npm install -g @testsprite/testsprite-cli

# Setup (once)
testsprite setup
# → Cole API key do dashboard (Settings > API Keys)
# → Só mostra uma vez!

# Verificar conexão
testsprite auth status
# → Connected: true
```

---

## Integração no Agent Loop

### Padrão Básico: Mid-Build Verification

```python
import subprocess
import json
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
    """
    Wrapper para TestSprite CLI como verifier de runtime.
    """
    
    def __init__(self, project_path: str, test_script: str = "test:e2e"):
        self.project_path = Path(project_path)
        self.test_script = test_script
    
    def verify(self, deployment_url: str) -> TestSpriteResult:
        """
        Executa TestSprite contra URL deployed.
        Retorna resultado com screenshot se falhar.
        """
        env = {
            **os.environ,
            "TEST_URL": deployment_url,
            "HEADLESS": "true"
        }
        
        # Run TestSprite
        result = subprocess.run(
            ["testsprite", "run", self.test_script],
            cwd=self.project_path,
            env=env,
            capture_output=True,
            text=True,
            timeout=300  # 5 min timeout
        )
        
        # Parse output for screenshot path
        screenshot = self._extract_screenshot(result.stdout, result.stderr)
        
        return TestSpriteResult(
            passed=result.returncode == 0,
            screenshot_path=screenshot,
            error_details=result.stderr if result.returncode != 0 else None,
            test_output=result.stdout
        )
    
    def _extract_screenshot(self, stdout: str, stderr: str) -> Optional[str]:
        """Extract screenshot path from TestSprite output."""
        # TestSprite outputs screenshot path on failure
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


# === INTEGRAÇÃO NO AGENT LOOP ===

class ClosedLoopAgent:
    """
    Agent com closed-loop verification via TestSprite.
    """
    
    def __init__(self, verifier: TestSpriteVerifier, max_retries: int = 3):
        self.verifier = verifier
        self.max_retries = max_retries
        self.iteration = 0
    
    def run_task(self, task: str, deployment_url: str) -> dict:
        """
        Executa task → verifica com TestSprite → patch se falhar → rerun.
        """
        for attempt in range(self.max_retries):
            self.iteration += 1
            
            # 1. Agent executa task (generate code, make changes)
            print(f"[Iteration {self.iteration}] Executing task...")
            self._execute_agent_task(task)
            
            # 2. Deploy (your deployment logic)
            print(f"[Iteration {self.iteration}] Deploying...")
            self._deploy()
            
            # 3. VERIFY with TestSprite (THE signal that closes the loop)
            print(f"[Iteration {self.iteration}] Verifying with TestSprite...")
            result = self.verifier.verify(deployment_url)
            
            if result.passed:
                print(f"✅ PASSED on iteration {self.iteration}")
                return {
                    "success": True,
                    "iterations": self.iteration,
                    "final_url": deployment_url
                }
            
            # 4. FAILED - Get screenshot + error details
            print(f"❌ FAILED on iteration {self.iteration}")
            print(f"   Screenshot: {result.screenshot_path}")
            print(f"   Error: {result.error_details}")
            
            # 5. Agent reads screenshot + error → patches
            if attempt < self.max_retries - 1:
                print(f"[Iteration {self.iteration}] Patching based on failure...")
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
        """Your deployment logic."""
        # Example: vercel deploy, netlify deploy, etc.
        pass
    
    def _patch_from_failure(self, result: TestSpriteResult):
        """Agent analyzes screenshot + error and creates fix."""
        # Feed screenshot + error to agent for next iteration
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

---

## Integração com GAN Harness

```bash
# Use TestSprite como eval-mode no gan-harness
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
  "deployment": {
    "type": "vercel",
    "previewUrl": "auto"
  },
  "verifier": {
    "captureScreenshotOnFail": true,
    "headless": true,
    "timeout": 300000
  }
}
```

---

## TestSprite Test Scripts (Exemplos)

```javascript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@testsprite/testsprite';

test('checkout flow works for real user', async ({ page }) => {
  // 1. Navigate to product
  await page.goto('/product/123');
  
  // 2. Add to cart (real click, not mock)
  await page.click('[data-testid="add-to-cart"]');
  
  // 3. Go to cart
  await page.click('[data-testid="cart-link"]');
  
  // 4. Fill checkout form (real typing)
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="address"]', '123 Main St');
  await page.fill('[name="card"]', '4242 4242 4242 4242');
  
  // 5. Submit (real form submit)
  await page.click('[data-testid="submit-order"]');
  
  // 6. Verify success (real network response)
  await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
  
  // 7. Verify no console errors
  const errors = [];
  page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()));
  expect(errors).toHaveLength(0);
});

test('form validation works', async ({ page }) => {
  await page.goto('/checkout');
  await page.click('[data-testid="submit-order"]');
  
  // Should show validation errors
  await expect(page.locator('[data-testid="email-error"]')).toContainText('required');
  await expect(page.locator('[data-testid="address-error"]')).toContainText('required');
});
```

---

## Anti-Patterns vs TestSprite Pattern

| ❌ Anti-Pattern | ✅ TestSprite Pattern |
|---|---|
| Unit tests com mocks | **Drive live deployed app** |
| "Green on my machine" | **Screenshot do que usuário vê** |
| Agent auto-avalia | **Verifier independente (TestSprite)** |
| Falha silenciosa | **Screenshot + error details → patch** |
| Retry sem feedback visual | **Patch baseado no que usuário vê** |

---

## Cost Considerations

| Fator | Impacto |
|---|---|
| TestSprite CLI | Free (open source Apache 2.0) |
| TestSprite Cloud (parallel, reporting) | Paid tiers |
| Execution time | ~2-5 min per verification |
| Screenshots storage | Minimal |
| **Value** | **Elimina "green on mocks, broken in prod"** |

---

## Integração com Skills Existentes

| Skill | Como Complementa |
|---|---|
| `loop-design-check` | TestSprite = **feedback gate** (judgment layer) runtime |
| `verification-loop` | Verification-loop = design-time; TestSprite = runtime |
| `gan-style-harness` | `--eval-mode testsprite` substitui Playwright para app deployed |
| `agent-guardrails` | TestSprite = guardrail de **runtime behavior** |
| `outcome-rubric-verification` | Outcome = rubric; TestSprite = behavioral verification |

---

## Troubleshooting

| Problema | Solução |
|---|---|
| `testsprite: command not found` | `npm install -g @testsprite/testsprite-cli` + restart shell |
| `Authentication failed` | `testsprite setup` → nova API key (só mostra uma vez) |
| Timeout na verificação | Aumentar `timeout` no config, otimizar test script |
| Screenshot não capturado | Verificar `headless: true`, permissions de escrita |
| Flaky tests | TestSprite roda em deployed real — flakiness = bug real |

---

## Referências

- [TestSprite CLI GitHub](https://github.com/testsprite/testsprite-cli)
- [TestSprite npm](https://www.npmjs.com/package/@testsprite/testsprite-cli)
- [TestSprite Dashboard](https://dashboard.testsprite.com)
- Video: `EIiXhCaZ4rw.en.dedup.txt` — linhas 60-77, 78-93
- Key quote: "The verifier I use is open source, the TestSprite CLI. The agent calls it mid-build and it drives the live app like a real user would, not mocks."