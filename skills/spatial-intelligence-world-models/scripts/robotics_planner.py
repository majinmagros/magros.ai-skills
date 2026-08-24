"""
Robotics Planning and Execution Helpers
Interfaces with World Labs robotics planning API and robot drivers.
"""

import json
import time
import numpy as np
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from pathlib import Path
from abc import ABC, abstractmethod

from worldlabs_client import WorldLabsClient, RoboticsPlanRequest


@dataclass
class RobotConfig:
    """Robot configuration."""
    robot_type: str  # franka_panda, ur5, spot, custom
    urdf_path: Optional[str] = None
    mjcf_path: Optional[str] = None
    ee_frame: str = "panda_hand"
    joint_limits: Optional[Dict[str, Tuple[float, float]]] = None
    velocity_limits: Optional[List[float]] = None
    acceleration_limits: Optional[List[float]] = None


@dataclass
class PlanningConstraints:
    """Motion planning constraints."""
    collision_avoidance: bool = True
    force_limits: Optional[List[float]] = None  # [fx, fy, fz, tx, ty, tz]
    velocity_scaling: float = 0.5
    acceleration_scaling: float = 0.5
    goal_tolerance: float = 0.01
    planning_time: float = 10.0


@dataclass
class Trajectory:
    """Robot trajectory."""
    joint_names: List[str]
    waypoints: List[List[float]]  # [num_waypoints, num_joints]
    timestamps: List[float]
    gripper_commands: Optional[List[float]] = None


class RobotDriver(ABC):
    """Abstract robot driver interface."""

    @abstractmethod
    def connect(self) -> bool:
        """Connect to robot."""
        pass

    @abstractmethod
    def disconnect(self):
        """Disconnect from robot."""
        pass

    @abstractmethod
    def get_joint_states(self) -> Dict[str, float]:
        """Get current joint positions."""
        pass

    @abstractmethod
    def execute_trajectory(self, trajectory: Trajectory) -> bool:
        """Execute trajectory on robot."""
        pass

    @abstractmethod
    def emergency_stop(self):
        """Emergency stop."""
        pass


class SimulatedRobotDriver(RobotDriver):
    """Simulated robot driver for testing (MuJoCo/Isaac Sim)."""

    def __init__(self, robot_config: RobotConfig, sim_backend: str = "mujoco"):
        self.robot_config = robot_config
        self.sim_backend = sim_backend
        self.connected = False
        self.current_joints = {}

    def connect(self) -> bool:
        print(f"Connecting to simulated {self.robot_config.robot_type} via {self.sim_backend}...")
        self.connected = True
        # Initialize simulation
        return True

    def disconnect(self):
        self.connected = False
        print("Disconnected from simulation")

    def get_joint_states(self) -> Dict[str, float]:
        return self.current_joints

    def execute_trajectory(self, trajectory: Trajectory) -> bool:
        if not self.connected:
            return False
        print(f"Executing trajectory with {len(trajectory.waypoints)} waypoints...")
        # Simulate execution
        self.current_joints = dict(zip(trajectory.joint_names, trajectory.waypoints[-1]))
        return True

    def emergency_stop(self):
        print("EMERGENCY STOP")


class FrankaDriver(RobotDriver):
    """Franka Emika Panda driver (requires franka_ros/libfranka)."""

    def __init__(self, robot_ip: str = "172.16.0.2"):
        self.robot_ip = robot_ip
        self.connected = False

    def connect(self) -> bool:
        # Would use franka_ros or libfranka Python bindings
        print(f"Connecting to Franka at {self.robot_ip}...")
        self.connected = True
        return True

    def disconnect(self):
        self.connected = False

    def get_joint_states(self) -> Dict[str, float]:
        # Query robot state
        return {f"panda_joint{i}": 0.0 for i in range(1, 8)}

    def execute_trajectory(self, trajectory: Trajectory) -> bool:
        if not self.connected:
            return False
        # Send trajectory to robot controller
        print(f"Executing on Franka: {len(trajectory.waypoints)} waypoints")
        return True

    def emergency_stop(self):
        print("FRANKA EMERGENCY STOP")


class URDriver(RobotDriver):
    """Universal Robots driver (URScript/RTDE)."""

    def __init__(self, robot_ip: str = "192.168.1.100"):
        self.robot_ip = robot_ip
        self.connected = False

    def connect(self) -> bool:
        print(f"Connecting to UR at {self.robot_ip}...")
        self.connected = True
        return True

    def disconnect(self):
        self.connected = False

    def get_joint_states(self) -> Dict[str, float]:
        return {f"joint_{i}": 0.0 for i in range(6)}

    def execute_trajectory(self, trajectory: Trajectory) -> bool:
        if not self.connected:
            return False
        print(f"Executing on UR: {len(trajectory.waypoints)} waypoints")
        return True

    def emergency_stop(self):
        print("UR EMERGENCY STOP")


# Predefined robot configs
ROBOT_CONFIGS = {
    "franka_panda": RobotConfig(
        robot_type="franka_panda",
        ee_frame="panda_hand",
        joint_limits={
            "panda_joint1": (-2.8973, 2.8973),
            "panda_joint2": (-1.7628, 1.7628),
            "panda_joint3": (-2.8973, 2.8973),
            "panda_joint4": (-3.0718, -0.0698),
            "panda_joint5": (-2.8973, 2.8973),
            "panda_joint6": (-0.0175, 3.7525),
            "panda_joint7": (-2.8973, 2.8973),
        },
        velocity_limits=[2.1750, 2.1750, 2.1750, 2.1750, 2.6100, 2.6100, 2.6100],
    ),
    "ur5": RobotConfig(
        robot_type="ur5",
        ee_frame="tool0",
        joint_limits={f"joint_{i}": (-2*np.pi, 2*np.pi) for i in range(6)},
        velocity_limits=[3.14]*6,
    ),
    "ur10": RobotConfig(
        robot_type="ur10",
        ee_frame="tool0",
        joint_limits={f"joint_{i}": (-2*np.pi, 2*np.pi) for i in range(6)},
        velocity_limits=[2.0]*6,
    ),
}


class RoboticsPlanner:
    """High-level robotics planning interface."""

    def __init__(self, client: WorldLabsClient, robot_config: RobotConfig):
        self.client = client
        self.robot_config = robot_config
        self.driver: Optional[RobotDriver] = None

    def set_driver(self, driver: RobotDriver):
        """Set robot driver for execution."""
        self.driver = driver

    def plan_task(
        self,
        scene_id: str,
        task: str,
        constraints: Optional[PlanningConstraints] = None
    ) -> Dict[str, Any]:
        """Request motion plan from World Labs API."""
        request = RoboticsPlanRequest(
            scene_id=scene_id,
            task=task,
            robot_config={
                "type": self.robot_config.robot_type,
                "ee_frame": self.robot_config.ee_frame,
                "joint_limits": self.robot_config.joint_limits or {},
            },
            constraints=asdict(constraints) if constraints else {}
        )
        return self.client.plan_robotics(request)

    def execute_plan(self, plan: Dict[str, Any]) -> bool:
        """Execute plan on connected robot."""
        if not self.driver:
            raise RuntimeError("No robot driver set. Call set_driver() first.")

        # Convert plan to trajectory
        trajectory = self._plan_to_trajectory(plan)

        # Execute
        success = self.driver.execute_trajectory(trajectory)

        if not success:
            self.driver.emergency_stop()

        return success

    def _plan_to_trajectory(self, plan: Dict[str, Any]) -> Trajectory:
        """Convert API plan to trajectory format."""
        # Plan format from API: {"trajectory": [[...]], "timestamps": [...], "gripper": [...]}
        traj_data = plan.get("trajectory", {})
        return Trajectory(
            joint_names=list(self.robot_config.joint_limits.keys()) if self.robot_config.joint_limits else [f"joint_{i}" for i in range(7)],
            waypoints=traj_data.get("waypoints", []),
            timestamps=traj_data.get("timestamps", []),
            gripper_commands=traj_data.get("gripper", None)
        )

    def verify_execution(self, scene_id: str, expected_state: Dict[str, Any]) -> Dict[str, Any]:
        """Verify execution achieved expected state."""
        return self.client.verify_execution(scene_id, expected_state)


# === Task-Specific Planning Helpers ===

def create_door_opening_plan(
    scene_id: str,
    door_side: str = "pull",  # "push" or "pull"
    handle_height: float = 1.0
) -> Dict[str, Any]:
    """Create door opening task specification."""
    return {
        "task": "open_door",
        "parameters": {
            "door_side": door_side,
            "handle_height": handle_height,
            "swing_angle": 90.0,  # degrees
        }
    }


def create_sandwich_plan(
    scene_id: str,
    ingredients: List[str] = None,
    bread_type: str = "sliced"
) -> Dict[str, Any]:
    """Create sandwich making task specification."""
    if ingredients is None:
        ingredients = ["bread", "cheese", "ham", "lettuce", "bread"]

    return {
        "task": "make_sandwich",
        "parameters": {
            "ingredients": ingredients,
            "bread_type": bread_type,
            "spread": "mayo",
            "cut": "diagonal"
        }
    }


def create_pick_place_plan(
    scene_id: str,
    object_name: str,
    target_location: List[float],
    approach_vector: List[float] = None
) -> Dict[str, Any]:
    """Create pick-and-place task specification."""
    return {
        "task": "pick_place",
        "parameters": {
            "object": object_name,
            "target": target_location,
            "approach": approach_vector or [0, 0, -1]
        }
    }


# === Sim-to-Real Transfer Helpers ===

def add_domain_randomization(plan: Dict[str, Any], noise_level: float = 0.01) -> Dict[str, Any]:
    """Add domain randomization to plan for sim-to-real transfer."""
    # Add noise to waypoints
    if "trajectory" in plan and "waypoints" in plan["trajectory"]:
        waypoints = np.array(plan["trajectory"]["waypoints"])
        noise = np.random.normal(0, noise_level, waypoints.shape)
        plan["trajectory"]["waypoints"] = (waypoints + noise).tolist()
    return plan


def create_impedance_controller_config(
    stiffness: List[float] = None,
    damping: List[float] = None
) -> Dict[str, Any]:
    """Create impedance control configuration for compliant execution."""
    return {
        "control_mode": "impedance",
        "stiffness": stiffness or [1000, 1000, 1000, 50, 50, 50],
        "damping": damping or [10, 10, 10, 1, 1, 1],
        "force_threshold": [20, 20, 20, 5, 5, 5]
    }


if __name__ == "__main__":
    # Demo
    from worldlabs_client import create_client_from_env

    client = create_client_from_env()
    robot_config = ROBOT_CONFIGS["franka_panda"]
    planner = RoboticsPlanner(client, robot_config)

    # Set simulated driver for testing
    planner.set_driver(SimulatedRobotDriver(robot_config))

    print("RoboticsPlanner initialized")
    print(f"Robot: {robot_config.robot_type}")
    print(f"EE Frame: {robot_config.ee_frame}")