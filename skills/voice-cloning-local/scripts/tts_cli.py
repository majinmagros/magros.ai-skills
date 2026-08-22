#!/usr/bin/env python3
"""
CLI para Qwen3-TTS voice cloning/design.
Uso:
  python tts_cli.py clone "Texto para falar" ref.wav "Transcrição do ref" --lang Portuguese --model 1.7B
  python tts_cli.py design "Texto" "young female, warm, Portuguese" --lang Portuguese
"""
import argparse
import sys
import os

# Add scripts dir to path
sys.path.insert(0, os.path.dirname(__file__))

from voice_clone import clone_voice
from voice_design import design_voice


def main():
    parser = argparse.ArgumentParser(description="Qwen3-TTS Local Voice Cloning")
    subparsers = parser.add_subparsers(dest="mode", required=True)
    
    # Clone
    p_clone = subparsers.add_parser("clone", help="Clone voz de áudio de referência")
    p_clone.add_argument("text", help="Texto para sintetizar")
    p_clone.add_argument("ref_audio", help="Arquivo de áudio de referência (WAV/MP3)")
    p_clone.add_argument("ref_text", help="Transcrição EXATA do áudio de referência")
    p_clone.add_argument("--lang", default="English", help="Idioma (10 suportados)")
    p_clone.add_argument("--model", default="1.7B", choices=["0.6B", "1.7B"], help="Tamanho do modelo")
    p_clone.add_argument("--out", default="output.wav", help="Arquivo de saída")
    p_clone.add_argument("--device", default="cuda:0", help="Device (cuda:0 ou cpu)")
    
    # Design
    p_design = subparsers.add_parser("design", help="Criar voz via descrição")
    p_design.add_argument("text", help="Texto para sintetizar")
    p_design.add_argument("description", help="Descrição da voz desejada")
    p_design.add_argument("--lang", default="English", help="Idioma")
    p_design.add_argument("--model", default="1.7B", choices=["0.6B", "1.7B"])
    p_design.add_argument("--out", default="output_design.wav")
    p_design.add_argument("--device", default="cuda:0")
    
    args = parser.parse_args()
    
    if args.mode == "clone":
        out = clone_voice(args.text, args.ref_audio, args.ref_text, args.lang, args.model, args.device, args.out)
    else:
        out = design_voice(args.text, args.description, args.lang, args.model, args.device, args.out)
    
    print(f"Áudio gerado: {out}")


if __name__ == "__main__":
    main()