#!/usr/bin/env python3
"""Ponte para baixar legendas do YouTube via youtube-transcript-api.

Por que existe: em 2026-10 o endpoint `timedtext` do YouTube comecou a responder
HTTP 429 para todos os player clients do yt-dlp (android, web, web_embedded) neste
ambiente, mesmo com yt-dlp atualizado. A API interna que o youtube-transcript-api
usa continua entregando as mesmas faixas, entao ela virou o caminho primario do
comando `download` do yt-oportunidades.mjs (yt-dlp segue como fallback).

Uso:
    python scripts/yt-subs.py <raw_dir> <video_id> [langs]

`langs` e uma lista separada por virgula, em ordem de preferencia (default
"pt,pt-PT,en"). Escreve `<raw_dir>/<id>.<lang>.vtt` no formato WEBVTT que o
`dedup` do pipeline entende e baixa SO a primeira faixa disponivel — cada faixa
extra e request extra, e o objetivo e gastar o minimo de cota.

Saida: 0 se escreveu ao menos um arquivo, 1 caso contrario.
"""
import os
import sys


def ts(seconds: float) -> str:
    """Segundos -> timestamp WEBVTT (HH:MM:SS.mmm)."""
    ms = int(round(max(0.0, seconds) * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1_000)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


def main() -> int:
    if len(sys.argv) < 3:
        print("uso: yt-subs.py <raw_dir> <video_id> [langs]", file=sys.stderr)
        return 2

    raw_dir, video_id = sys.argv[1], sys.argv[2]
    raw_langs = sys.argv[3] if len(sys.argv) > 3 else "pt,pt-PT,en"
    langs = [lang.strip() for lang in raw_langs.split(",") if lang.strip()]

    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        print(
            "youtube-transcript-api nao instalado: "
            "python -m pip install youtube-transcript-api",
            file=sys.stderr,
        )
        return 1

    api = YouTubeTranscriptApi()

    try:
        available = {t.language_code for t in api.list(video_id)}
    except Exception as exc:  # noqa: BLE001 - qualquer falha vira mensagem curta
        print(f"list falhou: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1

    os.makedirs(raw_dir, exist_ok=True)

    for lang in langs:
        if lang not in available:
            continue
        try:
            transcript = api.fetch(video_id, languages=[lang])
        except Exception as exc:  # noqa: BLE001
            print(f"fetch {lang} falhou: {type(exc).__name__}: {exc}", file=sys.stderr)
            continue

        out = os.path.join(raw_dir, f"{video_id}.{lang}.vtt")
        with open(out, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(f"WEBVTT\nKind: captions\nLanguage: {lang}\n\n")
            for snippet in transcript.snippets:
                fh.write(
                    f"{ts(snippet.start)} --> {ts(snippet.start + snippet.duration)}\n"
                    f"{snippet.text}\n\n"
                )
        print(f"ok {lang} -> {out} ({len(transcript.snippets)} segmentos)")
        return 0

    print(
        f"nenhuma faixa de {langs} disponivel (disponiveis: {sorted(available)})",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
