"""
World Labs Marble / LWM API Client
Provides a Python interface for 3D scene generation, spatial reasoning, and robotics planning.
"""

import os
import json
import time
import requests
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from pathlib import Path


@dataclass
class SceneGenerationRequest:
    image_url: str
    prompt: Optional[str] = None
    resolution: str = "1024x1024"
    num_views: int = 8
    physics_enabled: bool = True
    material_estimation: bool = True


@dataclass
class SpatialReasoningQuery:
    query_type: str  # object_permanence, physics_prediction, affordance_detection
    object_id: Optional[str] = None
    region: Optional[str] = None
    time_horizon: Optional[float] = None


@dataclass
class RoboticsPlanRequest:
    scene_id: str
    task: str
    robot_config: Dict[str, Any]
    constraints: Optional[Dict[str, Any]] = None


class WorldLabsClient:
    """Client for World Labs Marble / LWM API."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        timeout: int = 120
    ):
        self.api_key = api_key or os.getenv("WORLD_LABS_API_KEY")
        self.base_url = base_url or os.getenv("WORLD_LABS_BASE_URL", "https://api.worldlabs.ai")
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        })

    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Make HTTP request with retry logic."""
        url = f"{self.base_url}{endpoint}"
        max_retries = 3
        backoff = 1.0

        for attempt in range(max_retries):
            try:
                response = self.session.request(method, url, timeout=self.timeout, **kwargs)

                if response.status_code == 429:
                    # Rate limited - exponential backoff
                    retry_after = response.headers.get("Retry-After", backoff)
                    time.sleep(float(retry_after))
                    backoff *= 2
                    continue

                response.raise_for_status()
                return response.json()

            except requests.exceptions.RequestException as e:
                if attempt == max_retries - 1:
                    raise
                time.sleep(backoff)
                backoff *= 2

        raise RuntimeError(f"Failed after {max_retries} retries")

    # === 3D Scene Generation ===

    def generate_scene(self, request: SceneGenerationRequest) -> Dict[str, Any]:
        """Generate 3D scene from single image."""
        payload = {
            "input": {
                "image_url": request.image_url,
                "prompt": request.prompt
            },
            "parameters": {
                "resolution": request.resolution,
                "num_views": request.num_views,
                "physics_enabled": request.physics_enabled,
                "material_estimation": request.material_estimation
            }
        }
        return self._request("POST", "/v1/scenes/generate", json=payload)

    def get_scene(self, scene_id: str) -> Dict[str, Any]:
        """Retrieve generated scene by ID."""
        return self._request("GET", f"/v1/scenes/{scene_id}")

    def render_views(self, scene_id: str, camera_poses: List[Dict]) -> Dict[str, Any]:
        """Render novel views from scene."""
        return self._request("POST", f"/v1/scenes/{scene_id}/render", json={"camera_poses": camera_poses})

    def edit_scene(self, scene_id: str, edits: Dict[str, Any]) -> Dict[str, Any]:
        """Edit scene (add/remove objects, modify materials, relight)."""
        return self._request("POST", f"/v1/scenes/{scene_id}/edit", json=edits)

    # === Spatial Reasoning ===

    def spatial_reason(self, scene_id: str, queries: List[SpatialReasoningQuery]) -> Dict[str, Any]:
        """Run spatial reasoning queries on a scene."""
        payload = {
            "scene_id": scene_id,
            "queries": [asdict(q) for q in queries]
        }
        return self._request("POST", "/v1/spatial/reason", json=payload)

    def object_permanence(self, scene_id: str, object_id: str) -> Dict[str, Any]:
        """Check if object persists through occlusion."""
        query = SpatialReasoningQuery(query_type="object_permanence", object_id=object_id)
        return self.spatial_reason(scene_id, [query])

    def physics_prediction(self, scene_id: str, object_id: str, time_horizon: float = 2.0) -> Dict[str, Any]:
        """Predict object trajectory under physics."""
        query = SpatialReasoningQuery(
            query_type="physics_prediction",
            object_id=object_id,
            time_horizon=time_horizon
        )
        return self.spatial_reason(scene_id, [query])

    def affordance_detection(self, scene_id: str, region: str = "all") -> Dict[str, Any]:
        """Detect affordances (graspable, pushable, etc.) in region."""
        query = SpatialReasoningQuery(query_type="affordance_detection", region=region)
        return self.spatial_reason(scene_id, [query])

    # === Robotics Planning ===

    def plan_robotics(self, request: RoboticsPlanRequest) -> Dict[str, Any]:
        """Generate robot motion plan for task."""
        payload = {
            "scene_id": request.scene_id,
            "task": request.task,
            "robot_config": request.robot_config,
            "constraints": request.constraints or {}
        }
        return self._request("POST", "/v1/robotics/plan", json=payload)

    def execute_plan(self, plan_id: str, robot_interface: str) -> Dict[str, Any]:
        """Execute plan on robot (requires robot driver integration)."""
        return self._request("POST", f"/v1/robotics/execute", json={
            "plan_id": plan_id,
            "robot_interface": robot_interface
        })

    def verify_execution(self, scene_id: str, expected_state: Dict[str, Any]) -> Dict[str, Any]:
        """Verify robot execution achieved expected state."""
        return self._request("POST", "/v1/robotics/verify", json={
            "scene_id": scene_id,
            "expected_state": expected_state
        })

    # === Benchmarking ===

    def run_benchmark(self, suite: str, model: str, trials: int = 100) -> Dict[str, Any]:
        """Run standardized spatial reasoning benchmark."""
        return self._request("POST", "/v1/benchmarks/run", json={
            "suite": suite,
            "model": model,
            "trials": trials
        })


def create_client_from_env() -> WorldLabsClient:
    """Factory function to create client from environment variables."""
    return WorldLabsClient()


if __name__ == "__main__":
    # Quick test
    client = create_client_from_env()
    print("WorldLabsClient initialized")
    print(f"Base URL: {client.base_url}")
    print(f"API Key: {'***' if client.api_key else 'NOT SET'}")