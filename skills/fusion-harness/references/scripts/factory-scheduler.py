#!/usr/bin/env python3
""" Out-loop: schedule agent variants to run autonomously """
import schedule, time, subprocess, yaml
from pathlib import Path

VARIANTS_DIR = Path(".fusion-harness/variants/")  # Cada variante = SDLC config

def run_variant(variant_name):
    """ Executa variante completa: setup → grill → spec → tickets → implement """
    variant = load_variant(variant_name)
    for phase in ["setup", "grill", "to-spec", "to-tickets", "implement"]:
        run_phase(variant, phase)

def main():
    # Carrega schedule.yaml
    # Ex: daily 02:00 → variant "nightly-refactor"
    #     on push → variant "pr-review"
    #     webhook → variant "incident-response"
    schedule.every().day.at("02:00").do(run_variant, "nightly-refactor")

    while True:
        schedule.run_pending()
        time.sleep(60)
