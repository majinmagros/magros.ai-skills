---
name: self-improvement-ladder
description: Govern a self-improvement ladder B0-L5 for agent loops: experience bank, reusable repair procedures, structural-vs-effective gate, anti-benchmark-gaming. Use quando o loop deve melhorar sozinho, auditar autoaperfeiçoamento, decidir se recursão é estrutural ou efetiva. Triggers PT: escada de autoaperfeiçoamento, banco de experiências, recursão estrutural vs efetiva, benchmark gaming, melhorar o produtor. Triggers EN: self-improvement ladder, experience bank, structural vs effective recursion, anti benchmark gaming, improve the producer.
---

# Self-Improvement Ladder (B0–L5)

"The Last AI builds by Humans": audite em que degrau seu loop está, suba com persistência real — e prove que a recursão é efetiva, não só estrutural.

## Quando usar

- Loop que deveria "aprender sozinho" mas só repete os mesmos erros.
- Decidir investimento: melhorar o output ou melhorar o produtor do output.
- Auditar alegação de autoaperfeiçoamento / RSI antes de escalar ou publicar.
- NÃO é loop de skill única (`self-improving-skill`) nem instintos de sessão (`continuous-learning-v2`). Esta é a governança da escada.

## A escada B0–L5

- **B0 — manual:** humano opera tudo; nenhuma persistência entre runs.
- **L1 — memória episódica:** log append-only de runs (o que tentou, o que deu). Sem reuso.
- **L2 — banco de experiências:** episódios viram procedimentos de reparo reutilizáveis, com aprovação humana antes de entrar no banco. Busca por similaridade na próxima falha.
- **L3 — produtor evolui:** o loop reescreve a própria estratégia (prompts, ordem de tools, heurísticas) a partir do banco. Mudança versionada + rerun obrigatório.
- **L4 — recursão estrutural:** o sistema gera sub-sistemas que herdam o loop (fábrica de agentes com o mesmo ciclo). Ainda supervisionado.
- **L5 — recursão efetiva:** sub-sistemas melhoram o produtor sem humano no caminho. Exige todos os gates abaixo; alegar L5 sem eles é benchmark-gaming.

## Passos

1. **Classifique o degrau atual** — para seu loop, marque B0–L5 com evidência (onde mora a persistência? quem aprova a mudança? o produtor já mudou sozinho alguma vez?). Sem evidência, desça 1 degrau.
2. **Ache a persistência faltante** — o degrau mais comum de travar é L1→L2: falta memória procedimental. Adicione banco de experiências: `falha | contexto | reparo que funcionou | aprovação humana | data`. Sem aprovação, o banco vira lixeira.
3. **Adicione repair-procedures reutilizáveis** — cada entrada do banco vira procedimento testável (input → passos → verificação). Na próxima falha similar, o loop consulta antes de improvisar. Registre hit-rate do banco.
4. **Invista onde o gabarito é barato** — tese da verificabilidade: autoaperfeiçoamento só compõe onde o acerto é barato de checar (math, código com testes, cyber com sandbox). Em tool-use aberto e julgamento subjetivo, o loop aprende a trapacear o juiz — não suba a escada ali.
5. **Passe o gate estrutural≠efetivo** — antes de alegar o próximo degrau: a mudança melhorou o produtor (estratégia reutilizável) ou só o output desta run? Só o primeiro conta. Exija delta medido em benchmark travado, não em vibes.
6. **Bloqueie benchmark-gaming** — anti-patterns que invalidam a subida: seed-picking (escolher seed que passa), atalhos (resolver o teste, não a tarefa), evaluator-probing (sondar o juiz). Seeds fixas + juiz cego + tarefas held-out.

## Regras

- Melhore o produtor, não só o output. Output melhor sem estratégia reutilizável = L0 com maquiagem.
- Nenhum degrau sem persistência auditável: memória que não sobrevive ao restart não conta.
- Humano aprova entrada no banco (L2) e promoção de estratégia (L3+). Auto-promoção = deriva silenciosa.
- Recursão sem gate é rumor de RSI: alegação extraordinária exige benchmark travado + replicação.
- Se o gabarito é caro ou subjetivo, pare em L2 e opere bem — escada errada é pior que escada baixa.

## Related skills

- `self-improving-skill` — loop de melhoria por skill (degraus L1–L2 instanciados).
- `continuous-learning-v2` — instintos de sessão com promoção a regras.
- `closed-loop-verifier-pattern` — verificação runtime que ancora o gate.
- `knowledge-work-proxy-eval` — proxies duros para medir delta real entre degraus.
