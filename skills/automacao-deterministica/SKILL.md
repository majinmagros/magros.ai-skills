---
name: automacao-deterministica
description: Use when a task is predictable and should become a script instead of AI reasoning — or when deciding what to automate vs keep with the model. Triggers on "automatiza", "script pra isso", "tarefa previsível", "a+b=c", "postar automático", "não precisa pensar", "ganhar eficiência". Automates deterministic steps; keeps creative/reasoning with the LLM.
---

# Skill: Autoacao-deterministica — script pro previsível, IA pro que pensa

Tarefa A+B=C (entrada previsível → saída previsível) vira SCRIPT determinístico.
Script roda idêntico toda vez e não gasta tokens. IA fica para o que exige
raciocínio, criatividade e variação.

## 1. Decida: automatizar ou não?

| Automatize (script) | Mantenha na IA |
|---|---|
| Postar vídeo pronto nas redes | Escrever roteiro/copy criativo |
| Transcrever vídeo (download → texto) | Gerar materiais didáticos do conteúdo |
| Baixar/formatar/converter arquivos | Análise que decide no caminho |
| Regra fixa: "input X → sempre Y" | Onde o "bom" muda a cada vez |

Teste mental: a saída depende de decisão/criatividade? Sim → IA. Não → script.

## 2. Processo

1. Identifique o passo determinístico dentro do fluxo (ex.: transcrever =
   baixar + converter; não é "fazer a aula").
2. Peça ao agente para **escrever o script** (Python/CLI) — você não precisa
   saber programar.
3. Integre ao fluxo; atualize o script quando a plataforma mudar (você só
   atualiza o script, não re-faz a tarefa na mão).

## 3. Cuidados

- **Não automatize tudo**: script de tarefa usada 1x a cada meses custa mais
  manutenção do que economiza. Automatize o que roda TODO DIA e é estável.
- **Custo de erro**: sem camada de verificação, automação quebra calada.
  Adicione alerta/revisão se o erro for caro.
- Prefira conector/API oficial a browser automation (quebra com mudança de layout).
- Credenciais em `.env`, nunca no repositório público.

## 4. Regra

- Automação não substitui agente — elimina o trabalho burro do agente para ele
  sobrar para o que importa.
