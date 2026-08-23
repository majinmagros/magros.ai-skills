"""
Servidor web para clonagem de voz Qwen3-TTS
Roda localmente, carrega modelo uma vez e expõe UI HTML + API.
Uso: python web_clone_server.py
Abre em http://localhost:7861
"""
import pathlib
import tempfile
import subprocess
import shutil
import uuid
import re
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel
import torch

# --- Config ---
SCRIPT_DIR = pathlib.Path(__file__).parent
REF_AUDIO = SCRIPT_DIR / "jarvis_ref_10s.wav"
REF_TEXT = "Bom dia, sao 8 horas. Os sistemas de seguranca estao operacionais e a temperatura interna permanece estavel."

app = FastAPI(title="Jarvis Voice Clone - Qwen3-TTS")

_model_cache = {}

def get_model(model_size: str):
    if model_size in _model_cache:
        return _model_cache[model_size]
    from qwen_tts import Qwen3TTSModel
    model_id = f"Qwen/Qwen3-TTS-12Hz-{model_size}-Base"
    print(f"[LOAD] Carregando {model_id} em cuda:0 ...")
    try:
        model = Qwen3TTSModel.from_pretrained(
            model_id,
            device_map="cuda:0",
            dtype=torch.bfloat16,
            attn_implementation="sdpa",
        )
    except Exception as e:
        print(f"[LOAD] device_map falhou ({e}), tentando fallback sem device_map...")
        try:
            model = Qwen3TTSModel.from_pretrained(
                model_id,
                dtype=torch.bfloat16,
                attn_implementation="sdpa",
            )
            # Qwen3TTSModel wraps .model (Qwen3TTSForConditionalGeneration)
            try:
                # PyTorch 2.0+ meta tensor handling
                if hasattr(model.model, "to_empty"):
                    model.model = model.model.to_empty(device="cuda:0")
                else:
                    model.model = model.model.to("cuda:0")
            except Exception as e2:
                print(f"[LOAD] to/to_empty falhou {e2}, tentando direct .to em wrapper")
                if hasattr(model, "to"):
                    model = model.to("cuda:0")
            # Atualiza device attr
            try:
                model.device = torch.device("cuda:0")
            except: pass
        except Exception as e2:
            print(f"[LOAD] fallback também falhou: {e2}")
            raise
    _model_cache[model_size] = model
    print(f"[LOAD] {model_size} pronto.")
    return model

def _split_text(text: str, max_len: int = 900):
    """Quebra texto grande em frases sem cortar palavra, para evitar OOM."""
    # Tenta quebrar por pontuação
    sentences = re.split(r'(?<=[.!?;:\n])\s+', text)
    chunks = []
    cur = ""
    for s in sentences:
        if len(cur) + len(s) + 1 <= max_len:
            cur = (cur + " " + s).strip() if cur else s
        else:
            if cur:
                chunks.append(cur)
            # se frase sozinha > max_len, quebra por palavras
            if len(s) > max_len:
                words = s.split()
                tmp = ""
                for w in words:
                    if len(tmp) + len(w) + 1 <= max_len:
                        tmp = (tmp + " " + w).strip() if tmp else w
                    else:
                        chunks.append(tmp)
                        tmp = w
                cur = tmp
            else:
                cur = s
    if cur:
        chunks.append(cur)
    return chunks if chunks else [text]

class CloneRequest(BaseModel):
    text: str
    language: str = "Portuguese"
    model_size: str = "0.6B"

@app.get("/", response_class=HTMLResponse)
def home():
    html_path = SCRIPT_DIR / "index.html"
    if html_path.exists():
        return HTMLResponse(html_path.read_text(encoding="utf-8"))
    return HTMLResponse("<h1>index.html não encontrado</h1>", status_code=404)

@app.get("/api/ref-audio")
def ref_audio():
    if not REF_AUDIO.exists():
        raise HTTPException(404, "ref audio não encontrado")
    return FileResponse(str(REF_AUDIO), media_type="audio/wav")

@app.post("/api/clone")
async def clone(request: Request):
    content_type = request.headers.get("content-type", "")
    text = None
    language = "Portuguese"
    model_size = "0.6B"
    ref_text_custom = None
    ref_audio_path = None
    temp_ref_to_clean = None

    if "multipart/form-data" in content_type:
        form = await request.form()
        text = form.get("text")
        language = form.get("language") or "Portuguese"
        model_size = form.get("model_size") or "0.6B"
        ref_text_custom = form.get("ref_text") or form.get("ref_text_custom")
        upload = form.get("ref_audio") or form.get("ref_audio_file")
        if upload is not None and hasattr(upload, "read"):
            suffix = pathlib.Path(getattr(upload, "filename", "ref.wav")).suffix or ".wav"
            if suffix.lower() not in [".wav", ".mp3", ".m4a", ".ogg", ".flac", ".webm"]:
                suffix = ".wav"
            tmp_ref = pathlib.Path(tempfile.gettempdir()) / f"ref_{uuid.uuid4().hex[:8]}{suffix}"
            data = await upload.read()
            if len(data) < 800:
                raise HTTPException(400, "Arquivo de referência muito pequeno ou vazio")
            if len(data) > 12 * 1024 * 1024:
                raise HTTPException(400, "Arquivo muito grande (max 12MB)")
            tmp_ref.write_bytes(data)
            ref_audio_path = str(tmp_ref)
            temp_ref_to_clean = tmp_ref
    else:
        try:
            data = await request.json()
        except Exception:
            raise HTTPException(400, "JSON inválido ou Content-Type incorreto")
        text = data.get("text")
        language = data.get("language", "Portuguese")
        model_size = data.get("model_size", "0.6B")
        ref_text_custom = data.get("ref_text") or data.get("ref_text_custom")

    if not text or not str(text).strip():
        raise HTTPException(400, "Texto vazio")
    text = str(text)
    if len(text) > 2000:
        raise HTTPException(400, f"Texto muito longo ({len(text)} chars, max 2000). Divida em partes menores.")
    if len(text.strip()) < 2:
        raise HTTPException(400, "Texto muito curto")

    use_ref_audio = ref_audio_path or str(REF_AUDIO)
    use_ref_text = ref_text_custom.strip() if ref_text_custom and str(ref_text_custom).strip() else REF_TEXT

    if ref_audio_path and (not ref_text_custom or not str(ref_text_custom).strip()):
        print("[WARN] ref custom sem transcrição, usando fallback (qualidade pode cair)")

    if ref_audio_path and shutil.which("ffprobe"):
        try:
            r = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1", use_ref_audio], capture_output=True, text=True, timeout=5)
            dur = float(r.stdout.strip()) if r.stdout.strip() else 0
            if dur < 2.0:
                raise HTTPException(400, f"Áudio de referência muito curto ({dur:.1f}s, min 3s)")
            if dur > 30:
                print(f"[WARN] ref longo {dur:.1f}s, recomendado 3-15s")
        except HTTPException:
            raise
        except Exception as e:
            print(f"[WARN] ffprobe ref check falhou: {e}")

    if not pathlib.Path(use_ref_audio).exists():
        raise HTTPException(500, f"REF_AUDIO não encontrado: {use_ref_audio}")

    try:
        model = get_model(model_size)
    except Exception as e:
        raise HTTPException(500, f"Falha ao carregar modelo {model_size}: {e}")

    out_name = f"clone_{uuid.uuid4().hex[:8]}.wav"
    out_path = pathlib.Path(tempfile.gettempdir()) / out_name

    try:
        texts_to_gen = [text] if len(text) <= 900 else _split_text(text, 900)
        if len(texts_to_gen) > 1:
            print(f"[CHUNK] texto {len(text)} chars -> {len(texts_to_gen)} partes")

        wavs_list = []
        sr_final = 24000
        for chunk in texts_to_gen:
            wavs, sr = model.generate_voice_clone(
                text=chunk,
                language=language,
                ref_audio=use_ref_audio,
                ref_text=use_ref_text,
            )
            sr_final = sr
            import numpy as np
            if isinstance(wavs, list):
                if len(wavs) > 0 and isinstance(wavs[0], np.ndarray):
                    chunk_t = torch.from_numpy(__import__("numpy").concatenate(wavs) if len(wavs) > 1 else wavs[0])
                    if chunk_t.dim() == 1:
                        chunk_t = chunk_t.unsqueeze(0)
                else:
                    chunk_t = torch.stack(wavs)
            elif isinstance(wavs, np.ndarray):
                chunk_t = torch.from_numpy(wavs)
                if chunk_t.dim() == 1:
                    chunk_t = chunk_t.unsqueeze(0)
            else:
                chunk_t = wavs
                if chunk_t.dim() == 1:
                    chunk_t = chunk_t.unsqueeze(0)
            wavs_list.append(chunk_t.cpu())

        if len(wavs_list) == 1:
            wavs_final = wavs_list[0]
        else:
            # concatena com pausa de 0.25s de silêncio entre chunks
            pause = torch.zeros((wavs_list[0].shape[0], int(sr_final * 0.25)), dtype=wavs_list[0].dtype)
            intercalated = []
            for i, w in enumerate(wavs_list):
                intercalated.append(w)
                if i < len(wavs_list) - 1:
                    intercalated.append(pause)
            wavs_final = torch.cat(intercalated, dim=1)

        wavs, sr = wavs_final, sr_final
        import torchaudio
        torchaudio.save(str(out_path), wavs, sr)
        print(f"[GEN] {text[:70]}... -> {out_path} sr={sr} shape={wavs.shape} ref={'custom' if ref_audio_path else 'jarvis'}")

        s16_path = out_path.with_name(out_path.stem + "_s16.wav")
        if shutil.which("ffmpeg"):
            try:
                subprocess.run(["ffmpeg", "-y", "-i", str(out_path), "-c:a", "pcm_s16le", str(s16_path)], check=True, capture_output=True)
                if s16_path.exists() and s16_path.stat().st_size > 1000:
                    out_path = s16_path
            except Exception as e:
                print(f"[WARN] ffmpeg falhou: {e}")

        # limpa ref temp após uso (mantém wav final)
        if temp_ref_to_clean and temp_ref_to_clean.exists():
            try:
                # não limpa imediatamente se quisermos debugar, mas limpa após 5min? por enquanto mantém
                pass
            except: pass

        return FileResponse(str(out_path), media_type="audio/wav", filename="jarvis_clone.wav")

    except torch.cuda.OutOfMemoryError:
        torch.cuda.empty_cache()
        raise HTTPException(500, "CUDA out of memory. Tente modelo 0.6B ou texto mais curto.")
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"Erro na geração: {e}")

@app.get("/api/health")
def health():
    return {
        "cuda_available": torch.cuda.is_available(),
        "cuda_device": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
        "ref_exists": REF_AUDIO.exists(),
        "models_cached": list(_model_cache.keys()),
        "ffmpeg": bool(shutil.which("ffmpeg")),
    }

if __name__ == "__main__":
    import uvicorn
    import webbrowser
    import threading
    import time
    def preload():
        time.sleep(1)
        try:
            get_model("0.6B")
        except Exception as e:
            print(f"[PRELOAD] falhou: {e}")
    threading.Thread(target=preload, daemon=True).start()
    def open_browser():
        time.sleep(2)
        try:
            webbrowser.open("http://localhost:7861")
        except: pass
    threading.Thread(target=open_browser, daemon=True).start()
    print("Iniciando servidor em http://localhost:7861 ...")
    uvicorn.run(app, host="127.0.0.1", port=7861, log_level="info")
