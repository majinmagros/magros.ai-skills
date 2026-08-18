# Relatório de Avaliação: CodeBase Memory MCP (2026-08-18)

*Avaliação executada via framework da skill `avaliar-ferramenta-ia` após insight do canal AI Jason (`iWRmtPdFbGw`).*

## 1. Escopo Real vs. Marketing
- **Promessa**: Motor C/C++ de indexação instantânea de bases de código inteiras, com ganho de 50% de tokens e "GPS" de blast radius para agentes de IA via MCP.
- **Realidade**: É um servidor MCP estático que indexa símbolos e referências via árvore de sintaxe/AST local, injetando mapas de dependência pré-calculados no contexto do agente. Elimina a necessidade de repassar múltiplos arquivos inteiros (`cat`/`read`).

## 2. Custo do Recurso Definidor
- **Setup**: Compilação/instalação de binário C/C++ + daemon local em segundo plano.
- **Overhead**: Manutenção do índice atualizado a cada commit/mudança de branch. O custo computacional local é baixo, mas exige pipeline de compilação extra.

## 3. Lock-in e Portabilidade
- **Portabilidade**: O protocolo MCP é aberto, mas o motor subjacente é acoplado ao binário C/C++ específico.
- **Risco**: Dependência de infraestrutura local fora do runtime padrão do Claude Code.

## 4. Comparativo com o Stack Atual
- **Stack Atual**: `grep`, `glob`, `read`, e `graphify` (grafo de conhecimento local).
- **Vantagem**: O CodeBase Memory MCP oferece índice semântico/AST mais rápido que grep para bases gigantes em C++/Rust/TS.
- **Desvantagem**: Adiciona complexidade de daemon externo vs ferramentas nativas embutidas no harness.

## 5. Veredito e Recomendação
- **Decisão**: **Adotar condicionalmente** (baixo risco, alto valor para repos grandes). Criar uma skill de wiring (`codebase-mcp-wiring`) para orientar a instalação e configuração do binário quando o usuário estiver em bases monolíticas.
