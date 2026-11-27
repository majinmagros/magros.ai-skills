---
name: image-token-compression
description: Use when cutting agent input-token cost by rendering bulky text (system prompt, tool docs, large tool results, old history) into dense PNG pages so the model reads pixels instead of tokens. Triggers on "reduzir custo de input", "token de imagem", "PX Pipe", "comprimir contexto em imagem", "texto para imagem token", "cortar custo do agente", "image token compression", "render text to image for tokens". Non-triggers: shrinking what is loaded at all (use `context-budget`), controlling response depth (use `token-budget-advisor`), general prompt improvement (use `prompt-builder`).
metadata:
  origin: ECC
---

# Image Token Compression

Um token de imagem custa por **pixel**, não por caractere dentro dela. Em tráfego
real de coding agent, 1 token de texto carrega ~1 caractere de código/JSON denso,
enquanto 1 token de imagem carrega **~3,1 caracteres** do mesmo conteúdo. Renderizar
o texto gordo como página reduz o input pela metade ou mais.

Fonte: `@aicodeking` `aFmu4rLgH8U` (PX Pipe, MIT, ~7,6k stars). Números do projeto:
48.000 caracteres de system prompt + tool docs = ~25.000 tokens como texto vs
~2.700 tokens como uma página renderizada. Medição end-to-end no Fable 5: **59–70%
de conta menor**; demo de mesma tarefa: $42 (contexto 96% cheio) vs $6 (73k/1M).

## Quando usar

- System prompt + docs de tool passam de ~20k caracteres e são reenviados a cada turno.
- Histórico antigo domina o input e o agente já não precisa dele verbatim.
- Tool results grandes (leitura de arquivo, saída de comando) entram no contexto.
- Você já cortou o que dava para cortar (`context-budget`) e ainda precisa economizar.

Não use para: reduzir o que está instalado/carregado (isso é `context-budget`);
limitar tamanho de resposta (isso é `token-budget-advisor`); prompt mal escrito
(isso é `prompt-builder`).

## O que renderizar — e o que nunca

| Renderizar como imagem | Manter como texto |
|---|---|
| Bloco estático de system prompt | Últimos turnos da conversa |
| Docs de tool (descrições longas) | Mensagem atual do usuário |
| Tool results grandes (> ~6.000 caracteres) | Código que o agente vai **editar** |
| Histórico antigo | Qualquer coisa que precise de cópia exata |

Regra dura: **o que o modelo precisa reproduzir byte a byte não vira imagem.**
Editar código exige o original; ler documentação não.

## Arquitetura: proxy, não mudança no agente

```
agente → proxy local → provedor
         (texto gordo → PNG)   (resposta volta texto normal)
```

- O proxy roda na máquina do usuário e reescreve só as partes pesadas da request.
- A resposta volta como texto: nada muda no output, no streaming, nem no cliente.
- `cache_read` e output tokens não são comprimidos — a economia é só no input.

Vantagem: funciona com qualquer agente (Claude Code, Codex, SDK próprio) sem
fork. Desvantagem: mais uma peça entre você e o provedor.

## Legibilidade por modelo — o ponto que quebra tudo

Texto denso de 5×8 px não é lido igual por todo modelo. Teste do projeto: esconder
15 hex IDs aleatórios numa imagem de log e pedir leitura exata.

| Modelo | IDs lidos | Tier |
|---|---|---|
| Gemini 4 Argon | 15/15 | full reader |
| Gemini 3.6–3.8 Flash | 14/15 | full reader |
| Fable 5 (original) | 13/15 | full reader |
| Opus 5.5 | 3/15 | gist reader |
| Sonnet 5.5 | 2/15 | gist reader |
| Fable 5.1 / 5.2 | caiu; volta a 14/13 com **2 px de espaçamento entre linhas** | gist reader |

Consequências:

1. **Render settings são por modelo.** Modelos "gist" precisam de mais respiro
   entre linhas (o projeto usa +2 px).
2. **Gist reader serve para histórico, não para spec.** Ele entende o assunto da
   conversa antiga; não confie nele para números, IDs ou assinaturas de API.
3. **Rode o teste de leitura antes de ligar em produção.** 15 IDs aleatórios,
   exija 15/15 no modelo que você usa.

## Verificação: meça, não estime

O proxy do projeto envia a request original sem compressão ao endpoint gratuito
de contagem de tokens e grava a comparação com o que foi cobrado num arquivo de
eventos no home do usuário. Copie o hábito:

1. Grave `tokens_estimados_sem_compressao` e `tokens_cobrados` por request.
2. Compare após 20–30 requests reais.
3. Se a economia não aparecer, o gargalo é output ou cache — não o input.

## Riscos e limites

- **Qualidade:** no benchmark público do projeto, PX Pipe ficou atrás no Pro
  (14/19 vs 15/19) com 60% menos tokens — amostra pequena, mas real. Sempre rode
  sua própria eval (`agent-eval`) antes e depois.
- **Debug:** trace e log passam a mostrar PNG. Você precisa guardar o texto
  original em paralelo (`agent-observability`) ou fica sem reproduzir a falha.
- **Latência de render:** renderizar página custa CPU local; meça o p95.
- **Fora do seu controle:** provedor pode mudar a contagem de tokens de imagem.
  Revalide a cada troca de modelo.
- **Não é para segredo.** Imagem não protege PII — o modelo lê a imagem.

## Checklist

- [ ] Só system prompt, tool docs, tool results grandes e histórico antigo viram imagem
- [ ] Turnos recentes e mensagem atual continuam texto
- [ ] Teste de 15 IDs aleatórios passou no modelo alvo (15/15, ou tier gist assumido)
- [ ] Espaçamento entre linhas ajustado ao modelo
- [ ] Comparação estimado vs cobrado registrada por request
- [ ] Eval antes/depois mostrou mesma taxa de acerto
- [ ] Texto original preservado para debug
