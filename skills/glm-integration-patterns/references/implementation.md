# Implementation — GLM/Z.ai Agent

`GLMAgent` (OpenAI-compatible client), browser automation, C/C++ patterns, trial manager. Resumo e matriz no `SKILL.md`.

## GLMAgent — Integração Básica

```python
from dataclasses import dataclass
from typing import Optional, List
from enum import Enum

class GLMModel(Enum):
    GLM_4_5 = "glm-4.5"
    GLM_4_5_AIR = "glm-4.5-air"  # Faster, cheaper
    GLM_4V = "glm-4v"  # Vision

@dataclass
class GLMConfig:
    model: GLMModel = GLMModel.GLM_4_5
    api_base: str = "https://api.z.ai/v1"  # OpenAI-compatible
    api_key: str = ""  # From Z.ai dashboard
    max_tokens: int = 8192
    temperature: float = 0.1

    # GLM-specific
    enable_browser: bool = True
    enable_persistence: bool = True
    language: str = "en"  # ~10 supported

class GLMAgent:
    """Wrapper para GLM agent com capabilities específicas."""

    def __init__(self, config: GLMConfig):
        self.config = config
        self.client = self._create_client()
        self.conversation_history = []

    def _create_client(self):
        """Create OpenAI-compatible client for Z.ai."""
        from openai import OpenAI
        return OpenAI(
            base_url=self.config.api_base,
            api_key=self.config.api_key
        )

    def code_generation(self, task: str, context: dict = None) -> str:
        """Generate code with GLM."""
        messages = [
            {"role": "system", "content": self._get_system_prompt()},
            {"role": "user", "content": task}
        ]
        if context:
            messages.insert(1, {"role": "system", "content": f"Context: {context}"})

        response = self.client.chat.completions.create(
            model=self.config.model.value,
            messages=messages,
            max_tokens=self.config.max_tokens,
            temperature=self.config.temperature
        )
        return response.choices[0].message.content

    def browser_automation_task(self, url: str, task: str) -> dict:
        """
        GLM browser automation: navigate, interact, verify.
        Requires Z.ai platform with browser capability enabled.
        """
        # This would use Z.ai's browser automation API
        # Implementation depends on Z.ai SDK
        pass

    def c_cpp_task(self, task: str, files: List[str] = None) -> str:
        """C/C++ specific task - GLM strength area."""
        prompt = f"""
Task: {task}
Files: {files or 'N/A'}
Focus: C/C++ best practices, memory safety, performance.
Use modern C++ (C++17/20) or C11/17 standards.
"""
        return self.code_generation(prompt)

    def persistent_task(self, task: str, max_iterations: int = 10) -> List[str]:
        """Long-running task with persistence (stops on DONE)."""
        results = []
        context = ""

        for i in range(max_iterations):
            prompt = f"""
Task: {task}
Previous progress: {context}
Continue working toward the goal. If complete, say "DONE".
"""
            result = self.code_generation(prompt)
            results.append(result)

            if "DONE" in result.upper():
                break

            context += f"\nIteration {i+1}: {result[:500]}"

        return results

    def _get_system_prompt(self) -> str:
        return """You are GLM, a coding agent optimized for:
- Practical, working code over clever abstractions
- C/C++ expertise with modern standards
- Browser automation for verification
- Persistence on long tasks
- Cost-effective solutions
"""
```

## GLMBrowserAutomation

```python
class GLMBrowserAutomation:
    """
    GLM browser automation para verification de deployed apps.
    Similar ao TestSprite mas nativo no Z.ai.
    """

    def __init__(self, glm_agent: GLMAgent):
        self.agent = glm_agent

    def verify_deployed_app(self, url: str, test_cases: List[dict]) -> dict:
        """Verifica app deployed como usuário real."""
        results = []

        for test in test_cases:
            prompt = f"""
URL: {url}
Test: {test['description']}
Steps: {test['steps']}
Expected: {test['expected']}

Navigate and execute. Return:
- PASS/FAIL
- Screenshot description (what user sees)
- Any errors encountered
"""
            result = self.agent.code_generation(prompt)
            results.append({"test": test['description'], "result": result})

        return {"url": url, "tests": results}

    def checkout_flow_test(self, url: str) -> dict:
        """Teste específico de checkout flow (como no video)."""
        return self.verify_deployed_app(url, [
            {"description": "Add to cart",
             "steps": ["Go to product", "Click add to cart", "Go to cart"],
             "expected": "Item in cart"},
            {"description": "Fill checkout",
             "steps": ["Click checkout", "Fill email", "Fill address", "Fill card"],
             "expected": "Form accepts input"},
            {"description": "Submit order",
             "steps": ["Click submit", "Wait for confirmation"],
             "expected": "Order confirmed"},
        ])
```

## C/C++ Patterns (GLM Strength)

```cpp
// GLM gera C++ moderno: RAII, smart pointers, C++20 concepts/ranges,
// coroutines, modules; sem raw pointers nem manual memory management.

// Async HTTP client com coroutines
#include <coroutine>
#include <expected>
#include <string>
#include <httplib.h>

class AsyncHttpClient {
public:
    struct Response { int status; std::string body; std::string error; };

    std::future<std::expected<Response, std::string>>
    get_async(std::string_view url) {
        return std::async(std::launch::async, [url]() {
            httplib::Client cli(url);
            auto res = cli.Get("/");
            if (!res) return std::unexpected(res.error());
            return Response{res->status, res->body, ""};
        });
    }
};

// Memory-safe buffer
template<typename T>
class SafeBuffer {
    std::vector<T> data_;
    size_t read_pos_ = 0;
    size_t write_pos_ = 0;

public:
    std::expected<size_t, std::string> write(std::span<const T> src) {
        if (write_pos_ + src.size() > data_.size())
            data_.resize(write_pos_ + src.size());
        std::copy(src.begin(), src.end(), data_.begin() + write_pos_);
        write_pos_ += src.size();
        return src.size();
    }

    std::expected<std::span<T>, std::string> read(size_t count) {
        if (read_pos_ + count > write_pos_)
            return std::unexpected("Buffer underflow");
        auto span = std::span(data_.data() + read_pos_, count);
        read_pos_ += count;
        return span;
    }
};
```

## Integração com SubscriptionTierRouter

```python
# Em subscription-tier-routing, GLM como fallback:
def should_use_glm_budget(task, router) -> bool:
    if router._fallback_route(task).provider == Provider.GLM:
        return True
    if task.type in ["code_generation", "debugging"] and task.get("require_cpp"):
        return True
    if task.get("require_browser_automation"):
        return True
    if task.get("budget_constrained") and task.get("volume") == "high":
        return True
    return False
```

## GLMTrialManager

```python
class GLMTrialManager:
    """Gerencia trial quota para novos usuários Z.ai."""

    def __init__(self):
        self.trial_used = {}

    def can_use_trial(self, user_id: str) -> bool:
        return user_id not in self.trial_used

    def use_trial(self, user_id: str) -> dict:
        if self.can_use_trial(user_id):
            self.trial_used[user_id] = True
            return {
                "quota": "trial_quota",
                "models": ["glm-4.5", "glm-4.5-air"],
                "features": ["browser_automation", "c_cpp", "persistence"],
                "duration": "limited_time"
            }
        return {"error": "Trial already used"}

    def upgrade_to_paid(self, user_id: str, tier: str = "glm_18") -> bool:
        # Redirect to Z.ai billing
        return True
```
