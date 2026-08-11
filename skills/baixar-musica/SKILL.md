---
name: baixar-musica
description: Use when the user wants to download a song/audio from YouTube. Triggers on "baixar mÃºsica", "baixar faixa", "baixar som", "baixar do YouTube", "baixar som de <artista>", "quero essa mÃºsica", "yt download". Given a music name + artist, finds the video on YouTube, confirms with the user, and downloads the audio using baixar_audio.ps1.
---

# Skill: Baixar MÃºsica (busca no YouTube + download)

Procedimento para baixar o Ã¡udio de uma mÃºsica do YouTube, dado nome + artista.

## PrÃ©-requisitos (verificados)

- `baixar_audio.ps1` em `~\baixar_audio.ps1` (e o `.bat` de duplo clique ao lado).
- `yt-dlp`, `ffmpeg` e `node` disponÃ­veis no PATH (scoop).
- Pasta de saÃ­da padrÃ£o: `%USERPROFILE%\Music\YouTube Audio` (config do `baixar_audio.ps1`).

## 1. Capturar o pedido

Use o que o usuÃ¡rio disse (mÃºsica + artista). Se faltar artista, pergunte ou
use sÃ³ o nome da mÃºsica. Monte a query: `<nome> <artista>`.

## 2. Buscar no YouTube SEM baixar

Rode o search com node (evita a deprecaÃ§Ã£o de extraÃ§Ã£o sem JS runtime):

```powershell
yt-dlp "ytsearch1:<query>" --js-runtimes node --skip-download --no-playlist --print "%(title)s | %(channel)s | %(duration)s | %(id)s"
```

Se precisar de mais resultados, use `ytsearch10:` e escolha a melhor opÃ§Ã£o.

## 3. CONFIRMAR com o usuÃ¡rio ANTES de baixar

Mostre o resultado (tÃ­tulo, canal, duraÃ§Ã£o). Pergunte explicitamente se Ã© a
faixa certa â€” a busca pode pegar cover/remix/vÃ­deo errado. SÃ³ prossiga com OK.

## 3.1 VÃ¡rias faixas (em bloco)

O `baixar_audio.ps1` aceita **lista de URLs**. Para lote:

1. Resolva CADA faixa com `ytsearch1:` (passos 1â€“3 acima), confirmando com o
   usuÃ¡rio (pode confirmar todas de uma vez mostrando a lista).
2. Passe todas as URLs de uma vez:

```powershell
& "~\baixar_audio.ps1" -Urls "url1","url2","url3" -Parallel 3
```

> **IMPORTANTE**: invoque o script com `&` **na sessÃ£o PowerShell atual** â€” assim o
> array por vÃ­rgula (`"url1","url2"`) funciona. NÃƒO usar `powershell -File` para lote:
> nesse modo a vÃ­rgula nÃ£o Ã© interpretada (as URLs viram 1 Ãºnico argumento) e o lote
> quebra.
> Sem vÃ­rgula, o PowerShell liga a 2Âª URL no parÃ¢metro posicional seguinte (ex. `OutputDir`)
> e o script quebra.

- `-Parallel N` baixa N vÃ­deos simultaneamente (2â€“8 recomendado).
- Se houver playlist: `-Urls "<url>" -Playlist` baixa tudo dentro dela.

## 4. Baixar via baixar_audio.ps1

Invoque na sessÃ£o atual (funciona para 1 ou vÃ¡rias URLs):

```powershell
& "~\baixar_audio.ps1" -Urls "https://www.youtube.com/watch?v=<id>"
```

> Alternativa para duplo clique (1 faixa, sem lote):
> `powershell -ExecutionPolicy Bypass -File "~\baixar_audio.ps1" -Urls "<url>"`

### Formato/pasta customizados

Se o usuÃ¡rio pedir formato ou pasta diferentes, repasse os parÃ¢metros:

```powershell
... -Urls "<url>" -Format m4a -OutputDir "E:\Downloads\musicas" -Parallel 3
```

Formatos vÃ¡lidos do script: mp3, m4a, opus, flac, wav, ogg. Pasta deve existir.

### Playlist/canal

```powershell
... -Urls "<url_playlist>" -Playlist
```

## 5. Confirmar resultado

Informe ao usuÃ¡rio:
- Pasta de saÃ­da (padrÃ£o Ã© `Music\YouTube Audio`).
- Arquivo(s) gerados e o log `download_log_*.txt` na pasta de saÃ­da.

## Regras

- **Nunca adivinhar o ID/URL**: sempre rodar o `ytsearch1:` e usar o `%(id)s` retornado.
- **Sempre confirmar a faixa com o usuÃ¡rio** antes de baixar.
- Se a busca falhar, tente `ytsearch5:` com query limpa (sem parÃªnteses/aspas, nomes alternativos).
- Se o usuÃ¡rio pedir vÃ¡rias faixas, baixe em sequÃªncia confirmando cada URL.