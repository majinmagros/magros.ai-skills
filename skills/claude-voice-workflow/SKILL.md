---
name: claude-voice-workflow
description: Use when dictating prompts via voice (Sponcle/Whisper) to Claude — voice interview, transcription cleanup, prompt engineering from audio, and live voice conversation while a coding agent works in the background. Triggers on "voice workflow", "Sponcle", "ditado por voz", "entrevista por voz", "Whisper prompt", "voz ao vivo", "Qwen Audio Agent".
---

# Claude Voice Workflow — Ditado por Voz para Prompts

> Fonte: `Maestros da IA — Luciana Papini` (pending materialization). Exclusivo comunidade, aqui stub ECC.

Transforma áudio em prompt estruturado sem fricção.

## Quando usar

- Quer ditar ideia longa caminhando, sem digitar
- Entrevista por voz para extrair requisitos (prompt interview)
- Transcrição ruidosa que precisa virar prompt dos 4 pilares

## Voz ao vivo com agente rodando (leva 2026-10-31)

Ditado e conversa ao vivo são modos diferentes. No segundo, a fala continua
enquanto a tarefa de código roda no back end (gateway de voz + agente via ACP):

- São **duas conexões e dois custos**: modelo de voz e agente de código.
- O workspace do agente não é o cwd do terminal — confira o caminho absoluto
  configurado e reinicie o gateway depois de mudar a config.
- Interromper a fala, mutar o microfone, cancelar tarefa e desfazer são **quatro
  coisas distintas**; cancelar não reverte edições já feitas.
- "Aplicado" falado não é prova: confira estado da tarefa, arquivo e diff.
- Fale requisito, dúvida e bug; exija texto para caminho, código e erro exato.

Limites, tabela das quatro paradas e teste de aceitação em
`references/voz-ao-vivo-com-agente.md`.

## Workflow

1. Grave em Sponcle/Whisper (pt-BR) → `transcript.txt`
2. Limpe: remova hesitações, normalize, preserve intenção
3. Converta para prompt dos 4 pilares (`prompt-builder`) → valide com usuário
4. Envie para Claude/Code

## Checklist

- [ ] Áudio 3-60s com contexto
- [ ] Transcript limpo
- [ ] Prompt validado antes de executar

## Exemplo

```text
Áudio 40s caminhando: ideia de SaaS de agendamento com lembrete WhatsApp
Limpeza: tira "ahn, tipo, né" → preserva: público, dor, restrição de preço
Saída: prompt 4 pilares via prompt-builder → usuário valida → envia p/ Claude
```
