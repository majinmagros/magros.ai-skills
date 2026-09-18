---
name: ugc-seedance-talking-head
description: Pipeline fim-a-fim de UGC talking-head com Seedance 2.5, de trend a clipe publicável. Use quando o usuário pedir UGC com IA, talking head, clone de personagem, criativo para ads, hook + demo para A/B. Triggers PT: ugc com ia, talking head seedance, clonar personagem, criativo ugc, demo sem rosto. Triggers EN: seedance ugc, ai talking head, ugc ad pipeline, hook variant test.
---

# UGC Seedance Talking-Head

Pipeline fim-a-fim: mineração de trends → vibe-clone de personagem → geração Seedance → demo sem rosto → 1 demo × N hooks → ledger $/s.

## Quando usar

- Criar UGC com IA para ads (TikTok / Reels / Shorts).
- Clonar um personagem recorrente sem filmar toda vez.
- Testar N hooks com o mesmo demo (A/B).
- Quando pedir só "gera um vídeo", recuse o atalho e rode o pipeline.

Não usar para: vídeo institucional longo, VSL completa, avatar empresarial formal.

## Passos

### 1. Minerar trends (30 min, sem gerar nada)
1. Colete 10-20 criativos vencedores do nicho (TikTok Creative Center, biblioteca de anúncios, feed).
2. Para cada um anote: hook 0-3s (texto exato), ângulo, objeção quebrada, CTA, formato (POV, depoimento, unboxing, tela).
3. Saída: tabela `hook | ângulo | prova | CTA | por que funcionou`.
4. Escolha 1 ângulo + 3-5 hooks para esta leva. Não misture ângulos na mesma leva.

### 2. Vibe-clone do personagem (prompt JSON)
1. Defina identidade fixa: idade aparente, etnia, cabelo, estilo, cenário recorrente (ex: cozinha, carro, quarto).
2. Escreva o clone como JSON versionado (`character_v1.json`): `identity_lock`, `face`, `skin`, `voice_tone`, `wardrobe`, `setting`, `camera`.
3. Trave o rosto com 1 foto-referência aprovada. Toda geração futura referencia esse ID.
4. Valide: 3 gerações de teste lado a lado. Se o rosto derivar, ajuste o JSON, não o prompt solto.

Exemplo mínimo:

```json
{
  "identity_lock": "woman_30s_brunette_freckles_kitchen",
  "constraints": ["real skin texture, pores visible", "slight facial asymmetry", "no beauty filter", "no doll-face", "no oversized eyes", "natural indoor light, imperfect"],
  "camera": "front smartphone, chest-up, slight handheld shake",
  "negative": "ai slop, airbrushed skin, symmetrical doll face, studio lighting, 3d render"
}
```

### 3. Geração Seedance (imagem + áudio-referência)
1. Entrada: 1 imagem-referência do personagem + 1 áudio-referência (10-20s, ritmo e entonação desejados).
2. Gere o talking-head por bloco de 8-15s, não o vídeo inteiro de uma vez.
3. Prompt de cena inclui: fala exata, emoção, gestos, olhar para a câmera.
4. Rejeite e regenere se: boca dessincronizada, piscadas ausentes, mãos deformadas, fundo pulsando.

### 4. Demo sem rosto (screen-record + voice-clone)
1. Para demos de produto/app: não mostre o rosto. Grave a tela (screen-record 1080x1920).
2. Narre com voice-clone do personagem ou voz neutra consistente.
3. Estrutura do demo: problema em 3s → 3 cliques/funcionalidades → resultado → CTA.
4. Exporte demo limpo, sem hook colado. Hook entra no passo 5.

### 5. Pareamento 1 demo × N hooks
1. Congele 1 demo aprovado.
2. Gere N=3-5 aberturas (hooks 0-3s) com o talking-head, mesmo script de transição para o demo.
3. Monte: `hook_N + demo_fixo + CTA_fixo`. Só o hook varia.
4. Nomeie: `angulo_data_hookN_v1.mp4`. Nunca re-edite o demo no meio do teste.

### 6. Ledger $/s por clipe
1. Registre por clipe: `custo_geração_USD / duração_s = $/s`.
2. Tabela mínima: `clipe | segundos | custo | $/s | hook | status (teste/aprovado/descartado)`.
3. Regra: se $/s estourar o teto da conta, reduza N de hooks antes de reduzir qualidade do demo.
4. Feche a leva com: vencedor, por que venceu, próximo teste.

## Regras

- Anti-AI-slop obrigatório: pele real com textura, assimetria leve, luz imperfeita, fundo vivido. Nada de pele plástica ou render 3D.
- Anti doll-face obrigatório: proibido olhos gigantes, lábios inflados, simetria total, filtro de beleza. Negative prompt sempre presente.
- Identidade trava no JSON, não no chat. Sem `character_vX.json` não há geração.
- Áudio-referência manda no ritmo. Sem áudio, o talking-head fica robótico — não pule.
- 1 demo × N hooks. Proibido testar demo e hook variando juntos (perde atribuição).
- Máx 15s por take Seedance. Takes longos quebram sincronia labial.
- Declare conteúdo com IA se a plataforma/anunciante exigir. Não se passe por pessoa real em nicho sensível (saúde, finanças).

## Related skills

- `pipeline-video-agente` — orquestração geral de vídeo por agentes.
- `analise-concorrentes` — mineração de criativos e ângulos.
- `ai-media-generator` / `fal-ai-media` — execução da geração via provedor.

Fonte: vídeo GkGufbIVVC8 (AIJasonZ, UGC Seedance 2.5).
