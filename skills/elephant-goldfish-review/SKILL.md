---
name: elephant-goldfish-review
description: Use when a design or plan was written inside a long conversation and may contain shared assumptions the author can no longer see — an elephant agent writes the design doc, a zero-memory goldfish agent reviews only the doc and referenced files before any code. Triggers on "EGM", "elephant goldfish", "design doc review", "revisor sem contexto", "suposições compartilhadas", "revisar plano antes de codar", "fresh-context reviewer".
metadata:
  origin: ECC
---

# Elephant & Goldfish Review (EGM)

Base: Elephant Goldfish Model, projeto aberto na organização Google no GitHub,
inspirado no ensaio de Dave Rensin. Não é produto oficialmente suportado; trate
como projeto de time.

## O problema que resolve

Depois de uma hora conversando com um agente sobre uma feature, vocês dois
acumulam **suposições compartilhadas**. O design doc parece óbvio para quem
escreveu — e ambíguo para qualquer outra pessoa. O erro só aparece depois do
código pronto.

## Os dois papéis

- **Elefante** — agente com todo o contexto da conversa. Escreve o design doc.
- **Goldfish** — subagente novo, **zero memória** da conversa. Recebe apenas o
  design doc e os arquivos que o doc aponta. Sua função é revisar.

## Fluxo

1. **Elefante escreve o doc** com: objetivo, não-objetivos, invariantes,
   interfaces, arquivos que serão tocados, critérios de aceite e riscos.
2. **Congele o doc.** Nada de "vou explicar por chat o que quis dizer".
3. **Abra um goldfish** (subagente/sessão nova, sem histórico) e entregue só o
   doc + arquivos referenciados.
4. **Goldfish devolve** ambiguidades, suposições não declaradas, conflitos com o
   código real, perguntas que o doc não responde e veredito PASS/FAIL por
   critério de aceite.
5. **Elefante corrige o doc**, não o código. Repita até o goldfish passar.
6. **Só então implemente.**

## Regras

- O goldfish nunca vê a conversa original, o histórico ou o "raciocínio" do elefante.
- O doc precisa ser autossuficiente: se o goldfish tiver que adivinhar, falhou.
- Um goldfish por rodada. Reaproveitar o mesmo contamina o contexto.
- Use 1–2 rodadas. Mais que isso vira debate, não revisão.
- Funciona em Claude Code, Codex, Antigravity, Kimi e qualquer agente com
  subagentes/sessões isoladas. Instalação e nomes de comando mudam — confira o
  README atual do projeto em vez de fixar caminhos.

## Quando NÃO usar

- Tarefa trivial ou de uma linha.
- Bug reproduzível com causa já identificada.
- Quando o doc já é revisado por outra pessoa e o custo da rodada não se paga.

## Anti-overlap

- `santa-method`: dois revisores adversariais do **resultado**.
- `plan-duel`: duelo entre modelos sobre o **plano**.
- Esta skill: revisão do **design doc** por um revisor sem contexto, antes do código.

## Checklist

- [ ] Doc tem objetivo, não-objetivos e critérios de aceite
- [ ] Doc aponta os arquivos reais que serão tocados
- [ ] Goldfish é sessão nova, sem histórico
- [ ] Goldfish só recebeu doc + arquivos apontados
- [ ] Cada FAIL virou correção no doc, não no código
- [ ] Implementação começou só depois do PASS
