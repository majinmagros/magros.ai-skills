# approval_gates.py — require_approval decorator, auto-aprovação low-risk, audit log
# Extraído de SKILL.md (2026-09-09).


class ApprovalGatePatterns:
    @staticmethod
    def require_approval(action: str, reason: str,
                         approver: str = "human") -> dict:
        """Decorator para exigir aprovação antes de executar."""
        def decorator(func):
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                approval = input(f"Aprovação necessária para '{action}': {reason}\n"
                                 f"Aprovado por {approver}? (y/N): ")
                if approval.lower() != 'y':
                    raise PermissionError(f"Aprovação negada para: {action}")
                return func(*args, **kwargs)
            return wrapper

    @staticmethod
    def auto_approve_low_risk(action: str, risk_level: str) -> bool:
        """Auto-aprova ações de baixo risco."""
        low_risk_actions = ["read_file", "list_files", "search", "analyze"]
        return action in low_risk_actions

    @staticmethod
    def log_execution(action: str, params: dict, result: any,
                      duration: float) -> dict:
        """Log de execução para auditoria."""
        return {
            "action": action,
            "params": params,
            "result_summary": str(result)[:200],
            "duration_ms": duration * 1000,
            "timestamp": datetime.now().isoformat(),
            "success": True
        }
