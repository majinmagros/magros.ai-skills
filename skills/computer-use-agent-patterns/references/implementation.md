# Implementation — Computer Use Agent

`ComputerUseAgent` (observe→decide→act→self-correct), `OSWorldBenchmark`, `CaptchaSolverAgent` (48 levels), `SlideControlHandler`. Arquitetura no `SKILL.md`.

## Core Types + ComputerUseAgent

```python
from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple
from enum import Enum

class ActionType(Enum):
    CLICK = "click"
    DOUBLE_CLICK = "double_click"
    RIGHT_CLICK = "right_click"
    TYPE = "type"
    KEY_PRESS = "key_press"
    KEY_COMBO = "key_combo"  # Ctrl+C, Alt+Tab, etc.
    DRAG_DROP = "drag_drop"
    SLIDE = "slide"  # Slider controls
    SCROLL = "scroll"
    WAIT = "wait"
    SCREENSHOT = "screenshot"

@dataclass
class Action:
    type: ActionType
    coordinates: Optional[Tuple[int, int]] = None  # (x, y)
    text: Optional[str] = None
    keys: Optional[List[str]] = None
    start: Optional[Tuple[int, int]] = None  # For drag/slide
    end: Optional[Tuple[int, int]] = None
    duration_ms: Optional[int] = None

@dataclass
class Observation:
    screenshot_b64: str  # Base64 encoded PNG
    timestamp: float
    metadata: Dict  # Window title, active app, etc.

@dataclass
class ComputerUseState:
    goal: str
    observations: List[Observation]
    actions: List[Action]
    context_window_tokens: int
    task_start_time: float
    max_duration_seconds: int = 2400  # 40 min

class ComputerUseAgent:
    """Agent que usa Computer Use API para operar computador real."""

    def __init__(self, model: str = "gpt-6-astra",
                 max_context_tokens: int = 150000,
                 max_task_minutes: int = 40):
        self.model = model
        self.max_context_tokens = max_context_tokens
        self.max_task_minutes = max_task_minutes
        self.state = None

    def run_task(self, goal: str, initial_url: str = None) -> Dict:
        """Loop: observe → decide → act → self-correct."""
        self.state = ComputerUseState(
            goal=goal, observations=[], actions=[],
            context_window_tokens=0, task_start_time=time.time())

        if initial_url:
            self._execute_action(Action(type=ActionType.TYPE, text=initial_url,
                                        coordinates=(100, 50)))  # Address bar
            self._execute_action(Action(type=ActionType.KEY_PRESS, keys=["enter"]))

        while not self._is_done():
            obs = self._capture_screen()  # 1. OBSERVE
            self.state.observations.append(obs)

            action = self._decide_action(obs)  # 2. DECIDE
            result = self._execute_action(action)  # 3. ACT
            self.state.actions.append(action)

            if not self._verify_action_result(action, result):  # 4. SELF-CORRECT
                corrected = self._self_correct(action, result)
                if corrected:
                    self._execute_action(corrected)

            if self.state.context_window_tokens > self.max_context_tokens * 0.9:
                self._compress_context()  # 5. Keep recent + milestones

            if time.time() - self.state.task_start_time > self.max_task_minutes * 60:
                return {"status": "timeout", "state": self.state}  # 6. Time limit

        return {"status": "completed", "state": self.state}

    def _decide_action(self, obs: Observation) -> Action:
        prompt = self._build_prompt(obs)
        response = self._call_model_with_tools(prompt)
        return self._parse_action(response)

    def _build_prompt(self, obs: Observation) -> str:
        return f"""
Goal: {self.state.goal}

Current screen: [screenshot attached]
Previous actions: {len(self.state.actions)} actions taken
Time elapsed: {time.time() - self.state.task_start_time:.0f}s

Available actions:
- click(x, y), double_click(x, y), right_click(x, y)
- type(text), key_press(key), key_combo(keys)
- drag_drop(start_x, start_y, end_x, end_y)
- slide(start_x, start_y, end_x, end_y)  # For sliders
- scroll(direction, amount)
- wait(ms)

Decide the NEXT action to make progress toward the goal.
Be specific with coordinates. Use slide for slider controls.
"""

    def _self_correct(self, action: Action, result: Dict) -> Optional[Action]:
        """If action failed, try adjusted version."""
        if result.get("error") == "element_not_found" and action.coordinates:
            x, y = action.coordinates
            for dx, dy in [(10, 0), (-10, 0), (0, 10), (0, -10), (20, 0), (-20, 0)]:
                return Action(type=action.type, coordinates=(x + dx, y + dy),
                              text=action.text, keys=action.keys)

        elif result.get("error") == "slider_not_moved":
            if action.type == ActionType.SLIDE and action.start and action.end:
                sx, sy = action.start
                ex, ey = action.end
                return Action(type=ActionType.SLIDE, start=(sx, sy),
                              end=(ex + (ex - sx) * 0.5, ey + (ey - sy) * 0.5))
        return None

    def _verify_action_result(self, action: Action, result: Dict) -> bool:
        post_obs = self._capture_screen()  # visual verification
        return result.get("success", False)

    def _compress_context(self):
        # Summarize old observations/actions; keep recent + key milestones
        pass
```

## OSWorldBenchmark

```python
class OSWorldBenchmark:
    """Integração com OS World para benchmarking."""

    def __init__(self, agent: ComputerUseAgent):
        self.agent = agent

    def run_benchmark(self, task_subset: List[str] = None) -> Dict:
        tasks = self._load_osworld_tasks(task_subset)
        results = []
        for task in tasks:
            print(f"Running: {task['id']}")
            env = self._setup_environment(task)
            result = self.agent.run_task(goal=task["instruction"],
                                         initial_url=task.get("start_url"))
            eval_result = self._evaluate(task, result, env)
            results.append({"task_id": task["id"], "success": eval_result["success"],
                            "steps": len(result["state"].actions),
                            "duration": time.time() - result["state"].task_start_time,
                            "eval_details": eval_result})
            self._cleanup_environment(env)

        success_rate = sum(1 for r in results if r["success"]) / len(results)
        return {"success_rate": success_rate,
                "avg_steps": sum(r["steps"] for r in results) / len(results),
                "avg_duration_min": sum(r["duration"] for r in results) / len(results) / 60,
                "results": results}

    def _load_osworld_tasks(self, subset: List[str] = None) -> List[Dict]:
        # From xlang-ai/OSWorld dataset
        pass

    def _evaluate(self, task, result, env) -> Dict:
        # OS World evaluation functions
        pass
```

## CaptchaSolverAgent (48 Levels)

```python
class CaptchaSolverAgent:
    """Resolve captchas tipo 'I'm Not a Robot' (48 levels)."""

    LEVEL_PATTERNS = {
        1: "checkbox", 5: "traffic_lights", 10: "waldo",
        15: "perfect_circle", 20: "parallel_park", 25: "puzzles",
        30: "whack_mole", 35: "ai_faces", 40: "wrong_answers",
        45: "rhythm_game", 48: "final_boss",
    }

    def __init__(self, agent: ComputerUseAgent):
        self.agent = agent

    def solve_level(self, level: int, url: str) -> bool:
        pattern = self.LEVEL_PATTERNS.get(level, "unknown")
        result = self.agent.run_task(
            goal=f"Solve {pattern} captcha (level {level})", initial_url=url)
        return result["status"] == "completed"

    def solve_all_48(self, base_url: str) -> Dict:
        results = {}
        for level in range(1, 49):
            success = self.solve_level(level, f"{base_url}/level/{level}")
            results[level] = success
            if not success:
                print(f"Failed at level {level}")
                break
        return {"levels_solved": sum(1 for v in results.values() if v),
                "total_levels": 48,
                "success_rate": sum(1 for v in results.values() if v) / 48,
                "details": results}
```

## SlideControlHandler

```python
class SlideControlHandler:
    """Handler para slide controls (volume, brightness, captcha sliders)."""

    @staticmethod
    def calculate_slide_path(slider_bbox: Tuple[int, int, int, int],
                             target_percentage: float):
        """start/end coordinates para slide."""
        x1, y1, x2, y2 = slider_bbox
        center_y = (y1 + y2) // 2
        width = x2 - x1
        return ((x1 + 5, center_y),
                (x1 + int(width * target_percentage) - 5, center_y))

    @staticmethod
    def execute_slide(agent: ComputerUseAgent, slider_bbox, target_percentage: float,
                      verify: bool = True) -> bool:
        """Executa slide com verificação visual."""
        start, end = SlideControlHandler.calculate_slide_path(
            slider_bbox, target_percentage)
        result = agent._execute_action(
            Action(type=ActionType.SLIDE, start=start, end=end, duration_ms=500))
        if verify:
            post_obs = agent._capture_screen()
            actual = SlideControlHandler._detect_slider_position(post_obs, slider_bbox)
            return abs(actual - target_percentage) < 0.05
        return result.get("success", False)

    @staticmethod
    def _detect_slider_position(obs: Observation, bbox: Tuple) -> float:
        # CV: find slider handle position
        pass
```
