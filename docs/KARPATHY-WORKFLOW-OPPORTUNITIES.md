# Oportunidades de Workflow - Método Karpathy + Claude Code

> Análise do vídeo "Claude Code + Karpathy é praticamente trapaça" (pRv6Savk3yQ)
> 
> Data: 2026-08-13

## Contexto

O vídeo demonstra como Andrej Karpathy usa Claude Code para desenvolvimento autônomo, com loops de feedback, especificações claras e gestão rigorosa de contexto. Este documento mapeia como as skills existentes do magros.ai-skills se alinham com esse método.

---

## 1. Autonomous Loops - `autonomous-loops` / `continuous-agent-loop`

### O que Karpathy faz
- Deixa o agente rodando tarefas em loop com validação automática
- Usa checkpoints para recuperar estado em caso de falha
- Monitora progresso e intervém apenas quando necessário

### Nossa skill correspondente
**`autonomous-loops`** - Gerencia execução autônoma de loops com salvamento de estado e recuperação de falhas.

**`continuous-agent-loop`** - Loop contínuo com monitoramento de saúde e auto-recuperação.

### Oportunidade
Criar um guia prático combinando as duas skills para replicar o método Karpathy:
- Configurar loops de 2-5 minutos (tarefa única por loop)
- Salvamento automático de estado em checkpoints
- Monitoramento via `/status` e intervenção manual quando necessário

---

## 2. Spec-Driven Development - `spec-miner` / `intent-driven-development`

### O que Karpathy faz
- Foca em especificações claras e completas antes de gerar código
- Usa specs como "contrato" que o agente deve cumprir
- Valida implementação contra spec antes de considerar tarefa concluída

### Nossa skill correspondente
**`spec-miner`** - Extrai specs de código marrom (brownfield) e garante alinhamento de intenção.

**`intent-driven-development`** - Desenvolvimento orientado por intenção, com specs como fonte de verdade.

### Oportunidade
Criar workflow integrado:
1. `spec-miner` para extrair specs do código existente
2. `intent-driven-development` para garantir que novas features sigam as specs
3. `convergencia` para validar implementação contra spec/plano/tarefas

---

## 3. Test-Driven Development - `superpowers` / `tdd-workflow`

### O que Karpathy faz
- Testes unitários rígidos e feedback imediato para guiar a IA
- Cobertura mínima de 80% antes de considerar tarefa concluída
- Usa testes como "especificação executável"

### Nossa skill correspondente
**`superpowers`** - TDD obrigatório (RED → GREEN → REFACTOR) com cobertura mínima de 80%.

**`tdd-workflow`** - Workflow TDD completo com validação de cobertura e refatoração.

### Oportunidade
Criar workflow TDD Karpathy-style:
1. Escrever teste primeiro (RED)
2. Implementar código mínimo para passar (GREEN)
3. Refatorar mantendo testes verdes (REFACTOR)
4. Validar cobertura ≥80% antes de commit
5. Usar `score-loop` para iterar até atingir qualidade

---

## 4. Context Management - `context-budget` / `strategic-compact`

### O que Karpathy faz
- Gerenciamento rigoroso do contexto para evitar degradação de performance em sessões longas
- Compactação estratégica nos momentos certos
- Monitoramento de tokens e custo por tarefa

### Nossa skill correspondente
**`context-budget`** - Monitoramento de tokens e sugestão de compactação estratégica nos momentos certos.

**`strategic-compact`** - Compactação estratégica em pontos lógicos do workflow.

### Oportunidade
Criar guia de gestão de contexto para sessões longas:
- Monitorar tokens a cada 10 interações
- Compactar após completar milestone
- Usar `doctor` para remover peso morto periodicamente
- Combinar com `cost-tracking` para otimizar custo

---

## 5. Multi-Perspective Convergence - `multi-perspective-convergence`

### O que Karpathy faz
- Usa múltiplas perspectivas para validar decisões críticas
- Isola contextos para evitar viés de ancoragem
- Ranqueia ideias e aprofunda as melhores

### Nossa skill correspondente
**`multi-perspective-convergence`** - Pipeline de múltiplos agentes com isolamento de contexto, ranking e convergência.

### Oportunidade
Aplicar para decisões de arquitetura:
- 5 perspectivas diferentes (arquiteto, dev, QA, product, security)
- Isolamento completo de contexto entre perspectivas
- Ranking 0-10 e aprofundamento do top 3
- Convergência para decisões de alta confiança

---

## 6. Score Loop - `score-loop`

### O que Karpathy faz
- Itera até atingir qualidade mínima definida
- Usa rubrica clara para avaliar resultado
- Não aceita "bom o suficiente" - exige excelência

### Nossa skill correspondente
**`score-loop`** - Loop gerador-avaliador com nota de corte (padrão 85/100).

### Oportunidade
Combinar com TDD para garantir qualidade:
1. Implementar feature com TDD
2. Rodar `score-loop` com rubrica: Funcionalidade (40%), Confiabilidade (30%), Manutenibilidade (20%), Clareza (10%)
3. Iterar até atingir nota ≥85
4. Só então considerar tarefa concluída

---

## 7. Doctor - `doctor`

### O que Karpathy faz
- Remove peso morto de instruções e contexto
- Auditoria periódica de skills e agentes
- Otimização de custo e performance

### Nossa skill correspondente
**`doctor`** - Auditoria e enxugamento de "peso morto" em instruções/contexto de projetos, agentes e skills.

### Oportunidade
Executar `doctor` periodicamente:
- A cada 2-6 meses, ou quando novos modelos são lançados
- Remover instruções obsoletas que modelos modernos não precisam mais
- Reduzir custo de contexto e melhorar performance
- Combinar com `context-budget` para medir economia

---

## 8. Gauntlet Loop - `gauntlet-loop`

### O que Karpathy faz
- Segmenta tarefa em muitos segmentos
- Cada segmento tem par executor + verificador
- Verificador julga às cegas (sem contexto do executor)
- Só aprova se ficar impressionado ("uau")

### Nossa skill correspondente
**`gauntlet-loop`** - Arquitetura de subagentes para resultado excepcional com julgamento cego.

### Oportunidade
Aplicar para tarefas criativas de alto impacto:
- Segmentar projeto em partes independentes
- Par executor + verificador para cada segmento
- Verificador avalia às cegas (sem contexto de criação)
- Barra de aprovação: "impressionar", não apenas "funcionar"
- Custo: alto (horas + centenas de milhares de tokens)

---

## Workflow Integrado Karpathy-Style

### Fase 1: Planejamento (15 min)
1. `spec-miner` - Extrair specs do código existente
2. `intent-driven-development` - Definir intenção clara da nova feature
3. `context-budget` - Medir contexto disponível e planejar compactações

### Fase 2: Implementação (30-60 min)
4. `tdd-workflow` - Escrever testes primeiro (RED)
5. `autonomous-loops` - Loop de implementação com validação automática
6. `score-loop` - Iterar até atingir nota ≥85

### Fase 3: Validação (15 min)
7. `convergencia` - Validar implementação contra spec/plano/tarefas
8. `multi-perspective-convergence` - Validar decisões críticas com múltiplas perspectivas

### Fase 4: Otimização (10 min)
9. `strategic-compact` - Compactar contexto após completar milestone
10. `doctor` - Remover peso morto periodicamente

### Fase 5: Entrega (5 min)
11. Validar cobertura ≥80%
12. Commit com mensagem convencional
13. PR com descrição completa

---

## Próximos Passos

1. **Criar guia prático** - Documento passo-a-passo combinando as skills para replicar o método Karpathy
2. **Criar skill `karpathy-workflow`** - Skill dedicada que orquestra o workflow completo
3. **Criar exemplos** - Casos de uso reais demonstrando o método em ação
4. **Métricas** - Medir economia de tokens, tempo de desenvolvimento, qualidade do código

---

## Referências

- Vídeo: "Claude Code + Karpathy é praticamente trapaça" (pRv6Savk3yQ)
- Skills mencionadas: `autonomous-loops`, `continuous-agent-loop`, `spec-miner`, `intent-driven-development`, `superpowers`, `tdd-workflow`, `context-budget`, `strategic-compact`, `multi-perspective-convergence`, `score-loop`, `doctor`, `gauntlet-loop`, `convergencia`
- Autor: William Batista Gomes (magros Zapatero)
