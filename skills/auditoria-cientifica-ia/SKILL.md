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

## 5. Checks Obrigatórios (Validação Oficial)

| Check | Fonte | Frequência |
|---|---|---|
| Dados de referência (pontos ebulição, propriedades) | NIST, PubChem, ChemSpider | Todo paper químico |
| Benchmarks ML (leaderboards) | PapersWithCode, MLCommons | Todo paper ML |
| Reprodutibilidade código | Execução real (não LLM) | Papers com código |
| Cross-ref citações | Semantic Scholar, Crossref | Todo paper |
| Conflito de interesses / funding | COI statement, funding acknowledgment | Todo paper |

## 6. Integração com Skills ECC

| Skill | Relação |
|---|---|
| `agent-context-kit` / `context-ledger` | Ledger de auditorias (source, who, kind, excerpt, reference) |
| `pesquisa-social` / `research-ops` | Captura papers novos para auditar |
| `graphify` | Mapeia dependências entre papers/datasets |
| `eval-harness` / `score-loop` | Eval da auditoria (precision/recall vs manual) |
| `vibe-security-scanner` | Verifica se código paper tem vulns |
| `context-budget` | Otimiza tokens para papers longos |

## 7. Exemplo de Uso (Hermes/Claude)

```
"Use auditoria-cientifica-ia para auditar o paper arXiv:2401.12345.
Extraia claims, verifique benchmarks no PapersWithCode, 
tente reproduzir se houver código, gere relatório JSONL."
```

## 8. Referências

- Vídeo origem: `HwT3Un5qzG8` — @airevolutionx_pt (2026-08-18)
- SI Labs: `https://silabs.ai` (auditoria papers ICML 2024)
- NeurIPS erro +55%: `https://papers.nips.cc` / `https://arxiv.org/abs/2402.xxxxx`
- NIST Chemistry WebBook: `https://webbook.nist.gov/chemistry/`
- PapersWithCode API: `https://paperswithcode.com/api/v1/`
- Agent Context Kit: `https://github.com/okjpg/agent-context-kit` (ledger pattern)