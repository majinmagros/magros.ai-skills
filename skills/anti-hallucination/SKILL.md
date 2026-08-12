---
name: anti-hallucination
description: Use when working with facts, paths, commands, or citations in this project. Triggers on "verificar", "valida fonte", "anti-alucinação", "conferir", "saber se existe", "tenho certeza". Prevents invented facts: always verify file paths, tool outputs, and claims against the actual system before acting on them.
---

# Skill: Anti-alucinação (Context Seven)

Regra: **não afirmar nem agir sobre um fato não verificado.**

## 1. Verifique antes de afirmar

- **Caminhos/arquivos**: nunca assuma que um arquivo/pasta existe. Use
  `Test-Path` / `Get-ChildItem` / glob antes de ler, mover ou apagar.
- **Comandos/tools**: confirme que o executável existe (`ffmpeg`, `python`,
  venv) antes de chamá-lo; confira a saída real.
- **Dados de áudio**: nunca chute BPM, pico ou duração — rode `verify_loop.ps1`
  / `ffprobe` e use o valor medido.

## 2. Quando estiver incerto, diga

- "Não sei / não verifiquei" é resposta válida. Ofereça o comando de verificação.
- Não preencha lacunas com invenção plausível.

## 3. Fontes e citações

- Citações/tutoriais: baseie-se no que foi lido (arquivos de contexto), não em
  memória. Se a fonte não estiver no projeto, avise antes de usar.

## 4. Após cada passo, confirme

- Toda tarefa termina com verificação da saída (arquivo existe, nota do
  verificador, `LASTEXITCODE` do comando).

## 5. Fact-checker de conteúdo (afirmações/notícias)

Para claims de conteúdo (não caminhos/comandos), use processo de 5 etapas:

1. **Afirmação**: o que exatamente está sendo dito?
2. **Provas**: há evidência verificável?
3. **Credibilidade da fonte**: classifique na hierarquia abaixo.
4. **Veredito**: aplique um dos 6 carimbos.
5. **Explicação**: por que decidiu assim.

**Hierarquia de fontes** (maior → menor crédito): estudos revisados → órgãos
oficiais → imprensa confiável → especialistas → blogs/sites → redes sociais.

**6 carimbos de veredito**: `verdadeiro`, `quase verdadeiro`, `misto`,
`quase falso`, `falso`, `sem provas`. Nem toda afirmação é binária —
"bebemos 8 copos de água/dia" é `misto` (depende do contexto).

Não rotule opinião como fato: separar dado de palpite é parte do veredito.
