# Fábrica de Skills via NotebookLM (Padrão Joaquín Barberá)

Motor de criação e refinamento de habilidades (*skills*) usando Gemini Notebook (NotebookLM) como infraestrutura de RAG e síntese.

## Fluxo Operacional

1. **Caderno Base Dedicado**:
   - Criar caderno no Gemini Notebook.
   - Inserir guias oficiais de autoragem (*Gemini*, *ChatGPT*, *Claude*), prefixados como `1 skill`.
   - Definir System Prompt customizado (`Configurar chat > Personalizado`) travando o formato de saída das skills.

2. **Fast Research (Enriquecimento Contextual)**:
   - Pesquisa nativa por guias e melhores práticas do domínio alvo.
   - Importação automática como fonte temporária no caderno.

3. **Geração via Template de 3 Pilares**:
   - Enviar ao chat do caderno os 3 inputs obrigatórios:
     1. **Modelo de destino**: `[Gemini / ChatGPT / Claude]`
     2. **Objetivo principal**: O que a skill executa.
     3. **Dados de entrada (runtime)**: O que o usuário fornece.
   - Saída: Especificação técnica + conteúdo pronto da skill (frontmatter YAML, descrição, workflow e exemplos).

4. **Implementação**:
   - Copiar output gerado para o diretório de skills (`skills/<nome>/SKILL.md`) ou painel correspondente.
