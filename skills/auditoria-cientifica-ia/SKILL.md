---
name: auditoria-cientifica-ia
description: Use quando precisar auditar papers, datasets, benchmarks e registros científicos com IA — detecção de erros em dados de referência (ex: pontos de ebulição 75 anos), baixa reprodutibilidade (1/3 papers ICML), taxas de erro crescentes (NeurIPS +55% em 4 anos). Triggers em "auditoria científica", "reprodutibilidade papers", "erro dados referência", "SI Labs", "auditoria papers IA", "verificação benchmarks", "dados científicos errados".
metadata:
  origin: ECC
---

# Skill: Auditoria Científica com IA — Papers, Dados, Benchmarks

> Baseado no vídeo `HwT3Un5qzG8` (AI Revolution em Português) + repo `SI Labs` + metodologia `agent-context-kit` v0.1.0. Auditoria automatizada de papers, datasets, benchmarks — detecta erros em dados de referência (75 anos), baixa reprodutibilidade (1/3 ICML oral), erro crescente (NeurIPS +55% em 4 anos).

## 1. Quando usar

- Precisa auditar papers científicos (revisão por pares não pegou erro)
- Quer verificar datasets de referência (pontos de ebulição, propriedades químicas, benchmarks ML)
- Precisa auditar reprodutibilidade (papers ICML, NeurIPS, ICML, ICLR)
- Taxa de erro em artigos científicos crescendo (+55% NeurIPS 4 anos)
- Quer automatizar o que SI Labs faz manualmente (8 papers ICML oral → 1/3 reproduzíveis)

## 2. Arquitetura do Pipeline (3 etapas)

```
Entrada (PDF/DOI/ArXiv/CSV) 
    ↓
1. EXTRATOR — Extrai claims, métodos, dados, referências
    ↓
2. VERIFICADOR — Cross-ref com fontes primárias, executa reprodutibilidade
    ↓
3. RELATOR — Gera relatório: erros, irreprodutíveis, conflitos, severity
```

## 3. Ferramentas e Fontes

| Componente | Tool | Fonte |
|---|---|---|
| Busca papers | `arxiv`, `semantic-scholar`, `pubmed` APIs | Primária |
| Cross-ref dados | `wikidata`, `chemspider`, `nist.gov`, `pubchem` | Dados referência |
| Reprodutibilidade | `python`/`jupyter` execução controlada | Código paper |
| Benchmarks | `paperswithcode.com`, `mlcommons.org` | Leaderboards |
| IA Auditor | `claude`/`gpt-4o` com `search_context` | Análise semântica |

## 4. Schema do Relatório (JSONL)

```json
{
  "paper_id": "arxiv:2401.12345",
  "title": "Paper Title",
  "claims": [
    {"text": "Model achieves 95% on benchmark X", "verified": false, "evidence": "Leaderboard shows 92%"},
    {"text": "Boiling point of X is 100°C", "verified": false, "evidence": "NIST says 99.8°C", "severity": "high"}
  ],
  "reproducibility": {
    "attempted": true,
    "success": false,
    "logs": "path/to/logs",
    "environment": "python 3.10, deps pinned"
  },
  "data_integrity": {
    "checked_datasets": ["dataset_a", "dataset_b"],
    "issues": ["typo in Table 3", "outlier not removed"]
  },
  "severity": "high|medium|low",
  "recommendation": "retract|correct|flag|ok"
}
```