---
name: anti-hallucination
description: Use when working with facts, paths, commands, or citations in this project. Triggers on "verificar", "valida fonte", "anti-alucinaÃ§Ã£o", "conferir", "saber se existe", "tenho certeza". Prevents invented facts: always verify file paths, tool outputs, and claims against the actual system before acting on them.
---

# Skill: Anti-alucinaÃ§Ã£o (Context Seven)

Regra: **nÃ£o afirmar nem agir sobre um fato nÃ£o verificado.**

## 1. Verifique antes de afirmar

- **Caminhos/arquivos**: nunca assuma que um arquivo/pasta existe. Use
  `Test-Path` / `Get-ChildItem` / glob antes de ler, mover ou apagar.
- **Comandos/tools**: confirme que o executÃ¡vel existe (`ffmpeg`, `python`,
  venv) antes de chamÃ¡-lo; confira a saÃ­da real.
- **Dados de Ã¡udio**: nunca chute BPM, pico ou duraÃ§Ã£o â€” rode `verify_loop.ps1`
  / `ffprobe` e use o valor medido.

## 2. Quando estiver incerto, diga

- "NÃ£o sei / nÃ£o verifiquei" Ã© resposta vÃ¡lida. OfereÃ§a o comando de verificaÃ§Ã£o.
- NÃ£o preencha lacunas com invenÃ§Ã£o plausÃ­vel.

## 3. Fontes e citaÃ§Ãµes

- CitaÃ§Ãµes/tutoriais: baseie-se no que foi lido (arquivos de contexto), nÃ£o em
  memÃ³ria. Se a fonte nÃ£o estiver no projeto, avise antes de usar.

## 4. ApÃ³s cada passo, confirme

- Toda tarefa termina com verificaÃ§Ã£o da saÃ­da (arquivo existe, nota do
  verificador, `LASTEXITCODE` do comando).

## 5. Fact-checker de conteÃºdo (afirmaÃ§Ãµes/notÃ­cias)

Para claims de conteÃºdo (nÃ£o caminhos/comandos), use processo de 5 etapas:

1. **AfirmaÃ§Ã£o**: o que exatamente estÃ¡ sendo dito?
2. **Provas**: hÃ¡ evidÃªncia verificÃ¡vel?
3. **Credibilidade da fonte**: classifique na hierarquia abaixo.
4. **Veredito**: aplique um dos 6 carimbos.
5. **ExplicaÃ§Ã£o**: por que decidiu assim.

**Hierarquia de fontes** (maior â†’ menor crÃ©dito): estudos revisados â†’ Ã³rgÃ£os
oficiais â†’ imprensa confiÃ¡vel â†’ especialistas â†’ blogs/sites â†’ redes sociais.

**6 carimbos de veredito**: `verdadeiro`, `quase verdadeiro`, `misto`,
`quase falso`, `falso`, `sem provas`. Nem toda afirmaÃ§Ã£o Ã© binÃ¡ria â€”
"bebemos 8 copos de Ã¡gua/dia" Ã© `misto` (depende do contexto).

NÃ£o rotule opiniÃ£o como fato: separar dado de palpite Ã© parte do veredito.
