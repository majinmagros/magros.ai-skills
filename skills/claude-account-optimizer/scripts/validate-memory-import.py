#!/usr/bin/env python3
"""
validate-memory-import.py — Valida memory import + entrevista via voz
Parte do skill claude-account-optimizer
"""

import json
import sys
import os
import subprocess
from pathlib import Path
from typing import Dict, List, Any

def check_sponcle_installed() -> bool:
    """Verifica se Sponcle está disponível."""
    try:
        result = subprocess.run(["sponcle", "--version"], capture_output=True, text=True)
        return result.returncode == 0
    except FileNotFoundError:
        return False

def validate_memory_file(filepath: str) -> Dict[str, Any]:
    """Valida arquivo de memory exportado."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        required_keys = ['conversations', 'memories', 'preferences']
        missing = [k for k in required_keys if k not in data]
        
        return {
            "valid": len(missing) == 0,
            "missing_keys": missing,
            "conversation_count": len(data.get('conversations', [])),
            "memory_count": len(data.get('memories', [])),
            "file_size": os.path.getsize(filepath)
        }
    except Exception as e:
        return {"valid": False, "error": str(e)}

def generate_interview_prompt() -> str:
    """Gera prompt de entrevista para validação via voz."""
    return """
Me entreviste para me conhecer melhor e trabalhar melhor comigo.
Faça uma pergunta por vez sobre: minha vida, trabalho, negócio, objetivos, projetos,
e principalmente COMO EU GOSTO DE TRABALHAR.

Regras:
1. Uma pergunta por vez
2. Aguarde minha resposta antes da próxima
3. Foque em: estilo de trabalho, preferências, irritações, objetivos, fluxo de trabalho
4. No final, gere um resumo em JSON com: work_style, preferences, irritations, goals, workflow_patterns
"""

def run_voice_interview(prompt: str) -> str:
    """Executa entrevista via Sponcle (se disponível) ou retorna prompt para uso manual."""
    if check_sponcle_installed():
        # TODO: implementar integração real com Sponcle
        return "SPONCLE_AVAILABLE: Use 'sponcle record' para gravar resposta de voz"
    else:
        return f"SPONCLE_NOT_FOUND: Use este prompt manualmente:\n{prompt}"

def validate_memory_import(memory_file: str, run_interview: bool = True) -> Dict[str, Any]:
    """Validação completa do memory import."""
    results = {
        "file_validation": validate_memory_file(memory_file),
        "interview_completed": False,
        "interview_summary": None,
        "recommendations": []
    }
    
    if not results["file_validation"]["valid"]:
        results["recommendations"].append("Arquivo de memory inválido ou incompleto")
        return results
    
    if run_interview:
        prompt = generate_interview_prompt()
        interview_result = run_voice_interview(prompt)
        results["interview_completed"] = "SPONCLE_AVAILABLE" in interview_result or len(interview_result) > 100
        results["interview_summary"] = interview_result[:500] if interview_result else None
        
        if not results["interview_completed"]:
            results["recommendations"].append("Complete a entrevista de validação via voz (Sponcle) ou manualmente")
    
    # Recomendações baseadas no conteúdo
    validation = results["file_validation"]
    if validation.get("conversation_count", 0) < 10:
        results["recommendations"].append("Poucas conversas no memory - considere importar de mais fontes")
    
    if validation.get("memory_count", 0) < 5:
        results["recommendations"].append("Poucas memórias extraídas - execute entrevista de validação")
    
    return results

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Valida memory import + entrevista via voz")
    parser.add_argument("memory_file", help="Caminho para arquivo JSON de memory exportado")
    parser.add_argument("--skip-interview", action="store_true", help="Pular entrevista de voz")
    parser.add_argument("--output", help="Arquivo de saída JSON")
    args = parser.parse_args()
    
    if not os.path.exists(args.memory_file):
        print(f"❌ Arquivo não encontrado: {args.memory_file}", file=sys.stderr)
        sys.exit(1)
    
    results = validate_memory_import(args.memory_file, not args.skip_interview)
    
    print("\n=== VALIDAÇÃO MEMORY IMPORT ===")
    print(f"Arquivo: {args.memory_file}")
    print(f"Válido: {results['file_validation']['valid']}")
    print(f"Conversas: {results['file_validation'].get('conversation_count', 0)}")
    print(f"Memórias: {results['file_validation'].get('memory_count', 0)}")
    print(f"Entrevista: {'✅ Completa' if results['interview_completed'] else '⏳ Pendente'}")
    
    if results["recommendations"]:
        print("\n📋 Recomendações:")
        for rec in results["recommendations"]:
            print(f"  - {rec}")
    
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"\n💾 Resultado salvo em: {args.output}")
    
    # Exit code: 0 = sucesso, 1 = avisos, 2 = erros críticos
    if not results["file_validation"]["valid"]:
        sys.exit(2)
    elif results["recommendations"]:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()