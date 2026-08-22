import torch
import torchaudio
from qwen_tts import Qwen3TTSModel


def design_voice(
    text: str,
    voice_description: str,
    language: str = "English",
    model_size: str = "1.7B",
    device: str = "cuda:0",
    output_path: str = "output_design.wav"
):
    """
    Gera voz a partir de descrição natural (sem áudio de referência).
    
    Exemplos de voice_description:
    - "young female voice, warm and friendly, speaking slowly"
    - "middle-aged male, deep voice, professional narrator tone"
    - "child voice, energetic, Brazilian Portuguese"
    - "elderly woman, gentle, storytelling style, Japanese"
    """
    
    model_id = f"Qwen/Qwen3-TTS-12Hz-{model_size}-CustomVoice"
    
    model = Qwen3TTSModel.from_pretrained(
        model_id,
        device_map=device,
        dtype=torch.bfloat16,
        attn_implementation="sdpa",
    )
    
    wavs, sr = model.generate_voice_design(
        text=text,
        language=language,
        voice_description=voice_description,
    )
    
    torchaudio.save(output_path, wavs.unsqueeze(0), sr)
    return output_path


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Uso: python voice_design.py '<texto>' '<descrição da voz>' [language] [model_size]")
        sys.exit(1)
    
    text = sys.argv[1]
    description = sys.argv[2]
    language = sys.argv[3] if len(sys.argv) > 3 else "English"
    model_size = sys.argv[4] if len(sys.argv) > 4 else "1.7B"
    
    out = design_voice(text, description, language, model_size)
    print(f"Gerado: {out}")