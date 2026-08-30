#!/usr/bin/env python3
"""
model-router.py — Roteamento inteligente de modelos por complexidade/custo
Parte do skill claude-account-optimizer
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum

class ModelTier(Enum):
    ECONOMY = "economy"
    STANDARD = "standard" 
    PREMIUM = "premium"
    REASONING = "reasoning"

@dataclass
class ModelConfig:
    name: str
    alias: str
    tier: ModelTier
    cost_per_1k_in: float
    cost_per_1k_out: float
    max_tokens: int
    strengths: List[str]
    best_for: List[str]

class ModelRouter:
    def __init__(self, config_path: Optional[str] = None):
        self.models = self._load_models(config_path)
        self.usage_history = []
    
    def _load_models(self, config_path: Optional[str]) -> Dict[str, ModelConfig]:
        """Carrega configuração de modelos do arquivo YAML ou usa defaults."""
        defaults = {
            "sonet-3.7": ModelConfig(
                name="claude-3-7-sonnet",
                alias="sonet",
                tier=ModelTier.STANDARD,
                cost_per_1k_in=0.003,
                cost_per_1k_out=0.015,
                max_tokens=200000,
                strengths=["speed", "cost_efficiency", "general_tasks"],
                best_for=["daily_coding", "writing", "analysis", "research", "refactoring"]
            ),
            "opus-5": ModelConfig(
                name="claude-opus-5",
                alias="opus",
                tier=ModelTier.PREMIUM,
                cost_per_1k_in=0.015,
                cost_per_1k_out=0.075,
                max_tokens=200000,
                strengths=["reasoning", "complex_logic", "architecture"],
                best_for=["architecture", "complex_debugging", "security_audit", "multi_step_reasoning"]
            ),
            "fable-5": ModelConfig(
                name="claude-fable-5",
                alias="fable",
                tier=ModelTier.REASONING,
                cost_per_1k_in=0.03,
                cost_per_1k_out=0.15,
                max_tokens=200000,
                strengths=["deep_reasoning", "math", "algorithm_design"],
                best_for=["complex_math", "algorithm_design", "security_research"]
            ),
            "sonet-3.7": ModelConfig(
                name="claude-3-7-sonnet",
                alias="sonet",
                tier=ModelTier.STANDARD,
                cost_per_1k_in=0.003,
                cost_per_1k_out=0.015,
                max_tokens=200000,
                strengths=["speed", "cost_efficiency", "general_tasks"],
                best_for=["daily_coding", "writing", "analysis", "research", "refactoring"]
            ),
            "gemini-3.7-flash": ModelConfig(
                name="gemini-3.7-flash",
                alias="gemini-flash",
                tier=ModelTier.ECONOMY,
                cost_per_1k_in=0.00035,
                cost_per_1k_out=0.00035,
                max_tokens=1000000,
                strengths=["speed", "cost", "long_context"],
                best_for=["high_volume", "long_docs", "batch_processing"]
            ),
            "deepseek-v4-pro": ModelConfig(
                name="deepseek-v4-pro",
                alias="deepseek",
                tier=ModelTier.STANDARD,
                cost_per_1k_in=0.0005,
                cost_per_1k_out=0.0005,
                max_tokens=128000,
                strengths=["reasoning", "code", "chinese"],
                best_for=["deep_thinking", "code_generation", "analysis"]
            )
        }
        
        if config_path and os.path.exists(config_path):
            try:
                import yaml
                with open(config_path, 'r') as f:
                    user_config = yaml.safe_load(f)
                # Merge user config with defaults (simplified)
                return defaults
            except:
                pass
        return defaults
    
    def estimate_complexity(self, task_description: str) -> float:
        """Estima complexidade da tarefa (0-10)."""
        keywords_complex = [
            "architecture", "security", "audit", "debug", "optimize",
            "algorithm", "math", "crypto", "distributed", "concurrent",
            "memory_leak", "race_condition", "deadlock", "compiler"
        ]
        keywords_simple = [
            "write", "create", "add", "update", "fix", "refactor",
            "document", "test", "format", "lint", "rename"
        ]
        
        text = task_description.lower()
        complex_score = sum(1 for k in keywords_complex if k in text)
        simple_score = sum(1 for k in keywords_simple if k in text)
        
        # Heurística baseada em palavras-chave
        if complex_score > simple_score:
            return min(7 + complex_score, 10)
        elif simple_score > 0:
            return max(3 - simple_score * 0.5, 1)
        else:
            return 5  # neutro
    
    def estimate_tokens(self, task_description: str) -> int:
        """Estima tokens necessários baseado na descrição."""
        base = 1000
        words = len(task_description.split())
        return base + words * 50
    
    def select_model(self, task_description: str, budget_usd: Optional[float] = None) -> Dict[str, Any]:
        """Seleciona melhor modelo baseado na tarefa e orçamento."""
        complexity = self.estimate_complexity(task_description)
        estimated_tokens = self.estimate_tokens(task_description)
        
        # Filtra modelos por budget
        affordable_models = {}
        for name, model in self.models.items():
            est_cost = (self.estimate_tokens(task_description) / 1000) * (
                model.cost_per_1k_in + model.cost_per_1k_out
            )
            if budget_usd is None or est_cost <= budget_usd:
                affordable_models[name] = model
        
        if not affordable_models:
            return {"error": "Nenhum modelo cabe no orçamento", "budget": budget_usd}
        
        # Lógica de seleção por complexidade
        if complexity >= 8:
            # Tarefas muito complexas → PREMIUM/REASONING
            candidates = [m for m in affordable_models.values() 
                         if m.tier in [ModelTier.PREMIUM, ModelTier.REASONING]]
        elif complexity >= 5:
            # Complexidade média → STANDARD
            candidates = [m for m in affordable_models.values() 
                         if m.tier == ModelTier.STANDARD]
        else:
            # Tarefas simples → ECONOMY/STANDARD
            candidates = [m for m in affordable_models.values() 
                         if m.tier in [ModelTier.ECONOMY, ModelTier.STANDARD]]
        
        if not candidates:
            candidates = list(affordable_models.values())
        
        # Escolhe o melhor custo-benefício
        best = min(candidates, key=lambda m: m.cost_per_1k_in + m.cost_per_1k_out)
        
        # Calcula custo estimado
        est_tokens = self.estimate_tokens(task_description)
        est_cost = (est_tokens / 1000) * (best.cost_per_1k_in + best.cost_per_1k_out)
        
        return {
            "selected_model": best.name,
            "alias": best.alias,
            "tier": best.tier.value,
            "complexity_score": complexity,
            "estimated_tokens": est_tokens,
            "estimated_cost_usd": round(est_cost, 6),
            "reasoning": f"Complexidade {complexity}/10 → {best.tier.value} ({best.alias})",
            "alternatives": [
                {"model": m.name, "alias": m.alias, "tier": m.tier.value}
                for m in affordable_models.values() if m.name != best.name
            ][:3]
        }
    
    def route_task(self, task: str, budget: Optional[float] = None) -> Dict[str, Any]:
        """Interface principal: roteia uma tarefa para o melhor modelo."""
        return self.select_model(task, budget)
    
    def get_model_info(self, model_name: str) -> Optional[Dict]:
        """Retorna info detalhada de um modelo."""
        if model_name in self.models:
            m = self.models[model_name]
            return {
                "name": m.name,
                "alias": m.alias,
                "tier": m.tier.value,
                "cost_per_1k_in": m.cost_per_1k_in,
                "cost_per_1k_out": m.cost_per_1k_out,
                "max_tokens": m.max_tokens,
                "strengths": m.strengths,
                "best_for": m.best_for
            }
        return None
    
    def list_models(self) -> List[Dict]:
        """Lista todos modelos disponíveis."""
        return [
            {
                "name": m.name,
                "alias": m.alias,
                "tier": m.tier.value,
                "cost_per_1k_in": m.cost_per_1k_in,
                "cost_per_1k_out": m.cost_per_1k_out,
                "best_for": m.best_for[:3]
            }
            for m in self.models.values()
        ]

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Model Router - Roteamento inteligente de modelos")
    parser.add_argument("task", nargs="+", help="Descrição da tarefa")
    parser.add_argument("--budget", type=float, help="Orçamento máximo em USD")
    parser.add_argument("--config", help="Arquivo de configuração YAML")
    parser.add_argument("--list", action="store_true", help="Listar modelos disponíveis")
    parser.add_argument("--info", help="Info detalhada de um modelo")
    parser.add_argument("--json", action="store_true", help="Output JSON")
    args = parser.parse_args()
    
    router = ModelRouter(args.config)
    
    if args.list:
        models = router.list_models()
        print("Modelos Disponíveis:")
        for m in models:
            print(f"  {m['alias']} ({m['name']}) - {m['tier']} - ${m['cost_per_1k_in']:.4f}/${m['cost_per_1k_out']:.4f} per 1k")
        return
    
    if args.info:
        info = router.get_model_info(args.info)
        if info:
            print(json.dumps(info, indent=2))
        else:
            print(f"Modelo não encontrado: {args.info}")
        return
    
    task = " ".join(args.task)
    budget = args.budget
    
    result = router.route_task(task, budget)
    
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        if "error" in result:
            print(f"❌ {result['error']}")
            return
        
        print(f"🎯 Modelo Selecionado: {result['selected_model']} ({result['alias']})")
        print(f"   Tier: {result['tier']}")
        print(f"   Complexidade: {result['complexity_score']}/10")
        print(f"   Tokens estimados: {result['estimated_tokens']:,}")
        print(f"   Custo estimado: ${result['estimated_cost_usd']:.6f}")
        print(f"   Reasoning: {result['reasoning']}")
        print(f"\n🔄 Alternativas:")
        for alt in result['alternatives']:
            print(f"  - {alt['alias']} ({alt['model']}) - {alt['tier']}")

if __name__ == "__main__":
    main()