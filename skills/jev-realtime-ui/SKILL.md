---
name: jev-realtime-ui
description: Use when building interfaces that react while the user is still speaking — live voice-to-UI, stories that appear as they are told, adaptive forms, or live site building. Covers state-first architecture, barge-in, partial updates, fallback to turn-based and guardrails. Triggers on "JEV", "real-time UI", "voz em tempo real", "formulário adaptativo", "site que se monta enquanto falo", "Gemini Live", "interface que responde à fala".
metadata:
  origin: ECC
---

# JEV / Real-time voice-driven UI

Padrão: a fala vira **estado estruturado** e a UI reage em menos de um segundo,
em vez de prompt → espera → resultado. O vídeo chama isso de "IA imediata".

## Quando ativar

- Histórias, aulas ou explicações que devem aparecer na tela enquanto são faladas.
- Formulários que mudam a próxima pergunta conforme a resposta anterior.
- Sites/protótipos montados ao vivo durante uma conversa.
- Edição de conteúdo por voz com feedback visual imediato.

## Arquitetura (estado primeiro)

1. **Defina o schema de estado antes do prompt.** Exemplo de formulário:
   `{ nome, empresa, cargo, dor, orcamento, qualificado }`.
2. **Capture áudio** por WebRTC/WebSocket e transcreva em streaming.
3. **O modelo preenche campos do estado**, não HTML. Cada resposta é um delta
   parcial, validado contra o schema.
4. **A UI renderiza o estado**, nunca o texto cru do modelo. Diff de estado →
   diff de tela.
5. **Barge-in:** se o usuário falar por cima, cancele a fala do agente e continue
   do estado atual.
6. **Fallback:** se a latência passar do limite (ex.: 1,5 s), caia para turn-based
   e avise na interface.

## Regras de qualidade

- Lógica de decisão (qualificação, regras de negócio) fica em **código**; o modelo
  só redige e classifica.
- Nunca injete texto do modelo como HTML sem sanitização.
- Guarde o último estado válido; atualização parcial inválida não derruba a tela.
- Debounce de render e limite de atualizações por segundo.
- Logue transcrição + snapshots de estado para replay e depuração.
- Custo: limite minutos de sessão, minutos de áudio e modelo usado. Voz em tempo
  real queima cota rápido.

## Formulário adaptativo (padrão de monetização)

- Pergunta atual depende das anteriores; o funil é um grafo, não uma lista.
- O modelo escolhe a redação; o código escolhe o próximo nó.
- Ao final, o estado qualificado alimenta CRM/planilha — não o transcript.
- Sempre ofereça edição manual dos campos preenchidos por voz.

## Anti-overlap

- `vidu-s1-realtime-avatar`: avatar falante em tempo real.
- `gemini-cli-agent-skills`: uso do Gemini CLI, não de UI por voz.
- Esta skill: arquitetura de interface dirigida por fala em tempo real.

## Checklist

- [ ] Schema de estado definido antes do prompt
- [ ] UI renderiza estado validado, não texto do modelo
- [ ] Barge-in e cancelamento funcionam
- [ ] Fallback turn-based existe e é explícito
- [ ] Custo por sessão tem teto
- [ ] Transcript + snapshots ficam registrados
