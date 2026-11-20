# Voice Studio — ElevenLabs local, grátis e com dublagem

Fonte: `JF1jgRuFOMQ` (@maestrosdaia, 2026-10-28) + repo oficial verificado em 2026-10-31.

## O que é

- Repo: `github.com/debpalash/VoiceStudio` — site `voicestudio.sh`
- Licença: **AGPL-3.0** (copyleft forte, incluindo uso em rede)
- ~97 mil estrelas, ~10,7 mil forks, Python, atualizado em 2026-10-31
- Descrição oficial: alternativa open source e **totalmente local** ao ElevenLabs —
  voice cloning, voice design, **video dubbing**, ditado, transcrição e audiolivro,
  com suporte declarado a 646 idiomas
- Roda na própria máquina (CUDA/MLX); existe fork para rodar em Colab T4 grátis

## O que ele faz que o Qwen3-TTS não faz

| Capacidade | Qwen3-TTS (`voice-cloning-local`) | Voice Studio |
|---|---|---|
| Clonar voz a partir de referência curta | sim (3s) | sim |
| Gerar fala a partir de texto | sim, via `tts_cli.py` / API | sim, com UI |
| Dublar um vídeo inteiro para outro idioma | **não** | **sim** |
| Transcrever áudio | não (use Whisper) | sim |
| Audiolivro / ditado | não | sim |
| Licença | Apache 2.0 (permissiva) | AGPL-3.0 (copyleft de rede) |
| Interface | scripts + Web UI própria (7861) | app com UI completa |

## Veredito do canal (não é marketing)

O @maestrosdaia testou em português e descreveu o resultado como
"surpreendente" — mas com a ressalva explícita de que **não é melhor que as
opções pagas**. A operação deles continua pagando assinaturas (~US$ 100/mês)
nos projetos sérios. A recomendação é usar Voice Studio quando o requisito for:

- volume ilimitado sem custo por caractere;
- pipeline 24/7 em VPS;
- postar dezenas/centenas de vídeos por dia;
- dublagem de vídeo entre idiomas sem API key.

## Ressalvas antes de adotar

1. **AGPL-3.0**: se você oferecer o serviço pela rede, precisa disponibilizar o
   código-fonte das modificações. Para uso interno isso não morde; para SaaS, morde.
2. **Qualidade**: aceite que o resultado fica abaixo de ElevenLabs/HeyGen em
   projetos de marca. Bom para teste, protótipo e volume; arriscado como voz
   oficial de campanha.
3. **Custo escondido**: roda local — exige GPU. Em CPU o tempo por vídeo pode
   inviabilizar o pipeline.
4. **Clone de voz de terceiros**: exige consentimento; a responsabilidade
   jurídica é de quem publica (ver `copyright-compliance-tracking`).

## Como decidir rápido

```text
Preciso dublar vídeo inteiro?         → Voice Studio
Preciso de TTS em lote, offline, PT?  → Qwen3-TTS (esta skill)
Preciso de qualidade de campanha?     → opção paga (ElevenLabs/HeyGen)
Preciso de pipeline 24/7 sem custo?   → Voice Studio em VPS com GPU
```
