---
name: baixar-musica
description: Use when the user wants to download a song/audio from YouTube. Triggers on "baixar música", "baixar faixa", "baixar som", "baixar do YouTube", "baixar som de <artista>", "quero essa música", "yt download". Given a music name + artist, finds the video on YouTube, confirms with the user, and downloads the audio using baixar_audio.ps1.
---

# Skill: Baixar Música (busca no YouTube + download)

> ⚠️ **Uso pessoal apenas.** Baixar áudio do YouTube pode violar os Termos de Serviço
> da plataforma e direitos autorais. Use apenas para conteúdo com permissão de download
> (faixas livres, seu próprio conteúdo) e respeite o copyright.

Procedimento para baixar o áudio de uma música do YouTube, dado nome + artista.

## Pré-requisitos (verificados)

- `baixar_audio.ps1` em `~\baixar_audio.ps1` (e o `.bat` de duplo clique ao lado).
- `yt-dlp`, `ffmpeg` e `node` disponíveis no PATH (scoop). O `ffmpeg` é obrigatório para converter em mp3.
- Pasta de saída padrão: `%USERPROFILE%\Music\YouTube Audio` (config do `baixar_audio.ps1`).

## 1. Capturar o pedido

Use o que o usuário disse (música + artista). Se faltar artista, pergunte ou
use só o nome da música. Monte a query: `<nome> <artista>`.

## 2. Buscar no YouTube SEM baixar

Rode o search com node (evita a deprecação de extração sem JS runtime):

```powershell
yt-dlp "ytsearch1:<query>" --js-runtimes node --skip-download --no-playlist --print "%(title)s | %(channel)s | %(duration)s | %(id)s"
```

Se precisar de mais resultados, use `ytsearch10:` e escolha a melhor opção.

## 3. CONFIRMAR com o usuário ANTES de baixar

Mostre o resultado (título, canal, duração). Pergunte explicitamente se é a
faixa certa — a busca pode pegar cover/remix/vídeo errado. Só prossiga com OK.

## 3.1 Várias faixas (em bloco)

O `baixar_audio.ps1` aceita **lista de URLs**. Para lote:

1. Resolva CADA faixa com `ytsearch1:` (passos 1–3 acima), confirmando com o
   usuário (pode confirmar todas de uma vez mostrando a lista).
2. Passe todas as URLs de uma vez:

```powershell
& "~\baixar_audio.ps1" -Urls "url1","url2","url3" -Parallel 3
```

> **IMPORTANTE**: invoque o script com `&` **na sessão PowerShell atual** — assim o
> array por vírgula (`"url1","url2"`) funciona. NÃO usar `powershell -File` para lote:
> nesse modo a vírgula não é interpretada (as URLs viram 1 único argumento) e o lote
> quebra.
> Sem vírgula, o PowerShell liga a 2ª URL no parâmetro posicional seguinte (ex. `OutputDir`)
> e o script quebra.

- `-Parallel N` baixa N vídeos simultaneamente (2–8 recomendado).
- Se houver playlist: `-Urls "<url>" -Playlist` baixa tudo dentro dela.

## 4. Baixar e converter para mp3 (deletar vídeo após)

Invoque na sessão atual (o script já passa `-x` ao yt-dlp internamente e o
padrão é mp3 — NÃO passe `-x` na linha de comando, o script não tem esse parâmetro):