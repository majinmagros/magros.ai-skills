import torch
import torchaudio
from qwen_tts import Qwen3TTSModel


def clone_voice(
    text: str,
    ref_audio: str,
    ref_text: str,
    language: str = "English",
    model_size: str = "1.7B",
    device: str = "cuda:0",
    output_path: str = "output.wav"
):
    """
    Clona voz a partir de áudio de referência (3-30s recomendado).
    
    Args:
        text: Texto para sintetizar na voz clonada
        ref_audio: Caminho do arquivo de áudio de referência (WAV/MP3)
        ref_text: Transcrição EXATA do áudio de referência (obrigatório para qualidade)
        language: Um dos 10 idiomas suportados
        model_size: "1.7B" (melhor qualidade) ou "0.6B" (menos VRAM)
        device: "cuda:0" ou "cpu"
        output_path: Onde salvar o áudio gerado
    """
    
    model_id = f"Qwen/Qwen3-TTS-12Hz-{model_size}-Base"
    
    model = Qwen3TTSModel.from_pretrained(
        model_id,
        device_map=device,
        dtype=torch.bfloat16,
        attn_implementation="sdpa",
    )
    
    wavs, sr = model.generate_voice_clone(
        text=text,
        language=language,
        ref_audio=ref_audio,
        ref_text=ref_text,
    )
    
    # wavs can be list or tensor depending on version
    if isinstance(wavs, list):
        wavs = torch.stack(wavs)
    if wavs.dim() == 1:
        wavs = wavs.unsqueeze(0)
    
    torchaudio.save(output_path, wavs, sr)
    return output_path


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 4:
        print("Uso: python voice_clone.py '<texto>' <ref_audio.wav> '<ref_text>' [language] [model_size]")
        sys.exit(1)
    
    text = sys.argv[1]
    ref_audio = sys.argv[2]
    ref_text = sys.argv[3]
    language = sys.argv[4] if len(sys.argv) > 4 else "English"
    model_size = sys.argv[5] if len(sys.argv) > 5 else "1.7B"
    
    out = clone_voice(text, ref_audio, ref_text, language, model_size)
    print(f"Gerado: {out}")