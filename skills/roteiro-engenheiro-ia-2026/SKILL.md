---
name: roteiro-engenheiro-ia-2026
description: Use when building a structured learning or execution roadmap for becoming an AI Engineer in 2026. Triggers on "engenheiro de ia", "roadmap de ia 2026", "como virar engenheiro de ia", "fases para aprender ia", "vagas de engenheiro de ia", "estudar ia em 2026".
metadata:
  origin: ECC
---

# Skill: Roteiro para Engenheiro de IA em 2026 (Roadmap de 7 Fases)

Roadmap curado e estruturado para sair do zero absoluto até a atuação profissional como Engenheiro de IA, cobrindo fundamentos, APIs, RAG, agentes, avaliação e produção.

## 0. O Papel do Engenheiro de IA
Em 2026, a engenharia de IA substituiu o treino de modelos do zero (Machine Learning clássico) pela orquestração de **modelos fundacionais (LLMs, VLMs, SLMs)**, integrando-os a sistemas de software determinísticos (APIs, RAG, Agentes, MCP e MLOps/LLMOps).

---

## As 7 Fases do Roadmap

### Fase 0: Fundamentos de Software
- **Python**: Siltaxe, tipos, assincronicidade e manipulação de pacotes (`uv`).
- **Git & GitHub**: Versionamento, pull requests e colaboração em equipe.
- **SQL**: Consultas fundamentais para manipulação de bases relacionais.
- **Terminal**: Navegação em CLI, execução de scripts e uso de harnesses (Claude Code, etc.).

### Fase 1: Anatomia de um LLM
- **Nomenclaturas**: LLM (Large), SLM (Small), VLM (Vision), LRM (Reasoning/o-series).
- **Tokens e Contexto**: Como funciona a tokenização e o impacto da janela de contexto (e.g. 1M+ tokens).
- **Embeddings**: Representação vetorial semântica de textos e dados.
- **Alucinação**: A natureza estatística do próximo token e a inevitabilidade teórica da alucinação (mitigável, não eliminável).

### Fase 2: APIs e Prompts Avançados
- **SDKs de Provedores**: Integração com Anthropic, OpenAI, Google via SDKs oficiais ou 9Router/OmniRoute.
- **Saídas Estruturadas**: Uso de schemas (Pydantic / JSON Schema) para forçar respostas tipadas (não strings soltas).
- **Tool Calling & ReAct**: Como o LLM emite chamadas estruturadas e o código executa.
- **Técnicas de Prompt**: Few-shot, Chain of Thought (CoT), Tree of Thoughts (ToT).

### Fase 3: RAG (Retrieval-Augmented Generation)
- **Indexação e Chunking**: Estratégias de quebra de documentos e limpeza de dados.
- **Vector Stores & Busca Híbrida**: Similaridade de cosseno, BM25 e fusão (RRF).
- **Reranking**: Algoritmos de ordenação (e.g. Cohere Rerank, ColBERT).
- **Advanced / Agentic RAG**: Buscas iterativas e Graph RAG (conexões relacionais com Neo4j/Cypher).

### Fase 4: Agentes e Loops (Agents Part 1)
- **Agent Loops**: O ciclo core (LLM decide passo → código executa → resultado volta ao contexto).
- **State Graphs**: Orquestração por grafos de estado (LangGraph / dynamic workflows).
- **Observability / Tracing**: Monitoramento de execuções com LangFuse, LangSmith ou Opik.
- **Memory & Checkpointers**: Gerenciamento de memória de curto/longo prazo (curto, episódico, semântico).

### Fase 5: Ecossistema Avançado (Agents Part 2)
- **MCP (Model Context Protocol)**: Padrão aberto da Anthropic para conectar LLMs a fontes de dados e ferramentas locais/remotas.
- **A2A (Agent-to-Agent)**: Protocolos de interoperabilidade entre agentes independentes.
- **Multi-Agent Systems & Team Leads**: Subagentes paralelos com isolamento de contexto (evitando *context rot*) e orquestração.
- **Guardrails & HITL (Human-in-the-Loop)**: Proteção contra prompt injection, vazamento de segredos e aprovações obrigatórias para ações sensíveis.

### Fase 6: Avaliação e Testes (Evaluation)
- **LLM-as-a-Judge**: Uso de modelos avaliadores para pontuar respostas automatizadas.
- **Red Teaming**: Simulação de ataques e testes adversariais para endurecer o agente.
- **Golden Datasets**: Criação e evolução contínua de pares de teste (pergunta vs. resposta esperada).
- **RAGAS / Testes de Regressão**: CI/CD aplicado a pipelines de IA.

### Fase 7: Produção e LLMOps
- **FastAPI**: Exposição de serviços de IA via APIs RESTful assíncronas.
- **Docker & Contêineres**: Empacotamento de dependências, workers e APIs para ambiente isolado.
- **Cloud & Infraestrutura**: Deploy em nuvem (AWS, GCP, Azure ou VPS dedicada via Uncloud/Hostinger).
- **Engenharia de Produção**: Rate limits, autenticação, logs e resiliência (fallback automático via gateway).

---

## Projeto Integrado de Portfólio (De 0 a Prod)
1. **Fase 2**: Extrator de contratos em JSON estruturado.
2. **Fase 3**: Assistente de documentação interna com citação de fontes (RAG).
3. **Fase 5**: Agente corporativo com MCP, guardrails e aprovação humana (HITL).
4. **Fase 6**: Suíte de avaliação automática (Golden Dataset + LLM-as-a-Judge).
5. **Fase 7**: Publicação em API FastAPI dockerizada em VPS com rate-limit e observabilidade.
