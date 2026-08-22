"""Processa múltiplos textos com a mesma voz clonada."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from voice_clone import clone_voice
from pathlib import Path


def batch_clone(texts: list, ref_audio: str, ref_text: str, language: str, model_size: str, out_dir: str, device: str = "cuda:0"):
    Path(out_dir).mkdir(parents=True, exist_ok=True)
    results = []
    for i, text in enumerate(texts):
        out_path = f"{out_dir}/clone_{i:03d}.wav"
        clone_voice(text, ref_audio, ref_text, language, model_size, device, out_path)
        results.append(out_path)
    return results


if __name__ == "__main__":
    # Exemplo de uso
    texts = [
        "Bora pro set, galera!",
        "Esse drop vai ser insano!",
        "Obrigado por acompanhar, até a próxima!",
    ]
    batch_clone(
        texts=texts,
        ref_audio="minha_voz.wav",
        ref_text="Bora pro set galera",
        language="Portuguese",
        model_size="0.6B",
        out_dir="batch_output"
    )