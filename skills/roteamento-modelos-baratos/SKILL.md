---
name: roteamento-modelos-baratos
description: Use when choosing cheap models and routing them in agent loops — OpenRouter as provider in Claude Code, cost-per-task budgeting, using a low-cost model as executor while a strong model verifies, and when cheap+verifier loops become viable. Triggers on "rotear modelo barato", "OpenRouter no Claude Code", "custo por tarefa", "modelo barato pra loop", "DeepSeek", "huggingface barato".
metadata:
  origin: ECC
---

# Skill: Roteamento de Modelos Baratos (custo-por-tarefa)

Padrões para usar modelos de baixo custo sem perder qualidade: quem gera em
volume é barato, quem decide/valida é forte. A métrica que importa é
**custo por tarefa concluída**, não preço por token no papel.

## Quando usar

- Loop de geração/verificação que hoje usa modelo caro em todo lugar.
- Escolher provedor/modelo para um job de volume.
- Calcular se um projeto (ex: gerar 100 candidatos) cabe no orçamento.

## Padrões

### 1. Executor barato + verificador forte
- Modelo barato gera candidatos em massa (DeepSeek V4 Flash e similares).
- Modelo forte verifica/rankeia — o custo é por verificação, não por geração.
- Sempre meça nota/qualidade do executor antes de confiar no volume.

### 2. OpenRouter no Claude Code
- Configure OpenRouter como provider e escolha modelos por custo/task.
- Para tarefas repetitivas e determinísticas, o barato resolve.
- Suba de modelo só quando o verificador reprovar de forma consistente.

### 3. Custo-por-tarefa como métrica
- Preço/token é enganoso: tarefa fácil = poucos tokens no barato.
- Calcule: `custo = (tokens de entrada × preço entrada) + (tokens de saída × preço saída)` por execução, vezes o número de execuções.
- Compare o total do loop barato vs rodar tudo no caro uma vez.

### 4. Quando barato+verificador vira opção
- DeepSeek V4 Flash (~14¢/M entrada) torna loops "gerar N + verificar" viáveis.
- Regra prática: se o custo atual do job em modelo forte é alto, divida entre
  geração barata + amostragem de verificação forte (20-30% do volume).

## Checklist
- [ ] Métrica definida é custo-por-tarefa, não preço/token.
- [ ] Verificador independente do gerador.
- [ ] Amostragem de verificação existe antes de escalar volume.
- [ ] OpenRouter configurado como provider (ou equivalente).
- [ ] Loop barato validado por nota antes de colocar em produção.