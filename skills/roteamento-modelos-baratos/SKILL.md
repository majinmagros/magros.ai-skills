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

### 2. OpenRouter (ou DeepSeek direto) no Claude Code
- Configure OpenRouter como provider (3 env vars: `ANTHROPIC_BASE_URL`,
  `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_MODEL`) e escolha modelos por custo/task.
- **Caveat oficial do OpenRouter**: o Claude Code "é garantido só com o
  provedor first-party da Anthropic" e "é otimizado para modelos Anthropic e
  pode não funcionar com outros provedores" (tool-use/parsing pode quebrar).
  Teste o loop antes de depender.
- Alternativa sem agregador: a DeepSeek expõe endpoint Anthropic-compatível
  direto (`https://api.deepseek.com/anthropic`) para o Claude Code.
- Para tarefas repetitivas e determinísticas, o barato resolve. Suba de modelo
  só quando o verificador reprovar de forma consistente.

### 3. Custo-por-tarefa como métrica
- Preço/token é enganoso: tarefa fácil = poucos tokens no barato.
- Calcule: `custo = (tokens de entrada × preço entrada) + (tokens de saída × preço saída)` por execução, vezes o número de execuções.
- Compare o total do loop barato vs rodar tudo no caro uma vez.

### 4. Quando barato+verificador vira opção
- DeepSeek V4 Flash: preço vigente (16/08/2026+) tem **peak/off-peak** —
  off-peak ~$0.22/M entrada e ~$0.66/M saída; peak ~$0.44/$1.32; cache-hit de
  entrada bem mais barato (~$0.007–$0.014/M). O "14¢/M entrada" do anúncio era
  o preço até 15/08/2026 — **sempre confira a página oficial de pricing**
  (preços mudam com frequência).
- Regra prática: se o custo atual do job em modelo forte é alto, divida entre
  geração barata + amostragem de verificação forte (20-30% do volume).

## Checklist
- [ ] Métrica definida é custo-por-tarefa, não preço/token.
- [ ] Verificador independente do gerador.
- [ ] Amostragem de verificação existe antes de escalar volume.
- [ ] OpenRouter configurado como provider (ou equivalente).
- [ ] Loop barato validado por nota antes de colocar em produção.

## Cursor Model Routing Nativo (enriquecimento 2026-08-20, video `7phrurXJwH8`)

O **Cursor** tem roteamento de modelos embutido (sem OpenRouter) no plano Pro/Max:

| Modo/Modelo | Característica | Quando usar |
|---|---|---|
| **Auto** | Gerencia custo/qualidade automaticamente | Maioria das tarefas simples/estudo |
| **Composer 2.5** | Modelo próprio do Cursor, barato, bom para implementação | Implementar código, escrever arquivos |
| **Opus / Sonnet / GPT-4.5** | Caros, raciocínio forte | Planejar, arquitetar, debug complexo |
| **High (quase ilimitado)** | Limite "High" do plano Pro (~quase ilimitado/mês) | Uso diário sem medo de quota |
| **API (cobra extra após 100%)** | Modelos selecionados manualmente → consome quota API | Tarefas específicas que precisam de modelo específico |

**Padrão recomendado (do vídeo)**:
```
1. Planejar com caro (Opus/Sonnet) → /plan mode, especificar arquitetura
2. Implementar com barato (Composer 2.5 / Auto) → "implementa o plano"
3. Se travar ou erro complexo → volta pro caro para debug
```

**Limites**: Plano Pro = limite "High" mensal (reset todo mês). API = cobra extra por token após 100% da quota. Monitorar em Settings → Usage.