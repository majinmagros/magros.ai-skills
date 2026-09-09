#!/usr/bin/env python3
""" Cost tracking per model, per session, per workflow """
import sqlite3, time, json
from contextlib import contextmanager
from dataclasses import dataclass

DB = ".fusion-harness/costs.db"

@contextmanager
def track(model_alias, operation):
    start = time.time()
    tokens_in = tokens_out = 0
    try:
        yield lambda tin, tout: (setattr(tokens_in, tin), setattr(tokens_out, tout))
    finally:
        latency = int((time.time() - start) * 1000)
        cost = calculate_cost(model_alias, tokens_in, tokens_out)
        log_to_db(model_alias, operation, tokens_in, tokens_out, latency, cost)

def dashboard():
    # Query DB, show tables per model/session/workflow
    pass
