---
name: criar-skill
description: Use when creating, authoring, or refining Claude Code skills. Triggers on "cria uma skill", "skill nova", "gravar skill", "record a skill", "como criar skill", "melhora a skill", "4 regras de skill". Encodes the 4-step authoring process, Skill Creator / Record a Skill, the 3-layer structure, and the Anthropic engineers' 4 rules.
---

# Skill: Criar-skill — autoragem de skills (do zero ou por refinamento)

Ensina a criar skills boas, seguindo o processo dos engenheiros da Anthropic
e os fluxos oficiais (Skill Creator / Record a Skill).

## 1. Processo de criação (4 etapas — evita skill "teórica")

1. **Mapear o pipeline**: identifique EXATAMENTE o que a skill deve fazer, do
   início ao fim (etapa A → B → C → D). Não pule essa etapa.
2. **Caminhar com o agente**: execute o fluxo etapa por etapa em uma sessão,
   revisando e corrigindo cada resultado (não jogue tudo de uma vez).
3. **Iterar até funcionar**: só considera pronto quando o resultado final fica
   bom. Corrigir depois é caro; corrigir agora é barato.
4. **Materializar**: "revise todo o contexto desta conversa e crie uma skill
   baseada no que fizemos" — assim a skill nasce de experiência real, não de palpite.

> Erro mais comum: pedir "crie uma skill que faz X, Y e Z" do zero, sem contexto.
> É como dar um manual de 50 páginas a um funcionário novo e dizer "se vira".

## 2. Formas de autoragem

- **Skill Creator** (oficial): descreva a tarefa → ele pergunta até entender →
  formata e salva seguindo as convenções (frontmatter YAML + Markdown).
- **Record a Skill** (Claude Cowork, Mac): grave tela + cliques + voz narrando →
  ele transcreve e gera a skill. Use SÓ quando não houver conector oficial —
  navegação por browser quebra quando o layout do site muda.
- **Manual**: você mesmo estrutura o arquivo (útil para refinar/editar).

## 3. Estrutura de uma skill (3 camadas)

| Camada | O que é | Impacto |
|---|---|---|
| **Descrição/frontmatter** (`name` + `description`) | Decide QUANDO o agente usa a skill | Descrição ruim = skill nunca dispara. Use frases gatilho concretas. |
| **Passo a passo** | Instruções detalhadas, checklist, error handlers (o que NÃO fazer) | Quanto mais específico, mais previsível o resultado |
| **Ferramentas/referências** | Conectores, arquivos de referência, scripts determinísticos | Script (A+B=C) roda igual sempre; texto varia. Use script para o previsível. |

## 4. As 4 regras dos engenheiros da Anthropic

1. Tudo que se repete vira skill — "se o Claude é o celular, as skills são os apps".
2. Descrição é o gatilho de ativação (veja seção 3).
3. **Não crie skill gigante**: quebre em skills pequenas interligadas; valide cada
   uma antes da próxima; reutilize entre pipelines.
4. **Skill melhora a cada uso**: erro estrutural → atualize a SKILL, não
   contorne. Peça "revise o histórico e sugira mudanças, uma por uma pra eu aprovar".

## 5. Salvaguardas

- Skills de terceiros: >1/3 têm falhas (algumas maliciosas). Leia todo o
  `SKILL.md` antes de instalar; use fontes oficiais.
- Ideal: 3–5 skills ativas por contexto, não 12.
- Não precisa citar a skill no CLAUDE.md — o agente lê a descrição automaticamente.

## 6. Verificação

- Teste a skill em um caso real. Se errou, atualize a SKILL (regra 4), não dê
  contorno pontual. Repita até o resultado esperado sair sem intervenção.
