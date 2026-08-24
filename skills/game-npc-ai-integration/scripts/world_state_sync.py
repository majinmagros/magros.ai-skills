"""
World State Synchronization — Position, Inventory, Quests, Factions
Keeps NPC awareness in sync with the game engine.
"""

from __future__ import annotations
import time
import threading
from dataclasses import dataclass, field, asdict
from typing import Optional
from enum import Enum
from collections import defaultdict
from abc import ABC, abstractmethod
import json
from pathlib import Path


class QuestStatus(Enum):
    NOT_STARTED = "not_started"
    AVAILABLE = "available"
    ACTIVE = "active"
    COMPLETED = "completed"
    FAILED = "failed"
    TURNED_IN = "turned_in"


class FactionStanding(Enum):
    HATED = -1000
    HOSTILE = -500
    UNFRIENDLY = -100
    NEUTRAL = 0
    FRIENDLY = 100
    HONORED = 500
    REVERED = 1000
    EXALTED = 2000


@dataclass
class Position:
    """3D position with dimension/world context."""
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0
    dimension: str = "overworld"  # overworld, nether, end, interior, etc.
    timestamp: float = field(default_factory=time.time)

    def distance_to(self, other: Position) -> float:
        if self.dimension != other.dimension:
            return float('inf')
        dx = self.x - other.x
        dy = self.y - other.y
        dz = self.z - other.z
        return (dx*dx + dy*dy + dz*dz) ** 0.5

    def to_tuple(self) -> tuple[float, float, float]:
        return (self.x, self.y, self.z)

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> Position:
        return cls(**data)


@dataclass
class InventoryItem:
    """Item in inventory."""
    item_id: str
    name: str
    count: int = 1
    slot: int = -1
    metadata: dict = field(default_factory=dict)  # durability, enchantments, etc.

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> InventoryItem:
        return cls(**data)


@dataclass
class QuestObjective:
    """Single objective within a quest."""
    id: str
    description: str
    target_type: str  # kill, collect, goto, talk, craft
    target_id: str
    required_count: int = 1
    current_count: int = 0
    completed: bool = False

    def progress(self, amount: int = 1) -> bool:
        self.current_count = min(self.required_count, self.current_count + amount)
        if self.current_count >= self.required_count:
            self.completed = True
            return True
        return False

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> QuestObjective:
        return cls(**data)


@dataclass
class Quest:
    """Quest with multiple objectives."""
    id: str
    name: str
    description: str
    giver_id: str  # NPC or object that gives quest
    status: QuestStatus = QuestStatus.NOT_STARTED
    objectives: list[QuestObjective] = field(default_factory=list)
    rewards: dict = field(default_factory=dict)  # xp, items, currency, reputation
    prerequisites: list[str] = field(default_factory=list)  # quest IDs
    started_at: Optional[float] = None
    completed_at: Optional[float] = None
    metadata: dict = field(default_factory=dict)

    def is_complete(self) -> bool:
        return all(obj.completed for obj in self.objectives)

    def get_progress(self) -> float:
        if not self.objectives:
            return 1.0 if self.status == QuestStatus.COMPLETED else 0.0
        total = sum(obj.required_count for obj in self.objectives)
        current = sum(obj.current_count for obj in self.objectives)
        return current / total if total > 0 else 0.0

    def to_dict(self) -> dict:
        data = asdict(self)
        data["status"] = self.status.value
        data["objectives"] = [obj.to_dict() for obj in self.objectives]
        return data

    @classmethod
    def from_dict(cls, data: dict) -> Quest:
        quest = cls(
            id=data["id"],
            name=data["name"],
            description=data["description"],
            giver_id=data["giver_id"],
            status=QuestStatus(data.get("status", "not_started")),
            rewards=data.get("rewards", {}),
            prerequisites=data.get("prerequisites", []),
            started_at=data.get("started_at"),
            completed_at=data.get("completed_at"),
            metadata=data.get("metadata", {})
        )
        quest.objectives = [QuestObjective.from_dict(obj) for obj in data.get("objectives", [])]
        return quest


@dataclass
class Faction:
    """Faction with reputation tracking."""
    id: str
    name: str
    description: str = ""
    standing: int = 0  # -1000 to 2000+
    max_standing: int = 20000
    at_war_with: list[str] = field(default_factory=list)
    allied_with: list[str] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)

    def get_standing_level(self) -> FactionStanding:
        for level in reversed(list(FactionStanding)):
            if self.standing >= level.value:
                return level
        return FactionStanding.HATED

    def modify_standing(self, delta: int) -> int:
        self.standing = max(-1000, min(self.max_standing, self.standing + delta))
        return self.standing

    def is_hostile(self) -> bool:
        return self.standing < 0

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> Faction:
        return cls(**data)


class WorldState:
    """Complete world state for an NPC."""

    def __init__(self, npc_id: str):
        self.npc_id = npc_id
        self.position = Position()
        self.inventory: dict[int, InventoryItem] = {}  # slot -> item
        self.equipment: dict[str, InventoryItem] = {}  # slot_name -> item
        self.quests: dict[str, Quest] = {}  # quest_id -> Quest
        self.factions: dict[str, Faction] = {}  # faction_id -> Faction
        self.known_entities: dict[str, dict] = {}  # entity_id -> {type, last_seen, position}
        self.known_locations: dict[str, Position] = {}  # location_name -> Position
        self.active_effects: dict[str, dict] = {}  # effect_id -> {type, duration, magnitude}
        self.currency: dict[str, int] = defaultdict(int)  # currency_type -> amount
        self._lock = threading.RLock()
        self._listeners: list[callable] = []

    def add_listener(self, callback: callable) -> None:
        self._listeners.append(callback)

    def _notify(self, event_type: str, data: dict) -> None:
        for callback in self._listeners:
            try:
                callback(event_type, data)
            except Exception:
                pass  # Don't let listener errors break state

    # Position
    def update_position(self, position: Position) -> None:
        with self._lock:
            old_pos = self.position
            self.position = position
            self._notify("position_changed", {"old": old_pos.to_dict(), "new": position.to_dict()})

    def get_position(self) -> Position:
        with self._lock:
            return self.position

    # Inventory
    def add_item(self, item: InventoryItem, slot: int = None) -> bool:
        with self._lock:
            if slot is not None:
                if slot in self.inventory:
                    return False
                self.inventory[slot] = item
            else:
                # Find first empty slot
                for i in range(36):  # Standard inventory size
                    if i not in self.inventory:
                        self.inventory[i] = item
                        break
                else:
                    return False
            self._notify("item_added", {"item": item.to_dict(), "slot": slot})
            return True

    def remove_item(self, slot: int, count: int = None) -> Optional[InventoryItem]:
        with self._lock:
            if slot not in self.inventory:
                return None
            item = self.inventory[slot]
            if count is None or count >= item.count:
                del self.inventory[slot]
                self._notify("item_removed", {"item": item.to_dict(), "slot": slot})
                return item
            else:
                item.count -= count
                self._notify("item_count_changed", {"item": item.to_dict(), "slot": slot})
                return InventoryItem(item.item_id, item.name, count, slot, item.metadata)

    def get_item(self, slot: int) -> Optional[InventoryItem]:
        with self._lock:
            return self.inventory.get(slot)

    def find_item(self, item_id: str) -> list[tuple[int, InventoryItem]]:
        with self._lock:
            return [(slot, item) for slot, item in self.inventory.items()
                    if item.item_id == item_id]

    def get_inventory_summary(self) -> list[dict]:
        with self._lock:
            return [{"slot": slot, **item.to_dict()} for slot, item in self.inventory.items()]

    # Equipment
    def equip(self, slot: str, item: InventoryItem) -> Optional[InventoryItem]:
        with self._lock:
            old = self.equipment.get(slot)
            self.equipment[slot] = item
            self._notify("equipment_changed", {"slot": slot, "old": old.to_dict() if old else None,
                                               "new": item.to_dict()})
            return old

    def unequip(self, slot: str) -> Optional[InventoryItem]:
        with self._lock:
            if slot in self.equipment:
                item = self.equipment.pop(slot)
                self._notify("equipment_changed", {"slot": slot, "old": item.to_dict(), "new": None})
                return item
            return None

    # Quests
    def add_quest(self, quest: Quest) -> None:
        with self._lock:
            self.quests[quest.id] = quest
            self._notify("quest_added", {"quest": quest.to_dict()})

    def update_quest_status(self, quest_id: str, status: QuestStatus) -> bool:
        with self._lock:
            if quest_id in self.quests:
                old_status = self.quests[quest_id].status
                self.quests[quest_id].status = status
                if status == QuestStatus.ACTIVE and old_status != QuestStatus.ACTIVE:
                    self.quests[quest_id].started_at = time.time()
                elif status in (QuestStatus.COMPLETED, QuestStatus.TURNED_IN):
                    self.quests[quest_id].completed_at = time.time()
                self._notify("quest_status_changed", {"quest_id": quest_id, "old": old_status.value, "new": status.value})
                return True
            return False

    def progress_quest_objective(self, quest_id: str, objective_id: str, amount: int = 1) -> bool:
        with self._lock:
            if quest_id not in self.quests:
                return False
            quest = self.quests[quest_id]
            for obj in quest.objectives:
                if obj.id == objective_id:
                    completed = obj.progress(amount)
                    self._notify("quest_progress", {"quest_id": quest_id, "objective_id": objective_id,
                                                    "progress": obj.current_count, "completed": completed})
                    if quest.is_complete() and quest.status == QuestStatus.ACTIVE:
                        self.update_quest_status(quest_id, QuestStatus.COMPLETED)
                    return True
            return False

    def get_active_quests(self) -> list[Quest]:
        with self._lock:
            return [q for q in self.quests.values() if q.status == QuestStatus.ACTIVE]

    def get_available_quests(self, from_giver: str = None) -> list[Quest]:
        with self._lock:
            quests = [q for q in self.quests.values() if q.status == QuestStatus.AVAILABLE]
            if from_giver:
                quests = [q for q in quests if q.giver_id == from_giver]
            return quests

    # Factions
    def add_faction(self, faction: Faction) -> None:
        with self._lock:
            self.factions[faction.id] = faction

    def modify_faction_standing(self, faction_id: str, delta: int) -> bool:
        with self._lock:
            if faction_id in self.factions:
                old_standing = self.factions[faction_id].standing
                new_standing = self.factions[faction_id].modify_standing(delta)
                self._notify("faction_standing_changed", {"faction_id": faction_id,
                                                          "old": old_standing, "new": new_standing})
                return True
            return False

    def get_faction_standing(self, faction_id: str) -> int:
        with self._lock:
            return self.factions.get(faction_id, Faction(faction_id, faction_id)).standing

    # Known entities/locations
    def update_known_entity(self, entity_id: str, entity_type: str, position: Position) -> None:
        with self._lock:
            self.known_entities[entity_id] = {
                "type": entity_type,
                "last_seen": time.time(),
                "position": position.to_dict()
            }

    def get_known_entity(self, entity_id: str) -> Optional[dict]:
        with self._lock:
            return self.known_entities.get(entity_id)

    def get_nearby_entities(self, radius: float, entity_types: list[str] = None) -> list[dict]:
        with self._lock:
            results = []
            for eid, info in self.known_entities.items():
                if entity_types and info["type"] not in entity_types:
                    continue
                pos = Position.from_dict(info["position"])
                if self.position.distance_to(pos) <= radius:
                    results.append({"entity_id": eid, **info, "distance": self.position.distance_to(pos)})
            return results

    def add_known_location(self, name: str, position: Position) -> None:
        with self._lock:
            self.known_locations[name] = position

    def get_known_location(self, name: str) -> Optional[Position]:
        with self._lock:
            return self.known_locations.get(name)

    # Currency
    def add_currency(self, currency_type: str, amount: int) -> int:
        with self._lock:
            self.currency[currency_type] += amount
            self._notify("currency_changed", {"currency": currency_type, "amount": self.currency[currency_type]})
            return self.currency[currency_type]

    def spend_currency(self, currency_type: str, amount: int) -> bool:
        with self._lock:
            if self.currency.get(currency_type, 0) >= amount:
                self.currency[currency_type] -= amount
                self._notify("currency_changed", {"currency": currency_type, "amount": self.currency[currency_type]})
                return True
            return False

    # Effects
    def add_effect(self, effect_id: str, effect_type: str, duration: float, magnitude: float = 1.0) -> None:
        with self._lock:
            self.active_effects[effect_id] = {
                "type": effect_type,
                "duration": duration,
                "magnitude": magnitude,
                "start_time": time.time()
            }

    def remove_effect(self, effect_id: str) -> bool:
        with self._lock:
            if effect_id in self.active_effects:
                del self.active_effects[effect_id]
                return True
            return False

    def get_active_effects(self) -> dict:
        with self._lock:
            now = time.time()
            active = {}
            for eid, effect in self.active_effects.items():
                if now - effect["start_time"] < effect["duration"]:
                    active[eid] = effect
                else:
                    del self.active_effects[eid]
            return active

    # Serialization
    def to_dict(self) -> dict:
        with self._lock:
            return {
                "npc_id": self.npc_id,
                "position": self.position.to_dict(),
                "inventory": {str(slot): item.to_dict() for slot, item in self.inventory.items()},
                "equipment": {slot: item.to_dict() for slot, item in self.equipment.items()},
                "quests": {qid: quest.to_dict() for qid, quest in self.quests.items()},
                "factions": {fid: faction.to_dict() for fid, faction in self.factions.items()},
                "known_entities": self.known_entities,
                "known_locations": {name: pos.to_dict() for name, pos in self.known_locations.items()},
                "active_effects": self.active_effects,
                "currency": dict(self.currency)
            }

    @classmethod
    def from_dict(cls, data: dict) -> WorldState:
        state = cls(data["npc_id"])
        state.position = Position.from_dict(data["position"])
        state.inventory = {int(slot): InventoryItem.from_dict(item)
                          for slot, item in data.get("inventory", {}).items()}
        state.equipment = {slot: InventoryItem.from_dict(item)
                          for slot, item in data.get("equipment", {}).items()}
        state.quests = {qid: Quest.from_dict(quest) for qid, quest in data.get("quests", {}).items()}
        state.factions = {fid: Faction.from_dict(faction) for fid, faction in data.get("factions", {}).items()}
        state.known_entities = data.get("known_entities", {})
        state.known_locations = {name: Position.from_dict(pos)
                                for name, pos in data.get("known_locations", {}).items()}
        state.active_effects = data.get("active_effects", {})
        state.currency = defaultdict(int, data.get("currency", {}))
        return state

    def save(self, path: Path) -> None:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(self.to_dict(), f, ensure_ascii=False, indent=2)

    @classmethod
    def load(cls, path: Path) -> WorldState:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return cls.from_dict(data)


class WorldStateSync(ABC):
    """Abstract base for game-engine-specific world state synchronization."""

    def __init__(self, world_state: WorldState, sync_interval: float = 1.0):
        self.world_state = world_state
        self.sync_interval = sync_interval
        self._running = False
        self._thread: Optional[threading.Thread] = None

    @abstractmethod
    def fetch_position(self) -> Position:
        """Get current position from game engine."""
        pass

    @abstractmethod
    def fetch_inventory(self) -> dict[int, InventoryItem]:
        """Get current inventory from game engine."""
        pass

    @abstractmethod
    def fetch_quests(self) -> list[Quest]:
        """Get current quests from game engine."""
        pass

    @abstractmethod
    def fetch_factions(self) -> list[Faction]:
        """Get current faction standings from game engine."""
        pass

    @abstractmethod
    def fetch_nearby_entities(self, radius: float) -> list[dict]:
        """Get nearby entities from game engine."""
        pass

    def sync_once(self) -> None:
        """Perform one synchronization cycle."""
        try:
            # Position
            pos = self.fetch_position()
            self.world_state.update_position(pos)

            # Inventory
            inv = self.fetch_inventory()
            with self.world_state._lock:
                self.world_state.inventory = inv

            # Quests
            quests = self.fetch_quests()
            with self.world_state._lock:
                for quest in quests:
                    if quest.id not in self.world_state.quests:
                        self.world_state.add_quest(quest)
                    else:
                        # Update existing quest status
                        self.world_state.quests[quest.id].status = quest.status
                        for obj in quest.objectives:
                            for existing_obj in self.world_state.quests[quest.id].objectives:
                                if existing_obj.id == obj.id:
                                    existing_obj.current_count = obj.current_count
                                    existing_obj.completed = obj.completed

            # Factions
            factions = self.fetch_factions()
            with self.world_state._lock:
                for faction in factions:
                    if faction.id not in self.world_state.factions:
                        self.world_state.add_faction(faction)
                    else:
                        self.world_state.factions[faction.id].standing = faction.standing

            # Nearby entities
            entities = self.fetch_nearby_entities(50.0)  # 50 unit radius
            for entity in entities:
                self.world_state.update_known_entity(
                    entity["entity_id"],
                    entity["type"],
                    Position.from_dict(entity["position"])
                )

        except Exception as e:
            self.world_state._notify("sync_error", {"error": str(e)})

    def start(self) -> None:
        """Start background synchronization."""
        if self._running:
            return
        self._running = True
        self._thread = threading.Thread(target=self._sync_loop, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        """Stop background synchronization."""
        self._running = False
        if self._thread:
            self._thread.join(timeout=5.0)

    def _sync_loop(self) -> None:
        while self._running:
            self.sync_once()
            time.sleep(self.sync_interval)


class PositionTracker:
    """Tracks position history for path analysis and prediction."""

    def __init__(self, max_history: int = 1000):
        self.max_history = max_history
        self.history: list[Position] = []
        self._lock = threading.Lock()

    def add(self, position: Position) -> None:
        with self._lock:
            self.history.append(position)
            if len(self.history) > self.max_history:
                self.history.pop(0)

    def get_recent(self, count: int = 10) -> list[Position]:
        with self._lock:
            return self.history[-count:]

    def get_average_speed(self, window: int = 10) -> float:
        with self._lock:
            if len(self.history) < 2:
                return 0.0
            recent = self.history[-window:]
            total_dist = 0.0
            total_time = 0.0
            for i in range(1, len(recent)):
                dist = recent[i].distance_to(recent[i-1])
                dt = recent[i].timestamp - recent[i-1].timestamp
                if dt > 0:
                    total_dist += dist
                    total_time += dt
            return total_dist / total_time if total_time > 0 else 0.0

    def predict_position(self, seconds_ahead: float) -> Optional[Position]:
        """Simple linear prediction based on recent velocity."""
        with self._lock:
            if len(self.history) < 2:
                return None
            recent = self.history[-2:]
            dt = recent[1].timestamp - recent[0].timestamp
            if dt <= 0:
                return None
            vx = (recent[1].x - recent[0].x) / dt
            vy = (recent[1].y - recent[0].y) / dt
            vz = (recent[1].z - recent[0].z) / dt
            now = time.time()
            return Position(
                x=recent[1].x + vx * seconds_ahead,
                y=recent[1].y + vy * seconds_ahead,
                z=recent[1].z + vz * seconds_ahead,
                dimension=recent[1].dimension,
                timestamp=now + seconds_ahead
            )