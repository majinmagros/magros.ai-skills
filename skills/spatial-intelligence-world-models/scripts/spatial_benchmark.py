"""
Spatial Reasoning Benchmark Runner
Standardized benchmarks for object permanence, physics prediction, affordance detection, etc.
"""

import json
import time
import numpy as np
from typing import Dict, List, Any, Callable
from dataclasses import dataclass, asdict
from pathlib import Path
from abc import ABC, abstractmethod

from worldlabs_client import WorldLabsClient, SpatialReasoningQuery


@dataclass
class BenchmarkTask:
    """A single benchmark task."""
    task_id: str
    benchmark_type: str
    scene_id: str
    query: SpatialReasoningQuery
    ground_truth: Dict[str, Any]
    metadata: Dict[str, Any]


@dataclass
class BenchmarkResult:
    """Result of a single benchmark trial."""
    task_id: str
    prediction: Dict[str, Any]
    score: float
    latency_ms: float
    success: bool
    error: Optional[str] = None


@dataclass
class BenchmarkSummary:
    """Aggregated benchmark results."""
    benchmark_type: str
    num_trials: int
    mean_score: float
    std_score: float
    median_score: float
    success_rate: float
    mean_latency_ms: float
    per_task_results: List[BenchmarkResult]


class BenchmarkSuite(ABC):
    """Abstract base class for benchmark suites."""

    @abstractmethod
    def load_tasks(self, num_tasks: int) -> List[BenchmarkTask]:
        """Load benchmark tasks."""
        pass

    @abstractmethod
    def evaluate(self, ground_truth: Dict, prediction: Dict) -> float:
        """Evaluate prediction against ground truth. Returns 0.0-1.0 score."""
        pass

    @abstractmethod
    def get_name(self) -> str:
        """Return benchmark name."""
        pass


class ObjectPermanenceBenchmark(BenchmarkSuite):
    """Benchmark object permanence tracking through occlusion."""

    def get_name(self) -> str:
        return "object_permanence"

    def load_tasks(self, num_tasks: int) -> List[BenchmarkTask]:
        # In practice, load from dataset (e.g., CO3D, Ego4D, or World Labs benchmark set)
        tasks = []
        for i in range(num_tasks):
            tasks.append(BenchmarkTask(
                task_id=f"obj_perm_{i:04d}",
                benchmark_type="object_permanence",
                scene_id=f"scene_{i % 10:03d}",  # Reuse scenes
                query=SpatialReasoningQuery(
                    query_type="object_permanence",
                    object_id=f"obj_{i % 20:03d}"
                ),
                ground_truth={"visible": True, "position": [0.1, 0.2, 0.3]},
                metadata={"occlusion_duration": 1.5, "num_occluders": 2}
            ))
        return tasks

    def evaluate(self, ground_truth: Dict, prediction: Dict) -> float:
        # Accuracy: did we correctly predict visibility?
        gt_visible = ground_truth.get("visible", False)
        pred_visible = prediction.get("visible", False)
        if gt_visible == pred_visible:
            # If both visible, check position accuracy
            if gt_visible:
                gt_pos = np.array(ground_truth["position"])
                pred_pos = np.array(prediction.get("position", [0, 0, 0]))
                dist = np.linalg.norm(gt_pos - pred_pos)
                return max(0.0, 1.0 - dist)  # Simple distance-based score
            return 1.0
        return 0.0


class PhysicsPredictionBenchmark(BenchmarkSuite):
    """Benchmark physics trajectory prediction."""

    def get_name(self) -> str:
        return "physics_prediction"

    def load_tasks(self, num_tasks: int) -> List[BenchmarkTask]:
        tasks = []
        for i in range(num_tasks):
            tasks.append(BenchmarkTask(
                task_id=f"physics_{i:04d}",
                benchmark_type="physics_prediction",
                scene_id=f"scene_{i % 10:03d}",
                query=SpatialReasoningQuery(
                    query_type="physics_prediction",
                    object_id=f"obj_{i % 20:03d}",
                    time_horizon=2.0
                ),
                ground_truth={"trajectory": [[0, 0, 0], [0.1, 0, 0], [0.2, -0.05, 0]]},
                metadata={"gravity": 9.81, "initial_velocity": [0.1, 0, 0]}
            ))
        return tasks

    def evaluate(self, ground_truth: Dict, prediction: Dict) -> float:
        # MSE between predicted and ground truth trajectories
        gt_traj = np.array(ground_truth.get("trajectory", []))
        pred_traj = np.array(prediction.get("trajectory", []))

        if len(gt_traj) == 0 or len(pred_traj) == 0:
            return 0.0

        # Align trajectories (use min length)
        min_len = min(len(gt_traj), len(pred_traj))
        gt_traj = gt_traj[:min_len]
        pred_traj = pred_traj[:min_len]

        mse = np.mean((gt_traj - pred_traj) ** 2)
        # Convert MSE to 0-1 score (lower MSE = higher score)
        return max(0.0, 1.0 - mse * 10)  # Scale factor


class AffordanceDetectionBenchmark(BenchmarkSuite):
    """Benchmark affordance detection (graspable regions, etc.)."""

    def get_name(self) -> str:
        return "affordance_detection"

    def load_tasks(self, num_tasks: int) -> List[BenchmarkTask]:
        tasks = []
        affordance_types = ["grasp", "push", "pull", "open"]
        for i in range(num_tasks):
            tasks.append(BenchmarkTask(
                task_id=f"affordance_{i:04d}",
                benchmark_type="affordance_detection",
                scene_id=f"scene_{i % 10:03d}",
                query=SpatialReasoningQuery(
                    query_type="affordance_detection",
                    region=affordance_types[i % len(affordance_types)]
                ),
                ground_truth={"affordances": [{"type": "grasp", "region": [100, 100, 50, 50], "confidence": 0.9}]},
                metadata={"object_category": "mug"}
            ))
        return tasks

    def evaluate(self, ground_truth: Dict, prediction: Dict) -> float:
        # IoU between predicted and ground truth affordance regions
        gt_affs = ground_truth.get("affordances", [])
        pred_affs = prediction.get("affordances", [])

        if not gt_affs or not pred_affs:
            return 0.0

        # Simple IoU for first matching affordance type
        for gt in gt_affs:
            for pred in pred_affs:
                if gt["type"] == pred["type"]:
                    gt_box = gt["region"]  # [x, y, w, h]
                    pred_box = pred["region"]
                    return self._compute_iou(gt_box, pred_box)
        return 0.0

    def _compute_iou(self, box1: List[float], box2: List[float]) -> float:
        """Compute IoU of two boxes [x, y, w, h]."""
        x1, y1, w1, h1 = box1
        x2, y2, w2, h2 = box2

        xi1 = max(x1, x2)
        yi1 = max(y1, y2)
        xi2 = min(x1 + w1, x2 + w2)
        yi2 = min(y1 + h1, y2 + h2)

        if xi2 <= xi1 or yi2 <= yi1:
            return 0.0

        inter = (xi2 - xi1) * (yi2 - yi1)
        union = w1 * h1 + w2 * h2 - inter
        return inter / union if union > 0 else 0.0


class NovelViewSynthesisBenchmark(BenchmarkSuite):
    """Benchmark novel view synthesis quality."""

    def get_name(self) -> str:
        return "novel_view_synthesis"

    def load_tasks(self, num_tasks: int) -> List[BenchmarkTask]:
        tasks = []
        for i in range(num_tasks):
            tasks.append(BenchmarkTask(
                task_id=f"nvs_{i:04d}",
                benchmark_type="novel_view_synthesis",
                scene_id=f"scene_{i % 10:03d}",
                query=SpatialReasoningQuery(query_type="render_view"),
                ground_truth={"target_view": f"view_{i}.png"},
                metadata={"camera_pose": [0, 0, 1, 0, 0, 0, 1]}
            ))
        return tasks

    def evaluate(self, ground_truth: Dict, prediction: Dict) -> float:
        # Would compute PSNR/LPIPS against ground truth image
        # Placeholder: return prediction quality score
        return prediction.get("quality_score", 0.5)


class MultiStepPlanningBenchmark(BenchmarkSuite):
    """Benchmark multi-step manipulation planning."""

    def get_name(self) -> str:
        return "multi_step_planning"

    def load_tasks(self, num_tasks: int) -> List[BenchmarkTask]:
        tasks = []
        task_types = ["open_door", "make_sandwich", "pick_place", "stack_blocks"]
        for i in range(num_tasks):
            tasks.append(BenchmarkTask(
                task_id=f"planning_{i:04d}",
                benchmark_type="multi_step_planning",
                scene_id=f"scene_{i % 10:03d}",
                query=SpatialReasoningQuery(query_type="plan_task"),
                ground_truth={"plan": ["grasp", "move", "release"], "success": True},
                metadata={"task_type": task_types[i % len(task_types)], "num_steps": 5}
            ))
        return tasks

    def evaluate(self, ground_truth: Dict, prediction: Dict) -> float:
        # Success rate: did the plan achieve the goal?
        gt_success = ground_truth.get("success", False)
        pred_success = prediction.get("success", False)
        if gt_success and pred_success:
            # Check plan similarity
            gt_plan = ground_truth.get("plan", [])
            pred_plan = prediction.get("plan", [])
            if gt_plan and pred_plan:
                # Simple step overlap score
                overlap = len(set(gt_plan) & set(pred_plan))
                return overlap / max(len(gt_plan), len(pred_plan))
            return 1.0
        elif not gt_success and not pred_success:
            return 1.0  # Correctly predicted failure
        return 0.0


BENCHMARK_SUITES = {
    "object_permanence": ObjectPermanenceBenchmark,
    "physics_prediction": PhysicsPredictionBenchmark,
    "affordance_detection": AffordanceDetectionBenchmark,
    "novel_view_synthesis": NovelViewSynthesisBenchmark,
    "multi_step_planning": MultiStepPlanningBenchmark,
}


def run_benchmark(
    client: WorldLabsClient,
    benchmark_name: str,
    num_trials: int = 100,
    model: str = "marble_v1"
) -> BenchmarkSummary:
    """Run a full benchmark suite."""

    if benchmark_name not in BENCHMARK_SUITES:
        raise ValueError(f"Unknown benchmark: {benchmark_name}. Available: {list(BENCHMARK_SUITES.keys())}")

    suite_class = BENCHMARK_SUITES[benchmark_name]
    suite = suite_class()

    tasks = suite.load_tasks(num_trials)
    results = []

    for task in tasks:
        start = time.time()
        try:
            # Run spatial reasoning query
            response = client.spatial_reason(task.scene_id, [task.query])
            prediction = response.get("result", {})
            latency_ms = (time.time() - start) * 1000

            score = suite.evaluate(task.ground_truth, prediction)

            results.append(BenchmarkResult(
                task_id=task.task_id,
                prediction=prediction,
                score=score,
                latency_ms=latency_ms,
                success=True
            ))

        except Exception as e:
            latency_ms = (time.time() - start) * 1000
            results.append(BenchmarkResult(
                task_id=task.task_id,
                prediction={},
                score=0.0,
                latency_ms=latency_ms,
                success=False,
                error=str(e)
            ))

    # Aggregate
    scores = [r.score for r in results if r.success]
    latencies = [r.latency_ms for r in results if r.success]

    return BenchmarkSummary(
        benchmark_type=benchmark_name,
        num_trials=num_trials,
        mean_score=np.mean(scores) if scores else 0.0,
        std_score=np.std(scores) if scores else 0.0,
        median_score=np.median(scores) if scores else 0.0,
        success_rate=sum(1 for r in results if r.success) / len(results),
        mean_latency_ms=np.mean(latencies) if latencies else 0.0,
        per_task_results=results
    )


def run_all_benchmarks(
    client: WorldLabsClient,
    num_trials: int = 50,
    model: str = "marble_v1"
) -> Dict[str, BenchmarkSummary]:
    """Run all available benchmarks."""
    results = {}
    for name in BENCHMARK_SUITES:
        print(f"Running {name} benchmark...")
        results[name] = run_benchmark(client, name, num_trials, model)
    return results


def print_summary(summary: BenchmarkSummary):
    """Print benchmark summary."""
    print(f"\n=== {summary.benchmark_type.upper()} ===")
    print(f"Trials: {summary.num_trials}")
    print(f"Mean Score: {summary.mean_score:.3f} ± {summary.std_score:.3f}")
    print(f"Median Score: {summary.median_score:.3f}")
    print(f"Success Rate: {summary.success_rate:.1%}")
    print(f"Mean Latency: {summary.mean_latency_ms:.1f} ms")


if __name__ == "__main__":
    client = WorldLabsClient()
    results = run_all_benchmarks(client, num_trials=10)

    for name, summary in results.items():
        print_summary(summary)

    # Save results
    output = {name: asdict(summary) for name, summary in results.items()}
    with open("benchmark_results.json", "w") as f:
        json.dump(output, f, indent=2, default=str)
    print("\nResults saved to benchmark_results.json")